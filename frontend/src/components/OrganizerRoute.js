import React from 'react';
import { Navigate } from 'react-router-dom';

const OrganizerRoute = ({ children }) => {
  const isOrganizer = localStorage.getItem('is_organizer') === 'true';
  return isOrganizer ? children : <Navigate to="/unauthorized" />;
};

export default OrganizerRoute;

