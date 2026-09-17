from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
import io
from app.config import app_state
from app.ml.sample_generator import generate_sample_ecommerce_data

router = APIRouter(prefix="/api/upload", tags=["upload"])

@router.post("/csv")
async def upload_csv(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")

    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        
        # Check minimum required columns
        required = {'CustomerID', 'InvoiceNo', 'UnitPrice', 'Quantity'}
        missing = required - set(df.columns)
        
        if missing:
            raise HTTPException(
                status_code=400,
                detail=f"Uploaded CSV is missing required columns: {', '.join(missing)}"
            )

        # Standardize optional columns
        if 'InvoiceDate' not in df.columns:
            df['InvoiceDate'] = pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')
        if 'Category' not in df.columns:
            df['Category'] = 'General'
        if 'Description' not in df.columns:
            df['Description'] = 'Item ' + df['StockCode'].astype(str) if 'StockCode' in df.columns else 'Generic Item'

        # Load into engine & retrain
        app_state.data_engine.load_data(df)
        app_state.predictor.train_and_evaluate(app_state.data_engine.rfm_df, model_type="ridge")
        
        records_processed = len(df)
        customers_processed = len(app_state.data_engine.rfm_df)

        return {
            "success": True,
            "filename": file.filename,
            "records_processed": records_processed,
            "customers_processed": customers_processed,
            "validation_status": "Passed",
            "message": f"Successfully ingested {records_processed:,} records across {customers_processed:,} customers. Recalculated RFM segments and retrained revenue prediction model."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process CSV file: {str(e)}")

@router.post("/reset-sample")
def reset_sample_dataset():
    app_state.initialize_default_dataset()
    return {
        "success": True,
        "message": "Dataset reset to default 5,000+ realistic E-Commerce transaction dataset.",
        "records_processed": len(app_state.data_engine.cleaned_df),
        "customers_processed": len(app_state.data_engine.rfm_df)
    }
