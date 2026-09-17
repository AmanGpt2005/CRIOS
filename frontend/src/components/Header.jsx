import React, { useState } from 'react';
import { Search, Bell, User, DollarSign, IndianRupee, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Header({ activeTab, user, currency, setCurrency, alerts = [] }) {
  const [showNotifications, setShowNotifications] = useState(false);

  const pageTitles = {
    dashboard: 'Executive Revenue Dashboard',
    customers: 'Customer Intelligence & Directory',
    segmentation: 'RFM Customer Segmentation',
    predictions: 'ML Revenue Predictions',
    products: 'Product Performance & Intelligence',
    reports: 'Executive Business Reports',
    upload: 'Data Ingestion & Management'
  };

  return (
    <header style={{
      height: '70px',
      backgroundColor: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justify: 'space-between',
      padding: '0 2rem',
      zIndex: 10
    }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
          {pageTitles[activeTab] || 'CRIOS Platform'}
        </h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Real-time Customer Revenue Analytics & AI Optimization
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Currency Switcher */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: '0.6rem',
          padding: '2px'
        }}>
          <button
            onClick={() => setCurrency('INR')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '0.35rem 0.65rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: currency === 'INR' ? 'var(--accent-primary)' : 'transparent',
              color: currency === 'INR' ? '#fff' : 'var(--text-muted)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <IndianRupee size={13} /> INR (₹)
          </button>
          <button
            onClick={() => setCurrency('USD')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '0.35rem 0.65rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: currency === 'USD' ? 'var(--accent-primary)' : 'transparent',
              color: currency === 'USD' ? '#fff' : 'var(--text-muted)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <DollarSign size={13} /> USD ($)
          </button>
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              position: 'relative',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              width: '40px',
              height: '40px',
              borderRadius: '0.6rem',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              cursor: 'pointer'
            }}
          >
            <Bell size={18} />
            {alerts.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: 'var(--danger)',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justify: 'center'
              }}>
                {alerts.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '50px',
              right: '0',
              width: '320px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '0.8rem',
              boxShadow: 'var(--shadow-lg)',
              padding: '1rem',
              zIndex: 50
            }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                System Alerts & AI Insights
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {alerts.map((alert, idx) => (
                  <div key={idx} style={{
                    padding: '0.65rem',
                    borderRadius: '0.5rem',
                    background: alert.type === 'warning' ? 'var(--warning-bg)' : 'var(--success-bg)',
                    border: `1px solid ${alert.type === 'warning' ? 'var(--warning)' : 'var(--success)'}`,
                    display: 'flex',
                    gap: '0.5rem'
                  }}>
                    {alert.type === 'warning' ? (
                      <AlertTriangle size={16} color="var(--warning)" style={{ shrink: 0, marginTop: '2px' }} />
                    ) : (
                      <CheckCircle size={16} color="var(--success)" style={{ shrink: 0, marginTop: '2px' }} />
                    )}
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {alert.title}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {alert.message}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          paddingLeft: '0.75rem',
          borderLeft: '1px solid var(--border-color)'
        }}>
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
            alt="User Avatar"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--accent-primary)'
            }}
          />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {user?.name || 'Admin User'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
              {user?.role || 'Chief Revenue Officer'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
