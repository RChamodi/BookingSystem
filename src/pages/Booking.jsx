import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

const Booking = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [filters, setFilters] = useState({
    location: '',
    type: '',
  });

  const slotRef = useRef(null);     // For scrolling to slots
  const topRef = useRef(null);      // For scrolling back to top after booking

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/services', {
        credentials: 'include',
      });
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  const fetchSlots = async (serviceId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/user/slots/available/${serviceId}`, {
        credentials: 'include',
      });

      const contentType = response.headers.get('content-type');
      if (!response.ok) {
        const text = await response.text();
        console.error('Server error:', text);
        return;
      }

      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Invalid response (not JSON):', text);
        return;
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setAvailableSlots(data);
      } else {
        console.error('Expected an array of slots, got:', data);
        setAvailableSlots([]);
      }
    } catch (err) {
      console.error('Fetch failed:', err);
      setAvailableSlots([]);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleBookClick = async (service) => {
    setSelectedService(service);
    await fetchSlots(service.id);
    setSelectedSlot(null);

    // Scroll to slots container after render
    setTimeout(() => {
      if (slotRef.current) {
        slotRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const confirmBooking = async () => {
    if (!selectedSlot) return alert('Please select a time slot.');

    try {
      const response = await fetch(`http://localhost:8080/api/user/slots/book/${selectedSlot.id}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        toast.success(`Successfully booked ${selectedService.name} on ${new Date(selectedSlot.startTime).toLocaleString()}`);
        setSelectedService(null);
        setAvailableSlots([]);
        setSelectedSlot(null);

        // Scroll back to top (services list)
        if (topRef.current) {
          topRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        const errorText = await response.text();
        toast.error("Booking failed!");
      }
    } catch (err) {
      toast.error('Booking failed. Please try again.');
      console.error('Booking error:', err);
    }
  };

  const filteredServices = services.filter((s) => {
    const matchesLocation = filters.location
      ? s.location?.toLowerCase().includes(filters.location.toLowerCase())
      : true;
    const matchesType = filters.type ? s.type === filters.type : true;
    return matchesLocation && matchesType;
  });

  return (
    <div className="container" ref={topRef}>
      <h2>Book a Service</h2>

      {/* Filters */}
      <div className="filter-bar">
        <input
          type="text"
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
          placeholder="Location"
        />
        <select name="type" value={filters.type} onChange={handleFilterChange}>
          <option value="">All Types</option>
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
        </select>
      </div>

      {/* Services */}
      {filteredServices.length === 0 ? (
        <p>No matching services found.</p>
      ) : (
        filteredServices.map((service) => (
          <div key={service.id} className="card">
            <h3>{service.name}</h3>
            <p><strong>Type:</strong> {service.type}</p>
            <p><strong>Price:</strong> Rs {service.price}</p>
            <p><strong>Description:</strong> {service.description}</p>
            <p><strong>Location:</strong> {service.location}</p>
            <button
              onClick={() => handleBookClick(service)}
              disabled={service.availability === false}
            >
              {service.availability === false ? 'Unavailable' : 'Book Now'}
            </button>
          </div>
        ))
      )}

      {/* Slot Selection */}
      {selectedService && (
        <div
          ref={slotRef}
          className="card"
          style={{ marginTop: '2rem', backgroundColor: '#f0f8ff' }}
        >
          <h4>Select a time slot for: {selectedService.name}</h4>
          {availableSlots.length === 0 ? (
            <p>No available slots for this service.</p>
          ) : (
            <ul>
              {availableSlots.map((slot) => (
                <li key={slot.id} style={{ marginBottom: '0.5rem' }}>
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
          <button onClick={confirmBooking} disabled={!selectedSlot}>Confirm Booking</button>
          <button onClick={() => setSelectedService(null)} style={{ marginLeft: '1rem' }}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Booking;
