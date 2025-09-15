import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import '../../css/AvailabilityManager.css';

const localizer = momentLocalizer(moment);
const API_BASE = 'http://localhost:8080/api/admin';

Modal.setAppElement('#root');

const AvailabilityManager = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [events, setEvents] = useState([]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('week');

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [modalEvent, setModalEvent] = useState(null);
  const [tempStart, setTempStart] = useState('');
  const [tempEnd, setTempEnd] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedService) fetchSlots(selectedService);
  }, [selectedService]);

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${API_BASE}/services`, { withCredentials: true });
      setServices(res.data);
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const fetchSlots = async (serviceId) => {
    try {
      const res = await axios.get(`${API_BASE}/slots/service/${serviceId}`, { withCredentials: true });
      const formatted = res.data.map(slot => ({
        id: slot.id,
        title: 'Available',
        start: new Date(slot.startTime),
        end: new Date(slot.endTime),
      }));
      setEvents(formatted);
    } catch (err) {
      console.error('Error fetching slots:', err);
    }
  };

  const openCreateModal = ({ start, end }) => {
    if (!selectedService) {
      toast.warning('Please select a service first.');
      return;
    }
    setModalMode('create');
    setTempStart(moment(start).format('YYYY-MM-DDTHH:mm'));
    setTempEnd(moment(end).format('YYYY-MM-DDTHH:mm'));
    setModalEvent(null);
    setModalIsOpen(true);
  };

  const openEditModal = (event) => {
    setModalMode('edit');
    setModalEvent(event);
    setTempStart(moment(event.start).format('YYYY-MM-DDTHH:mm'));
    setTempEnd(moment(event.end).format('YYYY-MM-DDTHH:mm'));
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalMode('create');
    setModalEvent(null);
    setTempStart('');
    setTempEnd('');
  };

  const handleCreate = async () => {
    try {
      const res = await axios.post(`${API_BASE}/slots`, {
        serviceId: selectedService,
        startTime: moment(tempStart).format('YYYY-MM-DDTHH:mm:ss'),
        endTime: moment(tempEnd).format('YYYY-MM-DDTHH:mm:ss'),
      }, { withCredentials: true });

      setEvents(prev => [...prev, {
        id: res.data.id,
        title: 'Available',
        start: new Date(res.data.startTime),
        end: new Date(res.data.endTime),
      }]);
      toast.success('Slot created.');
      closeModal();
    } catch (err) {
      console.error('Error creating slot:', err);
      toast.error('Failed to create slot.');
    }
  };

  const handleEdit = async () => {
  try {
    const res = await axios.put(`${API_BASE}/slots/${modalEvent.id}`, {
      serviceId: selectedService,
      startTime: new Date(tempStart).toISOString(), 
      endTime: new Date(tempEnd).toISOString(),
    }, { withCredentials: true });

    
    setEvents(prev =>
      prev.map(e =>
        e.id === modalEvent.id
          ? {
              ...e,
              start: new Date(res.data.startTime), 
              end: new Date(res.data.endTime),
            }
          : e
      )
    );

    toast.success('Slot updated.');
    closeModal();
  } catch (err) {
    console.error('Error editing slot:', err.response || err);
    toast.error('Failed to update slot.');
  }
};


  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/slots/${modalEvent.id}`, { withCredentials: true });
      setEvents(prev => prev.filter(e => e.id !== modalEvent.id));
      toast.success('Slot deleted.');
      closeModal();
    } catch (err) {
      console.error('Error deleting slot:', err);
      toast.error('Failed to delete slot.');
    }
  };

  return (
    <div className="admin-section availability-manager">
      <h3 className="admin-title">Manage Service Availability</h3>

      <div className="availability-controls">
        <label htmlFor="serviceSelect">Select Service:</label>
        <select
          id="serviceSelect"
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
        >
          <option value="">-- Choose a Service --</option>
          {services.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div className="calendar-container">
        <Calendar
          selectable
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          date={currentDate}
          view={currentView}
          onNavigate={setCurrentDate}
          onView={setCurrentView}
          onSelectSlot={openCreateModal}
          onSelectEvent={openEditModal}
          views={['week', 'day', 'agenda']}
          defaultView="week"
          step={30}
          timeslots={2}
        />
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="slot-modal"
        overlayClassName="slot-modal-overlay"
        contentLabel="Slot Modal"
      >
        <h2>{modalMode === 'create' ? 'Create Slot' : 'Edit Slot'}</h2>

        <div className="modal-form">
          <label>Start Time:</label>
          <input
            type="datetime-local"
            value={tempStart}
            onChange={(e) => setTempStart(e.target.value)}
          />
          <label>End Time:</label>
          <input
            type="datetime-local"
            value={tempEnd}
            onChange={(e) => setTempEnd(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          {modalMode === 'create' && (
            <button className="btn primary" onClick={handleCreate}>Create</button>
          )}
          {modalMode === 'edit' && (
            <>
              <button className="btn primary" onClick={handleEdit}>Update</button>
              <button className="btn danger" onClick={handleDelete}>Delete</button>
            </>
          )}
          <button className="btn cancel" onClick={closeModal}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default AvailabilityManager;
