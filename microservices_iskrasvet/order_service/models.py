from sqlalchemy import Column, String, Float, DateTime, JSON, Integer
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_name = Column(String, nullable=False)
    customer_phone = Column(String, nullable=False)
    customer_email = Column(String, nullable=False)
    products = Column(JSON, nullable=False)
    status = Column(String, nullable=False, default="created")
    total_price = Column(Float, nullable=False)
    delivery_address = Column(String, nullable=False)
    delivery_cost = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow) 