import React from 'react';
import { sfx } from '../utils/sfx';

interface StyledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const StyledInput: React.FC<StyledInputProps> = ({ className, onKeyDown, ...props }) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            sfx.playEnter();
        } else if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Delete') {
            sfx.playTyping();
        }
        if (onKeyDown) {
            onKeyDown(e);
        }
    };

    return (
        <input
            onKeyDown={handleKeyDown}
            className={`w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl focus:outline-none focus:border-[var(--highlight-neon)] focus:ring-2 focus:ring-[var(--highlight-neon-glow)] text-white transition-all duration-300 ${className}`}
            {...props}
        />
    );
};

export default StyledInput;