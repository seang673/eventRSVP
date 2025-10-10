import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {handleLogout} from '../utils/auth';

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
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

    const isOrganizer =  userData.is_organizer === 'true';
    if (!userData) return <p>Loading dashboard...</p>

    return (
        <div>
            <h1>Welcome, {userData.username}</h1>
            <p>Email: {userData.email}</p>
            <p>Your Role: {isOrganizer ? 'Organizer' : 'Attendee'}</p>
            <p>{userData.message}</p>
            {isOrganizer &&
                (<button onClick={() => navigate('/create-event')}>Create Event</button>)
            }
            {!isOrganizer &&
            (<button onClick={() => navigate('/events')}>Events</button>)
            }
            <button onClick={() => navigate('/profile')}>Profile</button>
            <button onClick={() => handleLogout(navigate)}>Logout</button>
        </div>
    );
};

export default Dashboard;