import React, {useState} from 'react';
import api from '../services/api';

function RSVPForm({ event }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [confirmed, setConfirmed] = useState(true);
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (event.rsvp_count >= event.capacity){
            setError("This event is full. You cannot RSVP")
            return;
        }
        try{
            const token = localStorage.getItem('token');
            const res = await api.post('/rsvps/', {
                name,
                email,
                message,
                event: event,
            }, {
            headers: {
                Authorization: `Bearer ${token}`},
            });
            if (res.status === 201){
                alert('RSVP submitted successfully!'); // ✅ popup
                navigate('/dashboard') //Navigate to RSVP Dashboard

            }
        } catch(err){
            console.error(err);
            alert('Failed to submit RSVP. Please Try Again');
            }
        };

    return (
        <form onSubmit={handleSubmit}>
            <h3>RSVP for {event.title}</h3>
            {error && <p className="error">{error}</p>}
            <input type = "text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter Name" required/>
            <input type = "email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter Email" required/>
            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message (optional)"/>
            <button type="submit">Submit RSVP</button>
        </form>
    );
};

export default RSVPForm;