import React, { useState, useEffect, useMemo } from 'react';
import Settings from './Settings';
import './JogoDoPerfil.css';
import './Settings.css';
import beLogo from '../assets/logo.png'; // Caminho corrigido

const DEFAULT_PROFILES = [
    {
        title: "Diga aos jogadores que sou...",
        answer: "CIPA",
        clues: [
            "Sou uma comissão obrigatória em empresas.",
            "Sou formado por representantes do empregador e dos empregados.",
            "Minha principal missão é a prevenção de acidentes e doenças ocupacionais.",
            "As eleições dos meus membros acontecem anualmente.",
            "Tenho um presidente indicado pelo empregador e um vice-presidente eleito pelos empregados.",
            "Realizo reuniões mensais para discutir segurança no trabalho.",
            "Minha sigla significa 'Comissão Interna de Prevenção de Acidentes'.",
            "Atuo na fiscalização e divulgação de normas de segurança.",
            "Membros têm estabilidade provisória no emprego.",
            "Sou regulamentado pela NR-5.",
            "Sou formado por titulares e suplentes.",
            "Desenvolvo a Semana Interna de Prevenção de Acidentes (SIPAT).",
            "Não tenho poder de punir, mas de orientar.",
            "Promovo o diálogo entre a gestão e os funcionários.",
            "Sou um dos pilares da cultura de segurança da empresa.",
            "Minha atuação reduz a ocorrência de sinistros laborais.",
            "Represento um canal de comunicação vital.",
            "A minha existência é um direito do trabalhador.",
            "Sou o elo entre a equipe e a área de saúde e segurança.",
            "Ajudo a identificar riscos e a propor soluções."
        ]
    },
    {
        title: "Diga aos jogadores que sou...",
        answer: "Extintor",
        clues: [
            "Sou um equipamento de combate a incêndio.",
            "Possuo diferentes classes para tipos de fogo (A, B, C, D).",
            "Tenho um pino de segurança para evitar o acionamento acidental.",
            "A manutenção é periódica e a recarga é feita após o uso.",
            "Sou de uso obrigatório em diversos tipos de edificações.",
            "Preciso estar em local visível e de fácil acesso.",
            "Tenho validade, que deve ser checada frequentemente.",
            "Meu manuseio deve ser feito por pessoas treinadas.",
            "Sou um dos itens básicos do plano de combate a incêndios.",
            "Sou identificado por uma placa com minhas características.",
            "Posso ser de água, pó químico, CO2 ou espuma.",
            "Não posso ser utilizado para apagar incêndios de todas as classes.",
            "Mantenho uma pressão interna para funcionar.",
            "Sou um dos primeiros recursos em uma emergência.",
            "A cor da minha identificação indica o tipo de agente extintor.",
            "Preciso de uma inspeção visual a cada seis meses.",
            "Fico em suporte de parede ou de piso.",
            "A NR-23 me regulamenta no ambiente de trabalho.",
            "Sou um agente de segurança contra fogo.",
            "A forma de usar é 'P.A.S.S.' (Puxar, Apontar, Apertar, Varrer)."
        ]
    }
];

const JogoDoPerfil = () => {
    const [profiles, setProfiles] = useState(() => {
        const savedProfiles = localStorage.getItem('perfilProfiles');
        return savedProfiles ? JSON.parse(savedProfiles) : DEFAULT_PROFILES;
    });
    
    const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
    const [cluesRevealed, setCluesRevealed] = useState([]);
    const [showAnswer, setShowAnswer] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);

    const currentProfile = useMemo(() => {
        return profiles[currentProfileIndex];
    }, [currentProfileIndex, profiles]);

    useEffect(() => {
        if (currentProfile) {
            setCluesRevealed(Array(currentProfile.clues.length).fill(false));
        }
    }, [currentProfile]);

    const handleRevealClue = (index) => {
        const newCluesRevealed = [...cluesRevealed];
        newCluesRevealed[index] = true;
        setCluesRevealed(newCluesRevealed);
    };

    const handleRevealAnswer = () => {
        setShowAnswer(true);
    };

    const handleNextProfile = () => {
        if (currentProfileIndex < profiles.length - 1) {
            const nextIndex = currentProfileIndex + 1;
            setCurrentProfileIndex(nextIndex);
            setShowAnswer(false);
        } else {
            setGameEnded(true);
        }
    };
    
    const handleRestartGame = () => {
        setCurrentProfileIndex(0);
        setCluesRevealed(Array(profiles[0].clues.length).fill(false));
        setShowAnswer(false);
        setGameEnded(false);
    };
    
    const handleSaveProfiles = (updatedProfiles) => {
        setProfiles(updatedProfiles);
        localStorage.setItem('perfilProfiles', JSON.stringify(updatedProfiles));
        setShowSettings(false);
    };

    const isLastProfile = currentProfileIndex === profiles.length - 1;

    if (profiles.length === 0) {
        return (
            <div className="game-container">
                <p>Nenhum perfil disponível. Por favor, configure os perfis.</p>
                <button className="settings-button" onClick={() => setShowSettings(true)}></button>
                {showSettings && (
                    <Settings
                        onSave={handleSaveProfiles}
                        initialProfiles={profiles}
                        onClose={() => setShowSettings(false)}
                    />
                )}
            </div>
        );
    }
    
    if (gameEnded) {
        return (
            <div className="game-container end-game-container">
                <h2 className="end-game-message">Parabéns, você chegou ao fim dos perfis!</h2>
                <button className="next-profile-button" onClick={handleRestartGame}>Reiniciar</button>
                <button className="settings-button" onClick={() => setShowSettings(true)}></button>
                {showSettings && (
                    <Settings
                        onSave={handleSaveProfiles}
                        initialProfiles={profiles}
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

            <div className="profile-header">
                <div className={`hidden-answer-box ${showAnswer ? 'revealed' : ''}`}>
                    Eu sou: <span className="answer-word">{currentProfile?.answer}</span>
                </div>
                
                <h1 className="profile-title">{currentProfile?.title}</h1>
            </div>
            
            <div className="clues-list">
                {currentProfile?.clues.map((clue, index) => (
                    <p 
                        key={index}
                        onClick={() => handleRevealClue(index)}
                        className={`clue-item ${cluesRevealed[index] ? 'revealed' : 'hidden'}`}
                    >
                        <span className="clue-number">{index + 1}.</span>
                        <span className="clue-text">{clue}</span>
                    </p>
                ))}
            </div>

            <div className="game-controls">
                <button className="reveal-answer-button" onClick={handleRevealAnswer}>
                    Revelar Resposta
                </button>
                <button 
                    className="next-profile-button" 
                    onClick={handleNextProfile}
                    disabled={isLastProfile && !showAnswer}
                >
                    {isLastProfile ? 'Fim' : 'Próximo Perfil'}
                </button>
            </div>

            {showSettings && (
                <Settings
                    onSave={handleSaveProfiles}
                    initialProfiles={profiles}
                    onClose={() => setShowSettings(false)}
                />
            )}
        </div>
    );
};

export default JogoDoPerfil;