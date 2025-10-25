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
        <div className="dashboard-body">
                <div className="first-section">
                    <h1>Welcome, {userData.username}!</h1>
                    <h3>Email: {userData.email}</h3>
                    <h3>Your Role: <b>{isOrganizer ? 'Organizer' : 'Attendee'}</b></h3>
                    <h4>{userData.message}</h4>
                </div>
                <div className="second-section">
                    <button className="dsh-btn-class" onClick={() => navigate(isOrganizer ? '/create-event' : '/events')}>
                        {isOrganizer ? 'Create An Event' : 'Events For You'}
                    </button>
                    <button className="dsh-btn-class" onClick={() => navigate(isOrganizer ? '/orgProfile' : '/attendeeProfile')}>User Profile</button>
                    <button className="dsh-btn-class" onClick={() => handleLogout(navigate)}>Logout</button>
                </div>
        </div>
    );
};

export default Dashboard;