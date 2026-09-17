from fastapi import APIRouter
from app.config import app_state
from app.schemas.models import TrainModelRequest

router = APIRouter(prefix="/api/predictions", tags=["predictions"])

@router.get("/summary")
def get_predictions_summary():
    if not app_state.is_initialized:
        app_state.initialize_default_dataset()
    return app_state.predictor.get_predictions_summary()

@router.post("/train")
def train_model(req: TrainModelRequest):
    if not app_state.is_initialized:
        app_state.initialize_default_dataset()
    
    success = app_state.predictor.train_and_evaluate(app_state.data_engine.rfm_df, model_type=req.model_type)
    if success:
        return {
            "success": True,
            "message": f"Successfully trained model: {app_state.predictor.model_name}",
            "summary": app_state.predictor.get_predictions_summary()
        }
    return {"success": False, "message": "Failed to train model due to insufficient data."}
