import React, { useState, useEffect } from 'react';
import './Settings.css';

const Settings = ({ onSave, initialData, onClose, themes, onSelectTheme }) => {
    const [phrasesByTheme, setPhrasesByTheme] = useState(initialData);
    const [themeToEdit, setThemeToEdit] = useState('');

    const [newPhraseText, setNewPhraseText] = useState('');
    const [newWordText, setNewWordText] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);

    const isEditing = editingIndex !== null;

    useEffect(() => {
        if (isEditing && themeToEdit && phrasesByTheme[themeToEdit]) {
            const phrase = phrasesByTheme[themeToEdit][editingIndex];
            setNewPhraseText(phrase.phrase);
            setNewWordText(phrase.word);
        } else {
            setNewPhraseText('');
            setNewWordText('');
        }
    }, [editingIndex, themeToEdit, phrasesByTheme]);

    const handleAddOrUpdatePhrase = () => {
        if (newPhraseText.trim() === '' || newWordText.trim() === '') {
            alert('Por favor, preencha a frase e a palavra.');
            return;
        }

        const newPhrase = {
            theme: themeToEdit,
            phrase: newPhraseText.trim(),
            word: newWordText.trim()
        };

        const updatedPhrases = [...(phrasesByTheme[themeToEdit] || [])];

        if (isEditing) {
            updatedPhrases[editingIndex] = newPhrase;
        } else {
            updatedPhrases.push(newPhrase);
        }

        setPhrasesByTheme({ ...phrasesByTheme, [themeToEdit]: updatedPhrases });
        setNewPhraseText('');
        setNewWordText('');
        setEditingIndex(null);
    };

    const handleRemovePhrase = (indexToRemove) => {
        const updatedPhrases = (phrasesByTheme[themeToEdit] || []).filter((_, index) => index !== indexToRemove);
        setPhrasesByTheme({ ...phrasesByTheme, [themeToEdit]: updatedPhrases });
    };

    const handleSaveAndClose = () => {
        onSave(phrasesByTheme);
        onClose();
    };

    return (
        <div className="settings-overlay">
            <div className="settings-modal">
                <h2>Configurações</h2>
                
                {/* Seção para selecionar o tema para jogar */}
                <div className="settings-section">
                    <h3>Selecionar Tema para Jogar</h3>
                    <div className="theme-selection-settings">
                        {themes.map(theme => (
                            <button key={theme} className="theme-button" onClick={() => onSelectTheme(theme)}>
                                {theme}
                            </button>
                        ))}
                    </div>
                </div>

                <hr className="separator" />

                {/* Seção para editar as frases de um tema */}
                <div className="settings-section">
                    <h3>Editar Frases por Tema</h3>
                    {!themeToEdit ? (
                        <div className="theme-selection-settings">
                            <p>Escolha o tema que deseja editar:</p>
                            {themes.map(theme => (
                                <button key={theme} className="theme-button edit-theme" onClick={() => setThemeToEdit(theme)}>
                                    Editar "{theme}"
                                </button>
                            ))}
                        </div>
                    ) : (
                        <>
                            <h4>Editando: {themeToEdit}</h4>
                            <div className="phrase-add-form">
                                <div className="phrase-input-group">
                                    <input
                                        type="text"
                                        placeholder="Frase ou Dica"
                                        value={newPhraseText}
                                        onChange={(e) => setNewPhraseText(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Palavra Chave"
                                        value={newWordText}
                                        onChange={(e) => setNewWordText(e.target.value)}
                                    />
                                </div>
                                <button onClick={handleAddOrUpdatePhrase}>
                                    {isEditing ? 'Atualizar Frase' : 'Adicionar Frase'}
                                </button>
                                {isEditing && (
                                    <button className="cancel-button" onClick={() => setEditingIndex(null)}>Cancelar Edição</button>
                                )}
                            </div>

                            <div className="phrases-list">
                                <ul>
                                    {(phrasesByTheme[themeToEdit] || []).map((item, index) => (
                                        <li key={index}>
                                            <span>"{item.phrase}" - <strong>{item.word}</strong></span>
                                            <div className="phrase-actions">
                                                <button onClick={() => setEditingIndex(index)}>Editar</button>
                                                <button onClick={() => handleRemovePhrase(index)}>Remover</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button className="back-button" onClick={() => setThemeToEdit('')}>Voltar para Temas</button>
                        </>
                    )}
                </div>

                <div className="settings-actions">
                    <button className="save-button" onClick={handleSaveAndClose}>Salvar e Fechar</button>
                </div>
            </div>
        </div>
    );
};

export default Settings;