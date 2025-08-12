import React, { useState, useEffect } from 'react';
import './Settings.css';

const Settings = ({ onSave, initialProfiles, onClose }) => {
    const [profiles, setProfiles] = useState(initialProfiles);
    const [editingProfile, setEditingProfile] = useState(null);
    const [newTitle, setNewTitle] = useState('');
    const [newAnswer, setNewAnswer] = useState('');
    const [newClue, setNewClue] = useState('');
    const [newClues, setNewClues] = useState([]);
    const [editingClueIndex, setEditingClueIndex] = useState(null);

    useEffect(() => {
        if (editingProfile) {
            setNewTitle(editingProfile.title);
            setNewAnswer(editingProfile.answer);
            setNewClues(editingProfile.clues);
        } else {
            setNewTitle('');
            setNewAnswer('');
            setNewClues([]);
        }
    }, [editingProfile]);

    const handleAddClue = () => {
        if (newClue.trim() !== '') {
            setNewClues([...newClues, newClue.trim()]);
            setNewClue('');
        }
    };

    const handleRemoveClue = (indexToRemove) => {
        setNewClues(newClues.filter((_, index) => index !== indexToRemove));
    };

    const handleEditClue = (indexToEdit) => {
        setEditingClueIndex(indexToEdit);
    };

    const handleUpdateClue = (indexToUpdate, newText) => {
        const updatedClues = [...newClues];
        updatedClues[indexToUpdate] = newText.trim();
        setNewClues(updatedClues);
        setEditingClueIndex(null);
    };

    const handleFormSubmit = () => {
        if (newTitle.trim() === '' || newAnswer.trim() === '' || newClues.length === 0) {
            alert('Por favor, preencha o título, a resposta e adicione pelo menos uma dica.');
            return;
        }

        const updatedProfile = {
            title: newTitle.trim(),
            answer: newAnswer.trim(),
            clues: newClues
        };

        if (editingProfile) {
            const updatedProfilesList = profiles.map(profile =>
                profile === editingProfile ? updatedProfile : profile
            );
            setProfiles(updatedProfilesList);
            setEditingProfile(null);
        } else {
            setProfiles([...profiles, updatedProfile]);
        }

        setNewTitle('');
        setNewAnswer('');
        setNewClues([]);
    };

    const handleRemoveProfile = (indexToRemove) => {
        setProfiles(profiles.filter((_, index) => index !== indexToRemove));
    };

    const handleEditProfile = (profileToEdit) => {
        setEditingProfile(profileToEdit);
    };

    const handleCancelEdit = () => {
        setEditingProfile(null);
    };

    const handleSave = () => {
        if (profiles.length === 0) {
            alert('Não é possível salvar sem perfis. Adicione pelo menos um.');
            return;
        }
        onSave(profiles);
        onClose();
    };

    return (
        <div className="settings-overlay">
            <div className="settings-modal">
                <h2>Configurações de Perfis</h2>
                
                <div className="profile-add-form">
                    <input
                        type="text"
                        placeholder="Título do Perfil (Ex: Diga que eu sou...)"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Resposta (Ex: Extintor)"
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                    />
                    
                    <div className="clue-input-group">
                        <input
                            type="text"
                            placeholder="Adicione uma dica"
                            value={newClue}
                            onChange={(e) => setNewClue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddClue();
                                }
                            }}
                        />
                        <button type="button" onClick={handleAddClue}>+</button>
                    </div>

                    <ul className="new-clues-list">
                        {newClues.map((clue, index) => (
                            <li key={index}>
                                {editingClueIndex === index ? (
                                    <input
                                        type="text"
                                        value={clue}
                                        onChange={(e) => {
                                            const updatedClues = [...newClues];
                                            updatedClues[index] = e.target.value;
                                            setNewClues(updatedClues);
                                        }}
                                        onBlur={(e) => handleUpdateClue(index, e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleUpdateClue(index, e.target.value);
                                            }
                                        }}
                                        autoFocus
                                    />
                                ) : (
                                    <span>{index + 1}. {clue}</span>
                                )}
                                <div className="clue-actions">
                                    <button type="button" onClick={() => handleEditClue(index)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-edit">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                    </button>
                                    <button type="button" onClick={() => handleRemoveClue(index)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-remove">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        </svg>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <button className="add-profile-button" type="button" onClick={handleFormSubmit}>
                        {editingProfile ? 'Atualizar Perfil' : 'Adicionar Perfil'}
                    </button>
                    {editingProfile && (
                        <button className="cancel-edit-button" type="button" onClick={handleCancelEdit}>
                            Cancelar Edição
                        </button>
                    )}
                </div>
                
                <div className="profiles-list">
                    <h3>Perfis Atuais:</h3>
                    {profiles.length === 0 ? (
                        <p>Nenhum perfil customizado ainda. Adicione alguns!</p>
                    ) : (
                        <ul>
                            {profiles.map((profile, index) => (
                                <li key={index}>
                                    <span><strong>{profile.answer}</strong>: {profile.clues.length} dicas</span>
                                    <div className="profile-actions">
                                        <button type="button" onClick={() => handleEditProfile(profile)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-edit">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                        </button>
                                        <button type="button" onClick={() => handleRemoveProfile(index)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-remove">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="settings-actions">
                    <button className="save-button" type="button" onClick={handleSave}>Salvar Customizações</button>
                    <button className="cancel-button" type="button" onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default Settings;