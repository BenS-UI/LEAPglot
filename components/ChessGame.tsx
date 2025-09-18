import React, { useState, useMemo } from 'react';
import { AppState, View } from '../types';
import ChessBoard from './chess/ChessBoard';
import useChessLogic from './chess/useChessLogic';
import StyledButton from './StyledButton';
import PromotionModal from './chess/PromotionModal';
import { PieceType, GameMode, OpponentType } from './chess/types';
import GameLog from './chess/GameLog';

interface ChessGameProps {
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}

const ChessGame: React.FC<ChessGameProps> = ({ setAppState }) => {
  const {
    gameState,
    getSquare,
    handleSquareClick,
    selectedSquare,
    validMoves,
    startGame,
    handlePromotion,
    setCenterOn,
    handleHover,
  } = useChessLogic();

  const [zoom, setZoom] = useState(50); // 0 (out) to 100 (in)

  const viewportSize = useMemo(() => {
    if (gameState.mode !== 'infinite') return 8;

    // zoom 50 = 11, zoom 0 = 25, zoom 100 = 7
    const baseSize = 11;
    const scale = (50 - zoom) / 50; // 1 for zoom 0, 0 for zoom 50, -1 for zoom 100
    
    let size;
    if (scale > 0) { // Zoom out
      size = baseSize + Math.round(scale * 14); // 11 -> 25
    } else { // Zoom in
      size = baseSize + Math.round(scale * 4); // 11 -> 7
    }

    // Ensure it's an odd number for a perfect center
    if (size % 2 === 0) {
      size += 1;
    }
    return Math.max(7, Math.min(25, size));

  }, [zoom, gameState.mode]);

  const renderStatusMessage = () => {
    const turn = gameState.turn.charAt(0).toUpperCase() + gameState.turn.slice(1);
    const winner = gameState.turn === 'white' ? 'Black' : 'White';
    const highlightClass = "text-[var(--highlight-neon)] font-bold";

    switch (gameState.status) {
      case 'checkmate':
        return <><span className="text-red-500 font-bold">CHECKMATE!</span> {winner} wins.</>;
      case 'stalemate':
        return <><span className={highlightClass}>STALEMATE!</span> The game is a draw.</>;
      case 'draw_insufficient_material':
        return <><span className={highlightClass}>DRAW!</span> Insufficient material.</>;
      case 'playing':
        return <>{turn}'s Turn</>;
      case 'check':
        return <>{turn} is in <span className="text-yellow-400 font-bold">CHECK!</span></>;
      default:
        return 'Chess';
    }
  };
  
  const isGameOver = gameState.status === 'checkmate' || gameState.status === 'stalemate' || gameState.status === 'draw_insufficient_material';

  if (gameState.status === 'menu') {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-4 md:p-6 bg-zinc-900/20 rounded-3xl scanlines-overlay">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-[var(--highlight-neon)] font-display drop-shadow-[0_0_10px_var(--highlight-neon-glow)]">Chess</h1>
          <p className="text-lg text-zinc-500 mb-8">Select your game and opponent.</p>
          <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-12">
              <div className="flex flex-col space-y-4">
                  <h2 className="text-2xl font-display text-zinc-400 mb-2">Classic</h2>
                  <StyledButton onClick={() => startGame('classic', 'human')}>vs Player</StyledButton>
                  <StyledButton onClick={() => startGame('classic', 'cpu')}>vs CPU</StyledButton>
              </div>
              <div className="flex flex-col space-y-4">
                  <h2 className="text-2xl font-display text-zinc-400 mb-2">Infinite</h2>
                  <StyledButton onClick={() => startGame('infinite', 'human')}>vs Player</StyledButton>
                  <StyledButton onClick={() => startGame('infinite', 'cpu')}>vs CPU</StyledButton>
              </div>
          </div>
          <StyledButton onClick={() => setAppState({ view: View.GameMenu })} className="mt-12 !bg-transparent hover:!bg-zinc-800/50">
            Return to Hub
          </StyledButton>
        </div>
      </div>
    );
  }

  const onPromote = (piece: PieceType) => {
    if (gameState.promotionSquare) {
      handlePromotion(gameState.promotionSquare, piece);
    }
  }

  return (
    <div className="flex flex-col h-full w-full p-2 md:p-4 bg-zinc-900/20 rounded-3xl scanlines-overlay">
      <div className="w-full flex justify-between items-center px-2 mb-2">
        <h2 className="text-xl font-display text-zinc-400">{renderStatusMessage()}</h2>
        {isGameOver && <StyledButton onClick={() => startGame(gameState.mode, gameState.opponent)}>Play Again</StyledButton>}
      </div>
       {gameState.mode === 'infinite' && (
        <div className="w-full flex justify-center gap-6 p-1 mb-2 text-sm text-zinc-500">
            <span>White Stamina: <span className="text-green-400 font-bold">{gameState.whiteStamina}</span></span>
            <span>|</span>
            <span>Black Stamina: <span className="text-red-400 font-bold">{gameState.blackStamina}</span></span>
        </div>
      )}
      <div className="flex-1 flex items-center justify-center w-full overflow-hidden">
        <div className="h-full aspect-square max-h-[calc(100vh-12rem)] md:max-h-[calc(100vh-16rem)]">
          <ChessBoard
            getSquare={getSquare}
            onSquareClick={handleSquareClick}
            onHoverSquare={handleHover}
            selectedSquare={selectedSquare}
            validMoves={validMoves}
            playerColor="white"
            mode={gameState.mode}
            centerOn={gameState.centerOn}
            setCenterOn={setCenterOn}
            lastMove={gameState.lastMove}
            viewportSize={viewportSize}
          />
        </div>
        <div className="w-72 h-full max-h-[calc(100vh-12rem)] md:max-h-[calc(100vh-16rem)] ml-4 md:ml-6 flex flex-col">
            <GameLog history={gameState.history} previewNotation={gameState.previewNotation} />
            {gameState.mode === 'infinite' && (
              <div className="flex-shrink-0 mt-4 flex justify-center items-center">
                 <input
                    type="range"
                    min="0"
                    max="100"
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full accent-[var(--highlight-neon)]"
                />
              </div>
            )}
        </div>
      </div>
      {gameState.status === 'promotion' && gameState.promotionSquare && (
          <PromotionModal onPromote={onPromote} color={gameState.turn === 'white' ? 'white' : 'black'} />
      )}
    </div>
  );
};

export default ChessGame;