import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import '../css/Profile.css'; 

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/bookings/my', {
          credentials: 'include',
        });

        const contentType = res.headers.get('content-type');
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Error response:', errorText);
          toast.error('Failed to load bookings: ' + res.status);
          return;
        }

        if (!contentType || !contentType.includes('application/json')) {
          const raw = await res.text();
          console.error('Unexpected response (not JSON):', raw);
          toast.error('Invalid server response');
          return;
        }

        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error('Failed to load bookings', err);
        toast.error('Error loading bookings');
      }
    };

    fetchBookings();
  }, [user]);

  const handleCancelBooking = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/bookings/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        setBookings(bookings.filter((b) => b.id !== id));
        toast.success('Booking cancelled successfully');
      } else {
        toast.error('Failed to cancel booking');
      }
    } catch (err) {
      console.error('Cancel booking error', err);
      toast.error('Error cancelling booking');
    }
  };
  const handlePayNow = async (bookingId) => {
  try {
    const res = await fetch('http://localhost:8080/api/payments/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ bookingId })
    });

    if (res.ok) {
      const { url } = await res.json();
      window.location.href = url; // redirect to Stripe Checkout
    } else {
      alert('Failed to initiate payment');
    }
  } catch (err) {
    console.error('Payment initiation error', err);
  }
};

  return (
    <div className="profile-container">
      <div className="profile-content container">
        <h2 className="page-title">My Bookings</h2>

        <div className="card">
          {bookings.length === 0 ? (
            <p>No bookings yet.</p>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="booking-item">
                <div className="booking-img-wrapper">
                 <div className="booking-img-placeholder">
                  <span className="service-name">{booking.serviceName}</span>
                </div>
               </div>

                <div className="booking-info">
                <h3 className="booking-title">{booking.serviceName}</h3>
                <p><strong>Date:</strong> {new Date(booking.dateTime).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {new Date(booking.dateTime).toLocaleTimeString()}</p>
                <p><strong>Location:</strong> {booking.location}</p>
                <p><strong>Status:</strong> {booking.cancelled ? 'Cancelled' : 'Active'}</p>
                {!booking.cancelled && !booking.paid && (
      <div>
        <button className="btn cancel" onClick={() => handleCancelBooking(booking.id)}>Cancel Booking</button>
        <button className="btn" onClick={() => handlePayNow(booking.id)}>Pay Now</button>
      </div>
    )}
              </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
