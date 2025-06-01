from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from datetime import datetime
from pydantic import BaseModel, EmailStr, validator
import logging
import base64

from database import get_db, engine
import models


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Catalog Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000", "http://localhost:8001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock_quantity: int

class ProductCreate(ProductBase):
    images: Optional[List[str]] = []

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock_quantity: Optional[int] = None
    images: Optional[List[str]] = None

class ProductResponse(ProductBase):
    id: uuid.UUID
    images: List[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class OrderRequest(BaseModel):
    product_id: uuid.UUID
    quantity: int

def convert_binary_images_to_base64(images):
    if not images:
        return []
    return [base64.b64encode(img).decode('utf-8') for img in images]

def create_product_response(product):
    return {
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "stock_quantity": product.stock_quantity,
        "images": convert_binary_images_to_base64(product.images),
        "created_at": product.created_at,
        "updated_at": product.updated_at
    }

@app.get("/products", response_model=List[ProductResponse])
def get_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    products = db.query(models.Product).offset(skip).limit(limit).all()
    return [create_product_response(product) for product in products]

@app.get("/products/{product_id}", response_model=ProductResponse)
def get_product(product_id: uuid.UUID, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return create_product_response(product)

@app.post("/products", response_model=ProductResponse, status_code=201)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    try:
        binary_images = []
        for img in product.images:
            try:
                binary_images.append(base64.b64decode(img))
            except Exception as e:
                logger.error(f"Error decoding image: {str(e)}")
                continue

        db_product = models.Product(
            name=product.name,
            description=product.description,
            price=product.price,
            stock_quantity=product.stock_quantity,
            images=binary_images
        )
        
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        return create_product_response(db_product)
    except Exception as e:
        logger.error(f"Error creating product: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/products/{product_id}", response_model=ProductResponse)
def update_product(product_id: uuid.UUID, product_update: ProductUpdate, db: Session = Depends(get_db)):
    try:
        db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
        if db_product is None:
            raise HTTPException(status_code=404, detail="Product not found")

        update_data = product_update.dict(exclude_unset=True)
        
        if 'images' in update_data:
            binary_images = []
            for img in update_data['images']:
                try:
                    binary_images.append(base64.b64decode(img))
                except Exception as e:
                    logger.error(f"Error decoding image: {str(e)}")
                    continue
            update_data['images'] = binary_images

        for key, value in update_data.items():
            setattr(db_product, key, value)
        
        db_product.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_product)
        return create_product_response(db_product)
    except Exception as e:
        logger.error(f"Error updating product: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/products/{product_id}", status_code=204)
def delete_product(product_id: uuid.UUID, db: Session = Depends(get_db)):
    try:
        db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
        if db_product is None:
            raise HTTPException(status_code=404, detail="Product not found")
        
        db.delete(db_product)
        db.commit()
        return None
    except Exception as e:
        logger.error(f"Error deleting product: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/order")
def make_order(order: OrderRequest, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == order.product_id).with_for_update().first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.stock_quantity < order.quantity:
        raise HTTPException(
            status_code=400,
            detail=f"Недостаточно товаров. Осталось только {product.stock_quantity} шт."
        )
    product.stock_quantity -= order.quantity
    new_order = models.Order(product_id=order.product_id, quantity=order.quantity)
    db.add(new_order)
    db.commit()
    return {"message": "Заказ оформлен успешно!"}

@app.get("/debug/products/count")
def get_products_count(db: Session = Depends(get_db)):
    count = db.query(models.Product).count()
    return {"count": count}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000) 