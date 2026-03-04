import React from 'react';
import { Navigate } from 'react-router-dom';

const OrganizerRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token'); //If user is logged in
  const isOrganizer = JSON.parse(localStorage.getItem('isOrganizer') || "false");

  return isAuthenticated && isOrganizer ? children : <Navigate to="/unauthorized" />;
};

export default OrganizerRoute;

