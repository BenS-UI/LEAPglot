
import React, { useState } from 'react';
import StyledButton from '../StyledButton';

interface FlashcardsMenuProps {
  onStart: (shuffled: boolean) => void;
}

const FlashcardsMenu: React.FC<FlashcardsMenuProps> = ({ onStart }) => {
  const [shuffle, setShuffle] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-800 p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-cyan-400">Flashcards Options</h2>
      <div className="flex items-center space-x-4 mb-8">
        <label htmlFor="shuffle" className="text-lg">Shuffle cards:</label>
        <input
          type="checkbox"
          id="shuffle"
          checked={shuffle}
          onChange={() => setShuffle(!shuffle)}
          className="h-6 w-6 rounded text-cyan-500 focus:ring-cyan-600"
        />
      </div>
      <StyledButton onClick={() => onStart(shuffle)}>
        Start Session
      </StyledButton>
    </div>
  );
};

export default FlashcardsMenu;
