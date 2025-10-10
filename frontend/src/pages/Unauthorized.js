import React from 'react';
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
    navigate = useNavigate();

    return (
        <div>
            <h2>Access Denied</h2>
            <p>You do not have permission to this page.</p>
            <button className='back-button' onClick={() => navigate(-1)}><b>🔙Back</b></button>
        </div>
    )

}



export default Unauthorized;