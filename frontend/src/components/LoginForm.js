import React, {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import axios from 'axios';  //API Calls
import '../styles/authen.css';



function LoginForm({ setToken }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            const res = await axios.post('http://127.0.0.1:8000/api/login/', {
                username,
                password
            });
            setToken(res.data.access);
            localStorage.setItem('token', res.data.access);
            localStorage.setItem('username', res.data.username);
            localStorage.setItem('is_organizer', res.data.is_organizer);
            alert(`Login is successful, welcome back ${username}!`)
            navigate('/dashboard');
        } catch (error) {
            alert("Login failed: " + (error.response?.data?.detail || 'Unknown error'));
        }
    };

    return (
        <div className = "auth-screen">
            <button class="back-btn">🔙Back</button>
            <div className="contents">
                <form onSubmit={handleLogin}>
                    <h2>Login</h2>
                    <div className="form-group">
                        <label htmlFor="username">Email:</label>
                        <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value)} placeholder = "Enter Username" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter Password" />
                    </div>

                    <div className="submit-section">
                        <button className="submit-btn" type="submit">Log In</button>
                    </div>

                    <p>Don't have an account? <Link to="/register">Register Here</Link></p>
                </form>
           </div>
        </div>

    );
}

export default LoginForm;
