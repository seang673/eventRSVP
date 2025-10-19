import React, {useState, useEffect} from 'react';
import {Navigate, useNavigate} from 'react-router-dom';
import api from '../services/api';
import { handleLogout } from '../utils/auth';

function OrganizerProfile() {
    const [rsvps, setRsvps] = useState([]);
    const [events, setEvents] = useState([]);

    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const isOrganizer = localStorage.getItem('is_organizer') === 'true';

    const navigate = useNavigate();

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

    const handleCancelRSVPS = async (rsvpId) => {
        try{
            const token = localStorage.getItem('token');
            const res = await api.delete(`/rsvps/${rsvpId}`, {
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

    const fetchEvents = async() => {
        try{
            const res = await api.get('/events/organizer', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEvents(res.data);
        }catch(err){
            console.log("Failed to fetch events", err);
        } finally {
            setLoading(false);
        }

    }

    const handleCancelEvents = async (eventId) => {
        try{
            const token = localStorage.getItem('token');
            const res = await api.delete(`events/${eventId}`, {
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
            console.error("Error canceling Event:", err);
        }

        }

    useEffect(() => {
        if (!token) {
            navigate('/unauthorized');
            return;
        }
        fetchRsvps();
        fetchEvents();
    }, []);

    if (loading) return <p>Loading the RSVPs...</p>

    const username = localStorage.getItem('username')
    return (
        <div className="main-body">
            <button onClick={() => handleLogout(navigate)}>Logout</button>
            <h2>{username}'s Profile </h2>
            <div className="event-table">
                <h3>Your Created Events</h3>
                <table>
                    <thead>
                        <tr>
                        <th>Title</th>
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
                            <td>{event.title}</td>
                            <td>{new Date(event.date).toLocaleString()}</td>
                            <td>{event.location}</td>
                            <td>{event.capacity}</td>
                            <td>{event.rsvp_count}</td>
                            <td><button onClick={() => handleCancelEvents(event.id)}>Cancel</button></td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="rsvp-table">
                <h3>RSVPS For Your Events</h3>
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
                                    <button onClick={() => handleCancelRSVPS(rsvp.id)}>Cancel</button>
                                </td>
                            </tr>
                            ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
export default OrganizerProfile;