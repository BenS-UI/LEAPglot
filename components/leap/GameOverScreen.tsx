
import React from 'react';
import StyledButton from '../StyledButton';

interface GameOverScreenProps {
  score: number;
  level: number;
  onRestart: () => void;
  onExit: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, level, onRestart, onExit }) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center text-white">
      <div className="text-center p-8 bg-[var(--surface-glass)] border border-[var(--border-color)] rounded-2xl">
        <h1 className="font-display text-5xl font-bold mb-4 text-red-500">MISSION FAILED</h1>
        <p className="font-body text-2xl mb-2">Level Reached: {level}</p>
        <p className="font-body text-2xl mb-8">Final Score: {score}</p>
        <div className="flex space-x-4">
          <StyledButton
            onClick={onRestart}
          >
            Restart
          </StyledButton>
          <StyledButton
            onClick={onExit}
            className="!bg-slate-700/50"
          >
            Exit
          </StyledButton>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;
