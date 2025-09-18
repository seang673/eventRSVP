import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventList from './components/EventList';
import RSVPDashboard from './components/RSVPDashboard';
import Login from './components/LoginForm';
import Register from './components/RegisterForm';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EventList />} />
        <Route path="/dashboard" element={<RSVPDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>} />
      </Routes>
    </Router>
  );
}

export default App;
