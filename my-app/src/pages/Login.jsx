import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Basic validation or login logic here
    if (email && password) {
      localStorage.setItem('userEmail', email);   // ✅ Save to localStorage
      onLogin(email);                             // ✅ Pass email up to App
      navigate('/');                              // ✅ Redirect to Home
    } else {
      alert('Please enter email and password');
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