import React, { useState, useEffect, useCallback, useRef } from 'react';
import { List, Item, AppState, View, GameResult } from '../types';
import StyledButton from './StyledButton';
import VolumeUpIcon from './icons/VolumeUpIcon';
import { tts } from '../utils/tts';
import SecondaryButton from './SecondaryButton';
import { sfx } from '../utils/sfx';

interface SpellingBeeGameProps {
    list: List;
    setAppState: React.Dispatch<React.SetStateAction<AppState>>;
    logGameResult: (result: Omit<GameResult, 'timestamp'>) => void;
}

const SpellingBeeGame: React.FC<SpellingBeeGameProps> = ({ list, setAppState, logGameResult }) => {
    const [currentItem, setCurrentItem] = useState<Item | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    const [remainingItems, setRemainingItems] = useState<Item[]>([]);
    const [mistakes, setMistakes] = useState<Item[]>([]);
    const [gameState, setGameState] = useState<'playing' | 'finished' | 'menu'>('menu');
    const inputRef = useRef<HTMLInputElement>(null);

    const setupGame = useCallback(() => {
        const shuffled = [...list.items].sort(() => 0.5 - Math.random());
        setRemainingItems(shuffled);
        setCurrentItem(shuffled[0] || null);
        setScore(0);
        setMistakes([]);
        setFeedback('');
        setIsCorrect(null);
        setInputValue('');
        setGameState('playing');
        if(shuffled[0]) {
            tts.speak(shuffled[0].term);
        }
    }, [list.items]);

    useEffect(() => {
        if (gameState === 'playing' && inputRef.current) {
            inputRef.current.focus();
        }
    }, [gameState, currentItem]);

    const nextWord = useCallback(() => {
        const newRemaining = remainingItems.slice(1);
        setRemainingItems(newRemaining);
        if (newRemaining.length > 0) {
            const nextItem = newRemaining[0];
            setCurrentItem(nextItem);
            tts.speak(nextItem.term);
        } else {
            setGameState('finished');
        }
        setInputValue('');
        setFeedback('');
        setIsCorrect(null);
    }, [remainingItems]);

    const handleCheck = () => {
        if (!currentItem) return;
        sfx.playEnter();
        if (inputValue.trim().toLowerCase() === currentItem.term.toLowerCase()) {
            setFeedback('// CORRECT //');
            setIsCorrect(true);
            setScore(prev => prev + 1);
            sfx.playSuccess();
            setTimeout(nextWord, 1000);
        } else {
            setFeedback(`// INCORRECT // -> ${currentItem.term}`);
            setIsCorrect(false);
            setMistakes(prev => [...prev, currentItem]);
            sfx.playError();
            setTimeout(nextWord, 3000);
        }
    };
    
    const handleSkip = () => {
        if (!currentItem) return;
        setFeedback(`// SKIPPED // -> ${currentItem.term}`);
        setIsCorrect(false);
        setMistakes(prev => [...prev, currentItem]);
        setTimeout(nextWord, 3000);
    };
    
    useEffect(() => {
        if (gameState === 'finished' && list.items.length > 0) {
            logGameResult({
                game: 'Spelling Bee',
                listName: list.name,
                score,
                total: list.items.length,
                mistakes
            });
        }
    }, [gameState, list, score, mistakes, logGameResult]);


    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleCheck();
        } else if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Delete') {
            sfx.playTyping();
        }
    };

    const renderContent = () => {
        if (list.items.length < 1) {
            return (
                <div className="flex flex-col items-center justify-center h-full">
                    <h2 className="text-2xl mb-4">// DATA SET EMPTY //</h2>
                </div>
            )
        }
        
        if (gameState === 'menu') {
            return (
                 <div className="flex flex-col items-center justify-center h-full p-8">
                    <h1 className="text-4xl font-bold mb-4 text-[var(--highlight-neon)] font-display drop-shadow-[0_0_10px_var(--highlight-neon-glow)]">Spelling Matrix</h1>
                    <p className="text-lg mb-8 text-center text-zinc-500">Process auditory data and input correct sequence.</p>
                    <StyledButton onClick={setupGame}>Initiate</StyledButton>
                     <StyledButton onClick={() => setAppState({ view: View.GameMenu })} className="mt-4 !bg-transparent hover:!bg-zinc-800/50">
                        Egress
                    </StyledButton>
                </div>
            )
        }
        
        if (gameState === 'finished') {
            return (
                 <div className="flex flex-col items-center justify-center h-full p-8">
                    <h1 className="text-4xl font-bold mb-4 text-green-400 font-display">Protocol Complete</h1>
                    <p className="text-2xl mb-8">Score: {score} / {list.items.length}</p>
                    <StyledButton onClick={setupGame}>Re-Engage</StyledButton>
                     <StyledButton onClick={() => setAppState({ view: View.GameMenu })} className="mt-4 !bg-transparent hover:!bg-zinc-800/50">
                        Egress
                    </StyledButton>
                </div>
            )
        }

        return (
            <div className="flex flex-col items-center justify-center h-full w-full max-w-2xl mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4 text-zinc-500 font-display">Spelling Matrix</h1>
                <p className="text-zinc-600 mb-8">Data Point {list.items.length - remainingItems.length + 1} of {list.items.length}</p>

                <div className="mb-8">
                    <button onClick={() => currentItem && tts.speak(currentItem.term)} className="p-4 bg-zinc-800/50 rounded-full hover:bg-cyan-600/50 transition-colors border border-zinc-700 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                        <VolumeUpIcon className="h-12 w-12"/>
                    </button>
                </div>
                
                <div className="w-full mb-4">
                     <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className={`w-full text-center text-2xl p-4 bg-zinc-950/50 border-2 rounded-lg focus:outline-none transition-all font-mono tracking-widest
                            ${isCorrect === true ? 'border-green-500 text-green-400' : ''}
                            ${isCorrect === false ? 'border-red-500 text-red-400' : 'border-zinc-800 focus:border-[var(--highlight-neon)]'}`
                        }
                        placeholder=">_"
                        disabled={isCorrect !== null}
                     />
                </div>
                
                 <div className="h-8 mb-8 text-lg text-center font-mono">
                    {feedback && (
                        <p className={isCorrect ? 'text-green-400' : 'text-red-400'}>{feedback}</p>
                    )}
                </div>

                <div className="flex space-x-4">
                    <StyledButton onClick={handleCheck} disabled={isCorrect !== null}>Confirm</StyledButton>
                    <SecondaryButton onClick={handleSkip} disabled={isCorrect !== null}>Skip</SecondaryButton>
                </div>
            </div>
        );
    }
    
    return (
        <div className="h-full w-full rounded-3xl bg-zinc-900/20 scanlines-overlay">
            {renderContent()}
        </div>
    )
};

export default SpellingBeeGame;