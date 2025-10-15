import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; // Importe o Supabase
import './Settings.css';

const Settings = ({ onSave, initialData, onClose, themes, onSelectTheme }) => {
    // Estados do seu componente original, mantidos para controlar a UI
    const [phrasesByTheme, setPhrasesByTheme] = useState(initialData);
    const [themeToEdit, setThemeToEdit] = useState('');
    const [newPhraseText, setNewPhraseText] = useState('');
    const [newWordText, setNewWordText] = useState('');
    
    // Estado para controlar a edição (usando o objeto da frase em vez do índice)
    const [editingPhrase, setEditingPhrase] = useState(null); 
    const [loading, setLoading] = useState(false); // Para desabilitar botões durante o carregamento

    const isEditing = editingPhrase !== null;

    // Efeito para preencher os inputs ao clicar em "Editar"
    useEffect(() => {
        if (isEditing) {
            setNewPhraseText(editingPhrase.phrase);
            setNewWordText(editingPhrase.word);
        } else {
            setNewPhraseText('');
            setNewWordText('');
        }
    }, [editingPhrase]);

    // Função para ADICIONAR uma nova frase no Supabase
    const handleAddPhrase = async () => {
        if (!newPhraseText.trim() || !newWordText.trim() || !themeToEdit) return;
        setLoading(true);

        const { data, error } = await supabase
            .from('guess_or_leave_phrases')
            .insert([{ theme: themeToEdit, phrase: newPhraseText.trim(), word: newWordText.trim() }])
            .select();

        if (error) {
            console.error('Erro ao adicionar frase:', error);
        } else if (data) {
            const updatedPhrases = { ...phrasesByTheme };
            updatedPhrases[themeToEdit] = [...(updatedPhrases[themeToEdit] || []), data[0]];
            setPhrasesByTheme(updatedPhrases);
            setNewPhraseText('');
            setNewWordText('');
        }
        setLoading(false);
    };
    
    // Função para ATUALIZAR uma frase existente no Supabase
    const handleUpdatePhrase = async () => {
        if (!newPhraseText.trim() || !newWordText.trim() || !isEditing) return;
        setLoading(true);

        const { data, error } = await supabase
            .from('guess_or_leave_phrases')
            .update({ phrase: newPhraseText.trim(), word: newWordText.trim() })
            .match({ id: editingPhrase.id })
            .select();

        if (error) {
            console.error('Erro ao atualizar frase:', error);
        } else if (data) {
            const updatedPhrases = { ...phrasesByTheme };
            const phraseIndex = updatedPhrases[themeToEdit].findIndex(p => p.id === editingPhrase.id);
            if (phraseIndex !== -1) {
                updatedPhrases[themeToEdit][phraseIndex] = data[0];
                setPhrasesByTheme(updatedPhrases);
            }
            setEditingPhrase(null); // Limpa o estado de edição
        }
        setLoading(false);
    };

    // Função para REMOVER uma frase do Supabase pelo seu ID
    const handleRemovePhrase = async (idToRemove) => {
        setLoading(true);
        const { error } = await supabase
            .from('guess_or_leave_phrases')
            .delete()
            .match({ id: idToRemove });

        if (error) {
            console.error('Erro ao remover frase:', error);
        } else {
            const updatedPhrases = (phrasesByTheme[themeToEdit] || []).filter(p => p.id !== idToRemove);
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
            {/* O JSX abaixo é a estrutura do SEU componente, garantindo que o CSS funcione */}
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
                            <div className="phrase-add-form"> {/* Verifique se esta classe existe no seu CSS */}
                                <div className="phrase-input-group">
                                    <input
                                        type="text"
                                        placeholder="Frase ou Dica"
                                        value={newPhraseText}
                                        onChange={(e) => setNewPhraseText(e.target.value)}
                                        disabled={loading}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Palavra Chave"
                                        value={newWordText}
                                        onChange={(e) => setNewWordText(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                <button onClick={isEditing ? handleUpdatePhrase : handleAddPhrase} disabled={loading}>
                                    {isEditing ? 'Atualizar Frase' : 'Adicionar Frase'}
                                </button>
                                {isEditing && (
                                    <button className="cancel-button" onClick={() => setEditingPhrase(null)} disabled={loading}>Cancelar Edição</button>
                                )}
                            </div>

                            <div className="phrases-list">
                                <ul>
                                    {(phrasesByTheme[themeToEdit] || []).map((item) => (
                                        <li key={item.id}> {/* Usando o ID do banco como chave */}
                                            <span>"{item.phrase}" - <strong>{item.word}</strong></span>
                                            <div className="phrase-actions">
                                                <button onClick={() => setEditingPhrase(item)} disabled={loading}>Editar</button>
                                                <button onClick={() => handleRemovePhrase(item.id)} disabled={loading}>Remover</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button className="back-button" onClick={() => setThemeToEdit('')}>Voltar para Temas</button> {/* Verifique se esta classe existe */}
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