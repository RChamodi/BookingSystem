
import React, { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../css/UserDropdown.css'; 

const UserDropdown = () => {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    logout(); // Call logout from AuthContext
    navigate('/login'); // Or your login route
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="user-dropdown" ref={dropdownRef}>
      <div className="avatar" onClick={handleToggle}>
        {user?.name?.charAt(0).toUpperCase() || 'U'}
      </div>

      {open && (
        <div className="dropdown-menu">
          <button onClick={() => navigate('/profile')}>Profile</button>
          <button onClick={() => navigate('/my-bookings')}>My Bookings</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
