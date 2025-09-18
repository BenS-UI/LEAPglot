
import React from 'react';
import { PieceType, PlayerColor } from './types';
import PieceComponent from './Piece';
import StyledButton from '../StyledButton';

interface PromotionModalProps {
  onPromote: (piece: PieceType) => void;
  color: PlayerColor;
}

const PromotionModal: React.FC<PromotionModalProps> = ({ onPromote, color }) => {
  const promotionPieces: PieceType[] = ['queen', 'rook', 'bishop', 'knight'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 shadow-xl text-white text-center">
        <h2 className="text-2xl font-bold mb-4 font-display">Promote Pawn</h2>
        <div className="flex justify-center space-x-4">
          {promotionPieces.map(pieceType => (
            <button
              key={pieceType}
              onClick={() => onPromote(pieceType)}
              className="w-20 h-20 p-2 bg-zinc-800/50 border border-zinc-700 rounded-xl hover:bg-[var(--highlight-neon-glow)] hover:border-[var(--highlight-neon)]"
            >
              <PieceComponent piece={{ type: pieceType, color }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionModal;
