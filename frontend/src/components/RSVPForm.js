import React, {useState, useEffect} from 'react';
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

    useEffect(() => {
        console.log("RSVPForm mounted");
        return () => console.log("RSVPForm unmounted");
    }, []);

    if (!selectedEvent) {
        return (
        <div className="form-Container">
            <p>Loading event details...</p>
        </div>
        );
    }
    console.log("Selected event:", selectedEvent);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !selectedEvent ||
            selectedEvent.rsvpCount == null ||
            selectedEvent.capacity == null
        ) {
            setError("Event data not loaded yet. Please wait.");
            return;
        }


        if (selectedEvent.rsvpCount >= selectedEvent.capacity) {
            setError("This event is full. You cannot RSVP");
            return;
        }

        try{
            const token = localStorage.getItem('token');
            console.log("Submitting RSVP with data:", { name, email, message, eventId: selectedEvent.id });
            const res = await api.post('/rsvp', {
                name,
                email,
                message,
                eventId: selectedEvent.id,
            }, {
            headers: {
                Authorization: `Bearer ${token}`},
            });
            if (res.status === 201){
                console.log("RSVP submitted with:", res.data);
                alert('RSVP submitted successfully!'); // ✅ popup
                navigate('/events') //Navigate to RSVP Dashboard
            }
        } catch(err){
            console.error(err);
            alert('Failed to submit RSVP. Please Try Again');
            }
        };

    return (
        <div className="form-Container">
            <button type="button" className="back-btn" onClick={() => navigate(-1)}><b>🔙Back</b></button>

            <div className="formBody">
                <h2>RSVP for {selectedEvent.title}</h2>
                <form onSubmit={handleSubmit}>
                    {error && <p className="error">{error}</p>}
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input className="rsvp-input" type = "text" id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Enter Name" required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input className="rsvp-input" type = "email" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter Email" required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message:</label>
                        <textarea className="rsvp-input" value={message} id="message" onChange={e => setMessage(e.target.value)} placeholder="Message (optional)"/>
                    </div>
                    <button className="rsvp-submit-btn" type="submit">Submit RSVP</button>
                </form>
            </div>
        </div>

    );
};

export default RSVPForm;