import React, { useEffect, useState } from 'react';
import { Cpu, RefreshCw, TrendingUp, CheckCircle, Award, BarChart2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import MetricCard from '../components/MetricCard';
import { formatCurrency, getSegmentBadgeClass } from '../utils/formatters';
import { apiService } from '../api/apiService';

export default function RevenuePrediction({ currency, onSelectCustomer }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modelType, setModelType] = useState('ridge');
  const [retraining, setRetraining] = useState(false);

  const fetchPredictions = () => {
    setLoading(true);
    apiService.getPredictionsSummary()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  const handleRetrain = (type) => {
    setModelType(type);
    setRetraining(true);
    apiService.trainModel(type)
      .then(res => {
        if (res.summary) {
          setData(res.summary);
        }
        setRetraining(false);
      })
      .catch(err => {
        console.error(err);
        setRetraining(false);
      });
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading ML Revenue Prediction Diagnostics Engine...</div>;
  if (!data) return null;

  const { metrics, feature_importance, actual_vs_predicted, customer_predictions } = data;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Model Selector & Retrain Header */}
      <div className="crios-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Machine Learning Engine Active
          </span>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
            {metrics.model_name} Prediction Terminal
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ display: 'flex', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '0.6rem', padding: '3px' }}>
            {[
              { id: 'ridge', label: 'Ridge Regression' },
              { id: 'rf', label: 'Random Forest' },
              { id: 'linear', label: 'Linear Regression' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => handleRetrain(m.id)}
                disabled={retraining}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: modelType === m.id ? 'var(--accent-primary)' : 'transparent',
                  color: modelType === m.id ? '#fff' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleRetrain(modelType)}
            disabled={retraining}
            className="btn-primary"
            style={{ fontSize: '0.8rem' }}
          >
            <RefreshCw size={15} className={retraining ? 'animate-spin' : ''} />
            {retraining ? 'Training...' : 'Re-Train Engine'}
          </button>
        </div>
      </div>

      {/* Model Diagnostic Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
        <MetricCard
          title="R² Validation Score"
          value={metrics.r2_score}
          change="Optimal Fit"
          isPositive={metrics.r2_score >= 0.70}
          icon={Award}
          subtitle={`Across ${metrics.test_samples} test profiles`}
        />
        <MetricCard
          title="Mean Absolute Error (MAE)"
          value={formatCurrency(metrics.mae, currency)}
          change="Low Variance"
          isPositive={true}
          icon={Cpu}
          subtitle="average dollar deviation"
        />
        <MetricCard
          title="Root Mean Sq. Error (RMSE)"
          value={formatCurrency(metrics.rmse, currency)}
          change="Stable Model"
          isPositive={true}
          icon={TrendingUp}
          subtitle="penalizes high outliers"
        />
        <MetricCard
          title="Training Set Samples"
          value={metrics.train_samples}
          change="Validated"
          isPositive={true}
          icon={BarChart2}
          subtitle="cross-validation rows"
        />
      </div>

      {/* Visual Diagnostic Charts: Feature Importance & Actual vs Predicted */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Feature Importance Bar Chart */}
        <div className="crios-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
            Feature Weight Importance
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Normalized influence of RFM parameters on predicted revenue
          </p>

          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={feature_importance} margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" horizontal={false} />
                <XAxis type="number" stroke="var(--text-dim)" fontSize={11} />
                <YAxis dataKey="feature" type="category" stroke="var(--text-dim)" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '0.6rem' }}
                  formatter={(val) => [`${(val * 100).toFixed(1)}% Weight`, 'Influence']}
                />
                <Bar dataKey="importance" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Actual vs Predicted Line Plot */}
        <div className="crios-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
            Actual vs. Predicted Revenue Horizon
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Comparing ground truth LTV against ML regression predictions
          </p>

          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={actual_vs_predicted}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="customer_id" stroke="var(--text-dim)" fontSize={10} tick={false} />
                <YAxis stroke="var(--text-dim)" fontSize={11} tickFormatter={(v) => formatCompactNumber(v)} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '0.6rem' }}
                  formatter={(val, name) => [formatCurrency(val, currency), name === 'actual' ? 'Actual Target' : 'Predicted Model']}
                />
                <Legend />
                <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} dot={false} name="Actual Target" />
                <Line type="monotone" dataKey="predicted" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Predicted Model" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Customer Predictions Table */}
      <div className="crios-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
          Customer Level Revenue Predictions (Top 100 Profiles)
        </h3>

        <table className="crios-table">
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Segment</th>
              <th>Current Spend</th>
              <th>Predicted 90d Revenue</th>
              <th>Prediction Confidence</th>
            </tr>
          </thead>
          <tbody>
            {customer_predictions.map((cust) => (
              <tr key={cust.customer_id} onClick={() => onSelectCustomer(cust.customer_id)} style={{ cursor: 'pointer' }}>
                <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{cust.customer_id}</td>
                <td>
                  <span className={`badge ${getSegmentBadgeClass(cust.segment)}`}>
                    {cust.segment}
                  </span>
                </td>
                <td>{formatCurrency(cust.current_monetary, currency)}</td>
                <td style={{ fontWeight: 700, color: 'var(--success)' }}>
                  {formatCurrency(cust.predicted_revenue, currency)}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '6px', background: 'var(--bg-primary)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${cust.confidence_pct}%`, height: '100%', background: 'var(--success)' }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      {cust.confidence_pct}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
