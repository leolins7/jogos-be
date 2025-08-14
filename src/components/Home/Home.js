import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import beLogo from '../assets/logo.png';
import GameSettingsModal from '../GameSettingsModal/GameSettingsModal';
import './Home.css';

const Home = () => {
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleStartGame = () => {
        const savedGame = localStorage.getItem('selectedGame');
        if (savedGame) {
            navigate(savedGame);
        } else {
            alert('Por favor, selecione um jogo nas configurações antes de iniciar.');
        }
    };

    return (
        <div className="home-container">
            <Link to="/games-hub" className="hub-button">Central</Link>
            <button className="settings-button" onClick={() => setIsSettingsModalOpen(true)}></button>

            <div className="home-content">
                <img src={beLogo} alt="Be Eventos Logo" className="home-logo" />
                <button className="start-game-button" onClick={handleStartGame}>Iniciar Jogo</button>
            </div>

            {isSettingsModalOpen && <GameSettingsModal onClose={() => setIsSettingsModalOpen(false)} />}
        </div>
    );
};

export default Home;