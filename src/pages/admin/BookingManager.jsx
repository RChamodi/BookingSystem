import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/BookingManager.css';

const BookingManager = () => {
  const [bookings, setBookings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ date: '', time: '' });

  useEffect(() => {
    axios.get('http://localhost:8080/api/admin/bookings', {
      withCredentials: true,
    })
    .then(res => {
      if (!Array.isArray(res.data)) {
        console.error('Unexpected response format:', res.data);
        return;
      }

      const transformed = res.data.map(b => {
        const [date, time] = b.dateTime.split('T');
        return {
          id: b.id,
          user: b.user,
          service: b.service,
          date,
          time: time?.substring(0, 5),
          status: b.cancelled
            ? 'Cancelled'
            : b.approved
            ? 'Confirmed'
            : 'Pending',
        };
      });

      setBookings(transformed);
    })
    .catch(err => console.error('Error fetching bookings:', err));
  }, []);

  const handleStatusChange = (id) => {
    axios.post(`http://localhost:8080/api/admin/bookings/${id}/approve`, {}, {
      withCredentials: true,
    })
    .then(() => {
      setBookings(prev =>
        prev.map(b =>
          b.id === id ? { ...b, status: 'Confirmed' } : b
        )
      );
    })
    .catch(err => console.error(err));
  };

  const handleCancel = (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      axios.delete(`http://localhost:8080/api/admin/bookings/${id}`, {
        withCredentials: true,
      })
      .then(() => {
        setBookings(prev => prev.filter(b => b.id !== id));
      })
      .catch(err => console.error(err));
    }
  };

  const handleModifyClick = (booking) => {
    setEditingId(booking.id);
    setEditForm({ date: booking.date, time: booking.time });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = (id) => {
    const updatedDateTime = `${editForm.date}T${editForm.time}`;

    axios.put(`http://localhost:8080/api/admin/bookings/${id}`, {
      dateTime: updatedDateTime,
      location: '', 
    }, {
      withCredentials: true,
    })
    .then(() => {
      setBookings(prev =>
        prev.map(b =>
          b.id === id
            ? { ...b, date: editForm.date, time: editForm.time, status: 'Modified' }
            : b
        )
      );
      setEditingId(null);
    })
    .catch(err => console.error(err));
  };

  return (
   <div className="booking-manager">
      <h3 className="admin-title">Manage Bookings</h3>
      {bookings.length === 0 ? (
        <p>No bookings to display.</p>
      ) : (
        bookings.map((b) => (
          <div key={b.id} className="booking-card">
            <div className="booking-info">
              <p><strong>User:</strong> {b.user}</p>
              <p><strong>Service:</strong> {b.service}</p>
              <p><strong>Date:</strong> {b.date}</p>
              <p><strong>Time:</strong> {b.time}</p>
              <p><strong>Status:</strong> <span className={`status ${b.status.toLowerCase()}`}>{b.status}</span></p>
            </div>

            {editingId === b.id ? (
              <div className="edit-form">
                <input type="date" name="date" value={editForm.date} onChange={handleEditChange} />
                <input type="time" name="time" value={editForm.time} onChange={handleEditChange} />
                <div className="action-buttons">
                  <button className="btn primary" onClick={() => handleEditSubmit(b.id)}>Save</button>
                  <button className="btn" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="action-buttons">
                {b.status !== 'Confirmed' && (
                  <button className="btn primary" onClick={() => handleStatusChange(b.id)}>Approve</button>
                )}
                <button className="btn" onClick={() => handleModifyClick(b)}>Modify</button>
                <button className="btn danger" onClick={() => handleCancel(b.id)}>Cancel</button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default BookingManager;
