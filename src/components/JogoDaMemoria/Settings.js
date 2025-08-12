import React, { useState, useEffect } from 'react';
// Removido o import de Settings.css para consolidar os estilos
// no arquivo principal JogoDaMemoria.css

const Settings = ({ onSave, initialCardContent, initialGridSize, onClose }) => {
    const [cardPairs, setCardPairs] = useState([]);
    const [newText, setNewText] = useState('');
    const [editingPair, setEditingPair] = useState(null);
    const [gridSize, setGridSize] = useState(initialGridSize);

    useEffect(() => {
        if (!initialCardContent || initialCardContent.length === 0) {
            setCardPairs([]);
            return;
        }

        const pairs = [];
        for (let i = 0; i < initialCardContent.length; i += 2) {
            pairs.push({
                id: initialCardContent[i].matchId,
                text: initialCardContent[i].text,
            });
        }
        setCardPairs(pairs);
    }, [initialCardContent]);

    const handleAddPair = () => {
        if (newText.trim() !== '') {
            const newId = cardPairs.length > 0 ? Math.max(...cardPairs.map(p => p.id), 0) + 1 : 1;
            const newPair = { id: newId, text: newText.trim() };
            setCardPairs([...cardPairs, newPair]);
            setNewText('');
        }
    };

    const handleRemovePair = (idToRemove) => {
        setCardPairs(cardPairs.filter(pair => pair.id !== idToRemove));
    };

    const handleEditPair = (pair) => {
        setEditingPair(pair);
        setNewText(pair.text);
    };

    const handleUpdatePair = () => {
        if (newText.trim() !== '' && editingPair) {
            const updatedPairs = cardPairs.map(pair =>
                pair.id === editingPair.id ? { ...pair, text: newText.trim() } : pair
            );
            setCardPairs(updatedPairs);
            setNewText('');
            setEditingPair(null);
        }
    };

    const handleSave = () => {
        const savedContent = cardPairs.flatMap(pair => [
            { id: (pair.id * 2) - 1, matchId: pair.id, text: pair.text, color: "var(--be-eventos-blue)" },
            { id: (pair.id * 2), matchId: pair.id, text: pair.text, color: "var(--be-eventos-yellow)" },
        ]);

        if (savedContent.length === 0) {
            alert('Adicione pelo menos um par de cartas!');
            return;
        }

        onSave(savedContent, gridSize);
        onClose();
    };

    return (
        <div className="settings-overlay">
            <div className="settings-modal">
                <h2>Configurações do Jogo</h2>
                
                <div className="grid-size-config">
                    <h3>Tamanho do Tabuleiro:</h3>
                    <select className="grid-size-select" value={gridSize} onChange={(e) => setGridSize(e.target.value)}>
                        <option value="4x4">4 x 4 (16 cartas)</option>
                        <option value="5x4">5 x 4 (20 cartas)</option>
                        <option value="6x6">6 x 6 (36 cartas)</option>
                    </select>
                </div>

                <div className="card-pairs-list">
                    <h3>Pares de Cartas:</h3>
                    <div className="add-pair-form">
                        <input
                            type="text"
                            placeholder="Texto da nova carta..."
                            value={newText}
                            onChange={(e) => setNewText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (editingPair ? handleUpdatePair() : handleAddPair())}
                        />
                        <button onClick={editingPair ? handleUpdatePair : handleAddPair}>
                            {editingPair ? "Atualizar Par" : "Adicionar Par"}
                        </button>
                    </div>

                    <ul>
                        {cardPairs.map(pair => (
                            <li key={pair.id}>
                                <span>{pair.text}</span>
                                <div className="pair-actions">
                                    <button onClick={() => handleEditPair(pair)}>Editar</button>
                                    <button onClick={() => handleRemovePair(pair.id)}>Remover</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className="settings-actions">
                    <button className="save-button" onClick={handleSave}>Salvar</button>
                    <button className="cancel-button" onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default Settings;