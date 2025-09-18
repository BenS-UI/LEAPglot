export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
export type PlayerColor = 'white' | 'black';
export type OpponentType = 'cpu' | 'human';

export interface Piece {
  type: PieceType;
  color: PlayerColor;
  hasMoved?: boolean;
}

export interface Square {
  piece: Piece | null;
}

export type BoardState = Square[][];

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
  trail: Position[];
}

export type GameStatus =
  | 'menu'
  | 'playing'
  | 'check'
  | 'checkmate'
  | 'stalemate'
  | 'draw_insufficient_material'
  | 'promotion';
  
export type GameMode = 'classic' | 'infinite';

export interface GameState {
    status: GameStatus;
    turn: PlayerColor;
    promotionSquare: Position | null;
    mode: GameMode;
    centerOn: Position;
    lastMove: Move | null;
    whiteStamina: number;
    blackStamina: number;
    opponent: OpponentType;
    history: string[];
    previewNotation: string | null;
}