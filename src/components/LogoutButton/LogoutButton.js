// src/components/LogoutButton/LogoutButton.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LogoutButton.css';
import { supabase } from '../../supabaseClient'; // 1. Importe o Supabase

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        // 2. Peça ao Supabase para encerrar a sessão
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            console.error('Erro ao fazer logout:', error);
        }

        // 3. Limpe seu indicador local e redirecione
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