import React, { useEffect, useState } from 'react';
import '../../css/PaymentManager.css';

const PaymentManager = () => {
  const [payments, setPayments] = useState([]);
  
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/payments/admin', {
          credentials: 'include'
        });
        const data = await res.json();
        console.log('Payments data:', data); 
        setPayments(data);
      } catch (err) {
        console.error('Failed to fetch payments', err);
      }
    };
    fetchPayments();
  }, []);

  const handleExportCSV = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/payments/admin/export', {
        credentials: 'include'
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'payments-report.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (err) {
      console.error('Failed to export payments', err);
    }
  };

  return (
    <div>
      <h3 className='payment-title'>All Payments</h3>
      <button className='btn primary'onClick={handleExportCSV}>Export CSV</button>
      <table border="1" cellPadding="8" style={{ marginTop: '1rem', width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Booking ID</th>
            <th>Amount (Rs)</th>
            <th>Status</th>
            <th>Session ID</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.userId}</td>
              <td>{p.bookingId}</td>

              <td>{(p.amount / 100).toFixed(2)}</td>
              <td>{p.status}</td>
              <td>{p.stripeSessionId}</td>
              <td>{new Date(p.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentManager;
