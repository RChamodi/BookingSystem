import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import '../css/Profile.css';

const Profile = () => {
  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    contactInfo: '',
    preferences: ''
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/auth/me', {
          credentials: 'include',
        });
        const userData = await res.json();
        setProfile({
          name: userData.name || '',
          email: userData.email || '',
          contactInfo: userData.contactInfo || '',
          preferences: userData.preferences || '',
        });
      } catch (err) {
        console.error('Failed to load profile', err);
      }
    };

    fetchProfile();
  }, []);

  // Update profile
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        toast.success('Profile updated');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile', err);
    }
  };

  // Change password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/auth/me/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'text/plain',
        },
        credentials: 'include',
        body: newPassword,
      });

      if (res.ok) {
        setPasswordMessage('Password changed successfully!');
      } else {
        setPasswordMessage('Failed to change password.');
      }
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      console.error('Password change error', err);
      setPasswordMessage('Error changing password');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-content container">
        <h2 className="page-title">My Profile</h2>

        {/* Profile Form */}
        <form onSubmit={handleProfileSubmit} className="form-box">
          <h3>Manage Profile</h3>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleProfileChange}
            placeholder="Full Name"
          />
          <input
            type="text"
            name="contactInfo"
            value={profile.contactInfo}
            onChange={handleProfileChange}
            placeholder="Contact Number"
          />
          <textarea
            name="preferences"
            value={profile.preferences}
            onChange={handleProfileChange}
            placeholder="Preferences (e.g., stylist, time, etc.)"
          />
          <button type="submit" className="btn primary">
            Update Profile
          </button>
        </form>

        {/* Change Password */}
        <form onSubmit={handlePasswordChange} className="form-box">
          <h3>Change Password</h3>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn">Change Password</button>
          {passwordMessage && <p className="status-msg">{passwordMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default Profile;
