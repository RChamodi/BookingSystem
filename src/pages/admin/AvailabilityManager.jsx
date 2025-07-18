import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';

const localizer = momentLocalizer(moment);
const API_BASE = 'http://localhost:8080/api/admin';

const AvailabilityManager = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('week');


  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedService) fetchSlots(selectedService);
  }, [selectedService]);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_BASE}/services`, { withCredentials: true });
      setServices(response.data);
    } catch (err) {
      console.error('Error fetching services', err);
    }
  };

  const fetchSlots = async (serviceId) => {
    try {
      const response = await axios.get(`${API_BASE}/slots/service/${serviceId}`, { withCredentials: true });
      const slots = response.data.map(slot => ({
        id: slot.id,
        title: 'Available',
        start: new Date(slot.startTime),
        end: new Date(slot.endTime),
      }));
      setEvents(slots);
    } catch (err) {
      console.error('Error fetching slots', err);
    }
  };

  const handleSelectSlot = async ({ start, end }) => {
  if (!selectedService) {
    alert('Please select a service first.');
    return;
  }

  // Format start and end for display in prompt
  const startStr = moment(start).format('YYYY-MM-DD HH:mm');
  const endStr = moment(end).format('YYYY-MM-DD HH:mm');

  // Prompt user to confirm or change times
  const newStart = window.prompt('Start time (YYYY-MM-DD HH:mm):', startStr);
  const newEnd = window.prompt('End time (YYYY-MM-DD HH:mm):', endStr);

  if (!newStart || !newEnd) {
    alert('Slot creation cancelled.');
    return;
  }

  try {
    const res = await axios.post(`${API_BASE}/slots`, {
      serviceId: selectedService,
      // send as ISO string without timezone info for LocalDateTime
      startTime: moment(newStart, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DDTHH:mm:ss'),
      endTime: moment(newEnd, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DDTHH:mm:ss'),
    }, { withCredentials: true });

    setEvents(prev => [...prev, {
      id: res.data.id,
      title: 'Available',
      start: new Date(res.data.startTime),
      end: new Date(res.data.endTime),
    }]);
  } catch (err) {
    console.error('Failed to create slot', err);
    alert('Failed to create slot');
  }
};



  const handleEventClick = (event) => {
    const action = window.prompt('Type "edit" to edit or "delete" to remove this slot:');
    if (action === 'delete') return handleDeleteSlot(event);
    if (action === 'edit') return handleEditSlot(event);
  };

  const handleEditSlot = async (event) => {
    const newStart = prompt('Enter new start time (YYYY-MM-DD HH:mm):', moment(event.start).format('YYYY-MM-DD HH:mm'));
    const newEnd = prompt('Enter new end time (YYYY-MM-DD HH:mm):', moment(event.end).format('YYYY-MM-DD HH:mm'));

    if (!newStart || !newEnd) return;

    try {
      const response = await axios.put(`${API_BASE}/slots/${event.id}`, {
        serviceId: selectedService,
        startTime: new Date(newStart),
        endTime: new Date(newEnd),
      }, { withCredentials: true });

      setEvents(prev =>
        prev.map(e =>
          e.id === event.id
            ? {
                ...e,
                start: new Date(response.data.startTime),
                end: new Date(response.data.endTime),
              }
            : e
        )
      );
    } catch (err) {
      console.error('Failed to update slot', err);
    }
  };

  const handleDeleteSlot = async (event) => {
    const confirm = window.confirm('Are you sure you want to delete this slot?');
    if (!confirm) return;

    try {
      await axios.delete(`${API_BASE}/slots/${event.id}`, { withCredentials: true });
      setEvents(prev => prev.filter(e => e.id !== event.id));
    } catch (err) {
      console.error('Error deleting slot', err);
    }
  };

  return (
    <div>
      <h3> Manage Service Availability</h3>

      <label>Select Service:</label>
      <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
        <option value="">-- Choose a Service --</option>
        {services.map(s => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>

      <div style={{ height: 600, marginTop: '2rem' }}>
        <Calendar
  selectable
  localizer={localizer}
  events={events}
  startAccessor="start"
  endAccessor="end"
  date={currentDate}                 
  view={currentView}                 
  onNavigate={(date) => setCurrentDate(date)} 
  onView={(view) => setCurrentView(view)} 
  onSelectSlot={handleSelectSlot}
  onSelectEvent={handleEventClick}
  views={['week', 'day', 'agenda']}
  defaultView="week"
  step={30}            // 30 minutes per slot
  timeslots={2}        // 2 slots per step = 30 min * 2 = 1 hour segments
/>

      </div>
    </div>
  );
};

export default AvailabilityManager;
