import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AuthGuard from './components/AuthGuard';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          } />
        {/* You can add more routes like dashboard */}
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
