import logo from './logo.svg';
import './styles/App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventList from './components/EventList';
import Dashboard from './components/Dashboard';
import Profile from './components/UserProfilePage';
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
        <Route path="/" element={<App />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>} />
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
