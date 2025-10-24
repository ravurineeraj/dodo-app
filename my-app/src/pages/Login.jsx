import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Autofill saved credentials (optional)
  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    const savedPassword = localStorage.getItem('userPassword');
    if (savedEmail) setEmail(savedEmail);
    if (savedPassword) setPassword(savedPassword);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    const savedEmail = localStorage.getItem('userEmail');
    const savedPassword = localStorage.getItem('userPassword');

    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

    if (email === savedEmail && password === savedPassword) {
      // ✅ Correct credentials
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userPassword', password); // Save for next login (autofill)
      onLogin(email);
      alert('Login successful!');
      navigate('/');
    } else if (email === savedEmail && password !== savedPassword) {
      // ❌ Wrong password
      alert('Incorrect password!');
    } else {
      // ❌ No account found
      alert('No account found. Please sign up first.');
      navigate('/signup');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="button-group">
          <button type="submit">Login</button>
          <button type="button" onClick={() => navigate('/signup')}>
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}
