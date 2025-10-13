import React from 'react';
import { Link } from 'react-router-dom';
import beLogo from '../assets/logo.png'; 
import LogoutButton from '../LogoutButton/LogoutButton';
import './GameHub.css';

const GameHub = () => {
  return (
    <div className="game-hub-container">
      <Link to="/home" className="home-button"></Link>
      <LogoutButton />
      <img src={beLogo} alt="Be Eventos Logo" className="hub-logo" />
      <h1 className="hub-title">Central de Jogos</h1>
      <p className="hub-subtitle">Selecione um jogo para começar:</p>
      <div className="games-list">
        <Link to="/jogo-da-memoria" className="game-card">
          Jogo da Memória
        </Link>
        <Link to="/acerte-ou-saia" className="game-card">
          Acerte ou Saia
        </Link>
      </div>
    </div>
  );
};

export default GameHub;