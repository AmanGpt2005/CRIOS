import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CustomerDrawer from './components/CustomerDrawer';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CustomerIntelligence from './pages/CustomerIntelligence';
import CustomerSegmentation from './pages/CustomerSegmentation';
import RevenuePrediction from './pages/RevenuePrediction';
import ProductIntelligence from './pages/ProductIntelligence';
import BusinessReports from './pages/BusinessReports';
import DataManagement from './pages/DataManagement';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default to logged-in demo state
  const [user, setUser] = useState({
    name: 'Executive Admin',
    email: 'admin@crios.io',
    role: 'Chief Revenue Officer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('dark');
  const [currency, setCurrency] = useState('INR');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard currency={currency} onSelectCustomer={setSelectedCustomerId} />;
      case 'customers':
        return <CustomerIntelligence currency={currency} onSelectCustomer={setSelectedCustomerId} />;
      case 'segmentation':
        return <CustomerSegmentation currency={currency} />;
      case 'predictions':
        return <RevenuePrediction currency={currency} onSelectCustomer={setSelectedCustomerId} />;
      case 'products':
        return <ProductIntelligence currency={currency} />;
      case 'reports':
        return <BusinessReports currency={currency} />;
      case 'upload':
        return <DataManagement />;
      default:
        return <Dashboard currency={currency} onSelectCustomer={setSelectedCustomerId} />;
    }
  };

  return (
    <div className="app-shell" data-theme={theme}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
      />

      <div className="main-content">
        <Header
          activeTab={activeTab}
          user={user}
          currency={currency}
          setCurrency={setCurrency}
          alerts={[
            { type: 'warning', title: 'At-Risk Exposure', message: '42 accounts require re-engagement.' },
            { type: 'success', title: 'Champion Segment', message: '+6.2% growth over prior month.' }
          ]}
        />

        <main className="page-viewport">
          {renderActivePage()}
        </main>
      </div>

      {/* Customer Profile Side Drawer */}
      <CustomerDrawer
        customerId={selectedCustomerId}
        onClose={() => setSelectedCustomerId(null)}
        currency={currency}
      />
    </div>
  );
}
