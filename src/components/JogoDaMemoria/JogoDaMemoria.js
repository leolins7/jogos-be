import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Settings from './Settings';
import './JogoDaMemoria.css';
import { supabase } from '../../supabaseClient'; // Importe o Supabase

// Função para embaralhar as cartas (continua a mesma)
const shuffleCards = (cards) => {
    const shuffledCards = [...cards];
    for (let i = shuffledCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
    }
    return shuffledCards;
};

// Nova função para formatar os pares vindos do banco
const formatPairsToCards = (pairs) => {
    return pairs.flatMap((pair, index) => {
        const matchId = pair.id || index + 1;
        return [
            { id: (matchId * 2) - 1, matchId: matchId, text: pair.text, color: "var(--be-eventos-blue)" },
            { id: (matchId * 2), matchId: matchId, text: pair.text, color: "var(--be-eventos-yellow)" },
        ];
    });
};

const JogoDaMemoria = () => {
    const [cardContent, setCardContent] = useState([]);
    const [gridSize, setGridSize] = useState('4x4'); // Pode vir do Supabase no futuro

    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedCards, setMatchedCards] = useState([]);
    const [gameActive, setGameActive] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [loading, setLoading] = useState(true); // Estado de carregamento

    // useEffect para buscar os dados do Supabase
    useEffect(() => {
        const fetchCardPairs = async () => {
            setLoading(true);
            const { data: pairs, error } = await supabase
                .from('memory_card_pairs')
                .select('id, text');

            if (error) {
                console.error('Erro ao buscar pares de cartas:', error);
            } else {
                const formattedCards = formatPairsToCards(pairs);
                setCardContent(formattedCards);
                setCards(shuffleCards(formattedCards));
                setGameActive(true);
            }
            setLoading(false);
        };

        fetchCardPairs();
    }, []);

    // Lógica do jogo (continua a mesma)
    useEffect(() => {
        if (flippedCards.length === 2) {
            const [firstIndex, secondIndex] = flippedCards;
            if (cards[firstIndex].matchId === cards[secondIndex].matchId) {
                setMatchedCards([...matchedCards, cards[firstIndex].matchId]);
                setFlippedCards([]);
            } else {
                setTimeout(() => setFlippedCards([]), 1000);
            }
        }
    }, [flippedCards, cards, matchedCards]);

    useEffect(() => {
        if (cardContent.length > 0 && matchedCards.length === cardContent.length / 2) {
            setGameActive(false);
        }
    }, [matchedCards, cardContent]);

    const handleCardClick = (index) => {
        if (!gameActive || flippedCards.includes(index) || matchedCards.includes(cards[index].matchId)) {
            return;
        }
        setFlippedCards([...flippedCards, index]);
    };
    
    // ATENÇÃO: A lógica de salvar nas configurações precisará ser atualizada
    // para interagir com o Supabase. Faremos isso no próximo passo.
    const handleSaveSettings = (newContent, newGrid) => {
        // Por enquanto, vamos apenas atualizar o estado local
        const formattedCards = formatPairsToCards(newContent);
        setCardContent(formattedCards);
        setCards(shuffleCards(formattedCards));
        setGridSize(newGrid);
        setShowSettings(false);
        // Lógica para salvar no Supabase virá aqui
    };

    const gridColumns = gridSize.split('x')[0];
    const isSixBySix = gridSize === '6x6';

    if (loading) {
        return <div>Carregando jogo...</div>;
    }

    return (
        <div className="memory-game-container" style={{ maxWidth: '1500px' }}>
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
            <p className="prevention-footer">Vamos Juntos Compartilhar Prevenção</p>
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