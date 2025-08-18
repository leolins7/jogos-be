import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import beLogo from '../assets/logo.png';
import Settings from './Settings';
import './JogoDaRoleta.css';

const DEFAULT_ITEMS = [
    { text: "Item 1", color: "var(--be-eventos-blue)" },
    { text: "Item 2", color: "var(--be-eventos-yellow)" },
    { text: "Item 3", color: "var(--be-eventos-red)" },
    { text: "Item 4", color: "var(--be-eventos-green)" },
    { text: "Item 5", color: "var(--be-eventos-blue)" },
    { text: "Item 6", color: "var(--be-eventos-yellow)" },
    { text: "Item 7", color: "var(--be-eventos-red)" },
    { text: "Item 8", color: "var(--be-eventos-green)" },
    { text: "Item 9", color: "var(--be-eventos-blue)" },
    { text: "Item 10", color: "var(--be-eventos-yellow)" },
    { text: "Item 11", color: "var(--be-eventos-red)" }
];

const JogoDaRoleta = () => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const [items, setItems] = useState(() => {
        const savedItems = localStorage.getItem('rouletteItems');
        try {
            const parsedItems = savedItems ? JSON.parse(savedItems) : DEFAULT_ITEMS;
            const finalItems = parsedItems.slice(0, 11);
            while (finalItems.length < 11) {
                const index = finalItems.length;
                const color = index % 4 === 0 ? "var(--be-eventos-blue)" : index % 4 === 1 ? "var(--be-eventos-yellow)" : index % 4 === 2 ? "var(--be-eventos-red)" : "var(--be-eventos-green)";
                finalItems.push({ text: `Item ${index + 1}`, color });
            }
            return finalItems;
        } catch (e) {
            console.error("Failed to parse roulette items from localStorage", e);
            return DEFAULT_ITEMS;
        }
    });
    const [showSettings, setShowSettings] = useState(false);
    const rouletteRef = useRef(null);
    const degreesPerItem = 360 / items.length;

    const spin = () => {
        if (isSpinning) return;
        setIsSpinning(true);
        setResult(null);

        // Resetar a transição e a rotação antes de iniciar um novo giro
        rouletteRef.current.style.transition = 'none';
        rouletteRef.current.style.transform = `rotate(0deg)`;

        // Força o navegador a recalcular o layout antes da nova transição
        void rouletteRef.current.offsetHeight;

        const randomIndex = Math.floor(Math.random() * items.length);
        const totalSpins = 5 * 360; // 5 giros completos
        const finalDegree = totalSpins + (360 - (degreesPerItem * randomIndex) - (degreesPerItem / 2));
        
        rouletteRef.current.style.transition = 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1.0)';
        rouletteRef.current.style.transform = `rotate(${finalDegree}deg)`;

        setTimeout(() => {
            setIsSpinning(false);
            setResult(items[randomIndex].text);
            // Manter a roleta no ângulo final, mas sem a transição
            rouletteRef.current.style.transition = 'none'; 
            const finalAngle = finalDegree % 360;
            rouletteRef.current.style.transform = `rotate(${finalAngle}deg)`;
        }, 5000); // 5 segundos, o mesmo tempo da transição
    };

    const handleSaveItems = (updatedItems) => {
        const reColoredItems = updatedItems.map((item, i) => ({
            ...item,
            color: i % 4 === 0 ? "var(--be-eventos-blue)" : i % 4 === 1 ? "var(--be-eventos-yellow)" : i % 4 === 2 ? "var(--be-eventos-red)" : "var(--be-eventos-green)"
        }));
        setItems(reColoredItems);
        localStorage.setItem('rouletteItems', JSON.stringify(reColoredItems));
        setShowSettings(false);
    };

    const segments = useMemo(() => {
        const degreesPerItem = 360 / items.length;
        const itemSkew = 90 - degreesPerItem;
        const textRotate = degreesPerItem / 2;

        return items.map((item, index) => {
            const rotateDeg = index * degreesPerItem;
            return (
                <div 
                    key={index} 
                    className="roulette-segment"
                    style={{
                        backgroundColor: item.color,
                        transform: `rotate(${rotateDeg}deg) skewY(${itemSkew}deg)`,
                    }}
                >
                    <div 
                        className="segment-content"
                        style={{ 
                            transform: `skewY(-${itemSkew}deg) rotate(${textRotate}deg)`,
                        }}
                    >
                        <span>{item.text}</span>
                    </div>
                </div>
            );
        });
    }, [items]);

    return (
        <div className="game-container">
            <Link to="/" className="home-button"></Link>
            <button className="settings-button" onClick={() => setShowSettings(true)}></button>
            <img src={beLogo} alt="Be Eventos Logo" className="be-logo" />

            <h1 className="game-title">Jogo da Roleta</h1>

            <div className="roulette-wrapper">
                <div className="roulette" ref={rouletteRef}>
                    {segments}
                </div>
                <div className="roulette-center">
                    <img src={beLogo} alt="Be Eventos Logo" className="center-logo" />
                </div>
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