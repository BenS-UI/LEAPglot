
import React from 'react';
import { List, AppState, Item, GameResult } from '../types';
import MatchingPairsSession from './matching/MatchingPairsSession';

interface MatchingPairsGameProps {
  list: List;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  cue: keyof Item;
  logGameResult: (result: Omit<GameResult, 'timestamp'>) => void;
}

const MatchingPairsGame: React.FC<MatchingPairsGameProps> = ({ list, setAppState, cue, logGameResult }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 md:p-6 bg-zinc-900/20 rounded-3xl scanlines-overlay">
      <MatchingPairsSession list={list} setAppState={setAppState} cue={cue} logGameResult={logGameResult} />
    </div>
  );
};

export default MatchingPairsGame;