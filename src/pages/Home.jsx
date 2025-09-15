import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../css/Home.css';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-text">
          <h1>Welcome to BookingPro</h1>
          <p>
            Book appointments easily and quickly. Whether you're a guest or a registered user, we've got you covered!
          </p>

          <div className="button-group">
            {user ? (
              <>
                <h2>Hello, {user.name}</h2>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="btn primary">Admin Dashboard</Link>
                )}
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
    </div>
  );
};

export default Home;
