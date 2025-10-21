import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {handleLogout} from '../utils/auth';
import '../styles/dashboard.css'

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log("Token not found")
            navigate('/login'); //Redirect to login screen if user's token not found
            return;
        }

        axios.get('http://127.0.0.1:8000/dashboard/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => setUserData(res.data))
        .catch(err => {
            console.error(err);
            navigate('/login');
        });
    }, [navigate]);


    if (!userData) return <p>Loading dashboard...</p>
    const isOrganizer =  localStorage.getItem('is_organizer') === 'true';

    return (
        <div className="main-body">
                <div className="first-section">
                    <h1>Welcome, {userData.username}!</h1>
                    <p>Email: {userData.email}</p>
                    <p>Your Role: <b>{isOrganizer ? 'Organizer' : 'Attendee'}</b></p>
                    <p>{userData.message}</p>
                </div>
                <div className="second-section">
                    <button className="btn-class" onClick={() => navigate(isOrganizer ? '/create-event' : '/events')}>
                        {isOrganizer ? 'Create Event' : 'Events For You'}
                    </button>
                    <button className="btn-class" onClick={() => navigate(isOrganizer ? '/orgProfile' : '/attendeeProfile')}>User Profile</button>
                    <button className="btn-class" onClick={() => handleLogout(navigate)}>Logout</button>
                </div>
        </div>
    );
};

export default Dashboard;