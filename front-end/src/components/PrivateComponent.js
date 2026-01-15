import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getUser } from '../utils/api';

const PrivateComponent = () => {
    const auth = getUser();
    return auth ? <Outlet/> : <Navigate to="signup"/>
}

export default PrivateComponent;