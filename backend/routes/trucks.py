from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.models import Truck
from schemas.schemas import TruckSchema
import uuid

router = APIRouter()

# 📌 Create a new truck
@router.post("/trucks/", response_model=TruckSchema, summary="Create a new truck")
def create_truck(truck: TruckSchema, db: Session = Depends(get_db)):
    """
    📌 **Create a new truck**
    
    - **plate**: License plate of the truck  
    - **min_license_type**: Minimum required driver’s license type  

    🚨 **Business Rules**:
    - The license plate must be unique.
    
    **Returns**: The details of the newly created truck.
    """
    existing_truck = db.query(Truck).filter(Truck.plate == truck.plate).first()
    if existing_truck:
        raise HTTPException(status_code=409, detail="A truck with this plate already exists")

    new_truck = Truck(
        id=str(uuid.uuid4()), 
        plate=truck.plate, 
        min_license_type=truck.min_license_type,
    )
    db.add(new_truck)
    db.commit()
    db.refresh(new_truck)
    return new_truck

# 📌 Retrieve all trucks
@router.get("/trucks/", summary="List all trucks")
def get_trucks(db: Session = Depends(get_db)):
    """
    📋 **Retrieve all registered trucks**
    
    **Returns**: A list of all trucks stored in the database.
    """
    return db.query(Truck).all()

# 📌 Retrieve specific truck
@router.get("/trucks/{id}", summary="Retrieve a truck by ID")
def get_truck(id: str, db: Session = Depends(get_db)):
    """
    🔍 **Retrieve a specific truck by ID**
    
    - **id**: The unique identifier of the truck  
    
    **Returns**: The details of the truck if found.
    """
    truck = db.query(Truck).filter(Truck.id == id).first()
    if not truck:
        raise HTTPException(status_code=404, detail="Truck not found")
    return truck

# 📌 Update a truck
@router.put("/trucks/{id}", response_model=TruckSchema, summary="Update a truck")
def update_truck(id: str, updated_data: TruckSchema, db: Session = Depends(get_db)):
    """
    ✏️ **Update an existing truck**
    
    - **id**: The unique identifier of the truck  
    - **plate**: Updated license plate of the truck  
    - **min_license_type**: Updated minimum required license type  
    
    🚨 **Business Rules**:
    - The new license plate must be unique.
    
    **Returns**: The updated truck details.
    """
    truck = db.query(Truck).filter(Truck.id == id).first()
    if not truck:
        raise HTTPException(status_code=404, detail="Truck not found")
    
    truck.plate = updated_data.plate
    truck.min_license_type = updated_data.min_license_type
    db.commit()
    return truck

# 📌 Delete a truck
@router.delete("/trucks/{id}", summary="Delete a truck")
def delete_truck(id: str, db: Session = Depends(get_db)):
    """
    🗑️ **Delete a truck from the system**
    
    - **id**: The unique identifier of the truck to be deleted  
    
    **Returns**: A confirmation message indicating the successful deletion.
    
    🚨 **Error Handling**:
    - Returns **404 Not Found** if the truck does not exist.
    """
    truck = db.query(Truck).filter(Truck.id == id).first()
    if not truck:
        raise HTTPException(status_code=404, detail="Truck not found")
    
    db.delete(truck)
    db.commit()
    return {"message": "Truck deleted successfully"}


