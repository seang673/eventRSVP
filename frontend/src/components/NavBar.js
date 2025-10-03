import Reaact from 'react';
import {Link} from 'react-router-dom';

function Navbar() {
    return (
        <nav>
            <ul>
                <li><Link to="/" className="nav-link">Home</Link></li>
                <li><Link to="/dashboard" classNme="nav-link">Home</Link></li>
                <li><Link to="/login" className="nav-link">Login</Link></li>
                <li><Link to="/register" className="nav-link">Register</Link></li>
            </ul>
        </nav>
    );
}
export default Navbar;