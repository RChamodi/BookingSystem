import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../css/Register.css';

const Register = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log("User registered successfully");
      navigate('/login'); 
    } else {
      const errorText = await response.text();
      toast.error('Registration failed !');
    }
  } catch (error) {
    console.error('Registration error:', error);
    toast.error('Something went wrong during registration.');
  }
};


  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="register-title">Register</h2>
        <input {...register('name')} placeholder="Name" required />
        <input {...register('email')} placeholder="Email" type="email" required />
        <input {...register('password')} placeholder="Password" type="password" required />
        <button type="submit" className="btn primary">Register</button>
      </form>
    </div>
  );
};

export default Register;
