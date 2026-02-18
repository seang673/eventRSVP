import React, {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import axios from 'axios';
import '../styles/authen.css';


const RegisterForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        organizer: false,
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };


    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const response = await axios.post('http://localhost:8080/api/auth/register', formData);
            if (response.status === 201) {
                console.log("Submiting:", formData);
                alert('Registration Successful');
                navigate('/login');
            }
        } catch (error) {
            alert('Registration failed: ' + error.response?.data || 'Unknown error');
        }
    };

    return (
        <div className= "auth-screen">
            <button className="back-btn" onClick={() => navigate('/')}><b>🔙Back</b></button>
            <div className="contents">
                <form onSubmit = {handleSubmit}>
                    <h2>Register</h2>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" name="email" value={formData.email} placeholder="Email" onChange={handleChange} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input type="text" id="username" name="username" value={formData.username} placeholder="Username" onChange={handleChange} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" name="password" value={formData.password} placeholder="Password" onChange={handleChange} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="isOrganizer">
                            <input type="checkbox" id="isOrganizer" name="organizer" checked={formData.organizer} onChange={handleChange}/>
                                Event Organizer?
                        </label>
                    </div>

                    <div className="submit-section">
                        <button className="submit-btn" type="submit">Register</button>
                    </div>


                        <p>{message}</p>
                        <p>Already have an account? <Link to="/login" style={{fontWeight: 'bold', color:'#93ced9ff'}}>Log In</Link></p>
                </form>
            </div>
        </div>

    );
};

export default RegisterForm;