import React, { useEffect, useRef } from 'react';

interface GameLogProps {
  history: string[];
  previewNotation: string | null;
}

const GameLog: React.FC<GameLogProps> = ({ history, previewNotation }) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, previewNotation]);

  const movePairs: { white: string; black?: string }[] = [];
  for (let i = 0; i < history.length; i += 2) {
    movePairs.push({
      white: history[i],
      black: history[i + 1],
    });
  }
  
  const finalMovePairs = [...movePairs];

  if (previewNotation) {
    if (history.length % 2 === 0) { // White's turn
        finalMovePairs.push({ white: previewNotation });
    } else { // Black's turn
        if (finalMovePairs.length > 0) {
            const lastPair = { ...finalMovePairs[finalMovePairs.length - 1] };
            lastPair.black = previewNotation;
            finalMovePairs[finalMovePairs.length - 1] = lastPair;
        }
    }
  }


  return (
    <div className="flex-1 bg-zinc-950/50 p-3 rounded-xl border border-zinc-800 overflow-y-auto font-mono text-sm">
      <div className="grid grid-cols-[auto_1fr_1fr] gap-x-3 text-zinc-500">
        <div className="font-bold text-center">#</div>
        <div className="font-bold">White</div>
        <div className="font-bold">Black</div>
        {finalMovePairs.map((pair, index) => {
            const isPreviewWhite = pair.white === previewNotation && history.length % 2 === 0;
            const isPreviewBlack = pair.black === previewNotation && history.length % 2 !== 0;

            return (
              <React.Fragment key={index}>
                <div className="text-center text-zinc-600">{index + 1}.</div>
                <div className={`truncate ${isPreviewWhite ? 'text-yellow-400' : 'text-zinc-400'}`} title={pair.white}>{pair.white}</div>
                <div className={`truncate ${isPreviewBlack ? 'text-yellow-400' : 'text-zinc-400'}`} title={pair.black}>{pair.black || ''}</div>
              </React.Fragment>
            )
        })}
      </div>
      <div ref={logEndRef} />
    </div>
  );
};

export default GameLog;