import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; // 1. Importe o Supabase

const Settings = ({ onSave, initialCardContent, initialGridSize, onClose }) => {
    const [cardPairs, setCardPairs] = useState([]);
    const [newText, setNewText] = useState('');
    const [editingPair, setEditingPair] = useState(null);
    const [gridSize, setGridSize] = useState(initialGridSize);
    const [loading, setLoading] = useState(false);

    // 2. Extrai os pares únicos do conteúdo inicial
    useEffect(() => {
        const uniquePairs = initialCardContent.reduce((acc, current) => {
            if (!acc.find(item => item.id === current.matchId)) {
                acc.push({ id: current.matchId, text: current.text });
            }
            return acc;
        }, []);
        setCardPairs(uniquePairs);
    }, [initialCardContent]);

    // 3. Adiciona um novo par no banco de dados
    const handleAddPair = async () => {
        if (newText.trim() === '') return;
        setLoading(true);

        const { data, error } = await supabase
            .from('memory_card_pairs')
            .insert([{ text: newText.trim() }])
            .select();

        if (error) {
            console.error('Erro ao adicionar par:', error);
        } else if (data) {
            setCardPairs([...cardPairs, data[0]]);
            setNewText('');
        }
        setLoading(false);
    };

    // 4. Remove um par do banco de dados
    const handleRemovePair = async (idToRemove) => {
        setLoading(true);
        const { error } = await supabase
            .from('memory_card_pairs')
            .delete()
            .match({ id: idToRemove });

        if (error) {
            console.error('Erro ao remover par:', error);
        } else {
            setCardPairs(cardPairs.filter(pair => pair.id !== idToRemove));
        }
        setLoading(false);
    };

    // Prepara para edição
    const handleEditPair = (pair) => {
        setEditingPair(pair);
        setNewText(pair.text);
    };

    // 5. Atualiza um par no banco de dados
    const handleUpdatePair = async () => {
        if (newText.trim() === '' || !editingPair) return;
        setLoading(true);

        const { data, error } = await supabase
            .from('memory_card_pairs')
            .update({ text: newText.trim() })
            .match({ id: editingPair.id })
            .select();

        if (error) {
            console.error('Erro ao atualizar par:', error);
        } else if (data) {
            const updatedPairs = cardPairs.map(p => (p.id === editingPair.id ? data[0] : p));
            setCardPairs(updatedPairs);
            setNewText('');
            setEditingPair(null);
        }
        setLoading(false);
    };
    
    // 6. Passa os dados atualizados para o componente pai e fecha
    const handleSave = () => {
        onSave(cardPairs, gridSize);
    };

    return (
        <div className="settings-overlay">
            <div className="settings-modal">
                <h2>Configurações do Jogo</h2>
                
                <div className="grid-size-config">
                    <h3>Tamanho do Tabuleiro:</h3>
                    <select className="grid-size-select" value={gridSize} onChange={(e) => setGridSize(e.target.value)}>
                        <option value="4x4">4 x 4 (até 8 pares)</option>
                        <option value="5x4">5 x 4 (até 10 pares)</option>
                        <option value="6x6">6 x 6 (até 18 pares)</option>
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
                            disabled={loading}
                        />
                        <button onClick={editingPair ? handleUpdatePair : handleAddPair} disabled={loading}>
                            {editingPair ? "Atualizar" : "Adicionar"}
                        </button>
                    </div>

                    <ul>
                        {cardPairs.map(pair => (
                            <li key={pair.id}>
                                <span>{pair.text}</span>
                                <div className="pair-actions">
                                    <button onClick={() => handleEditPair(pair)} disabled={loading}>Editar</button>
                                    <button onClick={() => handleRemovePair(pair.id)} disabled={loading}>Remover</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className="settings-actions">
                    <button className="save-button" onClick={handleSave}>Salvar e Fechar</button>
                </div>
            </div>
        </div>
    );
};

export default Settings;