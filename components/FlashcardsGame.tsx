
import React from 'react';
import { List, AppState, Item } from '../types';
import StudyView from './StudyView';

interface FlashcardsGameProps {
  list: List;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  cue: keyof Item;
}

const FlashcardsGame: React.FC<FlashcardsGameProps> = ({ list, setAppState, cue }) => {
  return (
    <div className="w-full h-full p-4 md:p-6 bg-zinc-900/20 rounded-3xl scanlines-overlay">
        <StudyView list={list} setAppState={setAppState} cue={cue} />
    </div>
  );
};

export default FlashcardsGame;