import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Settings from './Settings';
import './JogoDaMemoria.css';

const DEFAULT_CARD_CONTENT = [
    { id: 1, matchId: 1, text: "EPI", color: "var(--be-eventos-yellow)" },
    { id: 2, matchId: 1, text: "EPI", color: "var(--be-eventos-yellow)" },
    { id: 3, matchId: 2, text: "CIPA", color: "var(--be-eventos-blue)" },
    { id: 4, matchId: 2, text: "CIPA", color: "var(--be-eventos-blue)" },
    { id: 5, matchId: 3, text: "Riscos", color: "var(--be-eventos-yellow)" },
    { id: 6, matchId: 3, text: "Riscos", color: "var(--be-eventos-yellow)" },
    { id: 7, matchId: 4, text: "NR-10", color: "var(--be-eventos-blue)" },
    { id: 8, matchId: 4, text: "NR-10", color: "var(--be-eventos-blue)" },
];

const shuffleCards = (cards) => {
    const shuffledCards = [...cards];
    for (let i = shuffledCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
    }
    return shuffledCards;
};

const JogoDaMemoria = () => {
    const [cardContent, setCardContent] = useState(() => {
        const savedContent = localStorage.getItem('memoryGameCards');
        return savedContent ? JSON.parse(savedContent) : DEFAULT_CARD_CONTENT;
    });

    const [gridSize, setGridSize] = useState(() => {
        const savedGrid = localStorage.getItem('memoryGameGrid');
        return savedGrid ? savedGrid : '4x4';
    });
    
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedCards, setMatchedCards] = useState([]);
    const [gameActive, setGameActive] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        if (cardContent.length > 0) {
             setCards(shuffleCards(cardContent));
             setGameActive(true);
        }
    }, [cardContent]);

    useEffect(() => {
        if (flippedCards.length === 2) {
            const [firstIndex, secondIndex] = flippedCards;
            if (cards[firstIndex].matchId === cards[secondIndex].matchId) {
                setMatchedCards([...matchedCards, cards[firstIndex].matchId]);
                setFlippedCards([]);
            } else {
                setTimeout(() => {
                    setFlippedCards([]);
                }, 1000);
            }
        }
    }, [flippedCards, cards, matchedCards]);
    
    useEffect(() => {
        if (matchedCards.length > 0 && matchedCards.length === cardContent.length / 2) {
            setGameActive(false);
            // Removido o alertbox
        }
    }, [matchedCards, cardContent]);
    
    const handleCardClick = (index) => {
        if (!gameActive || flippedCards.includes(index) || matchedCards.includes(cards[index].matchId)) {
            return;
        }
        setFlippedCards([...flippedCards, index]);
    };

    const handleSaveSettings = (newContent, newGrid) => {
        setCardContent(newContent);
        setGridSize(newGrid);
        localStorage.setItem('memoryGameCards', JSON.stringify(newContent));
        localStorage.setItem('memoryGameGrid', newGrid);
        setShowSettings(false);
    };

    const gridColumns = gridSize.split('x')[0];
    const isSixBySix = gridSize === '6x6';

    return (
        <div className="memory-game-container">
            <Link to="/home" className="home-button"></Link>
            <button className="settings-button" onClick={() => setShowSettings(true)}></button>

            <h1 className="game-title">Jogo da Memória</h1>
            
            <div className={`memory-grid ${isSixBySix ? 'grid-6x6' : ''}`} style={{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }}>
                {cards.map((card, index) => (
                    <div 
                        key={index} 
                        className={`card ${flippedCards.includes(index) || matchedCards.includes(card.matchId) ? 'flipped' : ''}`}
                        onClick={() => handleCardClick(index)}
                    >
                        <div className="card-inner">
                            <div className="card-front" style={{ backgroundColor: card.color }}>
                                {card.text}
                            </div>
                            <div className="card-back">
                                <span className="card-back-logo">be</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showSettings && (
                <Settings 
                    onSave={handleSaveSettings}
                    initialCardContent={cardContent}
                    initialGridSize={gridSize}
                    onClose={() => setShowSettings(false)}
                />
            )}
        </div>
    );
};

export default JogoDaMemoria;