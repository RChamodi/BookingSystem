import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import '../common/NavBar.css'; 
import UserDropdown from '../UserDropdown';

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="nav-logo">BookingPro</Link>
      </div>

      <div className="navbar-right">
        <Link to="/booking" className="nav-link">Services</Link>

        {!user ? (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        ) : (
          <>
            
            <UserDropdown />
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
