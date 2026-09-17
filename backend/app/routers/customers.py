from fastapi import APIRouter, HTTPException, Query
from app.config import app_state

router = APIRouter(prefix="/api/customers", tags=["customers"])

@router.get("/")
def list_customers(search: str = Query("", description="Search term"), segment: str = Query("all", description="Segment filter")):
    if not app_state.is_initialized:
        app_state.initialize_default_dataset()
    return app_state.data_engine.get_customer_list(search=search, segment=segment)

@router.get("/{customer_id}")
def get_customer_profile(customer_id: str):
    if not app_state.is_initialized:
        app_state.initialize_default_dataset()
    profile = app_state.data_engine.get_customer_profile(customer_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Customer ID not found.")
    
    # Attach predicted revenue if available
    if app_state.predictor.predictions_df is not None:
        pred_df = app_state.predictor.predictions_df
        c_pred = pred_df[pred_df['CustomerID'] == customer_id]
        if not c_pred.empty:
            profile['predicted_revenue'] = round(float(c_pred.iloc[0]['PredictedRevenue']), 2)
            profile['confidence_pct'] = float(c_pred.iloc[0]['ConfidencePct'])
        else:
            profile['predicted_revenue'] = round(profile['monetary'] * 0.4, 2)
            profile['confidence_pct'] = 85.0
    return profile
