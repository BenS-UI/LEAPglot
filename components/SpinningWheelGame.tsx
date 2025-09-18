
import React, { useState, useCallback } from 'react';
import { List, AppState, View, Item } from '../types';
import Wheel, { WheelSegment } from './Wheel';
import StyledButton from './StyledButton';
import { sfx } from '../utils/sfx';

type GameMode = 'menu' | 'oracle' | 'cognitive';

interface SpinningWheelGameProps {
  list: List;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  cue: keyof Item;
}

const SpinningWheelGame: React.FC<SpinningWheelGameProps> = ({ list, setAppState, cue }) => {
  const [mode, setMode] = useState<GameMode>('menu');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentQuestion, setCurrentQuestion] = useState<Item | null>(null);
  const [segments, setSegments] = useState<WheelSegment[]>([]);
  const [result, setResult] = useState<WheelSegment | null>(null);
  const [message, setMessage] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const setupOracleMode = useCallback(() => {
    const oracleSegments: WheelSegment[] = list.items.map(item => ({
      text: item.term,
      type: 'item',
    }));
    setSegments(oracleSegments);
    setMode('oracle');
    setResult(null);
    setMessage('');
  }, [list.items]);
  
  const setupCognitiveRound = useCallback(() => {
    const validItems = list.items.filter(item => item[cue]);
    if (validItems.length < 4) return;

    const shuffled = shuffleArray(validItems);
    const question = shuffled[0];
    const distractors = shuffled.slice(1, 4);

    // FIX: Add `as const` to the `type` properties to ensure TypeScript infers them as string literals, matching the `WheelSegment` type.
    const newSegments: WheelSegment[] = [
      { text: question.term, type: 'item' as const, isCorrect: true },
      ...distractors.map(item => ({ text: item.term, type: 'item' as const, isCorrect: false })),
      { text: '❤️ +1 Life', type: 'bonus_life' as const },
      { text: '✨ +100', type: 'bonus_points' as const },
    ];

    setCurrentQuestion(question);
    setSegments(shuffleArray(newSegments));
    setResult(null);
    setMessage('');
  }, [list.items, cue]);

  const startCognitiveMode = useCallback(() => {
    setScore(0);
    setLives(3);
    setIsGameOver(false);
    setupCognitiveRound();
    setMode('cognitive');
  }, [setupCognitiveRound]);

  const handleSpinEnd = (landedSegment: WheelSegment) => {
    setResult(landedSegment);
    
    if (mode === 'cognitive') {
      let nextLives = lives;
      let nextScore = score;
      
      if (landedSegment.type === 'item') {
        if (landedSegment.isCorrect) {
          sfx.playSuccess();
          setMessage('// CORRECT // +50 POINTS');
          nextScore += 50;
        } else {
          sfx.playError();
          setMessage('// INCORRECT // -1 LIFE');
          nextLives -= 1;
        }
      } else if (landedSegment.type === 'bonus_life') {
        sfx.playPowerUp();
        setMessage('// LIFE GAINED //');
        nextLives += 1;
      } else if (landedSegment.type === 'bonus_points') {
        sfx.playCoin();
        setMessage('// BONUS POINTS // +100');
        nextScore += 100;
      }

      setScore(nextScore);
      setLives(nextLives);

      if (nextLives <= 0) {
        setMessage('// SIMULATION OVER //');
        setIsGameOver(true);
      } else {
        setTimeout(() => setupCognitiveRound(), 2000);
      }
    }
  };

  const renderMenu = () => (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-2 text-[var(--highlight-neon)] drop-shadow-[0_0_8px_var(--highlight-neon-glow)] font-display">Oracle Wheel</h1>
      <p className="text-lg text-zinc-500 mb-8">Choose your simulation mode.</p>
      <div className="space-y-4">
        <StyledButton onClick={setupOracleMode} className="w-64">Oracle's Choice</StyledButton>
        <StyledButton onClick={startCognitiveMode} className="w-64">Cognitive Lock</StyledButton>
      </div>
       <StyledButton onClick={() => setAppState({ view: View.GameMenu })} className="mt-8 !bg-transparent hover:!bg-zinc-800/50">
        Return to Hub
      </StyledButton>
    </div>
  );

  const renderGame = () => {
    const isCognitive = mode === 'cognitive';
    return (
        <div className="flex flex-col items-center justify-start h-full w-full">
            <div className="w-full flex justify-between items-center p-4 mb-2">
                 <h1 className="text-2xl font-bold text-zinc-500 font-display">
                    {isCognitive ? "Cognitive Lock" : "Oracle's Choice"}
                </h1>
                {isCognitive && (
                    <div className="flex space-x-6 text-lg">
                        <span>Score: <span className="text-[var(--highlight-neon)] font-bold">{score}</span></span>
                        <span>Lives: <span className="text-[var(--highlight-neon)] font-bold">{lives}</span></span>
                    </div>
                )}
            </div>

            {isCognitive && currentQuestion && (
                <div className="w-full max-w-lg text-center p-4 mb-4 bg-zinc-950/50 rounded-xl border border-zinc-800">
                    <p className="text-sm text-zinc-600 uppercase tracking-wider">{cue}:</p>
                    <p className="text-lg text-[var(--highlight-neon)]">{currentQuestion[cue] as string}</p>
                </div>
            )}

            <Wheel segments={segments} onSpinEnd={handleSpinEnd} />

             <div className="h-16 mt-4 text-center">
                {message && <p className="text-xl text-yellow-400 font-display">{message}</p>}
                {result && !message && (
                    <div>
                        <h2 className="text-xl font-bold text-yellow-400 font-display">Result:</h2>
                        <p className="text-2xl mt-1 text-[var(--highlight-neon)]">{result.text}</p>
                    </div>
                )}
            </div>

            {isGameOver ? (
                <StyledButton onClick={startCognitiveMode} className="mt-4">Re-engage</StyledButton>
            ) : null}

            <StyledButton onClick={() => setMode('menu')} className="mt-4 !bg-transparent hover:!bg-zinc-800/50">
                Change Mode
            </StyledButton>
        </div>
    );
  };
  
  if (list.items.filter(item => item[cue]).length < 4 && mode !== 'oracle') {
     return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <h2 className="text-2xl mb-4 font-display">// INSUFFICIENT DATA //</h2>
            <p className="mb-4">"Cognitive Lock" mode requires at least 4 items with the selected cue.</p>
            <div className="flex space-x-4">
                <StyledButton onClick={setupOracleMode}>Play Oracle's Choice</StyledButton>
                <StyledButton onClick={() => setAppState({ view: View.ListEditor, listId: list.id })}>Modify Data Set</StyledButton>
            </div>
        </div>
     );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 rounded-3xl bg-zinc-900/20 scanlines-overlay">
      {mode === 'menu' ? renderMenu() : renderGame()}
    </div>
  );
};

export default SpinningWheelGame;
