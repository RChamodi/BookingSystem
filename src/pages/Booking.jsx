import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../css/Booking.css';

const Booking = () => {
  const [services, setServices] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    date: '',
    time: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchServicesAndSlots = async () => {
      try {
        const serviceRes = await fetch('http://localhost:8080/api/services', {
          credentials: 'include',
        });
        const serviceData = await serviceRes.json();

        const servicesWithSlots = await Promise.all(
          serviceData.map(async (service) => {
            const slotRes = await fetch(
              `http://localhost:8080/api/user/slots/available/${service.id}`,
              { credentials: 'include' }
            );
            const slots = await slotRes.json();
            return { ...service, slots };
          })
        );

        setServices(servicesWithSlots);
      } catch (error) {
        console.error('Failed to fetch services or slots:', error);
        toast.error('Failed to load services.');
      }
    };

    fetchServicesAndSlots();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleClearFilters = () => {
  setFilters({
    location: '',
    type: '',
    date: '',
    time: '',
  });
};


  const handleBookNow = (serviceId) => {
    navigate(`/booking/${serviceId}`);
  };

  const filteredServices = services.filter((service) => {
    const matchesLocation = filters.location
      ? service.location?.toLowerCase().includes(filters.location.toLowerCase())
      : true;

    const matchesType = filters.type ? service.type === filters.type : true;

    const matchesDate = filters.date
      ? service.slots?.some((slot) =>
          new Date(slot.startTime).toISOString().startsWith(filters.date)
        )
      : true;

    const matchesTime = filters.time
      ? service.slots?.some((slot) => {
          const slotTime = new Date(slot.startTime).toTimeString().slice(0, 5);
          return slotTime === filters.time;
        })
      : true;

    return matchesLocation && matchesType && matchesDate && matchesTime;
  });

  return (
    <div className="booking-container">
      <div className="booking-content ">
        <h2 className="page-title">Book a Service</h2>

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
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
          />
          <input
            type="time"
            name="time"
            value={filters.time}
            onChange={handleFilterChange}
          />
          <button onClick={handleClearFilters} className="btn clear-btn">
    Clear Filters
  </button>
        </div>

        {/* Services */}
        <div className="services-grid">
        {filteredServices.length === 0 ? (
          <p>No matching services found.</p>
        ) : (
          filteredServices.map((service) => (
            <div key={service.id} className="card service-card youtube-style-card">
  {/* Image at the top */}
  <div className="booking-img-wrapper">
    <div className="booking-img-placeholder">
      <span className="service-name">{service.name}</span>
    </div>
  </div>

  {/* Details */}
  <div className="service-details">
    <h3 className="service-title">{service.name}</h3>
    <p className="service-description">{service.description}</p>

    <div className="card-footer">
      <div className="price">Rs{service.price}</div>
      <button
        onClick={() => handleBookNow(service.id)}
        disabled={service.availability === false}
        className="btn book-btn"
      >
        {service.availability === false ? 'Unavailable' : 'Book Now'}
      </button>
    </div>
  </div>
</div>

          ))
        )}
        </div>
      </div>
    </div>
  );
};

export default Booking;
