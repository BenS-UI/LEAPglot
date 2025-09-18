
import React from 'react';
import { Difficulty } from './types';
import StyledButton from '../StyledButton';

interface DifficultyMenuProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

const DifficultyMenu: React.FC<DifficultyMenuProps> = ({ onSelectDifficulty }) => {
  return (
    <div className="absolute inset-0 bg-[var(--background-dark)] bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center text-white">
      <h1 className="font-display text-5xl font-bold mb-12 text-[var(--highlight-neon)] drop-shadow-[0_0_10px_var(--highlight-neon-glow)]">
        LEAP!
      </h1>
      <div className="flex flex-col space-y-4 w-64">
        {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((level) => (
          <StyledButton
            key={level}
            onClick={() => onSelectDifficulty(level)}
            className="text-2xl"
          >
            {level}
          </StyledButton>
        ))}
      </div>
    </div>
  );
};

export default DifficultyMenu;
