from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from datetime import datetime
from pydantic import BaseModel, EmailStr, validator
import re
import logging

from database import get_db, engine
import models

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Order Service")

class ProductInOrder(BaseModel):
    productId: uuid.UUID
    quantity: int

    def dict(self, *args, **kwargs):
        d = super().dict(*args, **kwargs)
        d['productId'] = str(d['productId'])
        return d

class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    customer_email: EmailStr
    products: List[ProductInOrder]
    delivery_address: str
    delivery_cost: float

    @validator('customer_phone')
    def validate_phone(cls, v):
        if not re.match(r'^\+?1?\d{9,15}$', v):
            raise ValueError('Invalid phone number format')
        return v

class OrderResponse(BaseModel):
    id: uuid.UUID
    customer_name: str
    customer_phone: str
    customer_email: str
    products: List[dict]
    status: str
    total_price: float
    delivery_address: str
    delivery_cost: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class OrderUpdate(BaseModel):
    status: str

@app.get("/orders", response_model=List[OrderResponse])
def get_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    orders = db.query(models.Order).offset(skip).limit(limit).all()
    return orders

@app.get("/orders/{order_id}", response_model=OrderResponse)
def get_order(order_id: uuid.UUID, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@app.post("/orders", response_model=OrderResponse, status_code=201)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    try:
        total_price = sum(product.quantity * 100 for product in order.products)
        
        products_data = [product.dict() for product in order.products]
        
        db_order = models.Order(
            customer_name=order.customer_name,
            customer_phone=order.customer_phone,
            customer_email=order.customer_email,
            products=products_data,
            status="created",
            total_price=total_price,
            delivery_address=order.delivery_address,
            delivery_cost=order.delivery_cost
        )
        
        db.add(db_order)
        db.commit()
        db.refresh(db_order)
        return db_order
    except Exception as e:
        logger.error(f"Error creating order: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/orders/{order_id}", response_model=OrderResponse)
def update_order(order_id: uuid.UUID, order_update: OrderUpdate, db: Session = Depends(get_db)):
    try:
        db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
        if db_order is None:
            raise HTTPException(status_code=404, detail="Order not found")
        
        valid_statuses = ["created", "processing", "shipped", "delivered", "cancelled"]
        if order_update.status not in valid_statuses:
            raise HTTPException(status_code=400, detail="Invalid status")
        
        db_order.status = order_update.status
        db_order.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(db_order)
        return db_order
    except Exception as e:
        logger.error(f"Error updating order: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/orders/{order_id}", status_code=204)
def delete_order(order_id: uuid.UUID, db: Session = Depends(get_db)):
    try:
        db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
        if db_order is None:
            raise HTTPException(status_code=404, detail="Order not found")
        
        db.delete(db_order)
        db.commit()
        return None
    except Exception as e:
        logger.error(f"Error deleting order: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001) 