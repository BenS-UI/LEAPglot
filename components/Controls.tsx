
import React from 'react';
import StyledButton from './StyledButton';

interface ControlsProps {
  onReset: () => void;
  onNewGame: () => void;
  moves: number;
  time: string;
}

const Controls: React.FC<ControlsProps> = ({ onReset, onNewGame, moves, time }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg my-4">
      <div className="flex space-x-4">
        <StyledButton onClick={onReset}>Reset</StyledButton>
        <StyledButton onClick={onNewGame}>New Game</StyledButton>
      </div>
      <div className="flex space-x-6 text-lg">
        <div>
          <span className="font-bold text-cyan-400">Moves: </span>
          <span>{moves}</span>
        </div>
        <div>
          <span className="font-bold text-cyan-400">Time: </span>
          <span>{time}</span>
        </div>
      </div>
    </div>
  );
};

export default Controls;
