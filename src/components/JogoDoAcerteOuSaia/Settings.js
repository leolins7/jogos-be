import React, { useState, useEffect } from 'react';
import './JogoDoAcerteOuSaia.css'; // Usamos o mesmo CSS do jogo para o modal

const Settings = ({ onSave, initialPhrases, onClose }) => {
    const [phrases, setPhrases] = useState(initialPhrases);
    const [newPhraseText, setNewPhraseText] = useState('');
    const [newWordText, setNewWordText] = useState('');
    const [editingPhrase, setEditingPhrase] = useState(null);

    useEffect(() => {
        if (editingPhrase) {
            setNewPhraseText(editingPhrase.phrase);
            setNewWordText(editingPhrase.word);
        } else {
            setNewPhraseText('');
            setNewWordText('');
        }
    }, [editingPhrase]);

    const handleAddPhrase = () => {
        if (newPhraseText.trim() === '' || newWordText.trim() === '') {
            alert('Por favor, preencha a frase e a palavra.');
            return;
        }
        const newPhrase = {
            phrase: newPhraseText.trim(),
            word: newWordText.trim()
        };
        setPhrases([...phrases, newPhrase]);
        setNewPhraseText('');
        setNewWordText('');
    };

    const handleUpdatePhrase = () => {
        if (newPhraseText.trim() === '' || newWordText.trim() === '' || !editingPhrase) {
            return;
        }
        const updatedPhrase = {
            phrase: newPhraseText.trim(),
            word: newWordText.trim()
        };
        const updatedPhrasesList = phrases.map(phrase =>
            phrase === editingPhrase ? updatedPhrase : phrase
        );
        setPhrases(updatedPhrasesList);
        setEditingPhrase(null);
    };

    const handleRemovePhrase = (indexToRemove) => {
        setPhrases(phrases.filter((_, index) => index !== indexToRemove));
    };

    const handleEditPhrase = (phraseToEdit) => {
        setEditingPhrase(phraseToEdit);
    };

    const handleSave = () => {
        if (phrases.length === 0) {
            alert('Não é possível salvar sem frases. Adicione pelo menos uma!');
            return;
        }
        onSave(phrases);
    };

    return (
        <div className="settings-overlay">
            <div className="settings-modal">
                <h2>Configurações de Frases</h2>
                <div className="phrase-add-form">
                    <input
                        type="text"
                        placeholder="Nova Frase"
                        value={newPhraseText}
                        onChange={(e) => setNewPhraseText(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Palavra Chave"
                        value={newWordText}
                        onChange={(e) => setNewWordText(e.target.value)}
                    />
                    {editingPhrase ? (
                        <button onClick={handleUpdatePhrase}>Atualizar Frase</button>
                    ) : (
                        <button onClick={handleAddPhrase}>Adicionar</button>
                    )}
                    {editingPhrase && (
                         <button className="cancel-edit-button" onClick={() => setEditingPhrase(null)}>Cancelar</button>
                    )}
                </div>

                <div className="phrases-list">
                    <h3>Frases Atuais:</h3>
                    {phrases.length === 0 ? (
                        <p>Nenhuma frase customizada ainda. Adicione algumas!</p>
                    ) : (
                        <ul>
                            {phrases.map((item, index) => (
                                <li key={index}>
                                    <span>"{item.phrase}" - Palavra: "{item.word}"</span>
                                    <div className="phrase-actions">
                                        <button onClick={() => handleEditPhrase(item)}>Editar</button>
                                        <button onClick={() => handleRemovePhrase(index)}>Remover</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="settings-actions">
                    <button className="save-button" onClick={handleSave}>Salvar Customizações</button>
                    <button className="cancel-button" onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default Settings;