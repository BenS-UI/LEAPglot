
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { List, Item, AppState, View } from '../types';
import { getNextSrsItem, updateSrsItem, SrsGrade } from '../utils/srs';
import SelfAssessment from './SelfAssessment';
import StyledButton from './StyledButton';

interface StudyViewProps {
  list: List;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  cue: keyof Item;
}

const StudyView: React.FC<StudyViewProps> = ({ list, setAppState, cue }) => {
  const [studyItems, setStudyItems] = useState<Item[]>(list.items);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  
  const dueItems = useMemo(() => studyItems.filter(item => {
      const nextReview = item.nextReview || 0;
      return nextReview <= Date.now();
  }), [studyItems]);

  const getNextItem = useCallback(() => {
    const nextItem = getNextSrsItem(studyItems);
    setCurrentItem(nextItem);
    if (!nextItem) {
      setSessionComplete(true);
    }
  }, [studyItems]);

  useEffect(() => {
    getNextItem();
  }, [getNextItem]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleGrade = (grade: SrsGrade) => {
    if (currentItem) {
      const updatedItem = updateSrsItem(currentItem, grade);
      setStudyItems(prevItems =>
        prevItems.map(item => (item.id === currentItem.id ? updatedItem : item))
      );
      setIsFlipped(false);
      getNextItem();
    }
  };
  
  const restartSession = () => {
    setSessionComplete(false);
    getNextItem();
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-display text-zinc-500">Flashcards</h1>
           <StyledButton onClick={() => setAppState({ view: View.GameMenu })}>
            Egress
          </StyledButton>
        </div>
        
        <div className="mb-4 text-center p-2 bg-zinc-950/50 rounded-xl border border-zinc-800">
            <p className="uppercase tracking-wider">Due items: <span className="font-bold text-[var(--highlight-neon)]">{dueItems.length}</span> / {studyItems.length}</p>
        </div>

        {sessionComplete ? (
          <div className="text-center p-10 bg-zinc-900/50 rounded-2xl border border-zinc-800">
            <h2 className="text-2xl font-bold text-green-400 font-display">Session Complete!</h2>
            <p className="mt-2 text-zinc-600">All due data points have been reviewed.</p>
            <StyledButton onClick={restartSession} className="mt-6">Repeat Protocol</StyledButton>
          </div>
        ) : currentItem ? (
          <div>
            <div className="perspective-1000 h-80 w-full cursor-pointer" onClick={handleFlip}>
              <div
                className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'transform-rotate-y-180' : ''}`}
              >
                <div className="absolute w-full h-full backface-hidden bg-[var(--surface-glass)] backdrop-blur-md rounded-2xl flex items-center justify-center p-6 shadow-lg border border-[var(--border-color)]">
                  <p className="text-3xl text-center text-[var(--highlight-neon)] drop-shadow-[0_0_8px_var(--highlight-neon-glow)]">{currentItem.term}</p>
                </div>
                <div className="absolute w-full h-full backface-hidden bg-[var(--surface-glass)] backdrop-blur-md rounded-2xl flex items-center justify-center p-6 shadow-lg border border-[var(--border-color)] transform-rotate-y-180">
                  <p className="text-2xl text-center text-zinc-500">{currentItem[cue] || 'N/A'}</p>
                </div>
              </div>
            </div>
            {isFlipped && <SelfAssessment onGrade={handleGrade} />}
          </div>
        ) : (
             <div className="text-center p-10 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                <h2 className="text-2xl font-bold font-display">// LOADING DATA STREAM...</h2>
             </div>
        )}
      </div>
    </div>
  );
};

export default StudyView;