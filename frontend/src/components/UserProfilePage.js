import React, {useEffect, useState} from 'react';
import {useNavigte} from 'react-router-dom';
import api from '../services/api';
import { handleLogout } from '../utils/auth';

function UserProfilePage() {
    const [rsvps, setRsvps] = useState([]);
    const [loading, setLoading] = useState(true);
    const userEmail = localStorage.get('email');
    const token = localStorage.getItem('token');
    const isOrganizer = localStorage.getItem('is_organizer') === 'true';
;
    if (!token) return <Navigate to="/unauthorized" />;

    const fetchRsvps = async () => {
        try{
            const res = await api.get('/rsvps');
            setRsvps(res.data);
        } catch (err) {
            console.error('Failed to fetch RSVPs:', err);
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

    const filteredRsvps = isOrganizer ? rsvps: rsvps.filter(rsvp => rsvp.email === userEmail);

    return (
        <div>
            <button onClick={() => handleLogout(navigate)}>Logout</button>
            <h2>RSVP Info</h2>
            //RSVP Table
            <table>
                <thead>
                    <tr>
                        <th>Event</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Message</th>
                        <th>Confirmed</th>
                    </tr>
                </thead>
                <tbody>
                    //populates table with rsvps
                    {filteredRsvps.map(rsvp => (
                        <tr key={rsvp.id}>
                            <td>{rsvp.event_title || rsvp.event}</td>
                            <td>{rsvp.name}</td>
                            <td>{rsvp.email}</td>
                            <td>{rsvp.message}</td>
                            <td>{rsvp.confirmed ? '✅' : '❌'}</td>
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
export default UserProfilePage;