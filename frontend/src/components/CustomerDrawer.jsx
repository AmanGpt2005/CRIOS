import React, { useEffect, useState } from 'react';
import { X, ShoppingBag, Calendar, DollarSign, Award, ArrowUpRight, Zap, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency, getSegmentBadgeClass } from '../utils/formatters';
import { apiService } from '../api/apiService';

export default function CustomerDrawer({ customerId, onClose, currency }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customerId) return;
    setLoading(true);
    apiService.getCustomerProfile(customerId)
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [customerId]);

  if (!customerId) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
      zIndex: 100,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div className="animate-fade-in" style={{
        width: '520px',
        height: '100vh',
        background: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border-color)',
        padding: '2rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Drawer Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Customer Profile Ledger
            </span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
              {customerId}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading customer analytical intelligence...
          </div>
        ) : profile ? (
          <>
            {/* Segment Badge & Spend Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className={`badge ${getSegmentBadgeClass(profile.segment)}`}>
                {profile.segment}
              </span>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total Gross Spend</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                  {formatCurrency(profile.monetary, currency)}
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.85rem'
            }}>
              <div className="crios-card" style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Invoices</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '2px' }}>{profile.frequency} Orders</div>
              </div>
              <div className="crios-card" style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Last Order</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '2px' }}>{profile.recency} Days Ago</div>
              </div>
              <div className="crios-card" style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Average Order Value</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '2px' }}>{formatCurrency(profile.aov, currency)}</div>
              </div>
              <div className="crios-card" style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Predicted 90d Revenue</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--success)', marginTop: '2px' }}>
                  {formatCurrency(profile.predicted_revenue, currency)}
                </div>
              </div>
            </div>

            {/* RFM Score Card */}
            <div className="crios-card" style={{ background: 'var(--accent-glow)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={16} /> RFM Score Breakdown
              </h4>
              <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Recency (R)</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>{profile.rfm_score.r} <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>/ 5</span></div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Frequency (F)</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>{profile.rfm_score.f} <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>/ 5</span></div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Monetary (M)</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>{profile.rfm_score.m} <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>/ 5</span></div>
                </div>
              </div>
            </div>

            {/* Purchase History Chart */}
            <div className="crios-card">
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
                Purchase History Trajectory
              </h4>
              <div style={{ width: '100%', height: '160px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={profile.purchase_history}>
                    <defs>
                      <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="var(--text-dim)" fontSize={10} />
                    <YAxis stroke="var(--text-dim)" fontSize={10} />
                    <Tooltip
                      contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}
                      formatter={(val) => [formatCurrency(val, currency), 'Spend']}
                    />
                    <Area type="monotone" dataKey="spend" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#spendGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Product Preferences */}
            <div className="crios-card">
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                Top Purchased Items
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {profile.product_preferences.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.4rem 0', borderBottom: '1px solid var(--border-color)' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.product}</span>
                    <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{formatCurrency(item.spend, currency)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Action */}
            <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '0.8rem', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)', fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                <Target size={15} /> Recommended Strategy
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {profile.recommended_action}
              </p>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
