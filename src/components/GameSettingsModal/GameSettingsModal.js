import React, { useState, useEffect } from 'react';
import './GameSettingsModal.css';

const GameSettingsModal = ({ onClose }) => {
    const [selectedGame, setSelectedGame] = useState('');

    useEffect(() => {
        const savedGame = localStorage.getItem('selectedGame');
        if (savedGame) {
            setSelectedGame(savedGame);
        } else {
            // Define um jogo padrão se não houver um salvo
            setSelectedGame('/jogo-do-perfil');
        }
    }, []);

    const handleSave = () => {
        if (selectedGame) {
            localStorage.setItem('selectedGame', selectedGame);
            onClose();
        } else {
            alert('Por favor, selecione um jogo.');
        }
    };

    return (
        <div className="settings-overlay">
            <div className="settings-modal">
                <h2>Configurações de Jogo</h2>
                <div className="game-selection">
                    <h3>Selecione o Jogo:</h3>
                    <select value={selectedGame} onChange={(e) => setSelectedGame(e.target.value)}>
                        <option value="/jogo-do-perfil">Jogo do Perfil</option>
                        <option value="/jogo-da-memoria">Jogo da Memória</option>
                        <option value="/acerte-ou-saia">Acerte ou Saia</option>
                        <option value="/sete-erros" disabled>07 Sete Erros (em breve)</option>
                    </select>
                </div>
                <div className="modal-actions">
                    <button className="save-button-modal" onClick={handleSave}>Salvar Jogo</button>
                    <button className="cancel-button-modal" onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default GameSettingsModal;