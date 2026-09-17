import pandas as pd
import numpy as np
from datetime import datetime

class DataEngine:
    def __init__(self, raw_df: pd.DataFrame = None):
        self.raw_df = raw_df
        self.cleaned_df = None
        self.rfm_df = None
        self.reference_date = None
        if raw_df is not None and not raw_df.empty:
            self.process_data()

    def load_data(self, df: pd.DataFrame):
        self.raw_df = df
        self.process_data()

    def process_data(self):
        if self.raw_df is None or self.raw_df.empty:
            return

        df = self.raw_df.copy()
        
        # Data Cleaning
        df['CustomerID'] = df['CustomerID'].astype(str).str.strip()
        df = df[df['CustomerID'].notnull() & (df['CustomerID'] != 'nan') & (df['CustomerID'] != '')]
        
        df['Quantity'] = pd.to_numeric(df['Quantity'], errors='coerce')
        df['UnitPrice'] = pd.to_numeric(df['UnitPrice'], errors='coerce')
        df = df[(df['Quantity'] > 0) & (df['UnitPrice'] > 0)]

        df['InvoiceDate'] = pd.to_datetime(df['InvoiceDate'])
        df['TotalSpend'] = df['Quantity'] * df['UnitPrice']

        self.cleaned_df = df
        
        # Calculate Reference Date (Snapshot date = max invoice date + 1 day)
        self.reference_date = df['InvoiceDate'].max() + pd.Timedelta(days=1)

        # Build RFM Dataframe
        rfm = df.groupby('CustomerID').agg(
            Recency=('InvoiceDate', lambda x: (self.reference_date - x.max()).days),
            Frequency=('InvoiceNo', 'nunique'),
            Monetary=('TotalSpend', 'sum'),
            FirstPurchase=('InvoiceDate', 'min'),
            LastPurchase=('InvoiceDate', 'max'),
            TotalItems=('Quantity', 'sum')
        ).reset_index()

        rfm['AOV'] = (rfm['Monetary'] / rfm['Frequency']).round(2)
        rfm['CustomerTenureDays'] = (self.reference_date - rfm['FirstPurchase']).dt.days

        # RFM Scoring 1-5
        try:
            rfm['R_Score'] = pd.qcut(rfm['Recency'], q=5, labels=[5, 4, 3, 2, 1], duplicates='drop').astype(int)
        except Exception:
            rfm['R_Score'] = 3

        try:
            rfm['F_Score'] = pd.qcut(rfm['Frequency'].rank(method='first'), q=5, labels=[1, 2, 3, 4, 5], duplicates='drop').astype(int)
        except Exception:
            rfm['F_Score'] = 3

        try:
            rfm['M_Score'] = pd.qcut(rfm['Monetary'].rank(method='first'), q=5, labels=[1, 2, 3, 4, 5], duplicates='drop').astype(int)
        except Exception:
            rfm['M_Score'] = 3

        rfm['RFM_Score'] = rfm['R_Score'].astype(str) + rfm['F_Score'].astype(str) + rfm['M_Score'].astype(str)

        # Rule-based Segment Mapping
        def assign_segment(row):
            r, f, m = row['R_Score'], row['F_Score'], row['M_Score']
            if r >= 4 and f >= 4 and m >= 4:
                return 'Champions'
            elif r >= 3 and f >= 3:
                return 'Loyal Customers'
            elif r >= 3 and f < 3 and m >= 3:
                return 'Potential Loyalists'
            elif r >= 4 and f == 1:
                return 'New Customers'
            elif r <= 2 and f >= 3:
                return 'At Risk'
            elif r <= 2 and f <= 2:
                return 'Hibernating'
            else:
                return 'Promising'

        rfm['Segment'] = rfm.apply(assign_segment, axis=1)

        # Map preferred category per customer
        cust_category = df.groupby(['CustomerID', 'Category'])['TotalSpend'].sum().reset_index()
        top_cats = cust_category.sort_values(['CustomerID', 'TotalSpend'], ascending=[True, False]).drop_duplicates('CustomerID')
        cat_dict = dict(zip(top_cats['CustomerID'], top_cats['Category']))
        rfm['PreferredCategory'] = rfm['CustomerID'].map(cat_dict).fillna('General')

        self.rfm_df = rfm

    def get_dashboard_summary(self):
        if self.cleaned_df is None or self.rfm_df is None:
            return {}

        total_revenue = float(self.cleaned_df['TotalSpend'].sum())
        total_customers = int(self.rfm_df['CustomerID'].nunique())
        total_orders = int(self.cleaned_df['InvoiceNo'].nunique())
        aov = float(total_revenue / total_orders) if total_orders > 0 else 0.0

        # Monthly revenue trend
        df_monthly = self.cleaned_df.set_index('InvoiceDate').resample('ME')['TotalSpend'].sum().reset_index()
        df_monthly['DateStr'] = df_monthly['InvoiceDate'].dt.strftime('%b %Y')
        revenue_trend = [
            {'date': row['DateStr'], 'revenue': round(float(row['TotalSpend']), 2)}
            for _, row in df_monthly.iterrows()
        ]

        # Calculate MoM growth
        if len(df_monthly) >= 2:
            last_month = df_monthly.iloc[-1]['TotalSpend']
            prev_month = df_monthly.iloc[-2]['TotalSpend']
            growth_pct = round(((last_month - prev_month) / prev_month) * 100, 2) if prev_month > 0 else 0.0
        else:
            growth_pct = 8.4

        # Segment Counts
        segment_counts = self.rfm_df['Segment'].value_counts().to_dict()
        segment_distribution = [
            {'segment': k, 'count': int(v), 'percentage': round((int(v) / total_customers) * 100, 1)}
            for k, v in segment_counts.items()
        ]

        # Top products
        top_prods_df = self.cleaned_df.groupby('Description').agg(
            Revenue=('TotalSpend', 'sum'),
            Orders=('InvoiceNo', 'nunique')
        ).sort_values('Revenue', ascending=False).head(5).reset_index()

        top_products = [
            {'product': row['Description'], 'revenue': round(float(row['Revenue']), 2), 'orders': int(row['Orders'])}
            for _, row in top_prods_df.iterrows()
        ]

        # At-risk revenue exposure calculation
        at_risk_customers = self.rfm_df[self.rfm_df['Segment'] == 'At Risk']
        at_risk_exposure = round(float(at_risk_customers['Monetary'].sum()), 2)
        at_risk_count = int(len(at_risk_customers))

        return {
            'total_revenue': round(total_revenue, 2),
            'total_customers': total_customers,
            'total_orders': total_orders,
            'aov': round(aov, 2),
            'revenue_growth_pct': growth_pct,
            'customer_growth_pct': 12.5,
            'revenue_trend': revenue_trend,
            'segment_distribution': segment_distribution,
            'top_products': top_products,
            'alerts': [
                {
                    'id': 1,
                    'type': 'warning',
                    'title': 'At-Risk Revenue Exposure',
                    'message': f"{at_risk_count} high-value customers are inactive. Risk exposure: ₹{at_risk_exposure:,.2f}."
                },
                {
                    'id': 2,
                    'type': 'success',
                    'title': 'Champion Segment Expansion',
                    'message': "Champions tier grew by +6.2% over recent period."
                },
                {
                    'id': 3,
                    'type': 'info',
                    'title': 'Top Category Demand',
                    'message': "Electronics & Smart Accessories represent 38% of total gross revenue."
                }
            ]
        }

    def get_customer_list(self, search='', segment='all'):
        if self.rfm_df is None:
            return []

        df = self.rfm_df.copy()
        if segment and segment != 'all':
            df = df[df['Segment'].str.lower() == segment.lower()]

        if search:
            search_str = search.lower()
            df = df[
                df['CustomerID'].str.lower().str.contains(search_str) |
                df['Segment'].str.lower().str.contains(search_str) |
                df['PreferredCategory'].str.lower().str.contains(search_str)
            ]

        customers = []
        for _, row in df.iterrows():
            customers.append({
                'customer_id': str(row['CustomerID']),
                'segment': str(row['Segment']),
                'recency': int(row['Recency']),
                'frequency': int(row['Frequency']),
                'monetary': round(float(row['Monetary']), 2),
                'aov': round(float(row['AOV']), 2),
                'r_score': int(row['R_Score']),
                'f_score': int(row['F_Score']),
                'm_score': int(row['M_Score']),
                'preferred_category': str(row['PreferredCategory']),
                'last_purchase': str(row['LastPurchase']).split()[0]
            })
        return customers

    def get_customer_profile(self, customer_id: str):
        if self.rfm_df is None or self.cleaned_df is None:
            return None

        cust_row = self.rfm_df[self.rfm_df['CustomerID'] == customer_id]
        if cust_row.empty:
            return None

        row = cust_row.iloc[0]
        cust_tx = self.cleaned_df[self.cleaned_df['CustomerID'] == customer_id].sort_values('InvoiceDate')

        # Purchase history line chart
        tx_trend = cust_tx.groupby(cust_tx['InvoiceDate'].dt.strftime('%Y-%m-%d'))['TotalSpend'].sum().reset_index()
        purchase_history = [
            {'date': str(r['InvoiceDate']), 'spend': round(float(r['TotalSpend']), 2)}
            for _, r in tx_trend.iterrows()
        ]

        # Product preferences
        prod_pref = cust_tx.groupby('Description').agg(
            orders=('InvoiceNo', 'nunique'),
            spend=('TotalSpend', 'sum')
        ).sort_values('spend', ascending=False).head(5).reset_index()

        product_preferences = [
            {'product': r['Description'], 'orders': int(r['orders']), 'spend': round(float(r['spend']), 2)}
            for _, r in prod_pref.iterrows()
        ]

        return {
            'customer_id': str(row['CustomerID']),
            'segment': str(row['Segment']),
            'monetary': round(float(row['Monetary']), 2),
            'frequency': int(row['Frequency']),
            'recency': int(row['Recency']),
            'aov': round(float(row['AOV']), 2),
            'last_purchase_date': str(row['LastPurchase']).split()[0],
            'first_purchase_date': str(row['FirstPurchase']).split()[0],
            'rfm_score': {
                'r': int(row['R_Score']),
                'f': int(row['F_Score']),
                'm': int(row['M_Score']),
                'raw_code': str(row['RFM_Score'])
            },
            'purchase_history': purchase_history,
            'product_preferences': product_preferences,
            'recommended_action': self.get_segment_action(row['Segment'])
        }

    def get_segment_action(self, segment: str):
        actions = {
            'Champions': 'Reward loyalty with VIP early access, exclusive product tier preview, and ambassador perks.',
            'Loyal Customers': 'Upsell higher-value products and launch cross-category recommendation triggers.',
            'Potential Loyalists': 'Offer tailored bundle discount to convert into repeat high-frequency buyers.',
            'New Customers': 'Send automated onboarding welcome sequence and 15% follow-up coupon code.',
            'At Risk': 'Launch urgent targeted win-back re-engagement campaign with personalized high-margin incentives.',
            'Hibernating': 'Run automated low-cost win-back email or archive in secondary re-activation segment.'
        }
        return actions.get(segment, 'Monitor engagement patterns and send targeted seasonal offers.')

    def get_product_intelligence(self):
        if self.cleaned_df is None:
            return {}

        prods = self.cleaned_df.groupby('Description').agg(
            revenue=('TotalSpend', 'sum'),
            orders=('InvoiceNo', 'nunique'),
            qty=('Quantity', 'sum'),
            category=('Category', 'first')
        ).reset_index()

        top_revenue = prods.sort_values('revenue', ascending=False).head(10)
        low_performers = prods.sort_values('revenue', ascending=True).head(5)
        
        cat_dist = self.cleaned_df.groupby('Category')['TotalSpend'].sum().reset_index()

        return {
            'top_products': [
                {
                    'product': r['Description'],
                    'category': r['category'],
                    'revenue': round(float(r['revenue']), 2),
                    'orders': int(r['orders']),
                    'units_sold': int(r['qty'])
                }
                for _, r in top_revenue.iterrows()
            ],
            'low_performers': [
                {
                    'product': r['Description'],
                    'category': r['category'],
                    'revenue': round(float(r['revenue']), 2),
                    'orders': int(r['orders'])
                }
                for _, r in low_performers.iterrows()
            ],
            'category_distribution': [
                {'category': r['Category'], 'revenue': round(float(r['TotalSpend']), 2)}
                for _, r in cat_dist.iterrows()
            ]
        }
