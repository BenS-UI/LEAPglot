import React, { useState, useEffect, useCallback } from 'react';
import { List, Item, AppState, View, GameResult } from '../types';
import StyledButton from './StyledButton';
import { sfx } from '../utils/sfx';

interface QuizGameProps {
    list: List;
    setAppState: React.Dispatch<React.SetStateAction<AppState>>;
    cue: keyof Item;
    logGameResult: (result: Omit<GameResult, 'timestamp'>) => void;
}

const QuizGame: React.FC<QuizGameProps> = ({ list, setAppState, cue, logGameResult }) => {
    const [questions, setQuestions] = useState<Item[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [options, setOptions] = useState<string[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    const [mistakes, setMistakes] = useState<Item[]>([]);
    const [gameState, setGameState] = useState<'playing' | 'finished' | 'menu'>('menu');

    const setupGame = useCallback(() => {
        const validQuestions = list.items.filter(item => item[cue]);
        const shuffledQuestions = [...validQuestions].sort(() => 0.5 - Math.random());
        setQuestions(shuffledQuestions);
        setCurrentQuestionIndex(0);
        setScore(0);
        setMistakes([]);
        setGameState('playing');
    }, [list.items, cue]);

    const generateOptions = useCallback((correctItem: Item) => {
        const wrongItems = list.items.filter(item => item.id !== correctItem.id && item[cue]);
        const shuffledWrong = wrongItems.sort(() => 0.5 - Math.random());
        const wrongOptions = shuffledWrong.slice(0, 3).map(item => String(item[cue] ?? ''));
        const allOptions = [String(correctItem[cue] ?? ''), ...wrongOptions].sort(() => 0.5 - Math.random());
        setOptions(allOptions);
    }, [list.items, cue]);

    useEffect(() => {
        if (gameState === 'playing' && questions.length > 0) {
            if (currentQuestionIndex < questions.length) {
                const currentQuestion = questions[currentQuestionIndex];
                generateOptions(currentQuestion);
                setSelectedAnswer(null);
                setIsCorrect(null);
            } else {
                setGameState('finished');
            }
        }
    }, [gameState, questions, currentQuestionIndex, generateOptions]);

    useEffect(() => {
        if (gameState === 'finished' && questions.length > 0) {
            logGameResult({
                game: 'Quiz',
                listName: list.name,
                score: score,
                total: questions.length,
                mistakes: mistakes,
            });
        }
    }, [gameState, list.name, score, questions, mistakes, logGameResult]);


    const handleAnswer = (answer: string) => {
        if (selectedAnswer) return;
        
        setSelectedAnswer(answer);
        const correct = answer === String(questions[currentQuestionIndex][cue] ?? '');
        setIsCorrect(correct);

        if (correct) {
            setScore(prev => prev + 1);
            sfx.playSuccess();
        } else {
            setMistakes(prev => [...prev, questions[currentQuestionIndex]]);
            sfx.playError();
        }

        setTimeout(() => {
            setCurrentQuestionIndex(prev => prev + 1);
        }, 1500);
    };

    const renderContent = () => {
        if (list.items.filter(i => i[cue]).length < 4) {
            return (
                 <div className="flex flex-col items-center justify-center h-full text-center">
                    <h2 className="text-2xl mb-4 font-display">// INSUFFICIENT DATA //</h2>
                     <p className="mb-4">Quiz simulation requires at least 4 data points with the selected cue.</p>
                     <StyledButton onClick={() => setAppState({ view: View.ListEditor, listId: list.id })}>
                        Modify Data Set
                    </StyledButton>
                </div>
            )
        }

         if (gameState === 'menu') {
            return (
                 <div className="flex flex-col items-center justify-center h-full p-8">
                    <h1 className="text-4xl font-bold mb-4 text-[var(--highlight-neon)] font-display drop-shadow-[0_0_10px_var(--highlight-neon-glow)]">Data Quiz</h1>
                    <p className="text-lg mb-8 text-center text-zinc-500">Match the term to the correct cue.</p>
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
                    <h1 className="text-4xl font-bold mb-4 text-green-400 font-display">Quiz Complete</h1>
                    <p className="text-2xl mb-8">Final Score: {score} / {questions.length}</p>
                    <StyledButton onClick={setupGame}>Re-Engage</StyledButton>
                     <StyledButton onClick={() => setAppState({ view: View.GameMenu })} className="mt-4 !bg-transparent hover:!bg-zinc-800/50">
                        Egress
                    </StyledButton>
                </div>
            )
        }

        const currentQuestion = questions[currentQuestionIndex];

        if (!currentQuestion) {
            // This state is temporary, while the component transitions to 'finished'.
            return (
                <div className="flex flex-col items-center justify-center h-full">
                    <h2 className="text-2xl font-display">// PROCESSING RESULTS... //</h2>
                </div>
            );
        }

        return (
            <div className="flex flex-col items-center justify-center h-full w-full max-w-3xl mx-auto p-4">
                <div className="w-full">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold text-zinc-500 font-display">Data Quiz</h1>
                        <p className="text-lg">Score: {score}</p>
                    </div>
                     <p className="text-zinc-600 mb-8 text-center uppercase tracking-wider">Query {currentQuestionIndex + 1} of {questions.length}</p>
                    
                    <div className="bg-zinc-900/50 p-8 rounded-2xl mb-8 text-center border border-zinc-800">
                        <p className="text-3xl font-bold text-[var(--highlight-neon)] drop-shadow-[0_0_8px_var(--highlight-neon-glow)]">{currentQuestion?.term}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {options.map(option => {
                            const isSelected = selectedAnswer === option;
                            const isTheCorrectAnswer = option === String(currentQuestion[cue] ?? '');
                            
                            let buttonClass = "!bg-zinc-900/60 hover:!border-[var(--highlight-neon)] hover:!text-[var(--highlight-neon)]";
                            if(isSelected) {
                                buttonClass = isCorrect ? "!bg-green-600/50 !border-green-500 !text-white" : "!bg-red-600/50 !border-red-500 !text-white";
                            } else if(selectedAnswer && isTheCorrectAnswer) {
                                buttonClass = "!bg-green-600/50 !border-green-500";
                            }
                            
                            return (
                                 <StyledButton
                                    key={option}
                                    onClick={() => handleAnswer(option)}
                                    disabled={!!selectedAnswer}
                                    className={`!normal-case !tracking-normal !font-normal !text-left !py-4 !h-full text-lg ${buttonClass}`}
                                >
                                    {option}
                                </StyledButton>
                            )
                        })}
                    </div>
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

export default QuizGame;