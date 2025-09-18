
import React from 'react';
import { List, AppState, View } from '../../types';
import StyledButton from '../StyledButton';
import DisconnectIcon from '../icons/DisconnectIcon';

const SortOutGame: React.FC<{ list: List, setAppState: React.Dispatch<React.SetStateAction<AppState>> }> = ({ list, setAppState }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-800 p-4 rounded-lg text-white text-center">
      <DisconnectIcon className="h-16 w-16 text-yellow-500 mb-4" />
      <h1 className="text-3xl font-bold mb-4 text-cyan-400">Sort Out Game</h1>
      <p className="mb-6">This game is currently under construction.</p>
      <StyledButton onClick={() => setAppState({ view: View.GameMenu })}>
        Back to Game Menu
      </StyledButton>
    </div>
  );
};

export default SortOutGame;
