import React, { useEffect, useState } from 'react';
import { Target, Zap, Users, ArrowUpRight, CheckCircle2, Send } from 'lucide-react';
import { formatCurrency, getSegmentBadgeClass } from '../utils/formatters';
import { apiService } from '../api/apiService';

export default function CustomerSegmentation({ currency }) {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaignSegment, setSelectedCampaignSegment] = useState(null);
  const [campaignName, setCampaignName] = useState('');
  const [discountPct, setDiscountPct] = useState(15);
  const [campaignResult, setCampaignResult] = useState(null);

  useEffect(() => {
    apiService.getSegmentationOverview()
      .then(data => {
        setSegments(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleLaunchCampaign = (e) => {
    e.preventDefault();
    if (!selectedCampaignSegment) return;

    apiService.triggerCampaign(selectedCampaignSegment.name, campaignName, discountPct)
      .then(res => {
        setCampaignResult(res);
      })
      .catch(err => console.error(err));
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading RFM Customer Segmentation...</div>;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Overview Banner */}
      <div className="crios-card" style={{ background: 'var(--accent-gradient)', color: '#ffffff' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.4rem' }}>
          Customer Segmentation & Strategic Action Terminal
        </h2>
        <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>
          CRIOS transforms static RFM groupings into an automated, proactive customer optimization system.
        </p>
      </div>

      {/* Segment Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
        {segments.map((seg, idx) => (
          <div key={idx} className="crios-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <span className={`badge ${getSegmentBadgeClass(seg.name)}`}>
                  {seg.name}
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {seg.percentage}%
                </span>
              </div>

              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
                {formatCurrency(seg.total_revenue, currency)}
              </div>

              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                <span>{seg.count} Customers</span>
                <span>Avg Recency: {seg.avg_recency_days}d</span>
                <span>Avg Freq: {seg.avg_frequency}x</span>
              </div>

              <div style={{ background: 'var(--bg-primary)', padding: '0.75rem', borderRadius: '0.6rem', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                  <Target size={13} /> Strategic Action
                </span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {seg.recommended_action}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedCampaignSegment(seg);
                setCampaignName(`${seg.name} Re-Engagement Campaign`);
                setCampaignResult(null);
              }}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}
            >
              <Zap size={15} /> Launch Campaign Trigger
            </button>
          </div>
        ))}
      </div>

      {/* Campaign Launch Modal */}
      {selectedCampaignSegment && (
        <div className="modal-overlay">
          <div className="crios-card animate-fade-in" style={{ width: '450px', background: 'var(--bg-secondary)', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              Launch Retention Campaign: {selectedCampaignSegment.name}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Targeting {selectedCampaignSegment.count} customers with ₹{selectedCampaignSegment.total_revenue.toLocaleString()} historical revenue exposure.
            </p>

            {campaignResult ? (
              <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success)', padding: '1rem', borderRadius: '0.6rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <CheckCircle2 size={32} color="var(--success)" style={{ margin: '0 auto' }} />
                <h4 style={{ fontWeight: 700, color: 'var(--success)' }}>Campaign Active</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{campaignResult.message}</p>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Est. Revenue Impact: {formatCurrency(campaignResult.estimated_revenue_impact, currency)}
                </div>
                <button onClick={() => setSelectedCampaignSegment(null)} className="btn-secondary" style={{ marginTop: '0.75rem', justifyContent: 'center' }}>
                  Close Modal
                </button>
              </div>
            ) : (
              <form onSubmit={handleLaunchCampaign} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '0.5rem',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    Target Offer Discount (%)
                  </label>
                  <input
                    type="number"
                    value={discountPct}
                    onChange={(e) => setDiscountPct(e.target.value)}
                    min="5"
                    max="50"
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '0.5rem',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button type="button" onClick={() => setSelectedCampaignSegment(null)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                    <Send size={15} /> Execute Launch
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
