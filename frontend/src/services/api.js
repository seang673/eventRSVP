import axios from 'axios';

const token = localStorage.getItem('token');

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

export default api;