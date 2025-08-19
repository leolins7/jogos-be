import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import beLogo from '../assets/logo.png';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.success) {
                // Armazena o status de login (em um projeto real, seria um token JWT)
                localStorage.setItem('isLoggedIn', 'true');
                navigate('/home');
            } else {
                setError('Usuário ou senha inválidos.');
            }
        } catch (err) {
            setError('Ocorreu um erro ao tentar fazer login. Tente novamente.');
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
                        <label htmlFor="username">Usuário</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                    <button type="submit" className="login-button">Entrar</button>
                </form>
            </div>
        </div>
    );
};

export default Login;