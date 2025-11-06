import React, { useState } from 'react';
import ServiceManager from './ServiceManager';
import BookingManager from './BookingManager';
import UserManager from './UserManager';
import AvailabilityManager from './AvailabilityManager';
import PaymentManager from './PaymentManager';
import DashboardOverview from './DashboardOverview';
import "../../css/AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview/>;
      case 'services':
        return <ServiceManager />;
      case 'availability':
        return <AvailabilityManager/>;
      case 'bookings':
        return <BookingManager/>;
      case 'users':
        return <UserManager/>;
      case 'payments':
        return <PaymentManager/>;
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <h3 className="sidebar-title">Admin Panel</h3>
        <nav className="sidebar-nav">
          {['dashboard', 'services', 'availability', 'bookings', 'users','payments'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? 'nav-button active' : 'nav-button'}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </aside>

      <main className="admin-content">
        <h2 className="admin-title">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
        <div className="admin-section">{renderContent()}</div>
      </main>
    </div>
  );
};

export default AdminDashboard;
