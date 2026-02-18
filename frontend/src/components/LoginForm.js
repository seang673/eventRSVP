import React, {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import axios from 'axios';  //API Calls
import '../styles/authen.css';

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            const res = await axios.post('http://localhost:8080/api/auth/login', {
                username,
                password
            });

            const { token, username:returnedUsername, email, isOrganizer, id } = res.data;

            localStorage.setItem("token", token);
            localStorage.setItem("username", returnedUsername);
            localStorage.setItem("email", email);
            localStorage.setItem("is_organizer", isOrganizer);
            localStorage.setItem("user_id", id);

            alert(`Login is successful, welcome back!`)
            navigate('/dashboard');
        } catch (error) {
            console.error("Login error:", error.response || error);
            alert("Login failed: " + (error.response?.data || error.message || 'Unknown error'));
        }
    };

    return (
        <div className = "auth-screen">
            <button className="back-btn" onClick={() => navigate('/')}><b>🔙Back</b></button>
            <div className="contents">
                <form onSubmit={handleLogin}>
                    <h2>Login</h2>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value)} placeholder = "Username" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
                    </div>

                    <div className="submit-section">
                        <button className="submit-btn" type="submit">Log In</button>
                    </div>

                    <p>Don't have an account? <Link to="/register" style={{fontWeight: 'bold', color:'#93ced9ff'}}>Register Here</Link></p>
                </form>
           </div>
        </div>

    );
}

export default LoginForm;
