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
    const rouletteWheelRef = useRef(null);

    useEffect(() => {
        try {
            const savedItems = localStorage.getItem('rouletteItems');
            const parsedItems = savedItems ? JSON.parse(savedItems) : DEFAULT_ITEMS;
            setItems(parsedItems);
        } catch (e) {
            console.error("Failed to parse roulette items from localStorage", e);
            setItems(DEFAULT_ITEMS);
        }
    }, []);

    const spin = () => {
        if (isSpinning || items.length === 0) return;

        const totalSpins = 5;
        const randomAngle = Math.random() * 360;
        const newRotation = rotation + (360 * totalSpins) + randomAngle;

        const degreesPerItem = 360 / items.length;

        // Ponteiro no topo (12h = 270°) e 0° do conic-gradient na direita
        const finalAngle = (360 - (newRotation % 360) + 270) % 360;
        const winningIndex = Math.floor(finalAngle / degreesPerItem);

        // snapshot para não mudar se o usuário editar itens durante o giro
        const chosenText = items[winningIndex].text;

        setIsSpinning(true);
        setResult(null);
        setRotation(newRotation);

        setTimeout(() => {
            setIsSpinning(false);
            setResult(chosenText);
        }, 5000);
    };

    const handleSaveItems = (updatedItems) => {
        setItems(updatedItems);
        localStorage.setItem('rouletteItems', JSON.stringify(updatedItems));
        setShowSettings(false);

        if (rouletteWheelRef.current) {
            rouletteWheelRef.current.style.transition = 'none';
            setRotation(0);
            setTimeout(() => {
                if (rouletteWheelRef.current) {
                    rouletteWheelRef.current.style.transition = 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)';
                }
            }, 50);
        }
        setResult(null);
    };

    const generateConicGradient = () => {
        if (items.length === 0) return 'transparent';
        const degreePerItem = 360 / items.length;
        const colors = ["var(--be-eventos-blue)", "var(--be-eventos-yellow)", "var(--be-eventos-red)", "var(--be-eventos-green)"];
        const gradientColors = items.map((_, index) => {
            const color = colors[index % colors.length];
            return `${color} ${index * degreePerItem}deg ${(index + 1) * degreePerItem}deg`;
        });
        return `conic-gradient(${gradientColors.join(', ')})`;
    };

    const degreesPerItem = 360 / items.length;

    return (
        <div className="game-container">
            <Link to="/" className="home-button"></Link>
            <button className="settings-button" onClick={() => setShowSettings(true)}></button>
            <img src={beLogo} alt="Be Eventos Logo" className="be-logo" />

            <h1 className="game-title">Jogo da Roleta</h1>

            <div className="roulette-wrapper">
                <div className="roulette-pointer"></div>
                
                <div
                    ref={rouletteWheelRef}
                    className="roulette-spinner"
                    style={{ transform: `rotate(${rotation}deg)` }}
                >
                    <div className="roulette-wheel" style={{ background: generateConicGradient() }}>
                        <ul className="roulette-labels">
                            {items.map((item, index) => {
                                const angle = index * degreesPerItem + degreesPerItem / 2;
                                return (
                                    <li
                                        key={index}
                                        className="roulette-label"
                                        style={{ transform: `rotate(${angle}deg)` }}
                                    >
                                        <span className="item-text" style={{ transform: `rotate(-${angle}deg)` }}>
                                            {item.text}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                <div className="roulette-center">
                    <img src={beLogo} alt="Be Eventos Logo" className="center-logo" />
                </div>
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
