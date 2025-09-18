
import React, { useState, useEffect, useMemo } from 'react';
import { List, Item, AppState, View, GameResult } from '../../types';
import Card from '../Card';
import StyledButton from '../StyledButton';
import MatchingPairsMenu from './MatchingPairsMenu';
import useMatchingAudio from './useMatchingAudio';
import { useMatchState, CardData } from './useMatchState';
import CloseIcon from '../icons/CloseIcon';

interface MatchingPairsSessionProps {
  list: List;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  cue: keyof Item;
  logGameResult: (result: Omit<GameResult, 'timestamp'>) => void;
}

const MatchingPairsSession: React.FC<MatchingPairsSessionProps> = ({ list, setAppState, cue, logGameResult }) => {
  const [sessionState, setSessionState] = useState<'menu' | 'playing' | 'finished'>('menu');
  const [enlargedCard, setEnlargedCard] = useState<CardData | null>(null);
  
  const { 
    cards, flippedCards, matchedPairs, moves, isFinished, 
    setupGame, onCardClick, checkMatch, checkForWin 
  } = useMatchState(list.items, cue);

  const { generateCues, playCardSound, playMatchSuccessSound, playMatchFailSound, playWinSound } = useMatchingAudio();
  
  const handleStart = (numPairs: number) => {
    const itemIds = setupGame(numPairs);
    generateCues(itemIds);
    setSessionState('playing');
  };

  const handleCardClick = (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (card && flippedCards.length < 2 && !flippedCards.includes(cardId)) {
      playCardSound(card.itemId);
    }
    onCardClick(cardId);
  };

  const handleEnlargeCard = (cardId: string) => {
    const cardToEnlarge = cards.find(c => c.id === cardId);
    if (cardToEnlarge) {
      setEnlargedCard(cardToEnlarge);
    }
  };
  
  useEffect(() => {
    const matchResult = checkMatch();
    if (matchResult === true) {
      playMatchSuccessSound();
    } else if (matchResult === false) {
      playMatchFailSound();
    }
  }, [flippedCards, checkMatch, playMatchSuccessSound, playMatchFailSound]);
  
  useEffect(() => {
      checkForWin();
  }, [matchedPairs, checkForWin]);
  
  useEffect(() => {
    if (isFinished && sessionState === 'playing') {
      playWinSound();
      logGameResult({
        game: 'Matching Pairs',
        listName: list.name,
        score: moves,
        total: cards.length / 2,
      });
      setSessionState('finished');
    }
  }, [isFinished, sessionState, playWinSound, list.name, moves, cards.length, logGameResult]);

  const gridCols = useMemo(() => {
      const numCards = cards.length;
      if (numCards <= 4) return 'grid-cols-2';
      if (numCards <= 6) return 'grid-cols-3';
      if (numCards <= 12) return 'grid-cols-4';
      if (numCards <= 16) return 'grid-cols-4';
      if (numCards <= 20) return 'grid-cols-5';
      return 'grid-cols-6';
  }, [cards]);

  if (sessionState === 'menu') {
    return <MatchingPairsMenu onStart={handleStart} maxPairs={list.items.filter(item => item[cue]).length} />;
  }
  
  return (
    <div className="flex flex-col items-center h-full w-full p-4">
      <div className="flex justify-between items-center w-full max-w-4xl mb-4">
        <h1 className="text-3xl font-bold font-display text-zinc-500">Matching Pairs</h1>
        <div className="text-xl">Moves: <span className="font-bold text-[var(--highlight-neon)]">{moves}</span></div>
      </div>

      <div className={`grid ${gridCols} gap-4 w-full max-w-4xl`}>
        {cards.map(card => (
          <Card
            key={card.id}
            id={card.id}
            content={card.content}
            isFlipped={flippedCards.includes(card.id) || matchedPairs.includes(card.itemId)}
            isMatched={matchedPairs.includes(card.itemId)}
            onClick={handleCardClick}
            onEnlarge={handleEnlargeCard}
            cardType={card.type}
          />
        ))}
      </div>
      
      {enlargedCard && (
        <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-md flex items-center justify-center z-20" onClick={() => setEnlargedCard(null)}>
            <div className="relative w-11/12 max-w-2xl h-auto max-h-[80vh] bg-zinc-900/80 border border-zinc-700 rounded-2xl p-8 shadow-xl text-white overflow-y-auto" onClick={e => e.stopPropagation()}>
                <button onClick={() => setEnlargedCard(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                    <CloseIcon className="h-6 w-6" />
                </button>
                <p className="text-2xl whitespace-pre-wrap">{enlargedCard.content}</p>
            </div>
        </div>
      )}

      {sessionState === 'finished' && (
        <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <div className="bg-zinc-900/80 border border-zinc-800 p-8 rounded-2xl text-center shadow-xl">
                <h2 className="text-4xl font-bold text-green-400 mb-4 font-display">Success!</h2>
                <p className="text-xl mb-6">Pairs matched in {moves} moves.</p>
                <div className="flex space-x-4">
                    <StyledButton onClick={() => setSessionState('menu')}>Play Again</StyledButton>
                    <StyledButton onClick={() => setAppState({ view: View.GameMenu })} className="!bg-zinc-700/50">Egress</StyledButton>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default MatchingPairsSession;
