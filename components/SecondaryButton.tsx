import React from 'react';
import { sfx } from '../utils/sfx';

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({ children, className, onClick, ...props }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    sfx.playClick();
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`px-6 py-3 bg-zinc-900/40 border border-[var(--border-color)] rounded-xl text-zinc-500 font-bold uppercase tracking-wider transition-all duration-300 hover:border-[var(--highlight-neon)] hover:text-[var(--highlight-neon)] focus:outline-none focus:ring-2 focus:ring-[var(--highlight-neon-glow)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[var(--border-color)] disabled:hover:text-zinc-500 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;