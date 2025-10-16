import React, 'useState', useEffect } from 'react';
import { Link } from 'react-router-dom';
import Settings from './Settings';
import './JogoDaMemoria.css';
import { supabase } from '../../supabaseClient';
// 1. Importe as funções do nosso novo arquivo de banco de dados
import { getDataFromDB, saveDataToDB } from '../../utils/db';

// ... (as funções shuffleCards e formatPairsToCards não mudam)
const shuffleCards = (cards) => {
    const shuffledCards = [...cards];
    for (let i = shuffledCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
    }
    return shuffledCards;
};

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
    // ... (os estados continuam os mesmos)
    const [cardContent, setCardContent] = useState([]);
    const [gridSize, setGridSize] = useState('4x4');
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedCards, setMatchedCards] = useState([]);
    const [gameActive, setGameActive] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [loading, setLoading] = useState(true);

    // 2. Lógica de busca de dados ATUALIZADA com cache
    useEffect(() => {
        const fetchCardPairs = async () => {
            setLoading(true);
            try {
                // Tenta buscar os dados online do Supabase
                const { data: pairs, error } = await supabase
                    .from('memory_card_pairs')
                    .select('id, text');

                if (error) throw error; // Se houver erro de rede, ele pula para o catch

                console.log("Jogo da Memória: Dados buscados do Supabase (Online)");
                const formattedCards = formatPairsToCards(pairs);
                setCardContent(formattedCards);
                setCards(shuffleCards(formattedCards));
                
                // Salva os dados mais recentes no banco local para uso offline
                await saveDataToDB('memory_card_pairs', pairs);

            } catch (error) {
                // Se a busca online falhar (estamos offline), busca do cache local
                console.warn("Jogo da Memória: Falha na rede. Buscando do cache local (IndexedDB)...");
                const cachedPairs = await getDataFromDB('memory_card_pairs');

                if (cachedPairs && cachedPairs.length > 0) {
                    console.log("Jogo da Memória: Dados carregados do cache local!");
                    const formattedCards = formatPairsToCards(cachedPairs);
                    setCardContent(formattedCards);
                    setCards(shuffleCards(formattedCards));
                } else {
                    console.error("Não foi possível carregar os dados do Jogo da Memória. Sem conexão e sem cache.");
                }
            } finally {
                setGameActive(true);
                setLoading(false);
            }
        };

        fetchCardPairs();
    }, []);

    // ... (o restante da lógica do jogo não muda)
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
    
    // 3. ATUALIZAÇÃO: Ao salvar as configurações, também atualizamos o cache local
    const handleSaveSettings = async (newPairs, newGrid) => {
        const formattedCards = formatPairsToCards(newPairs);
        setCardContent(formattedCards);
        setCards(shuffleCards(formattedCards));
        setGridSize(newGrid);
        setShowSettings(false);
        
        // Garante que o cache local tenha os dados mais recentes após a edição
        await saveDataToDB('memory_card_pairs', newPairs);
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