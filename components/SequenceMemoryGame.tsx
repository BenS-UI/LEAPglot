
import React, { useState, useEffect, useCallback } from 'react';
import { List, Item, AppState, View, GameResult } from '../types';
import StyledButton from './StyledButton';

interface SequenceMemoryGameProps {
    list: List;
    setAppState: React.Dispatch<React.SetStateAction<AppState>>;
    logGameResult: (result: Omit<GameResult, 'timestamp'>) => void;
}

const SequenceMemoryGame: React.FC<SequenceMemoryGameProps> = ({ list, setAppState, logGameResult }) => {
    const [sequence, setSequence] = useState<Item[]>([]);
    const [playerSequence, setPlayerSequence] = useState<Item[]>([]);
    const [level, setLevel] = useState(1);
    const [gameState, setGameState] = useState<'showing' | 'playing' | 'gameOver' | 'menu'>('menu');
    const [message, setMessage] = useState('');

    const generateSequence = useCallback((currentLevel: number) => {
        const shuffled = [...list.items].sort(() => 0.5 - Math.random());
        setSequence(shuffled.slice(0, currentLevel));
    }, [list.items]);

    const startGame = () => {
        setLevel(1);
        setPlayerSequence([]);
        generateSequence(1);
        setGameState('showing');
        setMessage('// MEMORIZE SEQUENCE //');
    };
    
    const endGame = useCallback((endMessage: string) => {
        if (gameState === 'playing') {
            logGameResult({
                game: 'Sequence Memory',
                listName: list.name,
                score: level - 1, // Log the last successfully completed level
                total: list.items.length
            });
            setGameState('gameOver');
            setMessage(endMessage);
        }
    }, [gameState, level, list.name, list.items.length, logGameResult]);


    useEffect(() => {
        if (gameState === 'showing') {
            const timer = setTimeout(() => {
                setGameState('playing');
                setMessage('// YOUR TURN //');
            }, level * 1500 + 1000);
            return () => clearTimeout(timer);
        }
    }, [gameState, level]);

    const handleItemClick = (item: Item) => {
        if (gameState !== 'playing') return;

        const newPlayerSequence = [...playerSequence, item];
        setPlayerSequence(newPlayerSequence);

        if (item.id !== sequence[newPlayerSequence.length - 1].id) {
            endGame(`// SEQUENCE FAILURE // LEVEL ${level}`);
            return;
        }

        if (newPlayerSequence.length === sequence.length) {
            const nextLevel = level + 1;
            if (nextLevel > list.items.length) {
                endGame(`// SUCCESS // ALL ${list.items.length} LEVELS COMPLETE!`);
            } else {
                setLevel(nextLevel);
                setPlayerSequence([]);
                generateSequence(nextLevel);
                setGameState('showing');
                setMessage('// CORRECT // INITIATING NEXT LEVEL...');
            }
        }
    };
    
    if (list.items.length < 1) {
        return (
             <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-2xl mb-4 font-display">// DATA SET EMPTY //</h2>
                <StyledButton onClick={() => setAppState({ view: View.ListEditor, listId: list.id })}>
                    Append Data
                </StyledButton>
            </div>
        );
    }
    
     if (gameState === 'menu') {
        return (
            <div className="flex flex-col items-center justify-center h-full p-4 rounded-3xl bg-zinc-900/20 scanlines-overlay">
                <h1 className="text-4xl font-bold mb-4 text-[var(--highlight-neon)] font-display drop-shadow-[0_0_10px_var(--highlight-neon-glow)]">Sequence Memory</h1>
                <p className="text-lg mb-8 text-center">Memorize and repeat the sequence of data points.</p>
                <StyledButton onClick={startGame}>Initiate</StyledButton>
                 <StyledButton onClick={() => setAppState({ view: View.GameMenu })} className="mt-4 !bg-transparent hover:!bg-zinc-800/50">
                    Egress
                </StyledButton>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full w-full p-4 rounded-3xl bg-zinc-900/20 scanlines-overlay">
            <h1 className="text-3xl font-bold mb-2 text-zinc-500 font-display">Sequence Memory</h1>
            <p className="text-xl mb-4">Level: <span className="text-[var(--highlight-neon)]">{level}</span></p>
            <p className="text-lg mb-6 h-6 text-yellow-400">{message}</p>
            
            {gameState === 'gameOver' && (
                <div className="flex flex-col items-center">
                    <StyledButton onClick={startGame}>Re-Engage</StyledButton>
                    <StyledButton onClick={() => setAppState({ view: View.GameMenu })} className="mt-4 !bg-transparent hover:!bg-zinc-800/50">
                        Egress
                    </StyledButton>
                </div>
            )}
            
            {gameState === 'showing' && (
                 <div className="flex flex-wrap justify-center gap-4">
                    {sequence.map((item, index) => (
                         <div key={`${item.id}-${index}`} className="w-40 h-24 bg-cyan-900/50 rounded-xl flex items-center justify-center p-2 text-center shadow-lg border border-cyan-700 animate-pulse" style={{ animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) ${index * 1.5}s infinite` }}>
                            {item.term}
                        </div>
                    ))}
                </div>
            )}
            
            {gameState === 'playing' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {list.items.map(item => (
                        <StyledButton key={item.id} onClick={() => handleItemClick(item)} className="h-24 text-lg">
                            {item.term}
                        </StyledButton>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SequenceMemoryGame;