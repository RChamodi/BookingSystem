import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
  const formBody = new URLSearchParams();
  formBody.append('username', data.email);
  formBody.append('password', data.password);

  const response = await fetch('http://localhost:8080/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formBody,
    credentials: 'include',
  });

  if (response.ok) {
    // fetch the logged-in user's info
    const userRes = await fetch('http://localhost:8080/api/auth/me', {
      credentials: 'include',
    });
    const user = await userRes.json();
    login(user);
    if (user.role === 'ADMIN') {
      navigate('/admin');
    } else {
      navigate('/profile');
    }
  } else {
    alert('Login failed');
  }
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
