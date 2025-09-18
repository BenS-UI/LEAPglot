import React from 'react';
import { sfx } from '../utils/sfx';

interface StyledButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const StyledButton: React.FC<StyledButtonProps> = ({ children, className, onClick, ...props }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    sfx.playClick();
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className={`px-6 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-[var(--text-primary)] font-bold uppercase tracking-wider transition-all duration-300 hover:border-[var(--highlight-neon)] hover:text-[var(--highlight-neon)] hover:shadow-[0_0_15px_var(--highlight-neon-glow)] focus:outline-none focus:ring-2 focus:ring-[var(--highlight-neon-glow)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:border-zinc-700 disabled:hover:text-[var(--text-primary)] ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default StyledButton;