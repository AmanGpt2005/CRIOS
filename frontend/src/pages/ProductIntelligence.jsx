import React, { useEffect, useState } from 'react';
import { Package, AlertCircle, ShoppingBag, TrendingUp, Layers } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { formatCurrency, formatCompactNumber } from '../utils/formatters';
import { apiService } from '../api/apiService';

const CATEGORY_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#06b6d4'];

export default function ProductIntelligence({ currency }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getProductsSummary()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading Product Performance Intelligence...</div>;
  if (!data) return null;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Category Revenue Distribution Chart & Low Performers */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Category Revenue Bar Chart */}
        <div className="crios-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
            Revenue Generation by Product Category
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Gross cumulative sales revenue contribution across catalog categories
          </p>

          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.category_distribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="category" stroke="var(--text-dim)" fontSize={11} />
                <YAxis stroke="var(--text-dim)" fontSize={11} tickFormatter={(v) => formatCompactNumber(v)} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '0.6rem' }}
                  formatter={(val) => [formatCurrency(val, currency), 'Total Revenue']}
                />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                  {data.category_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Performing Inventory Alert Card */}
        <div className="crios-card" style={{ background: 'var(--danger-bg)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} /> Low Performing SKUs
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            SKUs with lowest traction requiring bundle promotions or markdowns
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.low_performers.map((item, idx) => (
              <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.product}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span>{item.orders} Orders</span>
                  <span style={{ fontWeight: 700, color: 'var(--danger)' }}>{formatCurrency(item.revenue, currency)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products Grid */}
      <div className="crios-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
          Catalog Product Performance Matrix
        </h3>

        <table className="crios-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Total Revenue</th>
              <th>Invoice Count</th>
              <th>Units Sold</th>
            </tr>
          </thead>
          <tbody>
            {data.top_products.map((prod, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{prod.product}</td>
                <td>
                  <span style={{ fontSize: '0.75rem', background: 'var(--bg-primary)', padding: '0.2rem 0.6rem', borderRadius: '0.4rem', border: '1px solid var(--border-color)' }}>
                    {prod.category}
                  </span>
                </td>
                <td style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>
                  {formatCurrency(prod.revenue, currency)}
                </td>
                <td>{prod.orders} orders</td>
                <td>{prod.units_sold} units</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
