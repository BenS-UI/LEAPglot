
import { Item } from '../../types';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  isCorrect: boolean;
  isWrong: boolean;
  ridingOnId: string | null;
  offsetX: number | null;
}

export interface Obstacle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  item: Item;
}

export interface Lane {
  y: number;
  height: number;
  type: 'road' | 'safe';
  obstacles: Obstacle[];
}

export interface DestinationSlot {
  x: number;
  y: number;
  width: number;
  height: number;
  filled: boolean;
}

export interface PowerUp {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'life' | 'coin' | 'slow' | 'fast';
}

export interface GameState {
  status: 'menu' | 'playing' | 'gameOver' | 'levelComplete';
  score: number;
  lives: number;
  level: number;
  player: Player | null;
  lanes: Lane[];
  currentQuestion: Item | null;
  destinationSlots: DestinationSlot[];
  powerUps: PowerUp[];
  agentsHome: number;
}