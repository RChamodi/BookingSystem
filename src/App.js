import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Booking from './pages/Booking';
import AdminDashboard from './pages/admin/AdminDashboard';
import Home from './pages/Home';
import NavBar from './components/common/NavBar';
import MyBookings from './pages/MyBookings';
import BookingDetails from './pages/BookingDetails';
import BookingSuccess from './pages/BookingSuccess';


const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};


const AppWrapper = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute roles={['USER', 'ADMIN']}>
              <Profile />
              
            </PrivateRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <PrivateRoute roles={['USER', 'ADMIN']}>
              <MyBookings/>
              
            </PrivateRoute>
          }
        />
        <Route path="/booking/:id"
         element={
          <PrivateRoute roles={['USER', 'ADMIN']}>
         <BookingDetails />
         </PrivateRoute>
         } 
         />
        <Route
          path="/booking"
          element={
            
              <Booking />
            
          }
        />
        <Route
  path="/booking-success"
  element={
    <PrivateRoute roles={['USER', 'ADMIN']}>
      <BookingSuccess />
    </PrivateRoute>
  }
/>

        <Route
          path="/admin"
          element={
            <PrivateRoute roles={['ADMIN']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppWrapper />
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
