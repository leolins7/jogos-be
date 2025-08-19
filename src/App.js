import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import GameHub from './components/GameHub/GameHub';
import JogoDaMemoria from './components/JogoDaMemoria/JogoDaMemoria';
import JogoDoPerfil from './components/JogoDoPerfil/JogoDoPerfil';
import JogoDoAcerteOuSaia from './components/JogoDoAcerteOuSaia/JogoDoAcerteOuSaia';
import Login from './components/Login/Login'; // Importando o novo componente de Login
import JogoDaRoleta from './components/JogoDaRoleta/JogoDaRoleta';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} /> {/* Rota principal agora é a de Login */}
          <Route path="/home" element={<Home />} />
          <Route path="/games-hub" element={<GameHub />} />
          <Route path="/jogo-do-perfil" element={<JogoDoPerfil />} />
          <Route path="/jogo-da-memoria" element={<JogoDaMemoria />} />
          <Route path="/acerte-ou-saia" element={<JogoDoAcerteOuSaia />} />
          <Route path="/jogo-da-roleta" element={<JogoDaRoleta />} />
          <Route path="/sete-erros" element={<h1>Jogo dos 7 Erros em construção!</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;