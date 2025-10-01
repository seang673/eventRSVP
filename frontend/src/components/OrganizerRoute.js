import React from 'react';
import { Navigate } from 'react-router-dom';

const OrganizerRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token'); //If user is logged in
  const isOrganizer = localStorage.getItem('is_organizer') === 'true';

  return isAuthenticated && isOrganizer ? children : <Navigate to="/unauthorized" />;
};

export default OrganizerRoute;

