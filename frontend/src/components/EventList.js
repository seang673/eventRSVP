import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import api from '../services/api';
import '../styles/eventStyling.css';

function EventList(){
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const eventsPerPage = 5;
    const isOrganizer = localStorage.getItem('is_organizer') === 'true';

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const fetchEvents = () => {
        setLoading(true);
        api.get('/events/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res=> setEvents(res.data.results))
            .then(res => console.log("Events result:", res.data))
            .catch(err => console.error("Error fetching events", err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    console.log("Events response:", events);

    const filteredEvents = Array.isArray(events)
    ? events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

    const totalPages = Math.max(1, Math.ceil(filteredEvents.length / eventsPerPage));

    //For attendees to RSVP
    const handleRSVP = (event) => {
        navigate('/rsvp', {state: { event } });
    };


    return (
        <div className="event-list">
            <button className="back-btn" onClick={() => navigate('/dashboard')}><b>🔙Back</b></button>
            <div className="query-section">

                    <h2>Upcoming Events For You!</h2>
                    <input
                        className="search"
                        type = "text"
                        placeholder="Search events..."
                        value = {searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <button className="search-btn" onClick={() => setCurrentPage(1)}>Search</button>
            </div>

            <div className="events-section">
                {/*For refreshing events */}
                <button className="refresh-btn" onClick={fetchEvents}>Refresh Events</button>
                {currentEvents.length === 0 ? (
                    <p>No events found</p>
                ): (
                    currentEvents.map(event => (
                        <div className="event-card" key={event.id}>
                            <h2><strong>{event.title}</strong></h2>
                            <p>{new Date(event.date).toLocaleString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric'
                            }
                            )}
                            </p>
                            <p>Location: {event.location}</p>
                            <p>{event.description}</p>
                            <p>
                                {event.rsvp_count >= event.capacity
                                    ? "Event is full"
                                    : `${event.capacity - event.rsvp_count} spots left`
                                }
                            </p>
                            {!isOrganizer && (
                                <button className="rsvp-button" onClick={() => handleRSVP(event)}>
                                    RSVP
                                </button>
                            )}
                        </div>
                    ))
                )}

                <div className="page-handling">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i+1)}
                            style={{ margin: '0 5px', padding: '5px 10px' }}
                        >
                            {i+1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default EventList;