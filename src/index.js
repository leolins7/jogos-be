// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// Certifique-se de que a importação existe
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Se você quer que seu app funcione offline e carregue mais rápido,
// mude unregister() para register() abaixo.
// Saiba mais sobre service workers: https://cra.link/PWA
serviceWorkerRegistration.register(); // AQUI ESTÁ A MUDANÇA!

reportWebVitals();