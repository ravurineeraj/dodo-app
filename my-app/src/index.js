import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css'; // ✅ Fix: missing space and semicolon
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // ✅ Add this if using routing

const root = ReactDOM.createRoot(document.getElementById('root')); // ✅ Fix: missing '='

root.render(
  <React.StrictMode>
    <BrowserRouter> {/* ✅ Wrap App with Router */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);