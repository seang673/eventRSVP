import React, {useState} from 'react';
import api from '.../services/api';

function RSVPForm({ eventId }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.post('/rsvps/', {
            name,
            email,
            message,
            event: eventId,
            confirmed: true
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Name"/>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"/>
            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message"/>
            <button type="submit">RSVP</button>
        </form>
    );
}

export default RSVPForm;