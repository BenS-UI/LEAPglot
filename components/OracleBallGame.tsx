import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { List, AppState, View } from '../types';
import StyledButton from './StyledButton';
import StyledInput from './StyledInput';
import { GoogleGenAI } from '@google/genai';
import { crypticResponses } from '../data/oracleBallData';
import { sfx } from '../utils/sfx';

interface OracleBallGameProps {
  list: List;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}

const getLevelGuidelines = (level: string) => {
    const rules: Record<string, string> = {
      Dawn: 'Use simple, concrete vocabulary and 4-6 word sentences. Be gentle and encouraging.',
      Rise: 'Use common compound words and simple idioms in 6-10 word sentences. Be playful.',
      Zenith: 'Use cohesive short paragraphs of 8-14 word sentences. Be confident and clear.',
      Sundown: 'Use idiomatic language on abstract topics in 10-16 word sentences. Be poised.',
      Twilight: 'Use layered syntax, rhetoric, and irony in 12-20 word sentences. Be elegant and magnetic.',
      Midnight: 'Use seamless register control and advanced metaphors in 12-22 word sentences. Be commanding and graceful.',
    };
    return rules[level] || rules.Zenith;
};

const OracleBallGame: React.FC<OracleBallGameProps> = ({ list, setAppState }) => {
  const [targetWord, setTargetWord] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [gameState, setGameState] = useState<'idle' | 'shaking' | 'revealing'>('idle');
  const [level, setLevel] =useState('Zenith');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY as string }), []);

  const selectNewWord = useCallback(() => {
    if (list.items.length > 0) {
      const randomItem = list.items[Math.floor(Math.random() * list.items.length)];
      setTargetWord(randomItem.term);
    }
  }, [list.items]);

  useEffect(() => {
    selectNewWord();
  }, [selectNewWord]);

  const handleAsk = async () => {
    setError(null);
    setAnswer('');
    setGameState('shaking');
    sfx.playJump();

    const isQuestionValid = question.trim().endsWith('?') && question.toLowerCase().includes(targetWord.toLowerCase());

    setTimeout(async () => {
      if (!isQuestionValid) {
        const responses = crypticResponses[level] || crypticResponses.Zenith;
        const crypticAnswer = responses[Math.floor(Math.random() * responses.length)];
        setAnswer(crypticAnswer);
        setGameState('revealing');
        return;
      }

      setIsLoading(true);

      const levelGuideline = getLevelGuidelines(level);
      const prompt = `You are a mystical oracle sphere. A user has asked the following yes-or-no question about the future: "${question}". Provide a short, mysterious, and cryptic fortune-teller-style answer. Your response must be very brief (one short sentence). Adhere to this stylistic guideline: ${levelGuideline}.`;
      
      try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        setAnswer(response.text);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
        setError(`// ERROR: ${errorMessage}`);
        setAnswer('The connection to the ether grows weak...');
      } finally {
        setIsLoading(false);
        setGameState('revealing');
        selectNewWord();
      }
    }, 1500); // Shake animation duration
  };

  const animationClass = gameState === 'shaking' ? 'animate-shake' : '';

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 md:p-6 bg-zinc-900/20 rounded-3xl scanlines-overlay">
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px) rotate(-2deg); }
          20%, 40%, 60%, 80% { transform: translateX(5px) rotate(2deg); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out 3; }
        .triangle-flipper { transition: transform 1s; transform-style: preserve-3d; }
        .is-revealing { transform: rotateY(180deg); }
        .triangle-face { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .triangle-back { transform: rotateY(180deg); }
      `}</style>
      
      <div className="w-full max-w-2xl text-center mb-6">
          <h1 className="text-4xl font-bold mb-4 text-[var(--highlight-neon)] font-display drop-shadow-[0_0_10px_var(--highlight-neon-glow)]">Oracle Sphere</h1>
           <div className="flex items-center justify-center gap-4 bg-zinc-950/50 p-3 rounded-xl border border-zinc-800">
               <div className="text-zinc-500 uppercase tracking-wider">Level:</div>
                <select value={level} onChange={e => setLevel(e.target.value)} className="bg-zinc-800/50 border border-zinc-700 rounded p-1 focus:outline-none focus:border-[var(--highlight-neon)]">
                    {Object.keys(crypticResponses).map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                </select>
                <div className="text-zinc-500">|</div>
              <p>Target Term: <span className="font-bold text-yellow-400">{targetWord}</span></p>
           </div>
      </div>
      
      <div className={`[perspective:1000px] w-80 h-80 md:w-96 md:h-96 rounded-full bg-black shadow-2xl flex items-center justify-center p-8 border-2 border-zinc-800 ${animationClass}`}>
        <div className="w-full h-full rounded-full bg-indigo-900/40 flex items-center justify-center shadow-inner overflow-hidden">
           <div className={`relative w-48 h-48 triangle-flipper ${gameState === 'revealing' ? 'is-revealing' : ''}`}>
             <div className="absolute w-full h-full triangle-face">
                {/* Initial state, can be empty or have a symbol */}
             </div>
             <div className="absolute w-full h-full triangle-face triangle-back flex items-center justify-center p-2">
                 <div className="absolute w-0 h-0 border-l-[90px] border-r-[90px] border-b-[150px] border-l-transparent border-r-transparent border-b-blue-900/80"></div>
                  <p className="relative z-10 text-center text-sm font-bold text-cyan-200 px-4">
                      {isLoading ? '...' : answer}
                  </p>
             </div>
           </div>
        </div>
      </div>

      <div className="w-full max-w-xl mt-8">
        <div className="flex flex-col md:flex-row gap-4">
            <StyledInput
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                placeholder="Ask a yes/no question using the term..."
                disabled={gameState === 'shaking' || isLoading}
            />
            <StyledButton onClick={handleAsk} disabled={gameState === 'shaking' || isLoading}>
                Consult Oracle
            </StyledButton>
        </div>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      </div>

       <StyledButton onClick={() => setAppState({ view: View.GameMenu })} className="mt-8 !bg-transparent hover:!bg-zinc-800/50">
        Return to Hub
      </StyledButton>
    </div>
  );
};

export default OracleBallGame;
