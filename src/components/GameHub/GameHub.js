import React from 'react';
import { Link } from 'react-router-dom';
import beLogo from '../assets/logo.png';
import LogoutButton from '../LogoutButton/LogoutButton';
import './GameHub.css';

const GameHub = () => {
    return (
        <div className="games-container">
            <Link to="/home" className="home-button"></Link>
            <LogoutButton />
            <img src={beLogo} alt="Be Eventos Logo" className="be-logo" />
            <h1 className="games-title">Central de Jogos</h1>
            <p className="games-subtitle">Selecione um jogo para começar:</p>
            <div className="game-list">
                <div className="game-card">
                    <Link to="/jogo-do-perfil">Jogo do Perfil</Link>
                </div>
                <div className="game-card">
                    <Link to="/jogo-da-memoria">Jogo da Memória</Link>
                </div>
                <div className="game-card">
                    <Link to="/acerte-ou-saia">Acerte ou Saia</Link>
                </div>
                <div className="game-card">
                    <Link to="/jogo-da-roleta">Roleta</Link>
                </div>
            </div>
        </div>
    );
};

export default GameHub;