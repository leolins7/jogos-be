import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Settings from './Settings';
import './JogoDoAcerteOuSaia.css';
import beLogo from '../assets/logo.png';
import { supabase } from '../../supabaseClient';

const INITIAL_TIME = 30;
const BACKGROUND_COLORS = ['#2d559a', '#f1b302', '#28a745'];

const JogoDoAcerteOuSaia = () => {
    const [allPhrasesByTheme, setAllPhrasesByTheme] = useState({});
    const [themes, setThemes] = useState([]);
    const [loading, setLoading] = useState(true);

    const [themeToPlay, setThemeToPlay] = useState('');
    const [phrasesForCurrentGame, setPhrasesForCurrentGame] = useState([]);
    const [timer, setTimer] = useState(INITIAL_TIME);
    const [gameActive, setGameActive] = useState(false);
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [message, setMessage] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [showFullWord, setShowFullWord] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);

    const timerIntervalRef = useRef(null);
    const originalBodyColor = useRef(document.body.style.backgroundColor);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGameData = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('guess_or_leave_phrases')
                .select('id, theme, phrase, word');

            if (error) {
                console.error('Erro ao buscar frases:', error);
                setMessage('Não foi possível carregar os dados do jogo.');
            } else {
                const themesData = [...new Set(data.map(p => p.theme))].sort();
                const phrasesByTheme = data.reduce((acc, current) => {
                    acc[current.theme] = acc[current.theme] || [];
                    acc[current.theme].push(current);
                    return acc;
                }, {});

                setThemes(themesData);
                setAllPhrasesByTheme(phrasesByTheme);
            }
            setLoading(false);
        };

        fetchGameData();
    }, []);

    useEffect(() => {
        if (gameActive || gameEnded) {
            const colorIndex = currentPhraseIndex % BACKGROUND_COLORS.length;
            document.body.style.backgroundColor = BACKGROUND_COLORS[colorIndex];
        } else {
            document.body.style.backgroundColor = originalBodyColor.current;
        }
        
        return () => {
            document.body.style.backgroundColor = originalBodyColor.current;
        };
    }, [currentPhraseIndex, gameActive, gameEnded]);

    useEffect(() => {
        if (gameActive) {
            timerIntervalRef.current = setInterval(() => {
                setTimer(prevTimer => {
                    if (prevTimer <= 1) {
                        clearInterval(timerIntervalRef.current);
                        endGame("Tempo esgotado!");
                        return 0;
                    }
                    return prevTimer - 1;
                });
            }, 1000);
        } else {
            clearInterval(timerIntervalRef.current);
        }
        return () => clearInterval(timerIntervalRef.current);
    }, [gameActive]);

    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const handleSelectThemeToPlay = (theme) => {
        setThemeToPlay(theme);
        setGameEnded(false);
        const phrasesForTheme = allPhrasesByTheme[theme] || [];
        setPhrasesForCurrentGame(phrasesForTheme);
        setMessage(phrasesForTheme.length === 0 ? 'Este tema não possui frases. Adicione frases ou escolha outro tema.' : '');
        setShowSettings(false);
    };
    
    const startGame = () => {
        if (!themeToPlay || phrasesForCurrentGame.length === 0) {
            setMessage('Por favor, selecione um tema com frases nas configurações.');
            return;
        }
        setCurrentPhraseIndex(0);
        setShowFullWord(false);
        setGameEnded(false);
        setTimer(INITIAL_TIME);
        setGameActive(true);
    };

    const endGame = (msg = '') => {
        setGameActive(false);
        setShowFullWord(true);
        setMessage(msg);
    };

    const goToNextPhrase = () => {
        if (currentPhraseIndex < phrasesForCurrentGame.length - 1) {
            setCurrentPhraseIndex(prevIndex => prevIndex + 1);
            setTimer(INITIAL_TIME);
            setGameActive(true);
            setShowFullWord(false);
            setMessage('');
        } else {
            setGameActive(false);
            setGameEnded(true);
        }
    };
    
    const handleSaveSettings = (updatedPhrasesByTheme) => {
        setAllPhrasesByTheme(updatedPhrasesByTheme);
        const themesData = [...new Set(Object.values(updatedPhrasesByTheme).flat().map(p => p.theme))].sort();
        setThemes(themesData);
        if (themeToPlay) {
            setPhrasesForCurrentGame(updatedPhrasesByTheme[themeToPlay] || []);
        }
    };

    const currentPhrase = phrasesForCurrentGame[currentPhraseIndex];
    const isLastPhrase = currentPhraseIndex === phrasesForCurrentGame.length - 1;

    const currentWordHint = useMemo(() => {
        if (!currentPhrase) return '';
        const word = currentPhrase.word;
        if (showFullWord) return word;
        const wordLength = word.length;
        const hintChars = Array(wordLength).fill('_');
        for (let i = 0; i < wordLength; i++) {
            if (word[i] === ' ') hintChars[i] = ' ';
        }
        const revealedIndices = new Set();
        if (wordLength > 0 && word[0] !== ' ') {
            hintChars[0] = word[0];
            revealedIndices.add(0);
        }
        if (wordLength > 1 && word[wordLength - 1] !== ' ') {
            hintChars[wordLength - 1] = word[wordLength - 1];
            revealedIndices.add(wordLength - 1);
        }
        let additionalCharsToReveal = 0;
        if (wordLength > 5 && wordLength <= 8) additionalCharsToReveal = 1;
        else if (wordLength > 8 && wordLength <= 12) additionalCharsToReveal = 2;
        else if (wordLength > 12) additionalCharsToReveal = Math.floor(wordLength / 4);
        const availableIndices = [];
        for (let i = 1; i < wordLength - 1; i++) {
            if (word[i] !== ' ' && !revealedIndices.has(i)) availableIndices.push(i);
        }
        for (let i = 0; i < additionalCharsToReveal && i < availableIndices.length; i++) {
            const indexToReveal = availableIndices[i];
            hintChars[indexToReveal] = word[indexToReveal];
        }
        return hintChars.join(' ');
    }, [currentPhrase, showFullWord]);

    const renderMainContent = () => {
        if (loading) {
            return <h2>Carregando...</h2>;
        }

        if (gameEnded) {
            return (
                <div className="end-game-container">
                    <h2 className="end-game-message">Parabéns, você completou o tema!</h2>
                    <button className="next-phrase-button" onClick={() => navigate('/home')}>
                        Voltar ao Início
                    </button>
                    <p className="prevention-footer">Vamos juntos compartilhar prevenção</p>
                </div>
            );
        }

        if (gameActive || showFullWord) {
            return (
                <>
                    <div id="timer">Tempo: <span>{formatTime(timer)}</span></div>
                    <p id="phrase-display">{currentPhrase?.phrase || 'Carregando...'}</p>
                    <div className={`word-hint-display ${showFullWord ? 'revealed' : ''}`}>{currentWordHint}</div>
                    <div className="game-controls">
                        {!showFullWord && (
                            <button className="reveal-full-word-button" onClick={() => endGame("Resposta revelada!")}>Revelar Resposta</button>
                        )}
                        {showFullWord && (
                            <button className="next-phrase-button" onClick={goToNextPhrase}>
                                {isLastPhrase ? 'Finalizar Tema' : 'Próxima Frase'}
                            </button>
                        )}
                    </div>
                    <p className="prevention-footer">Vamos juntos compartilhar prevenção</p>
                </>
            );
        }
        
        // AJUSTE AQUI: Voltamos à tela inicial original
        return (
            <div className="start-screen">
                <h2>{themeToPlay ? `Tema: ${themeToPlay}` : 'Nenhum tema selecionado'}</h2>
                <button className="start-button" onClick={startGame} disabled={!themeToPlay || phrasesForCurrentGame.length === 0}>
                    Iniciar Jogo
                </button>
                {message && <p className="start-message">{message}</p>}
                {!themeToPlay && <p className="start-message">Clique na engrenagem ⚙️ para escolher um tema.</p>}
            </div>
        );
    };

    return (
        <div className="game-container">
            <Link to="/home" className="home-button"></Link>
            <button className="settings-button" onClick={() => setShowSettings(true)}></button>
            <img src={beLogo} alt="Be Eventos Logo" className="be-logo" />
            <h1 className="game-title">Acerte ou Saia</h1>
            {renderMainContent()}
            {showSettings && (
                <Settings
                    onSave={handleSaveSettings}
                    initialData={allPhrasesByTheme}
                    onClose={() => setShowSettings(false)}
                    themes={themes}
                    onSelectTheme={handleSelectThemeToPlay}
                />
            )}
        </div>
    );
};

export default JogoDoAcerteOuSaia;