import React, {useEffect, useState} from 'react';
import api from '../services/api';
import RSVPForm from './RSVPForm';

function EventList(){
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 5;

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

    return (
        <div>
            <h2>Upcoming Events</h2>
            <input
                type = "text"
                placeholder="Search events..."
                value = {searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            <button onClick={fetchEvents}>Refresh Events</button>
                <ul>
                    {currentEvents.map(event => (
                        <li key={event.id}>
                            <strong>{event.title}</strong> - {event.date}
                            <p>
                                {event.rsvp_count >= event.capacity
                                    ? "Event is full"
                                    : `${event.capacity - event.rsvp_count} spots left`}
                            </p>

                            <RSVPForm event={event} />
                        </li>
                    ))}
                </ul>
                <div>
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
    );
}

export default EventList;