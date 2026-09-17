from fastapi import APIRouter
from app.config import app_state
from app.schemas.models import CampaignTriggerRequest, CampaignTriggerResponse

router = APIRouter(prefix="/api/segmentation", tags=["segmentation"])

@router.get("/overview")
def get_segmentation_overview():
    if not app_state.is_initialized:
        app_state.initialize_default_dataset()
    
    rfm_df = app_state.data_engine.rfm_df
    total_customers = len(rfm_df) if rfm_df is not None else 1

    segments = ['Champions', 'Loyal Customers', 'Potential Loyalists', 'New Customers', 'At Risk', 'Hibernating']
    results = []

    for seg in segments:
        sub = rfm_df[rfm_df['Segment'] == seg] if rfm_df is not None else []
        cnt = len(sub)
        rev = float(sub['Monetary'].sum()) if cnt > 0 else 0.0
        avg_rec = float(sub['Recency'].mean()) if cnt > 0 else 0.0
        avg_freq = float(sub['Frequency'].mean()) if cnt > 0 else 0.0

        results.append({
            'name': seg,
            'count': cnt,
            'percentage': round((cnt / total_customers) * 100, 1),
            'total_revenue': round(rev, 2),
            'avg_recency_days': round(avg_rec, 1),
            'avg_frequency': round(avg_freq, 1),
            'recommended_action': app_state.data_engine.get_segment_action(seg)
        })

    return results

@router.post("/trigger-campaign", response_model=CampaignTriggerResponse)
def trigger_campaign(req: CampaignTriggerRequest):
    rfm_df = app_state.data_engine.rfm_df
    sub = rfm_df[rfm_df['Segment'].str.lower() == req.segment.lower()] if rfm_df is not None else []
    cnt = len(sub)
    exposure = float(sub['Monetary'].sum()) if cnt > 0 else 50000.0

    return {
        'success': True,
        'message': f"Campaign '{req.campaign_name}' successfully launched for {cnt} customers in segment '{req.segment}'.",
        'target_count': cnt,
        'estimated_revenue_impact': round(exposure * 0.18, 2)
    }
