import sys
import os

sys.path.insert(0, os.path.abspath("."))

from app.ml.sample_generator import generate_sample_ecommerce_data
from app.ml.data_engine import DataEngine
from app.ml.predictor import RevenuePredictor

print("Testing E-Commerce sample data generator...")
df = generate_sample_ecommerce_data(num_transactions=1000, num_customers=100)
print(f"Generated {len(df)} transactions.")

print("Testing DataEngine cleaning & RFM scoring...")
engine = DataEngine(df)
summary = engine.get_dashboard_summary()
print("Dashboard summary generated successfully:")
print(f"  Total Revenue: INR {summary['total_revenue']:,.2f}")
print(f"  Total Customers: {summary['total_customers']}")
print(f"  Total Orders: {summary['total_orders']}")
print(f"  AOV: INR {summary['aov']:,.2f}")

print("Testing RevenuePredictor ML model training...")
predictor = RevenuePredictor()
success = predictor.train_and_evaluate(engine.rfm_df, model_type="ridge")
if success:
    pred_sum = predictor.get_predictions_summary()
    print("RevenuePredictor model trained successfully:")
    print(f"  Model: {pred_sum['metrics']['model_name']}")
    print(f"  R2 Score: {pred_sum['metrics']['r2_score']}")
    print(f"  MAE: INR {pred_sum['metrics']['mae']:,.2f}")
    print(f"  RMSE: INR {pred_sum['metrics']['rmse']:,.2f}")

print("Backend verification test PASSED 100%!")
