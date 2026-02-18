import React, {useState, useEffect} from 'react';
import {Navigate, useNavigate} from 'react-router-dom';
import api from '../services/api';
import { handleLogout } from '../utils/auth';
import "../styles/profile.css";

function OrganizerProfile() {
    const [rsvps, setRsvps] = useState([]);
    const [events, setEvents] = useState([]);

    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const isOrganizer = localStorage.getItem('is_organizer') === 'true';

    const navigate = useNavigate();

    const fetchData = async () => {
        try{
            const res = await api.get('/profile/organizer', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("RSVP Response: ",res.data.rsvps);
            console.log("Events Response: ", res.data.events);
            setRsvps(res.data.rsvps);
            setEvents(res.data.events);
        } catch (err) {
            console.error('Failed to fetch organizer RSVPs:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelRSVPS = async (rsvpId) => {
        try{
            const token = localStorage.getItem('token');
            const res = await api.delete(`/rsvps/${rsvpId}/`, {
                headers: {
                    Authorization : `Bearer ${token}`,
                },
            });

            if (res.status === 204 || res.status === 200) {
                alert("This attendee's RSVP is cancelled successfully")
                setRsvps(prev => prev.filter(r => r.id !== rsvpId));
            } else {
                console.error("Failed to cancel the attendee's RSVP");
            }

        } catch(err) {
            console.error("Error canceling this RSVP:", err);
        }
    };

    const handleCancelEvents = async (eventId) => {
        try{
            const token = localStorage.getItem('token');
            const res = await api.delete(`events/${eventId}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 204 || res.status === 200) {
                alert("Cancelled event successfully")
                setEvents(prev => prev.filter(e => e.id !== eventId));
            } else {
                console.error("Failed to cancel Event");
            }

        } catch(err) {
            const errorMsg = err.response?.data?.detail || 'Failed to cancel event';
            console.error("Error canceling Event:", err);
            alert(errorMsg);
        }

        }

    useEffect(() => {
        if (!token) {
            navigate('/unauthorized');
            return;
        }
        fetchData();
    }, []);

    if (loading) return <p>Loading the RSVPS and Events...</p>

    const username = localStorage.getItem('username')
    return (
        <div className="main-body">
            <button className="back-btn" onClick={() => navigate('/dashboard')}>🔙Back</button>
            <button className="logout-btn" onClick={() => handleLogout(navigate)}>Logout</button>
            <div className="heading">
                <h2 style={{ textDecoration: 'underline' }}>{username}'s Profile </h2>
            </div>

            <div className="two-tables">
                <div className="profile-section">
                    <div className="event-table">
                        <h3>Your Created Events</h3>
                        <table>
                            <thead>
                                <tr>
                                <th>Event Title</th>
                                <th>Date</th>
                                <th>Location</th>
                                <th>Capacity</th>
                                <th>RSVP Count</th>
                                <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map(event => (
                                <tr key={event.id}>
                                    <td data-label="Event-Title">{event.title}</td>
                                    <td data-label="Date">{new Date(event.date).toLocaleString('en-US', {weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    })
                                    }</td>
                                    <td data-label="Location">{event.location}</td>
                                    <td data-label="Capacity">{event.capacity}</td>
                                    <td data-label="RSVP Count">{event.rsvp_count}</td>
                                    <td><button className="delete-btn" onClick={() => handleCancelEvents(event.id)}>Cancel</button></td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="rsvp-table">
                    <h3>RSVPS To Your Events</h3>
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
                            {/*populates table with rsvps*/}
                            {Array.isArray(rsvps) && rsvps.map(rsvp => (
                                <tr key={rsvp.id}>
                                    <td data-label="Event-Title">{rsvp.event_title || rsvp.event}</td>
                                    <td data-label="RSVP-Name">{rsvp.name}</td>
                                    <td data-label="Email">{rsvp.email}</td>
                                    <td data-label="Message">{rsvp.message}</td>
                                    <td>✅</td>
                                    <td>
                                        <button className="delete-btn" onClick={() => handleCancelRSVPS(rsvp.id)}>Cancel</button>
                                    </td>
                                </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>


        </div>
    );
}
export default OrganizerProfile;