
import React from 'react';
import GameCanvas from './leap/GameCanvas';
import { List, AppState, View, Item, GameResult } from '../types';
import DisconnectIcon from './icons/DisconnectIcon';
import StyledButton from './StyledButton';

interface LeapGameProps {
  list: List;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  cue: keyof Item;
  logGameResult: (result: Omit<GameResult, 'timestamp'>) => void;
}

const LeapGame: React.FC<LeapGameProps> = ({ list, setAppState, cue, logGameResult }) => {
  if (list.items.length < 5) {
      return (
             <div className="flex flex-col items-center justify-center h-full p-4 rounded-3xl bg-zinc-900/20 text-white text-center scanlines-overlay">
                 <DisconnectIcon className="h-16 w-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2 font-display">// INSUFFICIENT DATA //</h2>
                <p className="mb-4">LEAP! simulation requires at least 5 data points to generate lanes.</p>
                <StyledButton onClick={() => setAppState({ view: View.ListEditor, listId: list.id })}>
                    Modify Data Set
                </StyledButton>
            </div>
        );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full rounded-3xl overflow-hidden bg-[var(--background-dark)]">
      <GameCanvas items={list.items} setAppState={setAppState} cue={cue} logGameResult={logGameResult} listName={list.name} />
    </div>
  );
};

export default LeapGame;