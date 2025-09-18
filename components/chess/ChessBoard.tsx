import React, { useMemo, useRef, useEffect } from 'react';
import { PlayerColor, Position, Square, GameMode, Move } from './types';
import PieceComponent from './Piece';

interface ChessBoardProps {
  getSquare: (row: number, col: number) => Square | undefined;
  onSquareClick: (row: number, col: number) => void;
  onHoverSquare: (pos: Position | null) => void;
  selectedSquare: Position | null;
  validMoves: Position[];
  playerColor: PlayerColor;
  mode: GameMode;
  centerOn: Position;
  setCenterOn: (setter: (pos: Position) => Position) => void;
  lastMove: Move | null;
  viewportSize: number;
}

const PAN_ZONE_SIZE = 60; // pixels from the edge to trigger pan
const PAN_INTERVAL = 100; // ms between pan steps

const ChessBoard: React.FC<ChessBoardProps> = ({
  getSquare,
  onSquareClick,
  onHoverSquare,
  selectedSquare,
  validMoves,
  playerColor,
  mode,
  centerOn,
  setCenterOn,
  lastMove,
  viewportSize,
}) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const panIntervalRef = useRef<number | null>(null);
  const touchStartRef = useRef<{ x: number, y: number } | null>(null);
  const panStartCenterRef = useRef<Position | null>(null);

  const isWhiteSquare = (row: number, col: number) => (row + col) % 2 === 0;

  const { startRow, startCol, boardSize } = useMemo(() => {
    if (mode === 'classic') {
      return { startRow: 0, startCol: 0, boardSize: 8 };
    }
    const halfVp = Math.floor(viewportSize / 2);
    return {
      startRow: centerOn.row - halfVp,
      startCol: centerOn.col - halfVp,
      boardSize: viewportSize,
    };
  }, [mode, centerOn, viewportSize]);

  const viewportBoard = useMemo(() => {
    const board: ({ square: Square | undefined, pos: Position })[][] = [];
    for (let i = 0; i < boardSize; i++) {
      const row: ({ square: Square | undefined, pos: Position })[] = [];
      for (let j = 0; j < boardSize; j++) {
        const pos = { row: startRow + i, col: startCol + j };
        row.push({ square: getSquare(pos.row, pos.col), pos });
      }
      board.push(row);
    }
    return board;
  }, [boardSize, startRow, startCol, getSquare]);

  const stopPanning = () => {
    if (panIntervalRef.current) {
      clearInterval(panIntervalRef.current);
      panIntervalRef.current = null;
    }
  };

  // Drag-to-pan when a piece is selected
  useEffect(() => {
    const boardEl = boardRef.current;
    if (!boardEl || mode !== 'infinite' || !selectedSquare) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      stopPanning();
      const rect = boardEl.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      let panDirection: { dr: number, dc: number } | null = null;
      
      if (y < PAN_ZONE_SIZE) panDirection = { dr: -1, dc: 0 };
      else if (y > rect.height - PAN_ZONE_SIZE) panDirection = { dr: 1, dc: 0 };
      else if (x < PAN_ZONE_SIZE) panDirection = { dr: 0, dc: -1 };
      else if (x > rect.width - PAN_ZONE_SIZE) panDirection = { dr: 0, dc: 1 };
      
      if (panDirection) {
        const canPan = validMoves.some(move => {
           if (panDirection!.dr === -1) return move.row < startRow;
           if (panDirection!.dr === 1) return move.row >= startRow + viewportSize;
           if (panDirection!.dc === -1) return move.col < startCol;
           if (panDirection!.dc === 1) return move.col >= startCol + viewportSize;
           return false;
        });

        if (canPan) {
            panIntervalRef.current = window.setInterval(() => {
                setCenterOn(prev => ({ row: prev.row + panDirection!.dr, col: prev.col + panDirection!.dc }));
            }, PAN_INTERVAL);
        }
      }
    };
    
    boardEl.addEventListener('mousemove', handleMouseMove);
    boardEl.addEventListener('mouseleave', stopPanning);

    return () => {
      stopPanning();
      boardEl.removeEventListener('mousemove', handleMouseMove);
      boardEl.removeEventListener('mouseleave', stopPanning);
    };
  }, [mode, selectedSquare, validMoves, startRow, startCol, setCenterOn, viewportSize]);

  // Touch panning
  useEffect(() => {
    const boardEl = boardRef.current;
    if (!boardEl || mode !== 'infinite') return;

    const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 1) {
            touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            panStartCenterRef.current = centerOn;
        }
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length === 1 && touchStartRef.current && panStartCenterRef.current) {
            e.preventDefault();
            const dx = e.touches[0].clientX - touchStartRef.current.x;
            const dy = e.touches[0].clientY - touchStartRef.current.y;
            
            const squareSize = boardEl.clientWidth / viewportSize;
            if (squareSize <= 0) return;
            
            const colOffset = -Math.round(dx / squareSize);
            const rowOffset = -Math.round(dy / squareSize);
            
            setCenterOn(() => ({
                row: panStartCenterRef.current!.row + rowOffset,
                col: panStartCenterRef.current!.col + colOffset,
            }));
        }
    };
    
    const handleTouchEnd = () => {
        touchStartRef.current = null;
        panStartCenterRef.current = null;
    };

    boardEl.addEventListener('touchstart', handleTouchStart, { passive: true });
    boardEl.addEventListener('touchmove', handleTouchMove, { passive: false });
    boardEl.addEventListener('touchend', handleTouchEnd);
    boardEl.addEventListener('touchcancel', handleTouchEnd);

    return () => {
        boardEl.removeEventListener('touchstart', handleTouchStart);
        boardEl.removeEventListener('touchmove', handleTouchMove);
        boardEl.removeEventListener('touchend', handleTouchEnd);
        boardEl.removeEventListener('touchcancel', handleTouchEnd);
    };
}, [mode, centerOn, viewportSize, setCenterOn]);

// Trackpad/wheel panning
useEffect(() => {
    const boardEl = boardRef.current;
    if (!boardEl || mode !== 'infinite') return;

    let panAccumulator = { x: 0, y: 0 };
    let timeoutId: number | null = null;

    const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        
        panAccumulator.x += e.deltaX;
        panAccumulator.y += e.deltaY;
        
        if (timeoutId === null) {
            timeoutId = window.setTimeout(() => {
                const squareSize = boardEl.clientWidth / viewportSize;
                if (squareSize <= 0) return;

                const colOffset = Math.round(panAccumulator.x / squareSize);
                const rowOffset = Math.round(panAccumulator.y / squareSize);

                if (colOffset !== 0 || rowOffset !== 0) {
                    setCenterOn(prev => ({ row: prev.row + rowOffset, col: prev.col + colOffset }));
                }
                
                panAccumulator = { x: 0, y: 0 };
                timeoutId = null;
            }, 50); // Debounce to prevent overly sensitive panning
        }
    };
    
    boardEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
        boardEl.removeEventListener('wheel', handleWheel);
        if (timeoutId) clearTimeout(timeoutId);
    }

}, [mode, viewportSize, setCenterOn]);

  return (
    <div className="w-full h-full overflow-hidden flex items-center justify-center bg-zinc-950/10 touch-none">
      <div
        ref={boardRef}
        style={{ gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))` }}
        className={`grid aspect-square w-full border-2 border-[var(--border-color)] bg-[var(--border-color)]`}
      >
        {viewportBoard.map((row, rowIdx) =>
          row.map(({square, pos}, colIdx) => {
            const isSelected = selectedSquare && selectedSquare.row === pos.row && selectedSquare.col === pos.col;
            const isValidMove = validMoves.some(move => move.row === pos.row && move.col === pos.col);
            const isLastMoveFrom = lastMove && lastMove.from.row === pos.row && lastMove.from.col === pos.col;
            const isLastMoveTo = lastMove && lastMove.to.row === pos.row && lastMove.to.col === pos.col;
            const isTrail = lastMove?.trail.some(t => t.row === pos.row && t.col === pos.col);

            return (
              <div
                key={`${pos.row}-${pos.col}`}
                onClick={() => onSquareClick(pos.row, pos.col)}
                onMouseEnter={() => isValidMove && onHoverSquare(pos)}
                onMouseLeave={() => isValidMove && onHoverSquare(null)}
                className={`aspect-square flex items-center justify-center relative transition-colors duration-300
                  ${isWhiteSquare(pos.row, pos.col) ? 'bg-zinc-800' : 'bg-zinc-950'} 
                  ${isSelected ? 'bg-cyan-500/40' : ''}
                  ${isLastMoveTo ? 'shadow-[0_0_15px_var(--highlight-neon-glow)] border-2 border-[var(--highlight-neon)]' : ''}
                  ${isTrail ? 'bg-teal-600/30' : ''}
                `}
              >
                {square?.piece && <PieceComponent piece={square.piece} />}
                {isValidMove && (
                  <div className="absolute w-1/3 h-1/3 rounded-full bg-[var(--highlight-neon)]/30"></div>
                )}
                 {isLastMoveFrom && (
                  <div className="absolute w-full h-full rounded-full border-2 border-dashed border-[var(--highlight-neon)]/50 animate-pulse"></div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChessBoard;