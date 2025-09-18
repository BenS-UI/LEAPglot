
import React from 'react';

interface CardProps {
  id: string;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: (id: string) => void;
  onEnlarge: (id: string) => void;
  cardType: 'term' | 'definition';
}

const Card: React.FC<CardProps> = ({ id, content, isFlipped, isMatched, onClick, onEnlarge, cardType }) => {
  const cardContainerStyles = `relative w-full h-32 md:h-40 transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`;
  
  const frontBg = cardType === 'term' ? 'bg-teal-900/60' : 'bg-cyan-900/60';
  const frontBorder = cardType === 'term' ? 'border-teal-500/80' : 'border-cyan-500/80';
  const backBg = 'bg-zinc-800/50';
  
  const textContentColor = cardType === 'term' ? 'text-teal-300' : 'text-cyan-300';

  const cardContent = content.length > 100 ? content.substring(0, 97) + '...' : content;
  
  const faceStyles = 'absolute w-full h-full [backface-visibility:hidden] rounded-2xl backdrop-blur-sm border flex items-center justify-center p-4 text-center shadow-lg';
  
  const handleClick = () => {
    if (isFlipped && !isMatched) {
        onEnlarge(id);
    } else if (!isFlipped && !isMatched) {
        onClick(id);
    }
  };
  
  return (
    <div className="[perspective:1000px] group" onClick={handleClick}>
      <div className={`${cardContainerStyles} ${isMatched ? 'opacity-30 cursor-default' : 'cursor-pointer'}`}>
        
        {/* Back of Card (Initially Visible) */}
        <div className={`${faceStyles} ${backBg} border-[var(--border-color)] group-hover:border-[var(--highlight-neon)] group-hover:shadow-[0_0_10px_var(--highlight-neon-glow)] transition-all duration-300`}>
          <svg className="w-16 h-16 text-zinc-700/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
          </svg>
        </div>
        
        {/* Front of Card (Visible on Flip) */}
        <div className={`${faceStyles} ${frontBg} ${frontBorder} [transform:rotateY(180deg)]`}>
          <p className={`text-sm md:text-base font-semibold ${textContentColor}`}>{cardContent}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
