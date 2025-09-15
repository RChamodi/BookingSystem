import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts';
import '../../css/DashboardOverview.css';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    cancelled: 0,
  });

  const [bookingData, setBookingData] = useState([]);
  const [topServices, setTopServices] = useState([]);

  useEffect(() => {
    
    axios.get('http://localhost:8080/api/admin/dashboard/stats', {
      withCredentials: true,
    })
    .then(res => {
      setStats({
        total: res.data.totalBookings,
        confirmed: res.data.approvedBookings,
        cancelled: res.data.cancelledBookings,
      });
    })
    .catch(err => console.error('Stats error:', err));

    
    axios.get('http://localhost:8080/api/admin/dashboard/bookings-per-day', {
      withCredentials: true,
    })
    .then(res => {
      const formatted = res.data.map(item => ({
        date: item.date,
        bookings: item.count,
      }));
      setBookingData(formatted);
    })
    .catch(err => console.error('Bookings per day error:', err));

    
    axios.get('http://localhost:8080/api/admin/dashboard/bookings-per-service', {
      withCredentials: true,
    })
    .then(res => {
      const services = res.data.map(item => ({
        name: item.service,
        count: item.count,
      }));
      setTopServices(services);
    })
    .catch(err => console.error('Services error:', err));
  }, []);

  return (
    <div className="dashboard-page-bg">
      <div className="dashboard-container">
        <h3 className="admin-title">Booking Statistics</h3>

        <div className="stats-grid">
          <div className="card">
            <h4>Total Bookings</h4>
            <p>{stats.total}</p>
          </div>
          <div className="card">
            <h4>Confirmed</h4>
            <p>{stats.confirmed}</p>
          </div>
          <div className="card">
            <h4>Cancelled</h4>
            <p>{stats.cancelled}</p>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '2rem' }}>
          <h4>Most Booked Services</h4>
          <ul>
            {topServices.map((s, i) => (
              <li key={i}>{s.name} - {s.count} bookings</li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h4>Bookings Over Time</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bookingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#0077cc" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
