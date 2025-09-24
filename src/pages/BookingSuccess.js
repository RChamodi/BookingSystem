import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import "../css/BookingSuccess.css"; 

const BookingSuccess = () => {
  const location = useLocation();
  const { service, slot } = location.state || {};

  if (!service || !slot) {
    return <p>Invalid booking data. Please try again.</p>;
  }

  return (
    <div className="booking-success container">
      <h2> Booking Confirmed!</h2>
      
      <div className="card booking-summary">
        <h3>{service.name}</h3>
        <p><strong>Type:</strong> {service.type}</p>
        <p><strong>Location:</strong> {service.location}</p>
        <p><strong>Date:</strong> {new Date(slot.startTime).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {new Date(slot.startTime).toLocaleTimeString()} - {new Date(slot.endTime).toLocaleTimeString()}</p>
      </div>

      <Link to="/my-bookings" className="btn primary" style={{ marginTop: "1rem" }}>
        Go to My Bookings
      </Link>
    </div>
  );
};

export default BookingSuccess;
