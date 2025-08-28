import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Nav = () => {
    const auth = localStorage.getItem('user');
    const navigate = useNavigate();
    const logout = () => {
        localStorage.clear();
        navigate('/signup');
    }
    return (
        <div>
            <img
            alt = 'logo'
            className = 'logo'
             src= 'https://images-platform.99static.com//mXkmL-Ejr5KTFCKwU6oc0CIKj6I=/256x2289:756x2789/fit-in/500x500/99designs-contests-attachments/70/70438/attachment_70438547'/>
            {
                auth ?

                    <ul className="nav-ul">
                        <li><Link to="/">Products</Link></li>
                        <li><Link to="/add">Add Products</Link></li>
                        <li><Link to="/update">Update Products</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                        <li> <Link onClick={logout} to="/signup">Logout ({JSON.parse(auth).name})</Link></li> :
                    </ul>
                    : <ul className="nav-ul nav-right">
                        <li><Link to="/login">Login</Link></li>
                        <li> <Link to="/signup"> Sign Up</Link> </li>
                    </ul>
            }

        </div>
    )
}

export default Nav;