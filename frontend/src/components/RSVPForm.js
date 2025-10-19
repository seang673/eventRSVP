import React, {useState} from 'react';
import api from '../services/api';
import {useLocation, useNavigate} from 'react-router-dom';
import '../styles/createForms.css';

function RSVPForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('')

    const location = useLocation();
    const selectedEvent = location.state?.event;

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedEvent.rsvp_count >= selectedEvent.capacity){
            setError("This event is full. You cannot RSVP")
            return;
        }
        try{
            const token = localStorage.getItem('token');
            const res = await api.post('/rsvps/', {
                name,
                email,
                message,
                event: selectedEvent.id,
            }, {
            headers: {
                Authorization: `Bearer ${token}`},
            });
            if (res.status === 201){
                alert('RSVP submitted successfully!'); // ✅ popup
                navigate('/events') //Navigate to RSVP Dashboard

            }
        } catch(err){
            console.error(err);
            alert('Failed to submit RSVP. Please Try Again');
            }
        };

    return (
        <div className="form-container">
            <div className="formHeader">
                <button className="back-button" onClick={() => navigate(-1)}><b>🔙Back</b></button>
                <h2>RSVP for {selectedEvent.title}</h2>
            </div>
            <div className="formBody">
                <form onSubmit={handleSubmit}>
                    {error && <p className="error">{error}</p>}
                    <input type = "text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter Name" required/>
                    <input type = "email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter Email" required/>
                    <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message (optional)"/>
                    <button type="submit">Submit RSVP</button>
                </form>
            </div>
        </div>

    );
};

export default RSVPForm;