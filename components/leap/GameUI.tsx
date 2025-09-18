
import React from 'react';
import { Item } from '../../types';

interface GameUIProps {
  score: number;
  lives: number;
  level: number;
  agentsHome: number;
  totalAgents: number;
  question: Item | null;
  cue: keyof Item;
}

const GameUI: React.FC<GameUIProps> = ({ score, lives, level, agentsHome, totalAgents, question, cue }) => {
  return (
    <>
      <div
        className="absolute top-0 left-0 right-0 p-3 bg-black bg-opacity-50 text-white flex justify-between items-center text-sm font-body"
      >
        <div className="flex space-x-4">
          <p>Score: <span className="text-[var(--highlight-neon)] font-bold">{score}</span></p>
          <p>Lives: <span className="text-[var(--highlight-neon)] font-bold">{lives}</span></p>
        </div>
        <div className="flex space-x-4">
          <p>Agents: <span className="text-[var(--highlight-neon)] font-bold">{agentsHome}/{totalAgents}</span></p>
          <p>Level: <span className="text-[var(--highlight-neon)] font-bold">{level}</span></p>
        </div>
      </div>
      {question && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-black bg-opacity-70 text-white text-center font-body border-t border-[var(--border-color)]">
          <p className="text-zinc-600 uppercase tracking-wider text-xs mb-1">{cue}:</p>
          <p className="text-[var(--highlight-neon)] text-base leading-tight">{question[cue] as string || 'N/A'}</p>
        </div>
      )}
    </>
  );
};

export default GameUI;