import React, { useState, useEffect } from 'react';
//import axios from 'axios';

//const API_BASE = 'http://localhost:8080/api/admin/services';

const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    price: '',
    location: '',
    description: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    //  Mock data instead of API call
    setServices([
      {
        id: 1,
        name: 'Haircut',
        type: 'Offline',
        price: 300,
        location: 'Salon A',
        description: 'Basic haircut service',
      },
      {
        id: 2,
        name: 'Online Consultation',
        type: 'Online',
        price: 500,
        location: 'Virtual',
        description: 'Hair consultation over video',
      },
    ]);

    
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
    };

    if (isEditing) {
      setServices((prev) =>
        prev.map((service) =>
          service.id === editId ? { ...payload, id: editId } : service
        )
      );
    } else {
      const newId = services.length ? Math.max(...services.map(s => s.id)) + 1 : 1;
      setServices((prev) => [...prev, { ...payload, id: newId }]);
    }

    // Reset form
    setFormData({
      name: '',
      type: '',
      price: '',
      location: '',
      description: '',
    });
    setIsEditing(false);
    setEditId(null);

    
  };

  const handleEdit = (service) => {
    setFormData({
      name: service.name || '',
      type: service.type || '',
      price: service.price || '',
      location: service.location || '',
      description: service.description || '',
    });
    setIsEditing(true);
    setEditId(service.id);
  };
  const handleDelete = async (id) => {
    setServices((prev) => prev.filter((service) => service.id !== id));

  };

  /*useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(API_BASE, {
        withCredentials: true,
      });
      setServices(response.data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
    };

    try {
      if (isEditing) {
        await axios.put(`${API_BASE}/${editId}`, payload, {
          withCredentials: true,
        });
      } else {
        await axios.post(API_BASE, payload, {
          withCredentials: true,
        });
      }

      setFormData({
        name: '',
        type: '',
        price: '',
        location: '',
        description: '',
      });
      setIsEditing(false);
      setEditId(null);
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleEdit = (service) => {
    setFormData({
      name: service.name || '',
      type: service.type || '',
      price: service.price || '',
      location: service.location || '',
      description: service.description || '',
    });
    setIsEditing(true);
    setEditId(service.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`, { withCredentials: true });
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };*/

  return (
    <div>
      <h3>Manage Services</h3>

      <form onSubmit={handleAddOrUpdate} style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <input
          name="name"
          placeholder="Service Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <select name="type" value={formData.type} onChange={handleChange} required>
          <option value="">Select Type</option>
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
        </select>
        <input
          name="price"
          placeholder="Price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
        />
        <button type="submit">
          {isEditing ? 'Update Service' : 'Add Service'}
        </button>
      </form>

      <div style={{ marginTop: '2rem' }}>
        <h4>Service List</h4>
        {services.length === 0 ? (
          <p>No services found.</p>
        ) : (
          services.map((s) => (
            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5rem 0', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
              <div>
                <strong>{s.name}</strong> - {s.type} - Rs {s.price}<br />
                <em>{s.location}</em><br />
                <small>{s.description}</small>
              </div>
              <div>
                <button onClick={() => handleEdit(s)} style={{ marginRight: '1rem' }}>Edit</button>
                <button onClick={() => handleDelete(s.id)} style={{ backgroundColor: '#e74c3c', color: 'white' }}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ServiceManager;
