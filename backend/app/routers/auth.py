from fastapi import APIRouter, HTTPException
from app.schemas.models import LoginRequest, LoginResponse

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/login", response_model=LoginResponse)
def login(req: LoginRequest):
    # Support both custom credentials and instant demo bypass
    if req.email and req.password:
        return {
            "token": "crios_jwt_token_demo_admin_884920",
            "user": {
                "name": "Executive Admin",
                "email": req.email,
                "role": "Chief Revenue Officer",
                "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
            }
        }
    raise HTTPException(status_code=400, detail="Invalid credentials provided.")
