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
            console.log("User token not found")
            navigate('/login'); //Redirect to login screen if user's token not found
            return;
        }
        axios.get('http://localhost:8080/api/dashboard', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then(res => {
            console.log("Dashboard Response: ", res.data);
            setUserData(res.data);
            localStorage.setItem('username', res.data.username);
            localStorage.setItem('email', res.data.email);
            localStorage.setItem('is_organizer', res.data.isOrganizer);
        }).catch(err => {
            setTimeout(function() {
            console.error("Failed to fetch dashboard data:", err);
            navigate('/login');
            }, 2000);
        });
    }, [navigate]);


    if (!userData) return <p>Loading dashboard...</p>


    return (
        <div className="dashboard-body">
                <div className="first-section">
                    <h1>Welcome, {userData.username}!</h1>
                    <h3>Email: {userData.email}</h3>
                    <h3>Your Role: <b>{userData.isOrganizer ? 'Organizer' : 'Attendee'}</b></h3>
                    <h4>{userData.message}</h4>
                </div>
                <div className="second-section">
                    <button className="dsh-btn-class" onClick={() => navigate(userData.isOrganizer ? '/create-event' : '/events')}>
                        {userData.isOrganizer ? 'Create An Event' : 'Events For You'}
                    </button>
                    <button className="dsh-btn-class" onClick={() => navigate(userData.isOrganizer ? '/orgProfile' : '/attendeeProfile')}>User Profile</button>
                    <button className="dsh-btn-class" onClick={() => handleLogout(navigate)}>Logout</button>
                </div>
        </div>
    );
};

export default Dashboard;