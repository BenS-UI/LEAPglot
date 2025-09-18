import React from 'react';
import { List, AppState, View } from '../types';
import StyledButton from './StyledButton';
import DisconnectIcon from './icons/DisconnectIcon';

const CategorizingGame: React.FC<{ list: List, setAppState: React.Dispatch<React.SetStateAction<AppState>> }> = ({ list, setAppState }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 rounded-3xl bg-zinc-900/20 scanlines-overlay text-white text-center">
        <DisconnectIcon className="h-16 w-16 text-yellow-500 mb-4" />
        <h1 className="text-3xl font-bold mb-4 text-[var(--highlight-neon)] font-display">Categorizing Sim</h1>
        <p className="mb-6 text-zinc-600">// SIMULATION CORRUPTED - PENDING UPDATE //</p>
        <StyledButton onClick={() => setAppState({ view: View.GameMenu })}>
            Return to Hub
        </StyledButton>
    </div>
  );
};

export default CategorizingGame;