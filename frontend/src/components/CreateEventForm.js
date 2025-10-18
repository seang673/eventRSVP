import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import '../styles/createForms.css';

const CreateEventForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [capacity, setCapacity] = useState('');
    const [location, setLocation] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value} = e.target;
        switch (name) {
            case 'title':
                setTitle(value);
                break;
            case 'description':
                setDescription(value);
                break;
            case 'date':
                setDate(value);
                break;
            case 'capacity':
                setCapacity(value);
                break;
            case 'location':
                setLocation(value);
                break;
            default:
                break;
        }
    };
    const validateForm = () => {
            const newErrors = {};

            if (!title.trim()) newErrors.title = 'Title is required';
            if (!description.trim()) newErrors.description = 'Description is required';
            if (!location.trim()) newErrors.location = 'Location is required';
            if (!capacity || isNaN(capacity) || parseInt(capacity) <= 0){
                errors.capacity = "Capacity must be a positive number";
            }

            // Check for valid date
            if (!date) {
                newErrors.date = 'Date is required';
            } else if (new Date(date) < new Date()) {
                newErrors.date = 'Date must be in the future';
            }

            return newErrors;
        };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length >0){
            setErrors(validationErrors);
            return;
        }
        const token = localStorage.getItem('token');
        const payload= {title, date, location, capacity, description};

        try{
            const res = await axios.post('http://127.0.0.1:8000/events/', payload, {
                headers : {
                    Authorization: `Bearer ${token}`
                }
            });
            setMessage("Event created successfully!");
            setTimeout(() => navigate('/dashboard'), 2000);  //Navigate to dashboard after 2 seconds
        } catch(err) {
            const errorMsg = err.response?.data?.detail || 'Failed to create event';
            setMessage(errorMsg);
        }
    };

    return (
        <div className="formContainer">
            <button className="back-button" onClick={() => navigate(-1)}><b>🔙Back</b></button>

            <div className="formBody">
                <h2>Create A New Event</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="title" value={title} placeholder="Enter Title" onChange={handleChange} />
                    {errors.title && <p className="error">{errors.title}</p>}

                    <input type="text" name="description" value={description} placeholder="Enter Description" onChange={handleChange} />
                    {errors.description && <p className="error">{errors.description}</p>}

                    <input type="date" name="date" value={date} placeholder="Enter Date" onChange={handleChange} />
                    {errors.date && <p className="error">{errors.date}</p>}

                    <input type="number" name="capacity" value={capacity} placeholder="Enter Capacity" onChange={handleChange}/>
                    {errors.capacity && <p className="error">{errors.capacity}</p>}

                    <input type="text" name="location" value={location} placeholder="Enter Location" onChange={handleChange} />
                    {errors.location && <p className="error">{errors.location}</p>}

                    <button type="submit">Create Event</button>
                    <p>{message}</p>
                </form>
            </div>
        </div>
    );
};

export default CreateEventForm;