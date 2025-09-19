import React, {useState} from 'react';
import api from '../services/api';

function RSVPForm({ eventId }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [confirmed, setConfirmed] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await api.post('/rsvps/', {
                name,
                email,
                message,
                event: eventId,
                confirmed
        });
        alert('RSVP sumbitted successfully!');
        setName('');
        setEmail('');
        setMessage('');
        } catch(err){
            console.error(err);
            alert('Failed to submit RSVP');
            }
        };

    return (
        <form onSubmit={handleSubmit}>
            <h3>RSVP To This Event</h3>
            <input type = "text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required/>
            <input type = "email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required/>
            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message (optional)"/>
            <button type="submit">Submit RSVP</button>
        </form>
    );
}

export default RSVPForm;