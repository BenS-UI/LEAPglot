
import React, { useState, useMemo } from 'react';
import { Item } from '../../types';
import SelfAssessment from '../SelfAssessment';
import { SrsGrade } from '../../utils/srs';

interface FlashcardsSessionProps {
  items: Item[];
  onFinish: () => void;
}

const FlashcardsSession: React.FC<FlashcardsSessionProps> = ({ items, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentItem = useMemo(() => items[currentIndex], [items, currentIndex]);

  const handleGrade = (grade: SrsGrade) => {
    // In a full SRS implementation, you'd save the grade here.
    console.log(`Card "${currentItem.term}" graded with: ${grade}`);
    goToNextCard();
  };

  const goToNextCard = () => {
    setIsFlipped(false);
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onFinish();
    }
  };

  return (
    <div className="w-full max-w-2xl flex flex-col items-center">
      <div className="w-full h-80 mb-4 cursor-pointer perspective-1000" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'transform-rotate-y-180' : ''}`}>
          <div className="absolute w-full h-full backface-hidden bg-cyan-700 rounded-lg flex items-center justify-center p-6 shadow-lg">
            <p className="text-3xl text-center">{currentItem.term}</p>
          </div>
          <div className="absolute w-full h-full backface-hidden bg-indigo-700 rounded-lg flex items-center justify-center p-6 shadow-lg transform-rotate-y-180">
            <p className="text-2xl text-center">{currentItem.definition}</p>
          </div>
        </div>
      </div>

      {isFlipped && <SelfAssessment onGrade={handleGrade} />}

      <div className="mt-4 text-gray-400">
        Card {currentIndex + 1} of {items.length}
      </div>
    </div>
  );
};

export default FlashcardsSession;
