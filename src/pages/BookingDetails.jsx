import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../css/Booking.css";

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    fetchService();
    fetchSlots();
  }, [id]);

  const fetchService = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/services/${id}`, { credentials: 'include' });
      const data = await res.json();
      setService(data);
    } catch (err) {
      toast.error('Failed to fetch service.');
    }
  };

  const fetchSlots = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/user/slots/available/${id}`, { credentials: 'include' });
      const data = await res.json();
      setSlots(data);
    } catch (err) {
      toast.error('Failed to fetch slots.');
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot) {
      toast.warn("Please select a time slot");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/user/slots/book/${selectedSlot.id}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
  toast.success(`Successfully booked ${service.name}`);
  navigate('/booking-success', {
    state: {
      service,
      slot: selectedSlot,
    }
  });
}
 else {
        toast.error('Booking failed.');
      }
    } catch (err) {
      toast.error('Booking error.');
    }
  };

  if (!service) return <p>Loading service...</p>;

  return (
  <div className="booking-details container">
    <h2>{service.name}</h2>

    <div className="booking-details-columns">
      {/* Left Column: Service Info */}
      <div className="booking-column">
        <p><strong>Type:</strong> {service.type}</p>
        <p><strong>Price:</strong> Rs{service.price}</p>
        <p><strong>Location:</strong> {service.location}</p>
        <p><strong>Description:</strong> {service.description}</p>
      </div>

      {/* Right Column: Slots + Button */}
      <div className="booking-column">
        <h4>Available Time Slots</h4>
        {slots.length === 0 ? (
          <p>No available slots.</p>
        ) : (
          <ul className="slot-list">
            {slots.map((slot) => (
              <li key={slot.id}>
                <label>
                  <input
                    type="radio"
                    name="slot"
                    value={slot.id}
                    onChange={() => setSelectedSlot(slot)}
                  />
                  {' '}
                  {new Date(slot.startTime).toLocaleString()} - {new Date(slot.endTime).toLocaleTimeString()}
                </label>
              </li>
            ))}
          </ul>
        )}

        <div className="booking-actions">
          <button onClick={handleConfirmBooking} className="btn primary" disabled={!selectedSlot}>
            Confirm Booking
          </button>
          <button onClick={() => navigate(-1)} className="btn cancel">
            Go Back
          </button>
        </div>
      </div>
    </div>
  </div>
);

};

export default BookingDetails;
