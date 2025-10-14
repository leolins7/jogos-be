// src/components/Login/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import beLogo from '../assets/logo.png';
import './Login.css';
import { supabase } from '../../supabaseClient'; // Importe o cliente Supabase

const Login = () => {
    const [email, setEmail] = useState(''); // Usaremos email para o login
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Use a função de login do Supabase
            const { error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                throw error;
            }

            // Se o login for bem-sucedido, o Supabase gerencia a sessão.
            localStorage.setItem('isLoggedIn', 'true');
            navigate('/home');

        } catch (err) {
            setError(err.message || 'Usuário ou senha inválidos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <img src={beLogo} alt="Be Eventos Logo" className="login-logo" />
                <h1 className="login-title">Acesso Restrito</h1>
                <form onSubmit={handleSubmit} className="login-form">
                    {error && <p className="error-message">{error}</p>}
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Senha</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;