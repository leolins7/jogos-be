import React, { useState, useEffect, useRef, useMemo } from 'react';
import Settings from './Settings';
import './JogoDoAcerteOuSaia.css';
import beLogo from '../assets/logo.png'; // Caminho corrigido

const DEFAULT_PHRASES = [
    { phrase: "Protege sua cabeça contra impactos e objetos que caem em canteiros de obra.", word: "Capacete" },
    { phrase: "Usado para proteger as mãos contra cortes, abrasões e produtos químicos.", word: "Luvas" },
    { phrase: "Preserva sua audição em ambientes com ruído excessivo.", word: "Protetor auricular" },
    { phrase: "Item essencial que resguarda seus olhos de partículas, respingos e poeira.", word: "Óculos de segurança" },
    { phrase: "Evita quedas em trabalhos realizados em altura e mantém você preso a um ponto seguro.", word: "Cinto de segurança" },
    { phrase: "Calçado robusto que protege os pés contra esmagamentos, perfurações e choques elétricos.", word: "Botina de segurança" },
    { phrase: "Dispositivo para visualizar obstáculos e demarcar áreas perigosas.", word: "Fita zebrada" },
];

const INITIAL_TIME = 30;

const JogoDoAcerteOuSaia = () => {
    const [phrases, setPhrases] = useState(() => {
        const savedPhrases = localStorage.getItem('acerteOuSaiaPhrases');
        return savedPhrases ? JSON.parse(savedPhrases) : DEFAULT_PHRASES;
    });

    const [timer, setTimer] = useState(INITIAL_TIME);
    const [gameActive, setGameActive] = useState(false);
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [showFullWord, setShowFullWord] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);

    const timerIntervalRef = useRef(null);

    useEffect(() => {
        if (gameActive) {
            timerIntervalRef.current = setInterval(() => {
                setTimer(prevTimer => {
                    if (prevTimer <= 1) {
                        clearInterval(timerIntervalRef.current);
                        endGame("Tempo esgotado!", "error");
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

    const startGame = () => {
        if (phrases.length === 0) {
            setMessage('Por favor, adicione frases nas configurações antes de jogar!');
            setMessageType('error');
            return;
        }
        setTimer(INITIAL_TIME);
        setGameActive(true);
        setCurrentPhraseIndex(0);
        setMessage('');
        setMessageType('');
        setShowFullWord(false);
        setGameEnded(false);
    };

    const endGame = (msg, type) => {
        setGameActive(false);
        setMessage(msg);
        setMessageType(type);
    };

    const goToNextPhrase = () => {
        const nextIndex = currentPhraseIndex + 1;
        if (nextIndex < phrases.length) {
            setCurrentPhraseIndex(nextIndex);
            setTimer(INITIAL_TIME);
            setMessage('');
            setMessageType('');
            setShowFullWord(false);
        } else {
            setGameEnded(true);
        }
    };
    
    const handleRestartGame = () => {
        setCurrentPhraseIndex(0);
        setTimer(INITIAL_TIME);
        setGameActive(false);
        setMessage('');
        setMessageType('');
        setShowFullWord(false);
        setGameEnded(false);
    };

    const handleSavePhrases = (updatedPhrases) => {
        setPhrases(updatedPhrases);
        localStorage.setItem('acerteOuSaiaPhrases', JSON.stringify(updatedPhrases));
        setMessage('Frases customizadas salvas!');
        setMessageType('success');
        setShowSettings(false);
    };

    const currentWordHint = useMemo(() => {
        if (!gameActive || !phrases[currentPhraseIndex]) return '';

        const word = phrases[currentPhraseIndex].word;
        if (showFullWord) {
            return word;
        }

        const wordLength = word.length;
        let hintChars = Array(wordLength).fill('_');

        for (let i = 0; i < wordLength; i++) {
            if (word[i] === ' ') {
                hintChars[i] = ' ';
            }
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
        if (wordLength <= 5) {
            additionalCharsToReveal = 0;
        } else if (wordLength <= 8) {
            additionalCharsToReveal = 2;
        } else if (wordLength <= 12) {
            additionalCharsToReveal = 3;
        } else {
            additionalCharsToReveal = Math.floor(wordLength / 3);
        }

        let charsAdded = 0;
        const nonSpaceWordLength = word.replace(/\s/g, '').length;
        const effectiveLengthForStep = Math.max(1, wordLength - revealedIndices.size - (wordLength - nonSpaceWordLength));
        const step = Math.max(1, Math.floor(effectiveLengthForStep / (additionalCharsToReveal + 1)));

        for (let i = 1; i < wordLength - 1 && charsAdded < additionalCharsToReveal; i += step) {
            if (!revealedIndices.has(i) && word[i] !== ' ') {
                hintChars[i] = word[i];
                revealedIndices.add(i);
                charsAdded++;
            }
        }
        
        let finalHint = '';
        for (let i = 0; i < hintChars.length; i++) {
            finalHint += hintChars[i];
            if (i < hintChars.length - 1 && hintChars[i] !== ' ' && hintChars[i + 1] !== ' ') {
                finalHint += ' ';
            }
        }
        return finalHint;

    }, [currentPhraseIndex, gameActive, phrases, showFullWord]);

    const currentPhrase = phrases[currentPhraseIndex];
    const isLastPhrase = currentPhraseIndex === phrases.length - 1;

    if (phrases.length === 0) {
        return (
            <div className="game-container">
                <p>Nenhuma frase disponível. Por favor, configure as frases.</p>
                <button className="settings-button" onClick={() => setShowSettings(true)}></button>
                {showSettings && (
                    <Settings
                        onSave={handleSavePhrases}
                        initialPhrases={phrases}
                        onClose={() => setShowSettings(false)}
                    />
                )}
            </div>
        );
    }

    if (gameEnded) {
        return (
            <div className="game-container end-game-container">
                <h2 className="end-game-message">Parabéns, você chegou ao fim das frases!</h2>
                <button className="next-phrase-button" onClick={handleRestartGame}>Reiniciar</button>
                <button className="settings-button" onClick={() => setShowSettings(true)}></button>
                {showSettings && (
                    <Settings
                        onSave={handleSavePhrases}
                        initialPhrases={phrases}
                        onClose={() => setShowSettings(false)}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="game-container">
            <button className="settings-button" onClick={() => setShowSettings(true)}></button>
            <img src={beLogo} alt="Be Eventos Logo" className="be-logo" />

            <h1 className="game-title">Acerte ou Saia</h1>
            
            <div id="timer">Tempo: <span>{formatTime(timer)}</span></div>
            
            <p id="phrase-display">{currentPhrase ? currentPhrase.phrase : 'Carregando frase...'}</p>
            <div className="word-hint-display">{currentWordHint}</div>

            <div className="game-controls">
                {!showFullWord && (
                    <button className="reveal-full-word-button" onClick={() => setShowFullWord(true)}>
                        Revelar Resposta
                    </button>
                )}
                <button
                    className="next-phrase-button"
                    onClick={goToNextPhrase}
                    disabled={isLastPhrase && !showFullWord}
                >
                    {isLastPhrase ? 'Fim' : 'Próxima Frase'}
                </button>
            </div>

            {showSettings && (
                <Settings
                    onSave={handleSavePhrases}
                    initialPhrases={phrases}
                    onClose={() => setShowSettings(false)}
                />
            )}
        </div>
    );
};

export default JogoDoAcerteOuSaia;