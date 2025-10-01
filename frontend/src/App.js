import logo from './logo.svg';
import './styles/App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventList from './components/EventList';
import RSVPDashboard from './components/RSVPDashboard';
import Login from './components/LoginForm';
import OrganizerRoute from './components/OrganizerRoute';
import CreateEvent from './components/CreateEventForm';
import Register from './components/RegisterForm';
import Unauthorized from './pages/Unauthorized';

const isOrganizer = user?.is_organizer;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/dashboard" element={<RSVPDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/create-event" element={
          <OrganizerRoute>
            <CreateEvent />
          </OrganizerRoute>
        } />
        <Route path ="/unauthorized" element ={<Unauthorized/>} />
      </Routes>
    </Router>
  );
}

export default App;
