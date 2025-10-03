import React, {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import axios from 'axios';  //API Calls
import '../styles/authen.css'



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
            localStorage.setItem('is_organizer', res.data.is_organizer);
            alert(`Login is successful, welcome back ${username}!`)
            navigate('/dashboard');
        } catch (error) {
            alert("Login failed: " + (error.response?.data?.detail || 'Unknown error'));
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder = "Username" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
            <button type="submit">Log In</button>
            <p>Don't have an account? <Link to="/register">Register Here</Link></p>
        </form>
    );
}

export default LoginForm;
