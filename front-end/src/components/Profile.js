import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getUser } from '../utils/api';

const Profile = () => {
    const navigate = useNavigate();
    const user = getUser();

    const handleLogout = () => {
        logout();
        navigate('/signup');
    }

    return (
        <div className='profile'>
            <h1>👤 Profilim</h1>
            <div className='profile-info'>
                <p><strong>İsim:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
            </div>
            <button className='appButton' onClick={handleLogout}>Çıkış Yap</button>
        </div>
    )
}

export default Profile;
