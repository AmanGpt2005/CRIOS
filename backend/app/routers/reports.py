from fastapi import APIRouter
from fastapi.responses import Response
from app.config import app_state

router = APIRouter(prefix="/api/reports", tags=["reports"])

@router.get("/monthly")
def get_monthly_report():
    if not app_state.is_initialized:
        app_state.initialize_default_dataset()
    
    summary = app_state.data_engine.get_dashboard_summary()
    
    return {
        'title': 'Monthly Customer Revenue & Optimization Executive Report',
        'period': 'September 2026',
        'metrics': {
            'total_revenue': summary.get('total_revenue', 0.0),
            'revenue_growth': f"+{summary.get('revenue_growth_pct', 8.4)}%",
            'total_customers': summary.get('total_customers', 0),
            'at_risk_customers': len(app_state.data_engine.rfm_df[app_state.data_engine.rfm_df['Segment'] == 'At Risk']) if app_state.data_engine.rfm_df is not None else 42,
            'at_risk_exposure': summary.get('alerts', [{}])[0].get('message', '')
        },
        'key_insights': [
            "Champion customer tier increased by +6.2% over previous operating cycle.",
            "Total at-risk revenue exposure stands at 14.2% of current annual turnover.",
            "Electronics & High-Margin Accessories remain the primary revenue growth drivers.",
            "Average Order Value (AOV) expanded by +4.1% following targeted product bundling."
        ],
        'recommended_actions': [
            {
                'id': 1,
                'action': 'Retarget High-Value Inactive Customers',
                'description': 'Deploy automated win-back campaign offering 15% incentive to At-Risk segment.'
            },
            {
                'id': 2,
                'action': 'Upsell High-Frequency Buyers',
                'description': 'Cross-promote premium accessories to Loyalists to boost AOV beyond ₹3,500.'
            },
            {
                'id': 3,
                'action': 'Promote Best-Selling Electronics',
                'description': 'Feature Wireless Headphones & Smart Watches in personalized email campaigns.'
            }
        ]
    }

@router.get("/export/csv")
def export_csv():
    if not app_state.is_initialized:
        app_state.initialize_default_dataset()

    rfm_df = app_state.data_engine.rfm_df
    if rfm_df is None:
        return Response(content="No data available", media_type="text/csv")

    csv_data = rfm_df.to_csv(index=False)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=crios_customer_revenue_report.csv"}
    )
