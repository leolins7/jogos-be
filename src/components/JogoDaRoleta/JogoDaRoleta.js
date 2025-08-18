import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import beLogo from '../assets/logo.png';
import Settings from './Settings';
import './JogoDaRoleta.css';

const DEFAULT_ITEMS = [
    { text: "Item 1" }, { text: "Item 2" }, { text: "Item 3" },
    { text: "Item 4" }, { text: "Item 5" }, { text: "Item 6" },
    { text: "Item 7" }, { text: "Item 8" }, { text: "Item 9" },
    { text: "Item 10" }, { text: "Item 11" }
];

const JogoDaRoleta = () => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const [items, setItems] = useState([]);
    const [showSettings, setShowSettings] = useState(false);
    const [rotation, setRotation] = useState(0);
    const canvasRef = useRef(null);

    const colors = ["#2d559a", "#f1b302", "#dc3545", "#28a745"];
    const degreesPerItem = 360 / items.length;

    useEffect(() => {
        try {
            const savedItems = localStorage.getItem('rouletteItems');
            const parsedItems = savedItems ? JSON.parse(savedItems) : DEFAULT_ITEMS;
            setItems(parsedItems.slice(0, 11)); // Garante no máximo 11 itens
        } catch (e) {
            console.error("Failed to parse roulette items from localStorage", e);
            setItems(DEFAULT_ITEMS);
        }
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.9;

        // Limpa o canvas antes de redesenhar
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Salva o estado atual do canvas e aplica a rotação
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.translate(-centerX, -centerY);

        // Desenha os segmentos
        for (let i = 0; i < items.length; i++) {
            const startAngle = (i * degreesPerItem) * Math.PI / 180;
            const endAngle = ((i + 1) * degreesPerItem) * Math.PI / 180;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = colors[i % colors.length];
            ctx.fill();

            // Desenha as bordas
            ctx.strokeStyle = '#ccc';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Desenha o texto
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + (degreesPerItem / 2) * Math.PI / 180);
            ctx.textAlign = 'right';
            ctx.fillStyle = 'white';
            ctx.font = 'bold 16px Arial';
            ctx.fillText(items[i].text, radius * 0.9, 5);
            ctx.restore();
        }

        // Restaura o estado original do canvas
        ctx.restore();

        // Desenha o círculo central
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.25, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();

        // Desenha a logo no centro
        const img = new Image();
        img.src = beLogo;
        img.onload = () => {
            const logoSize = radius * 0.4;
            ctx.drawImage(img, centerX - logoSize / 2, centerY - logoSize / 2, logoSize, logoSize);
        };
        
        const logoSize = radius * 0.4;
        ctx.drawImage(img, centerX - logoSize / 2, centerY - logoSize / 2, logoSize, logoSize);
        
    }, [items, rotation]);

    const spin = () => {
        if (isSpinning || items.length === 0) return;
        setIsSpinning(true);
        setResult(null);

        const totalSpins = 5;
        const randomAngle = Math.random() * 360;
        const newRotation = rotation + (360 * totalSpins) + randomAngle;
        
        let start = Date.now();
        let duration = 5000;

        function animate() {
            let elapsed = Date.now() - start;
            let progress = Math.min(elapsed / duration, 1);
            let easedProgress = 1 - Math.pow(1 - progress, 3);
            let currentRotation = rotation + (newRotation - rotation) * easedProgress;
            setRotation(currentRotation);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setIsSpinning(false);
                const finalAngle = (360 - (newRotation % 360) + 270) % 360;
                const winningIndex = Math.floor(finalAngle / degreesPerItem);
                setResult(items[winningIndex].text);
            }
        }
        
        requestAnimationFrame(animate);
    };

    const handleSaveItems = (updatedItems) => {
        setItems(updatedItems);
        localStorage.setItem('rouletteItems', JSON.stringify(updatedItems));
        setShowSettings(false);
        setRotation(0);
        setResult(null);
    };

    return (
        <div className="game-container">
            <Link to="/" className="home-button"></Link>
            <button className="settings-button" onClick={() => setShowSettings(true)}></button>
            <img src={beLogo} alt="Be Eventos Logo" className="be-logo" />

            <h1 className="game-title">Jogo da Roleta</h1>

            <div className="roulette-wrapper">
                <canvas ref={canvasRef} width="500" height="500"></canvas>
                <div className="roulette-pointer"></div>
            </div>

            <div className="game-controls">
                <button
                    className="spin-button"
                    onClick={spin}
                    disabled={isSpinning}
                >
                    {isSpinning ? 'Girando...' : 'Girar Roleta'}
                </button>
            </div>

            {result && !isSpinning && (
                <div className="result-display">
                    <p>O resultado é: <strong>{result}</strong></p>
                </div>
            )}

            {showSettings && (
                <Settings
                    onSave={handleSaveItems}
                    initialItems={items}
                    onClose={() => setShowSettings(false)}
                />
            )}
        </div>
    );
};

export default JogoDaRoleta;