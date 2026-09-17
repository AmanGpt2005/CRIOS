from fastapi import APIRouter
from app.config import app_state

router = APIRouter(prefix="/api/products", tags=["products"])

@router.get("/summary")
def get_products_summary():
    if not app_state.is_initialized:
        app_state.initialize_default_dataset()
    return app_state.data_engine.get_product_intelligence()
