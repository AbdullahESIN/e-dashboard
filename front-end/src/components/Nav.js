import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, logout } from '../utils/api';
import { useTheme } from '../contexts/ThemeContext';

const Nav = () => {
    const auth = getUser();
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();
    const handleLogout = () => {
        logout();
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
                        <li><Link to="/">Dashboard</Link></li>
                        <li><Link to="/products">Ürünler</Link></li>
                        <li><Link to="/add">Ürün Ekle</Link></li>
                        <li><Link to="/categories">Kategoriler</Link></li>
                        <li><Link to="/profile">Profil</Link></li>
                        <li>
                            <button onClick={toggleTheme} style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                color: 'white',
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '1.2rem'
                            }}>
                                {isDark ? '☀️' : '🌙'}
                            </button>
                        </li>
                        <li> <Link onClick={handleLogout} to="/signup">Çıkış ({auth?.name})</Link></li>
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