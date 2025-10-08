import logo from './logo.svg';
import './styles/App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventList from './components/EventList';
import Dashboard from './components/Dashboard';
import OrganizerProfile from './components/OrganizerProfile';
import AttendeeProfile from './components/AttendeeProfile';
import Login from './components/LoginForm';
import OrganizerRoute from './components/OrganizerRoute';
import CreateEvent from './components/CreateEventForm';
import RSVPForm from './components/RSVPForm';
import Register from './components/RegisterForm';
import Unauthorized from './pages/Unauthorized';
import Welcome from './components/Welcome';

const isOrganizer = user?.is_organizer;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/orgProfile" element={<OrganizerProfile />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/attendeeProfile" element={<AttendeeProfile/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/rsvp" element={<RSVPForm/>} />
        <Route path="/events" element={<EventList/>} />
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
