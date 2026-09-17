from fastapi import APIRouter
from app.config import app_state

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/summary")
def get_dashboard_summary():
    if not app_state.is_initialized:
        app_state.initialize_default_dataset()
    return app_state.data_engine.get_dashboard_summary()
