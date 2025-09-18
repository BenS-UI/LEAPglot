
import React, { useState } from 'react';
import { List, Item, AppState, View } from '../types';
import DataDeckMenu from './data_deck/DataDeckMenu';
import DataDeckSession from './data_deck/DataDeckSession';

interface DataDeckGameProps {
  list: List;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  cue: keyof Item;
}

const DataDeckGame: React.FC<DataDeckGameProps> = ({ list, setAppState, cue }) => {
  const [sessionItems, setSessionItems] = useState<Item[] | null>(null);

  const handleStart = (items: Item[]) => {
    setSessionItems(items);
  };
  
  const handleFinish = () => {
    setSessionItems(null);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 md:p-6 bg-zinc-900/20 rounded-3xl scanlines-overlay">
      {sessionItems ? (
        <DataDeckSession items={sessionItems} onFinish={handleFinish} cue={cue} />
      ) : (
        <DataDeckMenu list={list} onStart={handleStart} setAppState={setAppState} />
      )}
    </div>
  );
};

export default DataDeckGame;