import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="centered-page" style={{ padding: '2rem' }}>
      <h1>Welcome to the Booking Platform</h1>
      <p>
        Book appointments easily. Whether you're a guest or registered user, we've got you covered!
      </p>
      <img
        src="/images/Booking_Home.jpg"
        alt="Welcome"
        style={{ maxWidth: '1000px', marginBottom: '1rem' }}
      />

      {user ? (
        <>
          <h2>Hello, {user.name} </h2>
          {user.role === 'Admin' && (
            <Link to="/admin">
              <button>Go to Admin Dashboard</button>
            </Link>
          )}
          {user.role === 'RegisteredUser' && (
            <>
              <Link to="/booking">
                <button>Book a Service</button>
              </Link>
              <Link to="/profile">
                <button>My Profile</button>
              </Link>
            </>
          )}
        </>
      ) : (
        <>
          <Link to="/login">
            <button>Login</button>
          </Link>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </>
      )}
    </div>
  );
};

export default Home;
