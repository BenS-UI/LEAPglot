import { useState, useCallback, useEffect } from 'react';
// FIX: Import the 'GameStatus' type, which was used in this file but not imported, causing compilation errors.
import {
  BoardState,
  PlayerColor,
  Piece,
  Position,
  GameState,
  PieceType,
  Square,
  GameMode,
  Move,
  OpponentType,
  GameStatus,
} from './types';
import { sfx } from '../../utils/sfx';

const PIECE_VALUES: Record<PieceType, number> = {
    pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 100,
};

const INITIAL_CENTER: Position = { row: 3, col: 3 };

const calculateTrail = (from: Position, to: Position, pieceType: PieceType): Position[] => {
    const trail: Position[] = [];
    const dr = to.row - from.row;
    const dc = to.col - from.col;
    const rowStep = Math.sign(dr);
    const colStep = Math.sign(dc);

    if (pieceType === 'rook' || (pieceType === 'queen' && (dr === 0 || dc === 0))) {
        const dist = Math.max(Math.abs(dr), Math.abs(dc));
        for (let i = 1; i < dist; i++) {
            trail.push({ row: from.row + i * rowStep, col: from.col + i * colStep });
        }
    } else if (pieceType === 'bishop' || (pieceType === 'queen' && Math.abs(dr) === Math.abs(dc))) {
        const dist = Math.abs(dr);
        for (let i = 1; i < dist; i++) {
            trail.push({ row: from.row + i * rowStep, col: from.col + i * colStep });
        }
    } else if (pieceType === 'pawn' && Math.abs(dr) === 2) {
        trail.push({ row: from.row + rowStep, col: from.col });
    } else if (pieceType === 'knight') {
        // Light up the corners of the bounding box to form an "L" shape
        const dRowAbs = Math.abs(dr);
        const dColAbs = Math.abs(dc);
        if (dRowAbs > dColAbs) { // Vertical L
             trail.push({ row: from.row + rowStep, col: from.col });
             trail.push({ row: from.row + 2 * rowStep, col: from.col });
        } else { // Horizontal L
             trail.push({ row: from.row, col: from.col + colStep });
             trail.push({ row: from.row, col: from.col + 2 * colStep });
        }
    }
    // King moves 1 square, so no trail.

    return trail;
};

const useChessLogic = () => {
  const [classicBoard, setClassicBoard] = useState<BoardState>([]);
  const [infiniteBoard, setInfiniteBoard] = useState<Map<string, Square>>(new Map());
  
  const [gameState, setGameState] = useState<GameState>({ 
      status: 'menu', 
      turn: 'white', 
      promotionSquare: null,
      mode: 'classic',
      centerOn: INITIAL_CENTER,
      lastMove: null,
      whiteStamina: 0,
      blackStamina: 0,
      opponent: 'cpu',
      history: [],
      previewNotation: null,
  });
  
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  
  const setCenterOn = useCallback((setter: (pos: Position) => Position) => {
    setGameState(prev => ({...prev, centerOn: setter(prev.centerOn)}));
  }, []);

  const getInitialClassicBoard = (): BoardState => {
    const board: BoardState = Array(8).fill(null).map(() => Array(8).fill({ piece: null }));
    const placePiece = (row: number, col: number, piece: Piece) => { board[row][col] = { piece }; };

    const backRank: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
    for (let i = 0; i < 8; i++) {
      placePiece(0, i, { type: backRank[i], color: 'black', hasMoved: false });
      placePiece(1, i, { type: 'pawn', color: 'black', hasMoved: false });
      placePiece(6, i, { type: 'pawn', color: 'white', hasMoved: false });
      placePiece(7, i, { type: backRank[i], color: 'white', hasMoved: false });
    }
    return board;
  };
  
  const getInitialInfiniteBoard = (): Map<string, Square> => {
      const board = new Map<string, Square>();
      const placePiece = (row: number, col: number, piece: Piece) => { board.set(`${row},${col}`, { piece }); };

      const backRank: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
      for (let i = 0; i < 8; i++) {
        placePiece(0, i, { type: backRank[i], color: 'black', hasMoved: false });
        placePiece(1, i, { type: 'pawn', color: 'black', hasMoved: false });
        placePiece(6, i, { type: 'pawn', color: 'white', hasMoved: false });
        placePiece(7, i, { type: backRank[i], color: 'white', hasMoved: false });
      }
      return board;
  };

  const getSquare = useCallback((row: number, col: number): Square | undefined => {
    if (gameState.mode === 'classic') {
      return classicBoard[row]?.[col];
    }
    return infiniteBoard.get(`${row},${col}`);
  }, [gameState.mode, classicBoard, infiniteBoard]);

  const getPseudoLegalMoves = (pos: Position, currentBoard: { get: (key: string) => Square | undefined }, state: GameState): Position[] => {
    const piece = currentBoard.get(`${pos.row},${pos.col}`)?.piece;
    if (!piece) return [];
    
    const moves: Position[] = [];
    const { type, color } = piece;
    const { mode } = state;
    const directions = {
        rook: [[-1, 0], [1, 0], [0, -1], [0, 1]],
        bishop: [[-1, -1], [-1, 1], [1, -1], [1, 1]],
        queen: [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]],
        king: [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]],
    };

    if (type === 'pawn') {
        const dir = color === 'white' ? -1 : 1;
        // Standard 1-step move
        if (!currentBoard.get(`${pos.row + dir},${pos.col}`)?.piece) {
            moves.push({ row: pos.row + dir, col: pos.col });
        }
        // 2-step initial move
        const startRow = color === 'white' ? 6 : 1;
        const pawnStartRowCondition = mode === 'classic' ? pos.row === startRow : !piece.hasMoved;

        if (pawnStartRowCondition && !currentBoard.get(`${pos.row + dir},${pos.col}`)?.piece && !currentBoard.get(`${pos.row + 2 * dir},${pos.col}`)?.piece) {
            moves.push({ row: pos.row + 2 * dir, col: pos.col });
        }
        // Captures
        [-1, 1].forEach(side => {
            const target = currentBoard.get(`${pos.row + dir},${pos.col + side}`)?.piece;
            if (target && target.color !== color) {
                moves.push({ row: pos.row + dir, col: pos.col + side });
            }
        });
    } else if (type === 'knight') {
        const knightMoves = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
        knightMoves.forEach(([dr, dc]) => {
            const newPos = { row: pos.row + dr, col: pos.col + dc };
            if (mode === 'classic' && (newPos.row < 0 || newPos.row >= 8 || newPos.col < 0 || newPos.col >= 8)) return;
            if (currentBoard.get(`${newPos.row},${newPos.col}`)?.piece?.color !== color) {
                moves.push(newPos);
            }
        });
    } else {
        const pieceDirections = directions[type as keyof typeof directions] || [];
        const stamina = color === 'white' ? state.whiteStamina : state.blackStamina;
        const moveLimit = (type === 'king') ? 2 : (mode === 'classic' ? 8 : 8 + stamina);

        pieceDirections.forEach(([dr, dc]) => {
            for (let i = 1; i < moveLimit; i++) {
                const newPos = { row: pos.row + i * dr, col: pos.col + i * dc };
                if (mode === 'classic' && (newPos.row < 0 || newPos.row >= 8 || newPos.col < 0 || newPos.col >= 8)) break;
                
                const targetPiece = currentBoard.get(`${newPos.row},${newPos.col}`)?.piece;
                if (targetPiece) {
                    if (targetPiece.color !== color) moves.push(newPos);
                    break;
                }
                moves.push(newPos);
                if (type === 'king') break;
            }
        });
    }
    return moves;
  };

  const findKing = useCallback((color: PlayerColor, currentBoard: Map<string, Square>): Position | null => {
    for (const [key, square] of currentBoard.entries()) {
      if (square.piece?.type === 'king' && square.piece.color === color) {
        const [row, col] = key.split(',').map(Number);
        return { row, col };
      }
    }
    return null;
  }, []);
  
  const isSquareAttacked = useCallback((pos: Position, attackerColor: PlayerColor, currentBoard: Map<string, Square>, state: GameState): boolean => {
    for (const [key, square] of currentBoard.entries()) {
      if (square.piece?.color === attackerColor) {
        const [row, col] = key.split(',').map(Number);
        const moves = getPseudoLegalMoves({ row, col }, currentBoard, state);
        if (moves.some(move => move.row === pos.row && move.col === pos.col)) {
          return true;
        }
      }
    }
    return false;
  }, []);

  const isKingInCheck = useCallback((kingColor: PlayerColor, currentBoard: Map<string, Square>, state: GameState): boolean => {
    const kingPos = findKing(kingColor, currentBoard);
    if (!kingPos) return true; // A king must exist
    const opponentColor = kingColor === 'white' ? 'black' : 'white';
    return isSquareAttacked(kingPos, opponentColor, currentBoard, state);
  }, [findKing, isSquareAttacked]);

  const getValidMovesForPiece = useCallback((pos: Position, currentBoard: Map<string, Square>, state: GameState): Position[] => {
    const piece = currentBoard.get(`${pos.row},${pos.col}`)?.piece;
    if (!piece) return [];
    
    const pseudoMoves = getPseudoLegalMoves(pos, currentBoard, state);
    return pseudoMoves.filter(move => {
        const tempBoard = new Map(currentBoard);
        tempBoard.set(`${move.row},${move.col}`, { piece: { ...piece, hasMoved: true } });
        tempBoard.delete(`${pos.row},${pos.col}`);
        return !isKingInCheck(piece.color, tempBoard, state);
    });
  }, [isKingInCheck]);

  const hasLegalMoves = useCallback((playerColor: PlayerColor, currentBoard: Map<string, Square>, state: GameState): boolean => {
      for (const [key, square] of currentBoard.entries()) {
          if (square.piece?.color === playerColor) {
              const [row, col] = key.split(',').map(Number);
              if (getValidMovesForPiece({ row, col }, currentBoard, state).length > 0) {
                  return true;
              }
          }
      }
      return false;
  }, [getValidMovesForPiece]);
  
  const countAttackers = (target: Position, attackerColor: PlayerColor, board: Map<string, Square>, state: GameState): number => {
    let count = 0;
    for (const [key, square] of board.entries()) {
        if (square.piece?.color === attackerColor) {
            const [row, col] = key.split(',').map(Number);
            const moves = getPseudoLegalMoves({row, col}, board, state);
            if (moves.some(m => m.row === target.row && m.col === target.col)) {
                count++;
            }
        }
    }
    return count;
  };

  const generateNotation = (
    move: { from: Position; to: Position },
    piece: Piece,
    capturedPiece: Piece | null,
    newStatus: GameStatus,
    promotionPiece: PieceType | null,
    board: Map<string, Square>,
    state: GameState
  ): string => {
    
    if (state.mode === 'infinite') {
      const colToInfiniteFile = (col: number): string => {
          if (col >= 0) {
              let result = '';
              let n = col;
              while (true) {
                  result = String.fromCharCode(97 + (n % 26)) + result;
                  n = Math.floor(n / 26) - 1;
                  if (n < 0) break;
              }
              return result;
          } else {
              let result = '';
              let n = Math.abs(col) - 1;
              while (true) {
                  result = String.fromCharCode(65 + (n % 26)) + result;
                  n = Math.floor(n / 26) - 1;
                  if (n < 0) break;
              }
              return result;
          }
      };
      const rowToInfiniteRank = (row: number): number => {
          const classicalRank = 8 - row;
          return classicalRank <= 0 ? classicalRank -1 : classicalRank;
      };

      const pieceInitial = piece.type === 'pawn' ? '' : `${piece.type.charAt(0).toUpperCase().replace('P', '').replace('K', 'N')}.`;
      
      // Handle case for just showing selected piece
      if (move.from.row === move.to.row && move.from.col === move.to.col) {
          const fromFile = colToInfiniteFile(move.from.col);
          const fromRank = rowToInfiniteRank(move.from.row);
          return `${pieceInitial}${fromFile}${fromRank}`;
      }
      
      const capture = capturedPiece ? '*' : '';
      const destFile = colToInfiniteFile(move.to.col);
      const destRank = rowToInfiniteRank(move.to.row);
      const promotion = promotionPiece ? `=${promotionPiece.charAt(0).toUpperCase()}` : '';
      const check = newStatus === 'check' ? '+' : '';
      const checkmate = newStatus === 'checkmate' ? '++' : '';
      
      return `${pieceInitial}${destFile}${capture}${destRank}${promotion}${check}${checkmate}`;
    }

    // Standard Algebraic Notation
    const pieceToSAN = (p: PieceType) => p === 'knight' ? 'N' : p.charAt(0).toUpperCase().replace('P', '');
    const posToSAN = (p: Position) => `${String.fromCharCode(97 + p.col)}${8 - p.row}`;
    
    // Handle case for just showing selected piece
    if (move.from.row === move.to.row && move.from.col === move.to.col) {
        return piece.type !== 'pawn' ? `${pieceToSAN(piece.type)}${posToSAN(move.from)}` : posToSAN(move.from);
    }

    // Castling
    if (piece.type === 'king' && Math.abs(move.from.col - move.to.col) === 2) {
      return move.to.col > move.from.col ? 'O-O' : 'O-O-O';
    }

    let notation = piece.type !== 'pawn' ? pieceToSAN(piece.type) : '';
    
    // Disambiguation
    if (piece.type !== 'pawn' && piece.type !== 'king') {
        const ambiguities = [];
        for (const [key, sq] of board.entries()) {
            if (sq.piece?.type === piece.type && sq.piece.color === piece.color) {
                const [r, c] = key.split(',').map(Number);
                if (r === move.from.row && c === move.from.col) continue;
                const otherMoves = getValidMovesForPiece({ row: r, col: c }, board, state);
                if (otherMoves.some(m => m.row === move.to.row && m.col === move.to.col)) {
                    ambiguities.push({ row: r, col: c });
                }
            }
        }
        if (ambiguities.length > 0) {
            const sameFile = ambiguities.some(p => p.col === move.from.col);
            const sameRank = ambiguities.some(p => p.row === move.from.row);
            if (!sameFile) {
                notation += String.fromCharCode(97 + move.from.col);
            } else if (!sameRank) {
                notation += (8 - move.from.row);
            } else {
                notation += posToSAN(move.from);
            }
        }
    }

    if (capturedPiece) {
        if (piece.type === 'pawn') notation += String.fromCharCode(97 + move.from.col);
        notation += 'x';
    }
    
    notation += posToSAN(move.to);
    
    if (promotionPiece) {
        notation += `=${pieceToSAN(promotionPiece)}`;
    }

    if (newStatus === 'checkmate') notation += '#';
    else if (newStatus === 'check') notation += '+';

    return notation;
  };

  const updateGameStatus = useCallback((currentBoard: Map<string, Square>, nextTurn: PlayerColor, state: GameState, lastMove: Move | null, moveNotation: string) => {
    const { mode } = state;
    const opponentKingPos = findKing(nextTurn, currentBoard);
    if (mode === 'infinite' && opponentKingPos) {
        const attackerColor = nextTurn === 'white' ? 'black' : 'white';
        if (countAttackers(opponentKingPos, attackerColor, currentBoard, state) >= 2) {
            sfx.playGameOver();
            setGameState(prev => ({ ...prev, status: 'checkmate', turn: nextTurn, promotionSquare: null, lastMove, history: [...prev.history, `${moveNotation}++`], previewNotation: null }));
            return;
        }
    }

    const inCheck = isKingInCheck(nextTurn, currentBoard, state);
    const canMove = hasLegalMoves(nextTurn, currentBoard, state);

    let newStatus: GameStatus = 'playing';
    if (inCheck && !canMove) {
        newStatus = 'checkmate';
        sfx.playGameOver();
    }
    else if (!inCheck && !canMove) {
        newStatus = 'stalemate';
        sfx.playGameOver();
    }
    else if (inCheck) {
        newStatus = 'check';
        sfx.playCheck();
    }
    
    let finalNotation = moveNotation;
    if (newStatus === 'checkmate') finalNotation += state.mode === 'classic' ? '#' : '++';
    else if (newStatus === 'check') finalNotation += '+';

    setGameState(prev => ({...prev, status: newStatus, turn: nextTurn, promotionSquare: null, lastMove, history: [...prev.history, finalNotation], previewNotation: null}));

  }, [isKingInCheck, hasLegalMoves, findKing]);

  const makeMove = useCallback((from: Position, to: Position) => {
    const isClassic = gameState.mode === 'classic';
    const currentBoard = isClassic ? new Map(classicBoard.flatMap((r, i) => r.map((s, j) => [`${i},${j}`, s]))) : new Map(infiniteBoard);
    
    const piece = currentBoard.get(`${from.row},${from.col}`)?.piece;
    if (!piece) return;

    const capturedPiece = currentBoard.get(`${to.row},${to.col}`)?.piece;
    if (capturedPiece) {
        sfx.playCapture();
        let staminaGain = 0;
        if (capturedPiece.type === 'pawn') staminaGain = 1;
        else if (['rook', 'knight', 'bishop'].includes(capturedPiece.type)) staminaGain = 2;
        else if (capturedPiece.type === 'queen') staminaGain = 10;

        setGameState(prev => ({
            ...prev,
            whiteStamina: piece.color === 'white' ? prev.whiteStamina + staminaGain : prev.whiteStamina,
            blackStamina: piece.color === 'black' ? prev.blackStamina + staminaGain : prev.blackStamina,
        }));
    } else {
        sfx.playMove();
    }

    const trail = calculateTrail(from, to, piece.type);
    const lastMove: Move = { from, to, trail };

    const newBoard = new Map(currentBoard);
    newBoard.set(`${to.row},${to.col}`, { piece: { ...piece, hasMoved: true } });
    newBoard.delete(`${from.row},${from.col}`);

    const promotionRowClassic = piece.color === 'white' ? 0 : 7;
    const pawnStartRow = piece.color === 'white' ? 6 : 1;
    const squaresAdvanced = Math.abs(to.row - pawnStartRow);
    const promotionConditionInfinite = squaresAdvanced >= 7;
    
    if (piece.type === 'pawn' && ( (isClassic && to.row === promotionRowClassic) || (!isClassic && promotionConditionInfinite) )) {
        sfx.playPromote();
        setGameState(prev => ({ ...prev, status: 'promotion', promotionSquare: to, lastMove, previewNotation: null }));
        // Notation will be handled in handlePromotion
        return;
    }
    
    if (isClassic) {
        const newClassicBoard = getInitialClassicBoard();
        for(let r=0; r<8; r++) for(let c=0; c<8; c++) newClassicBoard[r][c] = { piece: null };
        newBoard.forEach((s, k) => {
            const [r, c] = k.split(',').map(Number);
            newClassicBoard[r][c] = s;
        });
        setClassicBoard(newClassicBoard);
    } else {
        setInfiniteBoard(newBoard);
    }

    setGameState(prev => ({...prev, centerOn: to}));
    
    const nextTurn = piece.color === 'white' ? 'black' : 'white';
    
    setGameState(prev => {
        // Determine status *after* move to check for checks
        const inCheck = isKingInCheck(nextTurn, newBoard, prev);
        const canMove = hasLegalMoves(nextTurn, newBoard, prev);
        let newStatus: GameStatus = 'playing';
        if (inCheck && !canMove) newStatus = 'checkmate';
        else if (!inCheck && !canMove) newStatus = 'stalemate';
        else if (inCheck) newStatus = 'check';

        const notation = generateNotation({ from, to }, piece, capturedPiece, newStatus, null, currentBoard, prev);
        
        updateGameStatus(newBoard, nextTurn, prev, lastMove, notation);
        return prev;
    });
  }, [gameState.mode, classicBoard, infiniteBoard, updateGameStatus, isKingInCheck, hasLegalMoves]);
  
  const handlePromotion = (pos: Position, promotionPiece: PieceType) => {
    const isClassic = gameState.mode === 'classic';
    const currentBoard = isClassic ? new Map(classicBoard.flatMap((r, i) => r.map((s, j) => [`${i},${j}`, s]))) : new Map(infiniteBoard);
    
    const pawn = currentBoard.get(`${pos.row},${pos.col}`)?.piece;
    if (!pawn || !gameState.lastMove) return;
    
    const newBoard = new Map(currentBoard);
    newBoard.set(`${pos.row},${pos.col}`, { piece: { ...pawn, type: promotionPiece }});

     if (isClassic) {
        const newClassicBoard = getInitialClassicBoard();
        for(let r=0; r<8; r++) for(let c=0; c<8; c++) newClassicBoard[r][c] = { piece: null };
        newBoard.forEach((s, k) => {
            const [r, c] = k.split(',').map(Number);
            if(r < 8 && c < 8) newClassicBoard[r][c] = s;
        });
        setClassicBoard(newClassicBoard);
    } else {
        setInfiniteBoard(newBoard);
    }
    
    const nextTurn = pawn.color === 'white' ? 'black' : 'white';

    setGameState(prev => {
        const inCheck = isKingInCheck(nextTurn, newBoard, prev);
        const canMove = hasLegalMoves(nextTurn, newBoard, prev);
        let newStatus: GameStatus = 'playing';
        if (inCheck && !canMove) newStatus = 'checkmate';
        else if (!inCheck && !canMove) newStatus = 'stalemate';
        else if (inCheck) newStatus = 'check';
        
        // Use the move that *led* to promotion for notation
        const notation = generateNotation(
            gameState.lastMove!,
            {...pawn, type: 'pawn'}, // Treat as pawn move for notation before promotion
            null, // Assume promotion is not a capture for simplicity here
            newStatus,
            promotionPiece,
            currentBoard,
            prev
        );
        
        updateGameStatus(newBoard, nextTurn, prev, gameState.lastMove, notation);
        return prev;
    });
  };
  
  const findBestCpuMove = useCallback(() => {
    const cpuColor = 'black';
    const isClassic = gameState.mode === 'classic';
    const currentBoard = isClassic ? new Map(classicBoard.flatMap((r, i) => r.map((s, j) => [`${i},${j}`, s]))) : new Map(infiniteBoard);
    
    let bestMove: { from: Position; to: Position } | null = null;
    let maxScore = -Infinity;
    
    const allMoves: { from: Position; to: Position }[] = [];
    for (const [key, square] of currentBoard.entries()) {
      if (square.piece?.color === cpuColor) {
        const [row, col] = key.split(',').map(Number);
        const from = { row, col };
        const moves = getValidMovesForPiece(from, currentBoard, gameState);
        moves.forEach(to => allMoves.push({ from, to }));
      }
    }
    
    if (allMoves.length === 0) return;

    for (const { from, to } of allMoves) {
      let score = Math.random() * 0.1; 
      const tempBoard = new Map(currentBoard);
      const movingPiece = tempBoard.get(`${from.row},${from.col}`)!;
      tempBoard.set(`${to.row},${to.col}`, movingPiece);
      tempBoard.delete(`${from.row},${from.col}`);

      if (!hasLegalMoves('white', tempBoard, gameState) && isKingInCheck('white', tempBoard, gameState)) {
          score += 10000;
      }
      
      const capturedPiece = currentBoard.get(`${to.row},${to.col}`)?.piece;
      if (capturedPiece) {
        score += PIECE_VALUES[capturedPiece.type];
      }
      
      if (score > maxScore) {
        maxScore = score;
        bestMove = { from, to };
      }
    }
    
    if(!bestMove) bestMove = allMoves[Math.floor(Math.random() * allMoves.length)];

    if (bestMove) {
        setTimeout(() => makeMove(bestMove!.from, bestMove!.to), 500);
    }
  }, [gameState, classicBoard, infiniteBoard, getValidMovesForPiece, makeMove, hasLegalMoves, isKingInCheck]);
  
  useEffect(() => {
    if (gameState.turn === 'black' && gameState.opponent === 'cpu' && ['playing', 'check'].includes(gameState.status)) {
        findBestCpuMove();
    }
  }, [gameState.turn, gameState.status, gameState.opponent, findBestCpuMove]);

  const handleHover = (pos: Position | null) => {
    if (!selectedSquare) return;

    const currentBoard = gameState.mode === 'classic' ? new Map(classicBoard.flatMap((r, i) => r.map((s, j) => [`${i},${j}`, s]))) : new Map(infiniteBoard);
    const piece = currentBoard.get(`${selectedSquare.row},${selectedSquare.col}`)?.piece;

    if (!piece) return;

    let notation = '';
    if (pos === null) {
        // Hover ended, show just the starting square notation
        notation = generateNotation({ from: selectedSquare, to: selectedSquare }, piece, null, 'playing', null, currentBoard, gameState);
    } else {
        const capturedPiece = currentBoard.get(`${pos.row},${pos.col}`)?.piece;
        notation = generateNotation({ from: selectedSquare, to: pos }, piece, capturedPiece, 'playing', null, currentBoard, gameState);
    }
    setGameState(prev => ({ ...prev, previewNotation: notation }));
  };

  const handleSquareClick = useCallback((row: number, col: number) => {
    if (gameState.status !== 'playing' && gameState.status !== 'check') return;

    const currentBoard = gameState.mode === 'classic' ? new Map(classicBoard.flatMap((r, i) => r.map((s, j) => [`${i},${j}`, s]))) : new Map(infiniteBoard);

    if (selectedSquare) {
      const isValid = validMoves.some(m => m.row === row && m.col === col);
      if (isValid) {
        makeMove(selectedSquare, { row, col });
      } else {
        setGameState(prev => ({...prev, previewNotation: null}));
      }
      setSelectedSquare(null);
      setValidMoves([]);
    } else {
      const piece = currentBoard.get(`${row},${col}`)?.piece;
      if (piece && piece.color === gameState.turn) {
        if (gameState.opponent === 'human' && piece.color !== gameState.turn) return;

        sfx.playClick();
        const moves = getValidMovesForPiece({ row, col }, currentBoard, gameState);
        setSelectedSquare({ row, col });
        setValidMoves(moves);
        const notation = generateNotation({ from: {row, col}, to: {row, col} }, piece, null, 'playing', null, currentBoard, gameState);
        setGameState(prev => ({...prev, previewNotation: notation}));
      }
    }
  }, [selectedSquare, validMoves, gameState, classicBoard, infiniteBoard, makeMove, getValidMovesForPiece]);
  
  const startGame = useCallback((mode: GameMode, opponent: OpponentType) => {
      if (mode === 'classic') {
          setClassicBoard(getInitialClassicBoard());
      } else {
          setInfiniteBoard(getInitialInfiniteBoard());
      }
      setGameState({ status: 'playing', turn: 'white', promotionSquare: null, mode, centerOn: INITIAL_CENTER, lastMove: null, whiteStamina: 0, blackStamina: 0, opponent, history: [], previewNotation: null });
      setSelectedSquare(null);
      setValidMoves([]);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (gameState.mode !== 'infinite' || (gameState.status !== 'playing' && gameState.status !== 'check')) {
            return;
        }

        switch (e.key) {
            case 'ArrowUp':
                setCenterOn(prev => ({ ...prev, row: prev.row - 1 }));
                break;
            case 'ArrowDown':
                setCenterOn(prev => ({ ...prev, row: prev.row + 1 }));
                break;
            case 'ArrowLeft':
            case 'ArrowRight': {
                const allPieces = Array.from(infiniteBoard.entries())
                    .filter(([, square]) => square.piece)
                    .map(([key]) => {
                        const [row, col] = key.split(',').map(Number);
                        return { row, col };
                    })
                    .sort((a, b) => {
                        if (a.row !== b.row) return a.row - b.row;
                        return a.col - b.col;
                    });

                if (allPieces.length === 0) break;

                const currentIndex = allPieces.findIndex(p => p.row === gameState.centerOn.row && p.col === gameState.centerOn.col);
                
                let nextIndex;
                if (e.key === 'ArrowRight') {
                    nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % allPieces.length;
                } else { // ArrowLeft
                    nextIndex = currentIndex === -1 ? 0 : (currentIndex - 1 + allPieces.length) % allPieces.length;
                }
                
                if (allPieces[nextIndex]) {
                  setGameState(prev => ({...prev, centerOn: allPieces[nextIndex]}));
                }
                break;
            }
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.status, gameState.mode, gameState.centerOn, infiniteBoard, setCenterOn]);

  return {
    gameState,
    getSquare,
    selectedSquare,
    validMoves,
    handleSquareClick,
    startGame,
    handlePromotion,
    setCenterOn,
    handleHover,
  };
};

export default useChessLogic;