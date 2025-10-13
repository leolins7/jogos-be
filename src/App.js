import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home/Home';
import GameHub from './components/GameHub/GameHub';
import JogoDaMemoria from './components/JogoDaMemoria/JogoDaMemoria';
import JogoDoPerfil from './components/JogoDoPerfil/JogoDoPerfil';
import JogoDoAcerteOuSaia from './components/JogoDoAcerteOuSaia/JogoDoAcerteOuSaia';
import Login from './components/Login/Login';
import JogoDaRoleta from './components/JogoDaRoleta/JogoDaRoleta';

import './App.css';

// Componente que verifica se o usuário está logado
const ProtectedRoute = ({ children }) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/games-hub" element={<ProtectedRoute><GameHub /></ProtectedRoute>} />
          <Route path="/jogo-da-memoria" element={<ProtectedRoute><JogoDaMemoria /></ProtectedRoute>} />
          <Route path="/acerte-ou-saia" element={<ProtectedRoute><JogoDoAcerteOuSaia /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;