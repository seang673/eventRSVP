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
            const res = await axios.post('http://127.0.0.1:8000/login/', {
                username,
                password
            });
            console.log("Login Response:", res.data)
            const{access,  refresh, user} = res.data;

            if (!access || !user || !refresh) {
                throw new Error("Malformed response");
            }

            localStorage.setItem('token', access);
            localStorage.setItem('refresh', refresh);
            localStorage.setItem('username', user.username);
            localStorage.setItem('email', user.email);
            localStorage.setItem('is_organizer', user.is_organizer);

            alert(`Login is successful, welcome back ${user.username}!`)
            navigate('/dashboard');
        } catch (error) {
            console.error("Login error:", error.response || error);
            alert("Login failed: " + (error.response?.data?.error || error.message || 'Unknown error'));
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
