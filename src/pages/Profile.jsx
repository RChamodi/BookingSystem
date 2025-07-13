import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    contact: '',
    preferences: ''
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  // Fetch user profile and bookings
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
          contact: userData.contact || '',
          preferences: userData.preferences || '',
        });
      } catch (err) {
        console.error('Failed to load profile', err);
      }
    };

    const fetchBookings = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/bookings/my', {
          credentials: 'include',
        });
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error('Failed to load bookings', err);
      }
    };

    fetchProfile();
    fetchBookings();
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
        alert('Profile updated');
      } else {
        alert('Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile', err);
    }
  };

  // Cancel booking
  const handleCancelBooking = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/bookings/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        setBookings(bookings.filter((b) => b.id !== id));
      } else {
        alert('Failed to cancel booking');
      }
    } catch (err) {
      console.error('Cancel booking error', err);
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
    <div className="container">
      <h2 style={{ textAlign: 'center' }}>My Profile</h2>

      {/* Profile Management */}
      <form onSubmit={handleProfileSubmit} className="form-box" style={{ marginBottom: '2rem' }}>
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
          name="contact"
          value={profile.contact}
          onChange={handleProfileChange}
          placeholder="Contact Number"
        />
        <textarea
          name="preferences"
          value={profile.preferences}
          onChange={handleProfileChange}
          placeholder="Preferences (e.g., preferred stylist, time, etc.)"
        />
        <button type="submit">Update Profile</button>
      </form>

      {/* Change Password Section */}
      <div className="form-box" style={{ marginBottom: '2rem' }}>
        <h3>Change Password</h3>
        <form onSubmit={handlePasswordChange}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit">Change Password</button>
          {passwordMessage && <p>{passwordMessage}</p>}
        </form>
      </div>

      {/* Booking History */}
      <div className="card">
        <h3>Booking History</h3>
        {bookings.length === 0 ? (
  <p>No bookings yet.</p>
) : (
  bookings.map((booking) => (
    <div
      key={booking.id}
      style={{
        marginBottom: '1rem',
        borderBottom: '1px solid #eee',
        paddingBottom: '1rem',
      }}
    >
      <p><strong>Service:</strong> {booking.serviceName}</p>
<p><strong>Date:</strong> {new Date(booking.dateTime).toLocaleDateString()}</p>
<p><strong>Time:</strong> {new Date(booking.dateTime).toLocaleTimeString()}</p>
<p><strong>Location:</strong> {booking.location}</p>
<p><strong>Status:</strong> {booking.cancelled ? 'Cancelled' : 'Active'}</p>

      {!booking.cancelled && (
        <button onClick={() => handleCancelBooking(booking.id)}>Cancel Booking</button>
      )}
    </div>
  ))
)}

      </div>
    </div>
  );
};

export default Profile;
