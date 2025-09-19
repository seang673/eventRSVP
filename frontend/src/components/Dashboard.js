import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorgage.getItem('token');
        if (!token) {
            navigate('/login'); //Redirect to login screen if token not found
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

    return (
        <div>
            <h1>Welcome, {userData.username}</h1>
            <p>Email: {userData.email}</p>
            <p>Role: {userData.is_organizer ? 'Organizer' : 'Attendee'}</p>
            <p>{userData.message}</p>
            {isOrganizer ? (
                <button onClick={() => navigate('/create-event')}>Create Event</button>
            ): (
                <button onClick= {() => navigate('/rsvp')}>RSVP To Event</button>
            )}
        </div>
    );
};

export default Dashboard;