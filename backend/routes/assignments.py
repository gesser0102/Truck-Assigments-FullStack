from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.models import Assignment, Driver, Truck
from schemas.schemas import AssignmentCreateSchema, AssignmentResponseSchema
import uuid

router = APIRouter()

# 📌 Create a new assignment
@router.post("/assignments/", response_model=AssignmentResponseSchema, summary="Create a new assignment")
def create_assignment(assignment: AssignmentCreateSchema, db: Session = Depends(get_db)):
    """
    📌 **Create a new assignment between a driver and a truck**
    
    - **driver_id**: ID of the driver  
    - **truck_id**: ID of the truck  
    - **date**: Date of the assignment  

    🚨 **Business Rules**:
    - The driver must have the required license to operate the truck.
    - A driver **cannot be assigned to more than one truck on the same day**.
    - A truck **cannot be assigned to more than one driver on the same day**.
    
    **Returns**: The details of the newly created assignment.
    """
    driver = db.query(Driver).filter(Driver.id == assignment.driver_id).first()
    truck = db.query(Truck).filter(Truck.id == assignment.truck_id).first()

    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    if not truck:
        raise HTTPException(status_code=404, detail="Truck not found")

    # Validate driver's license
    license_order = {"A": 1, "B": 2, "C": 3, "D": 4, "E": 5}
    if license_order[driver.license_type] < license_order[truck.min_license_type]:
        raise HTTPException(status_code=400, detail="Driver does not have the required license type")

    # Ensure no conflicts
    existing_assignment = db.query(Assignment).filter(
        Assignment.driver_id == assignment.driver_id,
        Assignment.date == assignment.date
    ).first()
    if existing_assignment:
        raise HTTPException(status_code=400, detail="Driver is already assigned to another truck on this date")

    existing_truck_assignment = db.query(Assignment).filter(
        Assignment.truck_id == assignment.truck_id,
        Assignment.date == assignment.date
    ).first()
    if existing_truck_assignment:
        raise HTTPException(status_code=400, detail="Truck is already assigned to another driver on this date")

    # Create the assignment
    new_assignment = Assignment(
        id=str(uuid.uuid4()), 
        driver_id=assignment.driver_id, 
        truck_id=assignment.truck_id, 
        date=assignment.date
    )
    db.add(new_assignment)
    db.commit()
    db.refresh(new_assignment)

    # Return detailed response with driver & truck info
    return {
        "id": new_assignment.id,
        "driver_id": driver.id,
        "driver_name": driver.name,
        "driver_license_type": driver.license_type,
        "truck_id": truck.id,
        "truck_plate": truck.plate,
        "date": new_assignment.date
    }

# 📌 Get all assignments including driver name and truck plate
@router.get("/assignments/", response_model=list[AssignmentResponseSchema], summary="List all assignments with driver and truck details")
def get_assignments(db: Session = Depends(get_db)):
    """
    📋 **Retrieve all assignments, including driver name, license type, truck plate**
    
    **Returns**: A list of all assignments.
    """
    assignments = (
        db.query(
            Assignment.id,
            Assignment.driver_id,
            Driver.name.label("driver_name"),
            Driver.license_type.label("driver_license_type"),
            Assignment.truck_id,
            Truck.plate.label("truck_plate"),
            Assignment.date
        )
        .join(Driver, Assignment.driver_id == Driver.id)
        .join(Truck, Assignment.truck_id == Truck.id)
        .all()
    )

    return [
        {
            "id": assignment.id,
            "driver_id": assignment.driver_id,
            "driver_name": assignment.driver_name,
            "driver_license_type": assignment.driver_license_type,
            "truck_id": assignment.truck_id,
            "truck_plate": assignment.truck_plate,
            "date": assignment.date
        }
        for assignment in assignments
    ]

# 📌 Get a specific assignment by ID with driver name and truck plate
@router.get("/assignments/{id}", response_model=AssignmentResponseSchema, summary="Retrieve an assignment with driver and truck details")
def get_assignment(id: str, db: Session = Depends(get_db)):
    """
    🔍 **Retrieve a specific assignment, including driver name, license type, truck plate**
    
    - **id**: The unique identifier of the assignment  
    
    **Returns**: The assignment details if found.
    """
    assignment = (
        db.query(
            Assignment.id,
            Assignment.driver_id,
            Driver.name.label("driver_name"),
            Driver.license_type.label("driver_license_type"),
            Assignment.truck_id,
            Truck.plate.label("truck_plate"),
            Assignment.date
        )
        .join(Driver, Assignment.driver_id == Driver.id)
        .join(Truck, Assignment.truck_id == Truck.id)
        .filter(Assignment.id == id)
        .first()
    )

    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    return {
        "id": assignment.id,
        "driver_id": assignment.driver_id,
        "driver_name": assignment.driver_name,
        "driver_license_type": assignment.driver_license_type,
        "truck_id": assignment.truck_id,
        "truck_plate": assignment.truck_plate,
        "date": assignment.date
    }
# 📌 Update an existing assignment
@router.put("/assignments/{id}", response_model=AssignmentResponseSchema, summary="Update an existing assignment")
def update_assignment(id: str, updated_data: AssignmentCreateSchema, db: Session = Depends(get_db)):
    """
    ✏️ **Update an existing assignment**
    
    - **driver_id**: New driver ID  
    - **truck_id**: New truck ID  
    - **date**: New assignment date  
    
    🚨 **Business Rules**:
    - The driver must have the required license to operate the truck.
    - A driver **cannot be assigned to more than one truck on the same day**.
    - A truck **cannot be assigned to more than one driver on the same day**.
    
    **Returns**: The updated assignment details, including driver and truck info.
    """
    assignment = db.query(Assignment).filter(Assignment.id == id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    # Validate the new driver and truck
    driver = db.query(Driver).filter(Driver.id == updated_data.driver_id).first()
    truck = db.query(Truck).filter(Truck.id == updated_data.truck_id).first()

    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    if not truck:
        raise HTTPException(status_code=404, detail="Truck not found")

    # Validate driver's license
    license_order = {"A": 1, "B": 2, "C": 3, "D": 4, "E": 5}
    if license_order[driver.license_type] < license_order[truck.min_license_type]:
        raise HTTPException(status_code=400, detail="Driver does not have the required license type")

    # Ensure no conflicts with other assignments
    existing_assignment = db.query(Assignment).filter(
        Assignment.driver_id == updated_data.driver_id,
        Assignment.date == updated_data.date,
        Assignment.id != id
    ).first()
    if existing_assignment:
        raise HTTPException(status_code=400, detail="Driver is already assigned to another truck on this date")

    existing_truck_assignment = db.query(Assignment).filter(
        Assignment.truck_id == updated_data.truck_id,
        Assignment.date == updated_data.date,
        Assignment.id != id
    ).first()
    if existing_truck_assignment:
        raise HTTPException(status_code=400, detail="Truck is already assigned to another driver on this date")

    # ✅ Update the assignment
    assignment.driver_id = updated_data.driver_id
    assignment.truck_id = updated_data.truck_id
    assignment.date = updated_data.date
    db.commit()
    db.refresh(assignment)

    # ✅ Return the updated assignment with full details
    return {
        "id": assignment.id,
        "driver_id": driver.id,
        "driver_name": driver.name,
        "driver_license_type": driver.license_type,
        "truck_id": truck.id,
        "truck_plate": truck.plate,
        "date": assignment.date
    }

# 📌 Delete an assignment
@router.delete("/assignments/{id}", summary="Delete an assignment")
def delete_assignment(id: str, db: Session = Depends(get_db)):
    """
    🗑️ **Delete an assignment**
    
    - **id**: ID of the assignment to be deleted  
    
    **Returns**: A confirmation message indicating the deletion.
    """
    assignment = db.query(Assignment).filter(Assignment.id == id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    db.delete(assignment)
    db.commit()
    return {"message": "Assignment deleted successfully"}

@router.get("/trucks/{truck_id}/availability")
def check_truck_availability(truck_id: str, date: str, db: Session = Depends(get_db)):
    """
    Verify if truck is avaliable for a specific date
    """
    existing_assignment = db.query(Assignment).filter(
        Assignment.truck_id == truck_id,
        Assignment.date == date
    ).first()

    return {"available": existing_assignment is None}