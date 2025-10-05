import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import api from '../services/api';
import { handleLogout } from '../utils/auth';

function OrganizerProfile() {
    const [rsvps, setRsvps] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const isOrganizer = localStorage.getItem('is_organizer') === 'true';

    if (!token) return <Navigate to="/unauthorized" />;

    const fetchRsvps = async () => {
        try{
            const res = await api.get('/rsvps/organizer/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setRsvps(res.data);
        } catch (err) {
            console.error('Failed to fetch organizer RSVPs:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (rsvpId) => {
        try{
            const token = localStorage.getItem('token');
            const res = await api.delete(`/rsvps/${rsvpId}`, {
                headers: {
                    Authorization : `Bearer ${token}`,
                },
            });

            if (res.status === 204 || res.status === 200) {
                setRsvps(prev => prev.filter(r => r.id !== rsvpId));
            } else {
                console.error("Failed to cancel RSVP");
            }

        } catch(err) {
            console.error("Error canceling RSVP:", err);
        }
    };

    useEffect(() => {
        fetchRsvps();
    }, []);

    if (loading) return <p>Loading the RSVPs...</p>

    const username = localStorage.getItem('username')
    return (
        <div>
            <button onClick={() => handleLogout(navigate)}>Logout</button>
            <h2>{username}'s Profile </h2>
            <h3>Your Submitted RSVPS</h3>
            {/* RSVP Table */}
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
                    //populates table with rsvps
                    {rsvps.map(rsvp => (
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
    );

}

export default OrganizerProfile;