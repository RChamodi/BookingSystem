import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    // Replace with API call
    console.log("Registering user", data);
    navigate('/login');
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
