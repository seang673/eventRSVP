import React, {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import axios from 'axios';
import '../styles/authen.css';


const RegisterForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        is_organizer: false,
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,  //spreads existing state to not lose them
            //if input field is checkbox, then use 'checked', else use its value
            [name]: type === 'checkbox' ? checked : value,

        });
    };
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const response = await axios.post('http://127.0.0.1:8000/register/', formData);
            if (response.status === 201) {
                alert('Registration Successful');
                navigate('/login');
            }
        } catch (error) {
            alert('Registration failed: ' + error.response?.data?.detail || 'Unknown error');
        }
    };

    return (
        <form onSubmit = {handleSubmit}>
            <h2>Register</h2>
            <input type="text" name="username" placeholder="Username" onChange={handleChange} required/>
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required/>
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required/>
            <label>
                <input type="checkbox" name="is_organizer" onChange={handleChange} />
                Event Organizer?
            </label>
            <button type="submit">Register</button>
            <p>{message}</p>
            <p>Are you new here? <Link to="/login">Sign Up</Link></p>
        </form>
    );
};

export default RegisterForm;