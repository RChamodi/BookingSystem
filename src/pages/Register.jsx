import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

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
      alert('Registration failed: ' + errorText);
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('Something went wrong during registration.');
  }
};


  return (
    <div className="centered-form-container">
      <form className="form-box" onSubmit={handleSubmit(onSubmit)}>
        <h2 style={{ textAlign: 'center' }}>Register</h2>
        <input {...register('name')} placeholder="Name" required />
        <input {...register('email')} placeholder="Email" type="email" required />
        <input {...register('password')} placeholder="Password" type="password" required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
