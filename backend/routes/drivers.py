from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.models import Driver
from schemas.schemas import DriverSchema
import uuid

router = APIRouter()

# 📌 Create a new driver
@router.post("/drivers/", response_model=DriverSchema, summary="Create a new driver")
def create_driver(driver: DriverSchema, db: Session = Depends(get_db)):
    """
    📌 **Create a new driver**
    
    - **name**: Name of the driver  
    - **license_type**: Driver's license type (A, B, C, D, or E)  

    🚨 **Business Rules**:
    - The driver's license type must be valid (A, B, C, D, or E).
    
    **Returns**: The details of the newly created driver.
    """
    new_driver = Driver(id=str(uuid.uuid4()), name=driver.name, license_type=driver.license_type)
    db.add(new_driver)
    db.commit()
    db.refresh(new_driver)
    return new_driver

# 📌 Retrieve all drivers
@router.get("/drivers/", summary="List all drivers")
def get_drivers(db: Session = Depends(get_db)):
    """
    📋 **Retrieve all registered drivers**
    
    **Returns**: A list containing all drivers stored in the database.
    """
    return db.query(Driver).all()

# 📌 Retrieve a driver by ID
@router.get("/drivers/{id}", summary="Retrieve a driver by ID")
def get_driver(id: str, db: Session = Depends(get_db)):
    """
    🔍 **Retrieve a specific driver by ID**
    
    - **id**: The unique identifier of the driver  
    
    **Returns**: The details of the driver if found.
    
    🚨 **Error Handling**:
    - Returns **404 Not Found** if the driver does not exist.
    """
    driver = db.query(Driver).filter(Driver.id == id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    return driver

# 📌 Update a driver
@router.put("/drivers/{id}", response_model=DriverSchema, summary="Update a driver")
def update_driver(id: str, updated_data: DriverSchema, db: Session = Depends(get_db)):
    """
    ✏️ **Update an existing driver**
    
    - **id**: The unique identifier of the driver  
    - **name**: Updated name of the driver  
    - **license_type**: Updated driver's license type  
    
    🚨 **Business Rules**:
    - The new license type must be valid (A, B, C, D, or E).
    
    **Returns**: The updated driver details.
    
    🚨 **Error Handling**:
    - Returns **404 Not Found** if the driver does not exist.
    """
    driver = db.query(Driver).filter(Driver.id == id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    
    driver.name = updated_data.name
    driver.license_type = updated_data.license_type
    db.commit()
    return driver

# 📌 Delete a driver
@router.delete("/drivers/{id}", summary="Delete a driver")
def delete_driver(id: str, db: Session = Depends(get_db)):
    """
    🗑️ **Delete a driver from the system**
    
    - **id**: The unique identifier of the driver to be deleted  
    
    **Returns**: A confirmation message indicating the successful deletion.
    
    🚨 **Error Handling**:
    - Returns **404 Not Found** if the driver does not exist.
    """
    driver = db.query(Driver).filter(Driver.id == id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    
    db.delete(driver)
    db.commit()
    return {"message": "Driver deleted successfully"}
