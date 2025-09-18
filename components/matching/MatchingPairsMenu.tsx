import React, { useState } from 'react';
import StyledButton from '../StyledButton';

interface MatchingPairsMenuProps {
  onStart: (gridSize: number) => void;
  maxPairs: number;
}

const MatchingPairsMenu: React.FC<MatchingPairsMenuProps> = ({ onStart, maxPairs }) => {
  const [pairs, setPairs] = useState(Math.min(8, maxPairs));

  return (
    <div className="flex flex-col items-center justify-center bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-8 rounded-2xl shadow-lg text-white">
      <h2 className="text-3xl font-bold mb-6 text-[var(--highlight-neon)] drop-shadow-[0_0_8px_var(--highlight-neon-glow)] font-display">Matching Pairs</h2>
      <div className="mb-6 w-full">
        <label htmlFor="pairs-slider" className="block text-center text-lg mb-2">
          Number of Pairs: <span className="text-[var(--highlight-neon)] font-bold">{pairs}</span>
        </label>
        <input
          id="pairs-slider"
          type="range"
          min="2"
          max={maxPairs}
          value={pairs}
          onChange={(e) => setPairs(Number(e.target.value))}
          className="w-full accent-[var(--highlight-neon)]"
        />
      </div>
      <StyledButton onClick={() => onStart(pairs)}>
        Initiate
      </StyledButton>
    </div>
  );
};

export default MatchingPairsMenu;