import React, { useState } from 'react';
import ServiceManager from './ServiceManager';
import BookingManager from './BookingManager';
import UserManager from './UserManager';
import AvailabilityManager from './AvailabilityManager';
import DashboardOverview from './DashboardOverview';

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
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: '220px', background: '#2c3e50', color: '#fff', padding: '1rem' }}>
        <h3>Admin Panel</h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button onClick={() => setActiveTab('dashboard')}>📊 Dashboard</button>
          <button onClick={() => setActiveTab('services')}>🛠 Services</button>
          <button onClick={() => setActiveTab('availability')}>📅 Availability</button>
          <button onClick={() => setActiveTab('bookings')}>📥 Bookings</button>
          <button onClick={() => setActiveTab('users')}>👤 Users</button>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '2rem', background: '#ecf0f1' }}>
        <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
        <div style={{ marginTop: '1rem' }}>{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
