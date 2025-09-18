
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { List, Item, AppState, View, GameResult } from '../types';
import StyledButton from './StyledButton';
import PlayerShipIcon from './icons/PlayerShipIcon';
import DisconnectIcon from './icons/DisconnectIcon';

interface InvadersGameProps {
    list: List;
    setAppState: React.Dispatch<React.SetStateAction<AppState>>;
    cue: keyof Item;
    logGameResult: (result: Omit<GameResult, 'timestamp'>) => void;
}

const InvadersGame: React.FC<InvadersGameProps> = ({ list, setAppState, cue, logGameResult }) => {
    const [gameState, setGameState] = useState<'playing' | 'gameOver' | 'menu'>('menu');
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [currentQuestion, setCurrentQuestion] = useState<Item | null>(null);
    const [answers, setAnswers] = useState<Item[]>([]);
    const [invaders, setInvaders] = useState<{ item: Item, x: number, y: number, id: string }[]>([]);
    const gameAreaRef = useRef<HTMLDivElement>(null);
    const gameLoopRef = useRef<number | undefined>(undefined);

    const shuffleArray = <T,>(array: T[]): T[] => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const endGame = useCallback(() => {
        if (gameState === 'playing') {
            logGameResult({
                game: 'Invaders',
                listName: list.name,
                score: score,
            });
            setGameState('gameOver');
        }
    }, [gameState, list.name, score, logGameResult]);

    const setupRound = useCallback(() => {
        const validItems = list.items.filter(item => item[cue]);
        if (validItems.length < 4) return;
        
        const shuffled = shuffleArray(validItems);
        const question = shuffled[0];
        const wrongAnswers = shuffled.slice(1, 4);
        setCurrentQuestion(question);
        setAnswers(shuffleArray([question, ...wrongAnswers]));
    }, [list.items, cue]);

    const startGame = () => {
        setScore(0);
        setLives(3);
        setupRound();
        setGameState('playing');
        setInvaders([]);
    };
    
    useEffect(() => {
        if(gameState !== 'playing' || !currentQuestion) return;

        const spawnInvader = () => {
            if (gameAreaRef.current) {
                const gameWidth = gameAreaRef.current.offsetWidth;
                const newInvader = {
                    item: shuffleArray(answers)[0],
                    x: Math.random() * (gameWidth - 80),
                    y: 0,
                    id: `invader-${Date.now()}-${Math.random()}`
                };
                setInvaders(prev => [...prev, newInvader]);
            }
        }
        
        const invaderInterval = setInterval(spawnInvader, 2000);

        return () => clearInterval(invaderInterval);

    }, [gameState, currentQuestion, answers]);

    const handleAnswerClick = (item: Item) => {
        if (item.id === currentQuestion?.id) {
            setScore(s => s + 10);
            setInvaders([]);
            setupRound();
        } else {
            setLives(l => {
                if(l - 1 <= 0) {
                    endGame();
                    return 0;
                }
                return l - 1;
            });
        }
    };
    
     useEffect(() => {
        const moveInvaders = () => {
            setInvaders(prev => {
                const newInvaders = prev.map(inv => ({ ...inv, y: inv.y + 1.5 })).filter(inv => {
                    if (gameAreaRef.current && inv.y > gameAreaRef.current.offsetHeight) {
                        setLives(l => {
                             if(l-1 <= 0) {
                                endGame();
                                return 0;
                            }
                            return l-1;
                        });
                        return false;
                    }
                    return true;
                });
                return newInvaders;
            });
        };

        if (gameState === 'playing') {
            gameLoopRef.current = window.setInterval(moveInvaders, 50);
        }

        return () => {
            if (gameLoopRef.current) {
                clearInterval(gameLoopRef.current);
            }
        };
    }, [gameState, endGame]);


    if (list.items.filter(item => item[cue]).length < 4) {
        return (
             <div className="flex flex-col items-center justify-center h-full bg-zinc-900/20 p-4 rounded-3xl text-white text-center scanlines-overlay">
                 <DisconnectIcon className="h-16 w-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2 font-display">// INSUFFICIENT DATA //</h2>
                <p className="mb-4">Simulation requires at least 4 data points with the selected cue.</p>
                <StyledButton onClick={() => setAppState({ view: View.ListEditor, listId: list.id })}>
                    Modify Data Set
                </StyledButton>
            </div>
        );
    }
    
    const MenuScreen = (
        <div className="flex flex-col items-center justify-center h-full p-4">
            <h1 className="text-4xl font-bold mb-4 text-[var(--highlight-neon)] font-display drop-shadow-[0_0_10px_var(--highlight-neon-glow)]">Data Invaders</h1>
            <p className="text-lg mb-8 text-center text-zinc-500">Match the cue to the correct term to eliminate the incoming data packets.</p>
            <StyledButton onClick={startGame}>Initiate</StyledButton>
             <StyledButton onClick={() => setAppState({ view: View.GameMenu })} className="mt-4 !bg-transparent hover:!bg-zinc-800/50">
                Egress
            </StyledButton>
        </div>
    );

    const GameOverScreen = (
        <div className="flex flex-col items-center justify-center h-full p-4">
            <h1 className="text-4xl font-bold mb-4 text-red-500 font-display">SIMULATION OVER</h1>
            <p className="text-2xl mb-8">Final Score: {score}</p>
            <StyledButton onClick={startGame}>Re-Engage</StyledButton>
            <StyledButton onClick={() => setAppState({ view: View.GameMenu })} className="mt-4 !bg-transparent hover:!bg-zinc-800/50">
                Egress
            </StyledButton>
        </div>
    );
    
    const GameScreen = (
        <div className="flex flex-col h-full w-full overflow-hidden">
            <div className="p-4 bg-zinc-950/50 text-white flex justify-between items-center border-b border-[var(--border-color)]">
                <div className="text-xl font-bold">Score: {score}</div>
                <div className="text-center">
                    <p className="text-sm text-zinc-600 uppercase tracking-wider">{cue}:</p>
                    <p className="text-lg font-semibold text-[var(--highlight-neon)]">{currentQuestion?.[cue] || 'N/A'}</p>
                </div>
                <div className="flex items-center">
                    <span className="text-xl mr-2">Shields:</span>
                    <div className="flex">
                        {Array.from({ length: lives }).map((_, i) => <PlayerShipIcon key={i} className="h-6 w-6 text-[var(--highlight-neon)] drop-shadow-[0_0_5px_var(--highlight-neon-glow)]"/>)}
                    </div>
                </div>
            </div>
            <div ref={gameAreaRef} className="flex-1 relative">
                {invaders.map(invader => (
                    <div key={invader.id} style={{ left: invader.x, top: invader.y }} className="absolute bg-zinc-800/50 p-2 rounded-lg text-center text-white border border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                        {invader.item.term}
                    </div>
                ))}
            </div>
            <div className="p-4 bg-zinc-950/50 grid grid-cols-4 gap-4 border-t border-[var(--border-color)]">
                {answers.map(item => (
                    <StyledButton key={item.id} onClick={() => handleAnswerClick(item)} className="text-sm md:text-base">
                        {item.term}
                    </StyledButton>
                ))}
            </div>
        </div>
    );

    return (
        <div className="h-full w-full bg-zinc-900/20 rounded-3xl scanlines-overlay">
            {gameState === 'menu' && MenuScreen}
            {gameState === 'gameOver' && GameOverScreen}
            {gameState === 'playing' && GameScreen}
        </div>
    );
};

export default InvadersGame;