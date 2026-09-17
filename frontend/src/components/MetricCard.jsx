import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MetricCard({ title, value, change, isPositive = true, icon: Icon, subtitle }) {
  return (
    <div className="crios-card" style={{
      display: 'flex',
      flexDirection: 'column',
      justify: 'space-between',
      minHeight: '130px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {title}
        </span>
        {Icon && (
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '0.5rem',
            background: 'var(--accent-glow)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center'
          }}>
            <Icon size={18} color="var(--accent-primary)" />
          </div>
        )}
      </div>

      <div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
          {value}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
          {change && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.15rem 0.45rem',
              borderRadius: '0.4rem',
              background: isPositive ? 'var(--success-bg)' : 'var(--danger-bg)',
              color: isPositive ? 'var(--success)' : 'var(--danger)'
            }}>
              {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {change}
            </span>
          )}
          {subtitle && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              {subtitle}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
