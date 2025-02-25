from fastapi import Request, FastAPI
import traceback

from fastapi.responses import JSONResponse
from database import SessionLocal
from models.models import ErrorLog
from datetime import datetime

app = FastAPI()

@app.middleware("http")
async def log_exceptions_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        db = SessionLocal()
        error_entry = ErrorLog(
            timestamp=datetime.utcnow(),
            error_message=str(e),
            stack_trace=str(traceback.format_exc()),
            endpoint=request.url.path
        )
        db.add(error_entry)
        db.commit()
        db.close()
        return JSONResponse(status_code=500, content={"message": "Internal Server Error"})
