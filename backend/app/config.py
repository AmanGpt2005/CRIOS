import os
import pandas as pd
from app.ml.sample_generator import generate_sample_ecommerce_data
from app.ml.data_engine import DataEngine
from app.ml.predictor import RevenuePredictor

class AppState:
    def __init__(self):
        self.data_engine = DataEngine()
        self.predictor = RevenuePredictor()
        self.is_initialized = False

    def initialize_default_dataset(self):
        print("[CRIOS-BACKEND] Generating synthetic E-Commerce dataset...")
        df = generate_sample_ecommerce_data(num_transactions=5000, num_customers=450)
        self.data_engine.load_data(df)
        self.predictor.train_and_evaluate(self.data_engine.rfm_df, model_type="ridge")
        self.is_initialized = True
        print(f"[CRIOS-BACKEND] Initialized dataset with {len(df)} transactions and {len(self.data_engine.rfm_df)} customers.")

app_state = AppState()
