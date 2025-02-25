import pytest
import uuid
from fastapi.testclient import TestClient
from main import app
from database import get_db, SessionLocal
from models.models import Driver, Truck, Assignment

client = TestClient(app)

# ✅ Fixture to create a test database session
@pytest.fixture
def db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        # Ensures test data does not persist
        db.rollback()
        db.close()

# ✅ Fixture to create a driver and a truck before tests
@pytest.fixture
def setup_driver_truck(db_session):
    """
    Creates a driver and a truck for testing, ensuring uniqueness.
    """
    driver = Driver(id=str(uuid.uuid4()), name=f"Driver {uuid.uuid4().hex[:6]}", license_type="C")
    truck = Truck(id=str(uuid.uuid4()), plate=f"XYZ-{uuid.uuid4().hex[:5]}", min_license_type="C")

    db_session.add(driver)
    db_session.add(truck)
    db_session.commit()

    return {"driver_id": driver.id, "truck_id": truck.id}

# ✅ Test for creating a new assignment (POST)
def test_create_assignment(db_session, setup_driver_truck):
    """
    Tests the creation of a new assignment.
    """
    driver_id = setup_driver_truck["driver_id"]
    truck_id = setup_driver_truck["truck_id"]

    response = client.post("/api/assignments/", json={
        "driver_id": driver_id,
        "truck_id": truck_id,
        "date": "2025-02-15"
    })

    assert response.status_code == 200, response.text
    data = response.json()
    assert data["driver_id"] == driver_id
    assert data["truck_id"] == truck_id
    assert "driver_name" in data
    assert "driver_license_type" in data
    assert "truck_plate" in data

# ✅ Test for listing assignments (GET)
def test_get_assignments(db_session, setup_driver_truck):
    """
    Tests the retrieval of assignments.
    """
    driver_id = setup_driver_truck["driver_id"]
    truck_id = setup_driver_truck["truck_id"]

    # Create an assignment if the table is empty
    if not db_session.query(Assignment).first():
        new_assignment = Assignment(id=str(uuid.uuid4()), driver_id=driver_id, truck_id=truck_id, date="2025-02-15")
        db_session.add(new_assignment)
        db_session.commit()

    response = client.get("/api/assignments/")
    assert response.status_code == 200, response.text
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "driver_name" in data[0]
    assert "truck_plate" in data[0]

# ✅ Test for retrieving an assignment by ID (GET)
def test_get_assignment_by_id(db_session, setup_driver_truck):
    """
    Tests retrieving a specific assignment.
    """
    driver_id = setup_driver_truck["driver_id"]
    truck_id = setup_driver_truck["truck_id"]

    assignment = Assignment(id=str(uuid.uuid4()), driver_id=driver_id, truck_id=truck_id, date="2025-02-15")
    db_session.add(assignment)
    db_session.commit()

    response = client.get(f"/api/assignments/{assignment.id}")
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["id"] == assignment.id
    assert data["driver_name"]
    assert data["truck_plate"]

# ✅ Test for updating an assignment (PUT)
def test_update_assignment(db_session, setup_driver_truck):
    """
    Tests updating an assignment.
    """
    driver_id = setup_driver_truck["driver_id"]
    truck_id = setup_driver_truck["truck_id"]

    assignment = Assignment(id=str(uuid.uuid4()), driver_id=driver_id, truck_id=truck_id, date="2025-02-15")
    db_session.add(assignment)
    db_session.commit()

    new_date = "2025-02-20"
    response = client.put(f"/api/assignments/{assignment.id}", json={
        "driver_id": driver_id,
        "truck_id": truck_id,
        "date": new_date
    })

    assert response.status_code == 200, response.text
    data = response.json()
    assert data["id"] == assignment.id
    assert data["date"] == new_date

# ✅ Test for deleting an assignment (DELETE)
def test_delete_assignment(db_session, setup_driver_truck):
    """
    Tests deleting an assignment.
    """
    driver_id = setup_driver_truck["driver_id"]
    truck_id = setup_driver_truck["truck_id"]

    assignment = Assignment(id=str(uuid.uuid4()), driver_id=driver_id, truck_id=truck_id, date="2025-02-15")
    db_session.add(assignment)
    db_session.commit()

    response = client.delete(f"/api/assignments/{assignment.id}")
    assert response.status_code == 200, response.text
    assert response.json() == {"message": "Assignment deleted successfully"}

    # Verify that it was actually deleted
    response = client.get(f"/api/assignments/{assignment.id}")
    assert response.status_code == 404
