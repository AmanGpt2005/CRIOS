import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

def generate_sample_ecommerce_data(num_transactions=5000, num_customers=450):
    """
    Generates a realistic E-Commerce transaction dataset with RFM characteristics.
    """
    np.random.seed(42)
    random.seed(42)

    categories = {
        'Electronics': [
            ('Wireless Headphones', 2499.00),
            ('Smart Watch Series 5', 4999.00),
            ('Bluetooth Speaker', 1299.00),
            ('USB-C Fast Charger', 499.00),
            ('Ergonomic Mouse', 899.00)
        ],
        'Apparel & Fashion': [
            ('Slim Fit Denim Jeans', 1899.00),
            ('Cotton Casual T-Shirt', 599.00),
            ('Leather Bomber Jacket', 5499.00),
            ('Running Sports Shoes', 2999.00),
            ('Formal Silk Tie', 799.00)
        ],
        'Home & Kitchen': [
            ('Stainless Steel Cookware Set', 3499.00),
            ('Espresso Coffee Maker', 6999.00),
            ('Air Fryer 4.5L', 4299.00),
            ('Memory Foam Pillow', 999.00),
            ('LED Desk Lamp', 1199.00)
        ],
        'Beauty & Personal Care': [
            ('Hydrating Facial Serum', 899.00),
            ('Organic Shampoo 500ml', 499.00),
            ('Luxury Fragrance Spray', 2199.00),
            ('Electric Toothbrush', 1799.00),
            ('Sunscreen Gel SPF 50', 399.00)
        ],
        'Books & Stationery': [
            ('Data Science & ML Guide', 799.00),
            ('Hardcover Executive Planner', 449.00),
            ('Fountain Pen Gift Set', 1299.00),
            ('Wireless Presenter Clicker', 899.00)
        ]
    }

    flat_products = []
    for cat, items in categories.items():
        for desc, price in items:
            flat_products.append({'Category': cat, 'Description': desc, 'UnitPrice': price})

    customer_ids = [f"C{10000 + i}" for i in range(num_customers)]
    
    # Assign customer archetype weights to make RFM realistic
    # 15% Champions, 25% Loyal, 30% Potential, 15% At Risk, 15% Hibernating
    customer_archetypes = {}
    for cid in customer_ids:
        r_val = random.random()
        if r_val < 0.15:
            customer_archetypes[cid] = 'champion' # Frequent, high spending, recent
        elif r_val < 0.40:
            customer_archetypes[cid] = 'loyal'     # Frequent, moderate spending, recent
        elif r_val < 0.70:
            customer_archetypes[cid] = 'potential' # Average frequency, average spending
        elif r_val < 0.85:
            customer_archetypes[cid] = 'at_risk'   # High past spend, but inactive lately
        else:
            customer_archetypes[cid] = 'hibernating'# Low spend, inactive long ago

    end_date = datetime(2026, 9, 15)
    records = []
    invoice_seq = 50000

    for cid in customer_ids:
        arch = customer_archetypes[cid]
        if arch == 'champion':
            num_orders = random.randint(8, 25)
            days_range = (1, 60)
            qty_multiplier = random.uniform(1.2, 3.0)
        elif arch == 'loyal':
            num_orders = random.randint(5, 14)
            days_range = (5, 90)
            qty_multiplier = random.uniform(1.0, 2.0)
        elif arch == 'potential':
            num_orders = random.randint(2, 6)
            days_range = (10, 150)
            qty_multiplier = random.uniform(1.0, 1.5)
        elif arch == 'at_risk':
            num_orders = random.randint(4, 12)
            days_range = (120, 360) # Purchased a lot long ago
            qty_multiplier = random.uniform(1.2, 2.5)
        else: # hibernating
            num_orders = random.randint(1, 3)
            days_range = (200, 450)
            qty_multiplier = random.uniform(0.8, 1.2)

        for _ in range(num_orders):
            invoice_seq += 1
            invoice_no = f"INV-{invoice_seq}"
            days_ago = random.randint(days_range[0], days_range[1])
            order_date = end_date - timedelta(days=days_ago)

            # 1 to 4 line items per order
            num_items = random.randint(1, 4)
            chosen_items = random.sample(flat_products, num_items)

            for prod in chosen_items:
                qty = max(1, int(round(random.randint(1, 3) * qty_multiplier)))
                records.append({
                    'InvoiceNo': invoice_no,
                    'StockCode': f"SKU-{hash(prod['Description']) % 9000 + 1000}",
                    'Description': prod['Description'],
                    'Category': prod['Category'],
                    'Quantity': qty,
                    'InvoiceDate': order_date.strftime('%Y-%m-%d %H:%M:%S'),
                    'UnitPrice': prod['UnitPrice'],
                    'CustomerID': cid,
                    'Country': random.choice(['India', 'United States', 'United Kingdom', 'Germany', 'Singapore', 'UAE'])
                })

    df = pd.DataFrame(records)
    # Sort chronologically
    df['InvoiceDate'] = pd.to_datetime(df['InvoiceDate'])
    df = df.sort_values('InvoiceDate').reset_index(drop=True)
    df['InvoiceDate'] = df['InvoiceDate'].dt.strftime('%Y-%m-%d %H:%M:%S')
    return df
