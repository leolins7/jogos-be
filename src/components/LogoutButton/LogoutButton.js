import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LogoutButton.css';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        navigate('/login');
    };

    return (
        <button onClick={handleLogout} className="logout-button">
            Sair
        </button>
    );
};

export default LogoutButton;