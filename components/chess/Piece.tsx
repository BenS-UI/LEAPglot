import React from 'react';
import { Piece } from './types';

interface PieceProps {
  piece: Piece;
}

const PieceComponent: React.FC<PieceProps> = ({ piece }) => {
  const pieceColor = piece.color === 'white' ? '#FFFFFF' : 'var(--highlight-neon)';
  const strokeColor = '#1E1E1E';

  const svgs: Record<string, JSX.Element> = {
    'pawn': (
      <svg viewBox="0 0 45 45" className="w-3/4 h-3/4 drop-shadow-md">
        <g fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47C28.06 24.84 29 23.03 29 21c0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" />
        </g>
      </svg>
    ),
    'rook': (
      <svg viewBox="0 0 45 45" className="w-3/4 h-3/4 drop-shadow-md">
        <g fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" />
          <path d="M34 14l-3 3H14l-3-3" />
          <path d="M31 17v12.5H14V17" />
        </g>
      </svg>
    ),
    'knight': (
      <svg viewBox="0 0 45 45" className="w-3/4 h-3/4 drop-shadow-md">
        <g fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10c10.5 1 16.5 8 16 29H15c-2 0-9-1.5-8-10-1-11 5-13.5 13-15z" />
          <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003-1.66-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-1.994 2.13-2.507 3-2 .5 3 3.42 4.36 2 7-1 2 2 3 2 3s2-1 2-2.97z" />
        </g>
      </svg>
    ),
    'bishop': (
      <svg viewBox="0 0 45 45" className="w-3/4 h-3/4 drop-shadow-md">
        <g fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 0 2-1.65 1.46-1.65 1.46-2 1H11c-.35-.54-.35-.54-2-1-1.65-1.46 0-2 0-2z" />
          <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11-4-11 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" />
          <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" />
        </g>
      </svg>
    ),
    'queen': (
      <svg viewBox="0 0 45 45" className="w-3/4 h-3/4 drop-shadow-md">
        <g fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm11.5 1.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0zm13.5-1.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm-13.5 1.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0zm-13.5-1.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM11 14l-3 15h29l-3-15-11.5 5.5L11 14z" />
          <path d="M8 29h29v3H8v-3zM11.5 32l1 4h19l1-4h-21zM12 39h21v-3H12v3z" />
        </g>
      </svg>
    ),
    'king': (
      <svg viewBox="0 0 45 45" className="w-3/4 h-3/4 drop-shadow-md">
        <g fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.5 11.63V6M20 8h5" />
          <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" />
          <path d="M12.5 37c5.5-8 14.5-8 20 0" />
          <path d="M12.5 30c5.5-8 14.5-8 20 0" />
          <path d="M12.5 33.5c5.5-8 14.5-8 20 0" />
          <path d="M11.5 39.5h22v-2h-22v2z" />
        </g>
      </svg>
    ),
  };
  
  return svgs[piece.type];
};

export default PieceComponent;