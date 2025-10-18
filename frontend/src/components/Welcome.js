import React from 'react';
import { useNavigate} from 'react-router-dom';
import '../styles/authen.css';

const Welcome = () => {
    const navigate = useNavigate();
    return (
        <div className="welcome-screen">
            <div className="contents">
                <h2>Welcome to the Sean Griffiths' RSVP App</h2>
                <h3>The ultimate place to secure your spot to your favorite events</h3>
                <button onClick={() => navigate('/register')} className="btn-class">Register</button>
                <button onClick={() => navigate('/login')} className="btn-class">Log-In</button>
            </div>

        </div>
    )
}

export default Welcome;