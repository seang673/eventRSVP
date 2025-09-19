import React, {useEffect, useState} from 'react';
import api from '../services/api';

function RSVPDashboard() {
    const [rsvps, setRsvps] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRsvps = async () => {
        try{
            const res = await api.get('/rsvps');
            setRsvps(res.data);
        } catch (err) {
            console.error('Failed to fetch RSVPs:', err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchRsvps();
    }, []);

    if (loading) return <p>Loading the RSVPs...</p>

    return (
        <div>
            <h2>RSVP Dashboard</h2>
            //RSVP Table
            <table>
                <thead>
                    <tr>
                        <th>Event</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Message</th>
                        <th>Confirmed</th>
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
                            <td>{rsvp.confimred ? '✅' : '❌'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default RSVPDashboard;