from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    token: str
    user: Dict[str, Any]

class TrainModelRequest(BaseModel):
    model_type: str = "ridge" # "ridge", "rf", "linear"

class CampaignTriggerRequest(BaseModel):
    segment: str
    campaign_name: str
    offer_discount_pct: Optional[int] = 15

class CampaignTriggerResponse(BaseModel):
    success: bool
    message: str
    target_count: int
    estimated_revenue_impact: float
