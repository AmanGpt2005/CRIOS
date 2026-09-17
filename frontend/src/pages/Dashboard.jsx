import React, { useEffect, useState } from 'react';
import { DollarSign, Users, ShoppingBag, TrendingUp, AlertTriangle, ArrowUpRight, Zap, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import MetricCard from '../components/MetricCard';
import { formatCurrency, formatCompactNumber } from '../utils/formatters';
import { apiService } from '../api/apiService';

const SEGMENT_COLORS = {
  'Champions': '#10b981',
  'Loyal Customers': '#3b82f6',
  'Potential Loyalists': '#8b5cf6',
  'New Customers': '#06b6d4',
  'At Risk': '#f59e0b',
  'Hibernating': '#ef4444'
};

export default function Dashboard({ currency, onSelectCustomer }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getDashboardSummary()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading Executive Revenue Intelligence Dashboard...</div>;
  }

  if (!data) return null;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
        <MetricCard
          title="Total Gross Revenue"
          value={formatCurrency(data.total_revenue, currency)}
          change={`+${data.revenue_growth_pct}%`}
          isPositive={data.revenue_growth_pct >= 0}
          icon={DollarSign}
          subtitle="vs previous period"
        />
        <MetricCard
          title="Active Customers"
          value={formatCompactNumber(data.total_customers)}
          change={`+${data.customer_growth_pct}%`}
          isPositive={true}
          icon={Users}
          subtitle="segmented accounts"
        />
        <MetricCard
          title="Total Orders Processed"
          value={formatCompactNumber(data.total_orders)}
          change="+5.2%"
          isPositive={true}
          icon={ShoppingBag}
          subtitle="lifetime invoices"
        />
        <MetricCard
          title="Average Order Value (AOV)"
          value={formatCurrency(data.aov, currency)}
          change="+4.1%"
          isPositive={true}
          icon={TrendingUp}
          subtitle="per customer transaction"
        />
      </div>

      {/* Main Visual Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Revenue Trend Area Chart */}
        <div className="crios-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>Revenue Trajectory & Trend</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Monthly gross transaction revenue aggregation</p>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)', background: 'var(--success-bg)', padding: '0.2rem 0.6rem', borderRadius: '0.4rem' }}>
              Live Telemetry
            </span>
          </div>

          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenue_trend}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="var(--text-dim)" fontSize={11} />
                <YAxis stroke="var(--text-dim)" fontSize={11} tickFormatter={(val) => formatCompactNumber(val)} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '0.6rem' }}
                  formatter={(val) => [formatCurrency(val, currency), 'Gross Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Segment Breakdown Donut Chart */}
        <div className="crios-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
            Customer Segments
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>RFM Behavioral Distribution</p>

          <div style={{ width: '100%', height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.segment_distribution}
                  dataKey="count"
                  nameKey="segment"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {data.segment_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SEGMENT_COLORS[entry.segment] || '#3b82f6'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '0.6rem' }}
                  formatter={(val, name, item) => [`${val} Accounts (${item.payload.percentage}%)`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginTop: '0.5rem' }}>
            {data.segment_distribution.slice(0, 4).map((seg, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: SEGMENT_COLORS[seg.segment] || '#3b82f6' }} />
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{seg.segment}:</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{seg.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Top Products & AI Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        {/* Top Products Table */}
        <div className="crios-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
            Top Revenue Driving Products
          </h3>
          <table className="crios-table">
            <thead>
              <tr>
                <th>Product Description</th>
                <th>Invoices</th>
                <th>Revenue Generated</th>
              </tr>
            </thead>
            <tbody>
              {data.top_products.map((prod, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600 }}>{prod.product}</td>
                  <td>{prod.orders} orders</td>
                  <td style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>
                    {formatCurrency(prod.revenue, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Executive Insights & Alerts Box */}
        <div className="crios-card" style={{ background: 'var(--bg-glass)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} color="var(--warning)" /> AI Executive Insights
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {data.alerts.map((alert) => (
              <div key={alert.id} style={{
                padding: '0.85rem',
                borderRadius: '0.6rem',
                background: alert.type === 'warning' ? 'var(--warning-bg)' : 'var(--success-bg)',
                border: `1px solid ${alert.type === 'warning' ? 'var(--warning)' : 'var(--success)'}`
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '3px' }}>
                  {alert.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {alert.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
