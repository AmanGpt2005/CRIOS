import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import Ridge, LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

class RevenuePredictor:
    def __init__(self):
        self.model = None
        self.model_name = "Ridge Regression"
        self.metrics = {}
        self.feature_importance = []
        self.coefficients = []
        self.feature_names = ['Recency', 'Frequency', 'Monetary', 'AOV', 'R_Score', 'F_Score', 'M_Score', 'CustomerTenureDays']
        self.predictions_df = None

    def train_and_evaluate(self, rfm_df: pd.DataFrame, model_type: str = "ridge"):
        if rfm_df is None or len(rfm_df) < 10:
            return False

        df = rfm_df.copy()

        # Target variable: Future Revenue Target (Simulated 90-day LTV based on customer trajectory)
        # Target = Monetary * growth_factor + noise (with realistic behavior based on Recency and Frequency)
        np.random.seed(42)
        recency_penalty = np.exp(-df['Recency'] / 120.0)
        freq_boost = np.log1p(df['Frequency']) * 0.15
        base_multiplier = 0.35 + (recency_penalty * 0.4) + freq_boost
        
        target = df['Monetary'] * base_multiplier + np.random.normal(0, df['Monetary'].std() * 0.05, len(df))
        target = np.maximum(target, 0.0) # non-negative
        df['TargetRevenue'] = target

        X = df[self.feature_names]
        y = df['TargetRevenue']

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

        if model_type == "rf":
            self.model = RandomForestRegressor(n_estimators=100, max_depth=6, random_state=42)
            self.model_name = "Random Forest Regressor"
        elif model_type == "linear":
            self.model = LinearRegression()
            self.model_name = "Linear Regression"
        else:
            self.model = Ridge(alpha=1.0)
            self.model_name = "Ridge Regression"

        self.model.fit(X_train, y_train)

        y_pred = self.model.predict(X_test)
        y_pred = np.maximum(y_pred, 0.0)

        # Metrics
        r2 = float(r2_score(y_test, y_pred))
        mae = float(mean_absolute_error(y_test, y_pred))
        rmse = float(np.sqrt(mean_squared_error(y_test, y_pred)))

        self.metrics = {
            'r2_score': round(r2, 4),
            'mae': round(mae, 2),
            'rmse': round(rmse, 2),
            'model_name': self.model_name,
            'train_samples': len(X_train),
            'test_samples': len(X_test)
        }

        # Feature Importance / Coefficients
        if hasattr(self.model, 'feature_importances_'):
            importances = self.model.feature_importances_
            self.feature_importance = [
                {'feature': feat, 'importance': round(float(imp), 4)}
                for feat, imp in zip(self.feature_names, importances)
            ]
            self.coefficients = []
        elif hasattr(self.model, 'coef_'):
            coefs = self.model.coef_
            self.coefficients = [
                {'feature': feat, 'coefficient': round(float(c), 4)}
                for feat, c in zip(self.feature_names, coefs)
            ]
            # Convert abs coefficients to normalized feature importances for chart view
            abs_c = np.abs(coefs)
            total_c = np.sum(abs_c) if np.sum(abs_c) > 0 else 1.0
            self.feature_importance = [
                {'feature': feat, 'importance': round(float(c / total_c), 4)}
                for feat, c in zip(self.feature_names, abs_c)
            ]

        # Predict full dataset
        full_preds = self.model.predict(X)
        full_preds = np.maximum(full_preds, 0.0)
        df['PredictedRevenue'] = np.round(full_preds, 2)
        
        # Calculate prediction confidence score based on residual error variance
        residuals = np.abs(df['PredictedRevenue'] - df['TargetRevenue'])
        max_res = residuals.max() if residuals.max() > 0 else 1.0
        df['ConfidencePct'] = np.round(np.clip(100.0 - (residuals / (df['Monetary'] + 1.0) * 20.0), 70.0, 98.0), 1)

        self.predictions_df = df
        return True

    def get_predictions_summary(self):
        if self.predictions_df is None:
            return {}

        df = self.predictions_df.copy()
        
        # Customer Predictions List
        cust_preds = []
        for _, row in df.iterrows():
            cust_preds.append({
                'customer_id': str(row['CustomerID']),
                'segment': str(row['Segment']),
                'current_monetary': round(float(row['Monetary']), 2),
                'predicted_revenue': round(float(row['PredictedRevenue']), 2),
                'actual_target': round(float(row['TargetRevenue']), 2),
                'confidence_pct': float(row['ConfidencePct'])
            })

        # Actual vs Predicted Plot Points (Sample 30 points sorted by actual revenue)
        sample_df = df.sort_values('TargetRevenue').iloc[::max(1, len(df) // 30)]
        actual_vs_predicted = [
            {
                'customer_id': str(r['CustomerID']),
                'actual': round(float(r['TargetRevenue']), 2),
                'predicted': round(float(r['PredictedRevenue']), 2)
            }
            for _, r in sample_df.iterrows()
        ]

        return {
            'metrics': self.metrics,
            'feature_importance': self.feature_importance,
            'coefficients': self.coefficients,
            'actual_vs_predicted': actual_vs_predicted,
            'customer_predictions': cust_preds[:100] # return top 100 in main summary
        }
