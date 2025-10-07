import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "../css/Booking.css";

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [calendarView, setCalendarView] = useState('week');
  const [calendarDate, setCalendarDate] = useState(new Date());




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
      } else {
        toast.error('Booking failed.');
      }
    } catch (err) {
      toast.error('Booking error.');
    }
  };

  if (!service) return <p>Loading service...</p>;

  // Filter out past slots
const now = new Date();
const futureSlots = slots.filter(slot => new Date(slot.startTime) >= now);

// Convert future slot data to events for calendar
const events = futureSlots.map(slot => ({
  id: slot.id,
  title: `${new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
  start: new Date(slot.startTime),
  end: new Date(slot.endTime),
}));


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

        {/* Right Column: Calendar + Actions */}
        <div className="booking-column">
          <h4>Select a Time Slot</h4>

          {slots.length === 0 ? (
            <p>No available slots.</p>
          ) : (
            <>
              <div style={{ maxHeight: '550px',width:'550px', overflowY: 'auto' }}>
  <Calendar
  localizer={localizer}
  events={events}
  startAccessor="start"
  endAccessor="end"
  style={{ height: 500}}
  selectable
  view={calendarView}
  onView={setCalendarView}
  date={calendarDate}
  onNavigate={(date) => setCalendarDate(date)}
  defaultView="week"
  views={['month', 'week', 'day']}
  min={new Date(new Date().setHours(0, 0, 0, 0))} // today at 00:00

  onSelectEvent={(event) => {
    const selected = slots.find(s => s.id === event.id);
    setSelectedSlot(selected);
  }}
/>


</div>

              {selectedSlot && (
                <p style={{ marginTop: '1rem' }}>
                  <strong>Selected Slot:</strong>{' '}
                  {new Date(selectedSlot.startTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              )}
            </>
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
