import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  PieChart, 
  TrendingUp, 
  Package, 
  FileText, 
  Database, 
  Sun, 
  Moon, 
  LogOut,
  Zap
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, theme, toggleTheme, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'segmentation', label: 'Segmentation', icon: PieChart },
    { id: 'predictions', label: 'Predictions', icon: TrendingUp },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'upload', label: 'Data Management', icon: Database },
  ];

  return (
    <aside style={{
      width: '260px',
      height: '100vh',
      backgroundColor: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      justify: 'space-between',
      padding: '1.25rem 1rem',
      userSelect: 'none',
      zIndex: 20
    }}>
      <div>
        {/* Brand Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.5rem 0.75rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '0.6rem',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Zap size={22} color="#ffffff" />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.2rem',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              color: 'var(--text-main)',
              lineHeight: 1.1
            }}>CRIOS</h1>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Revenue Intelligence</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.6rem',
                  border: 'none',
                  background: isActive ? 'var(--accent-glow)' : 'transparent',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent'
                }}
              >
                <Icon size={19} color={isActive ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button
          onClick={toggleTheme}
          style={{
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            padding: '0.65rem 0.85rem',
            borderRadius: '0.6rem',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-primary)',
            color: 'var(--text-main)',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Toggle</span>
        </button>

        <button
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.65rem 0.85rem',
            borderRadius: '0.6rem',
            border: 'none',
            background: 'transparent',
            color: 'var(--danger)',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
