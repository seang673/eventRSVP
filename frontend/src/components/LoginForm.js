import React, {useState} from 'react';
import axios from 'axios';  //API Calls

function LoginForm({ setToken }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await axios.post('http://127.0.0.1:8000/api/token/', {
            username,
            password
        });
        setToken(res.data.access);
        localStorage.setItem('token', res.data.access);
    };

    return (
        <form onSubmit={handleLogin}>
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder = "Username" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
            <button type="submit">Login</button>
        </form>
    );
}

export default LoginForm;
