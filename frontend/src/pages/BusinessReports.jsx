import React, { useEffect, useState } from 'react';
import { FileText, Download, CheckCircle2, AlertTriangle, ArrowRight, Printer } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { apiService } from '../api/apiService';

export default function BusinessReports({ currency }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getMonthlyReport()
      .then(data => {
        setReport(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleExportCSV = () => {
    window.open('/api/reports/export/csv', '_blank');
  };

  const handlePrintPDF = () => {
    window.print();
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Generating Business Executive Report...</div>;
  if (!report) return null;

  const { metrics, key_insights, recommended_actions } = report;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Export Header Controls */}
      <div className="crios-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Board Ready Executive Summary
          </span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
            {report.title} — {report.period}
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleExportCSV} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
            <Download size={16} /> Export Raw CSV
          </button>
          <button onClick={handlePrintPDF} className="btn-primary" style={{ fontSize: '0.85rem' }}>
            <Printer size={16} /> Print / Export PDF
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="crios-card" style={{ background: 'var(--bg-secondary)', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Document Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--border-color)', paddingBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-primary)', letterSpacing: '-0.5px' }}>
              CRIOS
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Customer Revenue Intelligence & Optimization System</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>Monthly Performance Report</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Generated: September 2026</div>
          </div>
        </div>

        {/* High Level Key Indicators Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: '0.8rem', border: '1px solid var(--border-color)' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Monthly Revenue</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
              {formatCurrency(metrics.total_revenue, currency)}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MoM Growth</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)', marginTop: '2px' }}>
              {metrics.revenue_growth}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active Segmented Accounts</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
              {metrics.total_customers}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>At-Risk Accounts</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--warning)', marginTop: '2px' }}>
              {metrics.at_risk_customers} Accounts
            </div>
          </div>
        </div>

        {/* Narrative Executive Takeaways */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Executive Narrative Insights
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {key_insights.map((insight, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                <CheckCircle2 size={16} color="var(--success)" style={{ marginTop: '3px', shrink: 0 }} />
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Strategic Roadmap */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Prioritized Recommended Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recommended_actions.map((act) => (
              <div key={act.id} style={{ display: 'flex', gap: '1rem', background: 'var(--bg-primary)', padding: '1rem', borderRadius: '0.6rem', border: '1px solid var(--border-color)' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-glow)', color: 'var(--accent-primary)', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyCenter: 'center', shrink: 0 }}>
                  {act.id}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{act.action}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{act.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
