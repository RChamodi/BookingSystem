import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const mockBookings = [
  { id: 1, service: 'Haircut', date: '2025-06-25', time: '10:00 AM' },
  { id: 2, service: 'Massage', date: '2025-06-28', time: '1:30 PM' },
];

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState({
    name: user.name || '',
    email: user.email || '',
    contact: '',
    preferences: ''
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    // Replace with API call to get user bookings
    setBookings(mockBookings);
  }, []);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // Replace with API call to update profile
    console.log('Profile updated:', profile);
  };

  const handleCancelBooking = (id) => {
    // Replace with API call to delete/cancel booking
    setBookings(bookings.filter(b => b.id !== id));
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // Replace this with secure validation logic
    const storedPassword = localStorage.getItem('userPassword'); // demo only

    if (currentPassword !== storedPassword) {
      setPasswordMessage('Current password is incorrect.');
      return;
    }

    localStorage.setItem('userPassword', newPassword); 
    setPasswordMessage('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
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
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
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
            <div key={booking.id} style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
              <p><strong>Service:</strong> {booking.service}</p>
              <p><strong>Date:</strong> {booking.date}</p>
              <p><strong>Time:</strong> {booking.time}</p>
              <button onClick={() => handleCancelBooking(booking.id)}>Cancel Booking</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
