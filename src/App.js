import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home'; // Novo componente
import GameHub from './components/GameHub/GameHub';
import JogoDaMemoria from './components/JogoDaMemoria/JogoDaMemoria';
import JogoDoPerfil from './components/JogoDoPerfil/JogoDoPerfil';
import JogoDoAcerteOuSaia from './components/JogoDoAcerteOuSaia/JogoDoAcerteOuSaia';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games-hub" element={<GameHub />} />
          <Route path="/jogo-do-perfil" element={<JogoDoPerfil />} />
          <Route path="/jogo-da-memoria" element={<JogoDaMemoria />} />
          <Route path="/acerte-ou-saia" element={<JogoDoAcerteOuSaia />} />
          {/* Rota para o próximo jogo, dos 7 erros */}
          <Route path="/sete-erros" element={<h1>Jogo dos 7 Erros em construção!</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;