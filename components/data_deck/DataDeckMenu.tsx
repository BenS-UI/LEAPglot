import React, { useState } from 'react';
import { List, Item, AppState, View } from '../../types';
import StyledButton from '../StyledButton';
import { sfx } from '../../utils/sfx';

interface DataDeckMenuProps {
  list: List;
  onStart: (items: Item[]) => void;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}

const DataDeckMenu: React.FC<DataDeckMenuProps> = ({ list, onStart, setAppState }) => {
  const [numItems, setNumItems] = useState(Math.min(10, list.items.length));
  const [shuffle, setShuffle] = useState(true);

  const handleStart = () => {
    let itemsToStudy = shuffle ? [...list.items].sort(() => 0.5 - Math.random()) : [...list.items];
    itemsToStudy = itemsToStudy.slice(0, numItems);
    onStart(itemsToStudy);
  };
  
  if (list.items.length < 1) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-2xl mb-4 font-display">// DATA SET EMPTY //</h2>
            <StyledButton onClick={() => setAppState({ view: View.ListEditor, listId: list.id })}>
                Append Data
            </StyledButton>
        </div>
    );
  }

  return (
    <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-8 rounded-2xl shadow-xl max-w-md w-full">
      <h2 className="text-3xl font-bold mb-6 text-[var(--highlight-neon)] drop-shadow-[0_0_8px_var(--highlight-neon-glow)] text-center font-display">Data Deck</h2>
      <div className="space-y-6">
        <div>
          <label htmlFor="num-items" className="block text-lg mb-2 uppercase tracking-wider">Cards: <span className="text-[var(--highlight-neon)] font-bold">{numItems}</span></label>
          <input
            id="num-items"
            type="range"
            min="1"
            max={list.items.length}
            value={numItems}
            onChange={(e) => setNumItems(Number(e.target.value))}
            className="w-full accent-[var(--highlight-neon)]"
          />
        </div>
        <div className="flex items-center justify-center space-x-4">
          <label htmlFor="shuffle" className="text-lg uppercase tracking-wider">Shuffle Deck</label>
          <input
            type="checkbox"
            id="shuffle"
            checked={shuffle}
            onChange={() => {
              sfx.playToggle();
              setShuffle(!shuffle);
            }}
            className="h-6 w-6 rounded text-[var(--highlight-neon)] bg-zinc-800 border-zinc-700 focus:ring-offset-0 focus:ring-2 focus:ring-[var(--highlight-neon-glow)]"
          />
        </div>
      </div>
      <div className="mt-8">
        <StyledButton onClick={handleStart} className="w-full">
          Start Session
        </StyledButton>
      </div>
    </div>
  );
};

export default DataDeckMenu;