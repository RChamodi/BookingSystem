import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../css/Home.css';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/services');
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error('Failed to fetch services:', err);
    }
  };

  const filteredServices = services.filter(service => {
    if (activeTab === 'All') return true;
    return service.type === activeTab;
  });

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-text">
          <h1>Welcome to BookingPro</h1>
          <p>Book appointments easily and quickly.</p>
          <div className="button-group">
            {user ? (
              <>
                <h2>Hello, {user.name}</h2>
                {user.role === 'ADMIN' && <Link to="/admin" className="btn primary">Admin Dashboard</Link>}
                {user.role === 'USER' && (
                  <>
                    <Link to="/booking" className="btn primary">Book a Service</Link>
                    <Link to="/profile" className="btn secondary">My Profile</Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="btn primary">Login</Link>
                <Link to="/register" className="btn secondary">Register</Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-image">
          <img src="/images/Booking_Home.jpg" alt="Booking" />
        </div>
      </div>

      {/* Tabs Section */}
      <div className="tabs-container">
        <div className="tabs">
          {['All', 'Online', 'Offline'].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="service-grid">
          {filteredServices.length > 0 ? (
            filteredServices.map(service => (
              <div className="card service-card youtube-style-card" key={service.id}>
                <div className="booking-img-wrapper">
                  <div className="booking-img-placeholder">
                    <span className="service-name">{service.name}</span>
                  </div>
                </div>
                <div className="service-details">
    <h3 className="service-title">{service.name}</h3>
    <p className="service-description">{service.description}</p>

                  <div className="card-footer">
      <div className="price">Rs{service.price}</div>

                    <Link to={`/booking/${service.id}`} className="btn primary">Book Now</Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>No services found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
