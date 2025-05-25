from sqlalchemy import Column, String, Float, DateTime, Integer, ARRAY, LargeBinary
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(String)
    price = Column(Float, nullable=False)
    stock_quantity = Column(Integer, nullable=False)
    images = Column(ARRAY(LargeBinary))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Order(Base):
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), nullable=False)
    quantity = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow) 