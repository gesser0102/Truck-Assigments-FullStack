from pydantic import BaseModel, ConfigDict
from datetime import date

class DriverSchema(BaseModel):
    name: str
    license_type: str


class TruckSchema(BaseModel):
    plate: str
    min_license_type: str


class AssignmentCreateSchema(BaseModel):
    driver_id: str
    truck_id: str
    date: date
    
class AssignmentResponseSchema(BaseModel):
    id: str
    driver_id: str
    driver_name: str 
    driver_license_type: str 
    truck_id: str
    truck_plate: str 
    date: date

    model_config = ConfigDict(from_attributes=True) 

class ErrorLogSchema(BaseModel):
    timestamp: date
    error_message: str
    stack_trace: str
    endpoint: str

