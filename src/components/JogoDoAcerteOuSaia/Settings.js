import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import './Settings.css';

const Settings = ({ onSave, initialData, onClose, themes, onSelectTheme }) => {
    // 1. Estado para saber se o navegador está online
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    
    const [phrasesByTheme, setPhrasesByTheme] = useState(initialData);
    const [themeToEdit, setThemeToEdit] = useState('');
    const [newPhraseText, setNewPhraseText] = useState('');
    const [newWordText, setNewWordText] = useState('');
    const [editingPhrase, setEditingPhrase] = useState(null); 
    const [loading, setLoading] = useState(false);

    const isEditing = editingPhrase !== null;

    // 2. Efeito que monitora o status da conexão
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        if (isEditing) {
            setNewPhraseText(editingPhrase.phrase);
            setNewWordText(editingPhrase.word);
        } else {
            setNewPhraseText('');
            setNewWordText('');
        }
    }, [editingPhrase]);

    // ... (As funções de add, update e remove continuam as mesmas)
    const handleAddPhrase = async () => {
        if (newPhraseText.trim() === '' || newWordText.trim() === '' || !themeToEdit) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('guess_or_leave_phrases')
            .insert([{ theme: themeToEdit, phrase: newPhraseText.trim(), word: newWordText.trim() }])
            .select();
        if (error) console.error('Erro ao adicionar frase:', error);
        else if (data) {
            const updatedPhrasesForTheme = [...(phrasesByTheme[themeToEdit] || []), data[0]];
            setPhrasesByTheme({ ...phrasesByTheme, [themeToEdit]: updatedPhrasesForTheme });
            setNewPhraseText(''); setNewWordText('');
        }
        setLoading(false);
    };

    const handleUpdatePhrase = async () => {
        if (!isEditing) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('guess_or_leave_phrases')
            .update({ phrase: newPhraseText.trim(), word: newWordText.trim() })
            .match({ id: editingPhrase.id }).select();
        if (error) console.error('Erro ao atualizar frase:', error);
        else if (data) {
            const updatedPhrasesForTheme = phrasesByTheme[themeToEdit].map(p => p.id === editingPhrase.id ? data[0] : p);
            setPhrasesByTheme({ ...phrasesByTheme, [themeToEdit]: updatedPhrasesForTheme });
            setEditingPhrase(null);
        }
        setLoading(false);
    };

    const handleRemovePhrase = async (phraseToRemove) => {
        setLoading(true);
        const { error } = await supabase
            .from('guess_or_leave_phrases')
            .delete().match({ id: phraseToRemove.id });
        if (error) console.error('Erro ao remover frase:', error);
        else {
            const updatedPhrases = (phrasesByTheme[themeToEdit] || []).filter(p => p.id !== phraseToRemove.id);
            setPhrasesByTheme({ ...phrasesByTheme, [themeToEdit]: updatedPhrases });
        }
        setLoading(false);
    };

    const handleSaveAndClose = () => {
        onSave(phrasesByTheme);
        onClose();
    };

    return (
        <div className="settings-overlay">
            <div className="settings-modal">
                <h2>Configurações</h2>
                
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

                <div className="settings-section">
                    <h3>Editar Frases por Tema</h3>
                    {/* 3. Mensagem informativa quando estiver offline */}
                    {!isOnline && <p style={{ color: 'orange', fontWeight: 'bold' }}>Modo offline: a edição de frases está desabilitada.</p>}

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
                                    <input type="text" placeholder="Frase ou Dica" value={newPhraseText} onChange={(e) => setNewPhraseText(e.target.value)} disabled={!isOnline || loading} />
                                    <input type="text" placeholder="Palavra Chave" value={newWordText} onChange={(e) => setNewWordText(e.target.value)} disabled={!isOnline || loading} />
                                </div>
                                {/* 4. Botões de edição são desabilitados se estiver offline */}
                                <button onClick={isEditing ? handleUpdatePhrase : handleAddPhrase} disabled={!isOnline || loading}>
                                    {isEditing ? 'Atualizar Frase' : 'Adicionar Frase'}
                                </button>
                                {isEditing && (
                                    <button className="cancel-button" onClick={() => setEditingPhrase(null)} disabled={loading}>Cancelar Edição</button>
                                )}
                            </div>

                            <div className="phrases-list">
                                <ul>
                                    {(phrasesByTheme[themeToEdit] || []).map((item) => (
                                        <li key={item.id}>
                                            <span>"{item.phrase}" - <strong>{item.word}</strong></span>
                                            <div className="phrase-actions">
                                                <button onClick={() => setEditingPhrase(item)} disabled={!isOnline || loading}>Editar</button>
                                                <button onClick={() => handleRemovePhrase(item)} disabled={!isOnline || loading}>Remover</button>
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