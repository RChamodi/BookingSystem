import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    // Fake login logic for now (replace with API call)
    const fakeUser = {
      email: data.email,
      role: data.email === 'admin@example.com' ? 'Admin' : 'RegisteredUser',
      name: 'Demo User',
    };
    login(fakeUser);
    navigate('/');
  };

  return (
     <div className="centered-form-container">
    
    <form className="form-box" onSubmit={handleSubmit(onSubmit)}>
      <h2 style={{ textAlign: 'center' }}>Login</h2>
      <input {...register('email')} placeholder="Email" type="email" required />
      <input {...register('password')} placeholder="Password" type="password" required />
      <button type="submit">Login</button>
    </form>
    </div>
  );
};

export default Login;
