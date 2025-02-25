from sqlalchemy import Column, String, Enum, Date, ForeignKey
from sqlalchemy.dialects.mysql import CHAR
from sqlalchemy.orm import relationship
import uuid
from database import Base

class Driver(Base):
    __tablename__ = "drivers"

    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    license_type = Column(Enum("A", "B", "C", "D", "E", name="license_enum"), nullable=False)

class Truck(Base):
    __tablename__ = "trucks"

    id = Column(String(36), primary_key=True)
    plate = Column(String(50), unique=True, nullable=False)
    min_license_type = Column(Enum("A", "B", "C", "D", "E", name="license_enum"), nullable=False)

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    driver_id = Column(CHAR(36), ForeignKey("drivers.id"), nullable=False)
    truck_id = Column(CHAR(36), ForeignKey("trucks.id"), nullable=False)
    date = Column(Date, nullable=False)

    driver = relationship("Driver")
    truck = relationship("Truck")

class ErrorLog(Base):
    __tablename__ = "error_logs"

    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    timestamp = Column(Date, nullable=False)
    error_message = Column(String(1024), nullable=False)
    stack_trace = Column(String(2048), nullable=False)
    endpoint = Column(String(255), nullable=False)
