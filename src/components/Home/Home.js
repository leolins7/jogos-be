import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import beLogo from '../assets/logo.png';
import GameSettingsModal from '../GameSettingsModal/GameSettingsModal';
import './Home.css';

const Home = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="home-container">
      <div className="home-content">
        <img src={beLogo} alt="Be Eventos Logo" className="logo-image" />
        <h1 className="main-title">Seja Bem-Vindo!</h1>
        <p className="subtitle">Selecione um jogo para começar.</p>
        <Link to="/games-hub" className="start-button">
          Iniciar Jogo
        </Link>
        <button className="settings-button-home" onClick={() => setShowModal(true)}>
          <span className="settings-icon"></span>
        </button>
      </div>
      {showModal && <GameSettingsModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Home;