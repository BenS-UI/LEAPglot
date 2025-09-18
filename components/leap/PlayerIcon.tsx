
import React from 'react';

interface PlayerIconProps {
  isCorrect: boolean;
  isWrong: boolean;
}

const PlayerIcon: React.FC<PlayerIconProps> = ({ isCorrect, isWrong }) => {
  let color = "text-[var(--highlight-neon)]";
  let animation = "";
  if (isCorrect) {
    animation = "animate-ping";
  }
  if (isWrong) {
    color = "text-red-500";
    animation = "animate-bounce";
  }

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={`w-full h-full ${color} ${animation} transition-colors duration-300 drop-shadow-[0_0_8px_var(--highlight-neon-glow)]`}
    >
        <path d="M11.9999 3.75L4.06061 11.6893L5.12127 12.75L11.9999 5.87132L18.8786 12.75L19.9393 11.6893L11.9999 3.75Z" />
        <path d="M11.9999 11.25L4.06061 19.1893L5.12127 20.25L11.9999 13.3713L18.8786 20.25L19.9393 19.1893L11.9999 11.25Z" />
    </svg>
  );
};

export default PlayerIcon;