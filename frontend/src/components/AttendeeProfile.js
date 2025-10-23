import React, {useEffect, useState} from 'react';
import {Navigate, useNavigate} from 'react-router-dom';
import api from '../services/api';
import { handleLogout } from '../utils/auth';
import '../styles/profile.css';

function UserProfilePage() {
    const [rsvps, setRsvps] = useState([]);
    const [loading, setLoading] = useState(true);
    const userEmail = localStorage.getItem('email');
    const token = localStorage.getItem('token');

    const navigate = useNavigate();

    const fetchRsvps = async () => {
        try{
            const res = await api.get('/rsvps');
            console.log("RSVPS response:", res.data);
            setRsvps(res.data.results);
        } catch (err) {
            console.error('Failed to fetch RSVPs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(token){
            fetchRsvps();
        }

        }, []);

    if (!token) return <Navigate to="/unauthorized" />;


    const handleCancel = async (rsvpId) => {
        try{
            const token = localStorage.getItem('token');
            const res = await api.delete(`/rsvps/${rsvpId}`, {
                headers: {
                    Authorization : `Bearer ${token}`,
                },
            });

            if (res.status === 204 || res.status === 200) {
                alert("RSVP is cancelled successfully")
                setRsvps(prev => prev.filter(r => r.id !== rsvpId));
            } else {
                console.error("Failed to cancel RSVP");
            }

        } catch(err) {
            console.error("Error canceling RSVP:", err);
        }
    };

    if (loading) return <p>Loading the RSVPs...</p>

    const filteredRsvps = rsvps.filter(rsvp => rsvp?.email?.trim()?.toLowerCase() === userEmail?.trim()?.toLowerCase());
    console.log("Filtered Rsvps:", filteredRsvps);
    console.log("Email:", userEmail);
    const username = localStorage.getItem('username')
    return (
        <div className="main-body">
            <button className="back-btn" onClick={() => navigate('/dashboard')}>🔙Back</button>
            <button className="logout-btn" onClick={() => handleLogout(navigate)}>Logout</button>
            <div className="profile-section">
                <h2>{username}'s Profile </h2>
                <h3>Your Event Reservations</h3>
                {/*RSVP Table*/}
                <table>
                    <thead>
                        <tr>
                            <th>Event</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Message</th>
                            <th>Confirmed</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/*populates table with rsvps*/}
                        {filteredRsvps.map(rsvp => (
                            <tr key={rsvp.id}>
                                <td>{rsvp.event_title || rsvp.event}</td>
                                <td>{rsvp.name}</td>
                                <td>{rsvp.email}</td>
                                <td>{rsvp.message}</td>
                                <td>✅</td>
                                <td>
                                    <button onClick={() => handleCancel(rsvp.id)}>Cancel</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
export default UserProfilePage;