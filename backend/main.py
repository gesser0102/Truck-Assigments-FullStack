from fastapi import FastAPI
from routes import drivers, trucks, assignments
from middlewares.middlewares import log_exceptions_middleware
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI(
    title="Truck Management API",
    description="API to manage trucks and drivers assignments",
    version="1.0.0",
    contact={
        "name": "Rodrigo Gesser",
        "email": "gesserrodrigo@hotmail.com",
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    },
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)


app.middleware("http")(log_exceptions_middleware)
# app routes
app.include_router(drivers.router, prefix="/api")
app.include_router(trucks.router, prefix="/api")
app.include_router(assignments.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "API is running!"}
