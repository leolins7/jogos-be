import React, { useState, useEffect } from 'react';
import './Settings.css';

const Settings = ({ onSave, initialItems, onClose }) => {
    // Garante que o estado inicial seja sempre um array, mesmo que initialItems seja nulo
    const [items, setItems] = useState(() => initialItems || []);
    const [newItemText, setNewItemText] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);

    // Sincroniza o estado interno se os itens iniciais mudarem
    useEffect(() => {
        setItems(initialItems || []);
    }, [initialItems]);

    const handleAddItem = () => {
        if (newItemText.trim() !== '' && items.length < 11) {
            // Apenas o texto é necessário, a cor é controlada no componente principal
            setItems([...items, { text: newItemText.trim() }]);
            setNewItemText('');
        }
    };

    const handleUpdateItem = () => {
        if (newItemText.trim() !== '' && editingIndex !== null) {
            const updatedItems = [...items];
            updatedItems[editingIndex].text = newItemText.trim();
            setItems(updatedItems);
            setEditingIndex(null);
            setNewItemText('');
        }
    };

    const handleRemoveItem = (indexToRemove) => {
        const updatedItems = items.filter((_, index) => index !== indexToRemove);
        setItems(updatedItems);
    };

    const handleEditClick = (index) => {
        setEditingIndex(index);
        setNewItemText(items[index].text);
    };

    const handleSaveAndClose = () => {
        if (items.length === 0) {
            alert('Adicione pelo menos um item para salvar.');
            return;
        }
        onSave(items);
        onClose();
    };

    return (
        <div className="settings-overlay">
            <div className="settings-modal">
                <h2>Configurações da Roleta</h2>
                <div className="item-add-form">
                    <h3>{editingIndex !== null ? 'Editar Item' : 'Adicionar Item'} (Máx: 11)</h3>
                    <div className="input-group">
                        <input
                            type="text"
                            value={newItemText}
                            onChange={(e) => setNewItemText(e.target.value)}
                            placeholder="Texto do item"
                        />
                        {editingIndex !== null ? (
                            <>
                                <button onClick={handleUpdateItem}>Atualizar</button>
                                <button className="cancel-edit-button" onClick={() => { setEditingIndex(null); setNewItemText(''); }}>Cancelar</button>
                            </>
                        ) : (
                            <button onClick={handleAddItem} disabled={items.length >= 11}>Adicionar</button>
                        )}
                    </div>
                </div>

                <div className="items-list">
                    <h3>Itens Atuais: ({items.length}/11)</h3>
                    <ul>
                        {items.map((item, index) => (
                            <li key={index}>
                                <span>{index + 1}. {item.text}</span>
                                <div className="item-actions">
                                    <button onClick={() => handleEditClick(index)}>Editar</button>
                                    <button onClick={() => handleRemoveItem(index)}>Remover</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="settings-actions">
                    <button className="save-button" onClick={handleSaveAndClose}>Salvar e Fechar</button>
                    <button className="cancel-button" onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default Settings;