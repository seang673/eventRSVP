import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import api from '../services/api';

function EventList(){
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 5;
    const isOrganizer = localStorage.getItem('is_organizer') === 'true';

    const navigate = useNavigate();

    const fetchEvents = () => {
        api.get('/events/')
            .then(res=> setEvents(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

    //For attendees to RSVP
    const handleRSVP = (event) => {
        navigate('/rsvp', {state: { event } });
    };


    return (
        <div className="event-list">
            <div className="query-section">
                <h2>Upcoming Events For You!</h2>
                <input
                    type = "text"
                    placeholder="Search events..."
                    value = {searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="events-section">
                //For refreshing events
                <button onClick={fetchEvents}>Refresh Events</button>
                {currentEvents.map(event => (
                    <div className="event-card" key={event.id}>
                        <h2><strong>{event.title}</strong></h2>
                        <p>{event.date}</p>
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
                ))}

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