import React, { useState } from 'react';
import './Settings.css';

const Settings = ({ onSave, initialItems, onClose }) => {
    const [items, setItems] = useState(initialItems);
    const [newItem, setNewItem] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);

    const handleAddItem = () => {
        if (newItem.trim() !== '' && items.length < 11) {
            const color = items.length % 2 === 0 ? "var(--be-eventos-blue)" : "var(--be-eventos-yellow)";
            setItems([...items, { text: newItem.trim(), color }]);
            setNewItem('');
        }
    };

    const handleUpdateItem = (index) => {
        if (newItem.trim() !== '') {
            const updatedItems = [...items];
            updatedItems[index].text = newItem.trim();
            setItems(updatedItems);
            setEditingIndex(null);
            setNewItem('');
        }
    };

    const handleRemoveItem = (index) => {
        const updatedItems = items.filter((_, i) => i !== index);
        const reColoredItems = updatedItems.map((item, i) => ({
            ...item,
            color: i % 2 === 0 ? "var(--be-eventos-blue)" : "var(--be-eventos-yellow)"
        }));
        setItems(reColoredItems);
    };

    const handleEditClick = (index) => {
        setEditingIndex(index);
        setNewItem(items[index].text);
    };

    return (
        <div className="settings-overlay">
            <div className="settings-modal">
                <h2>Configurações do Jogo da Roleta</h2>
                <div className="item-add-form">
                    <h3>Adicionar/Editar Item (Máximo 11)</h3>
                    <div className="input-group">
                        <input
                            type="text"
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            placeholder="Nome do Item"
                        />
                        {editingIndex !== null ? (
                            <button onClick={() => handleUpdateItem(editingIndex)}>Salvar Edição</button>
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
                    <button className="save-button" onClick={() => onSave(items)}>Salvar e Fechar</button>
                    <button className="cancel-button" onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default Settings;