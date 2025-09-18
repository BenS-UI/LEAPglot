
import React, { useState, useEffect } from 'react';
import { Item } from '../../types';
import CorrectIncorrectButtons from './CorrectIncorrectButtons';
import StyledButton from '../StyledButton';

interface DataDeckSessionProps {
  items: Item[];
  onFinish: () => void;
  cue: keyof Item;
}

const DataDeckSession: React.FC<DataDeckSessionProps> = ({ items, onFinish, cue }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  
  const currentItem = items[currentIndex];

  const handleAssessment = (correct: boolean) => {
    if (correct) {
      setCorrectCount(prev => prev + 1);
    } else {
      setIncorrectCount(prev => prev + 1);
    }
    
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      // Last card, wait for finish click.
      // To prevent showing the buttons after the last assessment, we can move to an index out of bounds.
      setCurrentIndex(items.length);
    }
  };

  const isFinished = currentIndex >= items.length;
  
  if (isFinished) {
      return (
          <div className="bg-zinc-900/50 backdrop-blur-md p-8 rounded-2xl text-center border border-zinc-800">
            <h2 className="text-3xl text-green-400 font-bold mb-4 font-display">Session Complete!</h2>
            <p className="text-xl mb-2">Correct: {correctCount}</p>
            <p className="text-xl mb-6">Incorrect: {incorrectCount}</p>
            <StyledButton onClick={onFinish}>Finish</StyledButton>
          </div>
      );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-2xl p-4">
        <div className="w-full mb-4 flex justify-between uppercase tracking-wider text-zinc-600">
            <p>Card: {currentIndex + 1} / {items.length}</p>
            <div className="flex space-x-4">
                <p className="text-green-400">Correct: {correctCount}</p>
                <p className="text-red-400">Incorrect: {incorrectCount}</p>
            </div>
        </div>
      
        <div className="w-full h-80 mb-6 perspective-1000 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'transform-rotate-y-180' : ''}`}>
                <div className="absolute w-full h-full backface-hidden bg-[var(--surface-glass)] backdrop-blur-md rounded-2xl flex items-center justify-center p-6 shadow-lg border border-[var(--border-color)]">
                  <p className="text-3xl text-center text-[var(--highlight-neon)] drop-shadow-[0_0_8px_var(--highlight-neon-glow)]">{currentItem.term}</p>
                </div>
                <div className="absolute w-full h-full backface-hidden bg-[var(--surface-glass)] backdrop-blur-md rounded-2xl flex items-center justify-center p-6 shadow-lg border border-[var(--border-color)] transform-rotate-y-180">
                  <p className="text-2xl text-center text-zinc-500">{currentItem[cue] || 'N/A'}</p>
                </div>
            </div>
        </div>

        {isFlipped && (
            <CorrectIncorrectButtons onAssess={handleAssessment} />
        )}
    </div>
  );
};

export default DataDeckSession;