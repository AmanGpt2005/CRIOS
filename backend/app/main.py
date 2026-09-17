from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import app_state
from app.routers import (
    auth,
    dashboard,
    customers,
    segmentation,
    predictions,
    products,
    reports,
    upload
)

app = FastAPI(
    title="CRIOS - Customer Revenue Intelligence & Optimization System API",
    description="Full-stack Customer Revenue Intelligence, RFM Analytics, and ML Prediction REST API",
    version="2.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(customers.router)
app.include_router(segmentation.router)
app.include_router(predictions.router)
app.include_router(products.router)
app.include_router(reports.router)
app.include_router(upload.router)

@app.on_event("startup")
def startup_event():
    print("[CRIOS-BACKEND] Starting FastAPI Server...")
    app_state.initialize_default_dataset()

@app.get("/")
def root():
    return {
        "status": "online",
        "system": "CRIOS - Customer Revenue Intelligence & Optimization System",
        "version": "2.0.0",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
