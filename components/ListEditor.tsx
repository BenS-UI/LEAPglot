import React, { useState } from 'react';
import { List, Item, AppState, View } from '../types';
import StyledButton from './StyledButton';
import StyledInput from './StyledInput';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';
import EditIcon from './icons/EditIcon';
import BulkAddModal from './BulkAddModal';
import { sfx } from '../utils/sfx';

interface ListEditorProps {
  list: List;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  updateList: (listId: string, updatedList: List) => void;
}

const ListEditor: React.FC<ListEditorProps> = ({ list, setAppState, updateList }) => {
  const [items, setItems] = useState<Item[]>(list.items);
  const [newTerm, setNewTerm] = useState('');
  const [newDefinition, setNewDefinition] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingTerm, setEditingTerm] = useState('');
  const [editingDefinition, setEditingDefinition] = useState('');
  const [isBulkAddModalOpen, setIsBulkAddModalOpen] = useState(false);

  const handleAddItem = () => {
    if (newTerm.trim() && newDefinition.trim()) {
      const newItem: Item = {
        id: `item-${Date.now()}`,
        term: newTerm,
        definition: newDefinition,
      };
      const updatedItems = [...items, newItem];
      setItems(updatedItems);
      updateList(list.id, { ...list, items: updatedItems });
      setNewTerm('');
      setNewDefinition('');
      sfx.playSuccess();
    } else {
      sfx.playError();
    }
  };
  
  const handleBulkAdd = (bulkItems: Omit<Item, 'id'>[]) => {
    const newItems: Item[] = bulkItems.map((item, index) => ({
      id: `item-${Date.now()}-${index}`,
      ...item
    }));
    const updatedItems = [...items, ...newItems];
    setItems(updatedItems);
    updateList(list.id, { ...list, items: updatedItems });
    setIsBulkAddModalOpen(false);
  }

  const handleDeleteItem = (id: string) => {
    sfx.playTrash();
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    updateList(list.id, { ...list, items: updatedItems });
  };
  
  const handleStartEdit = (item: Item) => {
    sfx.playClick();
    setEditingItemId(item.id);
    setEditingTerm(item.term);
    setEditingDefinition(item.definition);
  };

  const handleCancelEdit = () => {
    sfx.playClick();
    setEditingItemId(null);
    setEditingTerm('');
    setEditingDefinition('');
  };

  const handleSaveEdit = (id: string) => {
    if (editingTerm.trim() && editingDefinition.trim()) {
        const updatedItems = items.map(item =>
            item.id === id ? { ...item, term: editingTerm, definition: editingDefinition } : item
        );
        setItems(updatedItems);
        updateList(list.id, { ...list, items: updatedItems });
        handleCancelEdit();
        sfx.playSuccess();
    } else {
        sfx.playError();
    }
  };


  return (
    <div className="p-6 bg-[var(--surface-glass)] backdrop-blur-lg border border-[var(--border-color)] rounded-3xl h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[var(--highlight-neon)] drop-shadow-[0_0_8px_var(--highlight-neon-glow)]">{list.name}</h1>
        <StyledButton onClick={() => setAppState({ view: View.GameMenu })}>Return to Hub</StyledButton>
      </div>
      
      <div className="mb-6 bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800">
        <h2 className="text-xl font-semibold mb-3">Append New Entry</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <StyledInput type="text" placeholder="Term" value={newTerm} onChange={e => setNewTerm(e.target.value)} />
          <StyledInput type="text" placeholder="Definition" value={newDefinition} onChange={e => setNewDefinition(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddItem()} />
          <StyledButton onClick={handleAddItem} className="flex items-center justify-center">
              <PlusIcon className="h-5 w-5 mr-1" /> Append
          </StyledButton>
          <StyledButton onClick={() => setIsBulkAddModalOpen(true)}>Batch Upload</StyledButton>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800">
        <h2 className="text-xl font-semibold mb-3">Data Entries ({items.length})</h2>
        <ul className="space-y-3">
          {items.map(item => (
            <li key={item.id} className="p-4 bg-zinc-900/70 rounded-xl border border-zinc-800">
                {editingItemId === item.id ? (
                     <div className="flex flex-col gap-2">
                        <StyledInput value={editingTerm} onChange={(e) => setEditingTerm(e.target.value)} />
                        <textarea 
                           value={editingDefinition} 
                           onChange={(e) => setEditingDefinition(e.target.value)} 
                           className="w-full h-24 px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl focus:outline-none focus:border-[var(--highlight-neon)] focus:ring-2 focus:ring-[var(--highlight-neon-glow)] text-white transition-all duration-300"
                        />
                        <div className="flex gap-2 justify-end mt-2">
                            <StyledButton onClick={() => handleSaveEdit(item.id)}>Commit</StyledButton>
                            <StyledButton onClick={handleCancelEdit} className="bg-gray-600 hover:bg-gray-700">Abort</StyledButton>
                        </div>
                     </div>
                ) : (
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="font-bold text-[var(--highlight-neon)]">{item.term}</p>
                            {item.synonym && <p className="text-sm text-zinc-500 italic">Syn: {item.synonym}</p>}
                            <p className="text-zinc-600 mt-1">{item.definition}</p>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                           <button onClick={() => handleStartEdit(item)} className="p-1 text-gray-400 hover:text-yellow-400">
                               <EditIcon className="h-5 w-5" />
                           </button>
                           <button onClick={() => handleDeleteItem(item.id)} className="p-1 text-gray-400 hover:text-red-500">
                               <TrashIcon className="h-5 w-5" />
                           </button>
                        </div>
                    </div>
                )}
            </li>
          ))}
        </ul>
      </div>

      {isBulkAddModalOpen && (
          <BulkAddModal
              onClose={() => setIsBulkAddModalOpen(false)}
              onBulkAdd={handleBulkAdd}
          />
      )}
    </div>
  );
};

export default ListEditor;