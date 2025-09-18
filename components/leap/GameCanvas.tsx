
import React from 'react';
import useLeapGameLogic from '../../hooks/useLeapGameLogic';
import GameUI from './GameUI';
import DifficultyMenu from './DifficultyMenu';
import GameOverScreen from './GameOverScreen';
import { Item, AppState, View, GameResult } from '../../types';
import PlayerIcon from './PlayerIcon';

interface GameCanvasProps {
  items: Item[];
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  cue: keyof Item;
  logGameResult: (result: Omit<GameResult, 'timestamp'>) => void;
  listName: string;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ items, setAppState, cue, logGameResult, listName }) => {
  const {
    gameState,
    gameRef,
    canvasRef,
    startGame,
    restartGame,
  } = useLeapGameLogic(items, cue, logGameResult, listName);

  return (
    <div className="w-full h-full relative" ref={gameRef}>
      <canvas ref={canvasRef} className="w-full h-full" />
      
      {gameState.status !== 'playing' && gameState.status !== 'levelComplete' && (
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      )}

      <GameUI
        score={gameState.score}
        lives={gameState.lives}
        level={gameState.level}
        agentsHome={gameState.agentsHome}
        totalAgents={gameState.destinationSlots.length}
        question={gameState.currentQuestion}
        cue={cue}
      />
      
      {gameState.player && gameState.status === 'playing' && (
          <div style={{ position: 'absolute', left: gameState.player.x, top: gameState.player.y, width: gameState.player.width, height: gameState.player.height }}>
              <PlayerIcon isCorrect={gameState.player.isCorrect} isWrong={gameState.player.isWrong} />
          </div>
      )}

      {gameState.status === 'menu' && (
        <DifficultyMenu onSelectDifficulty={startGame} />
      )}

      {gameState.status === 'gameOver' && (
        <GameOverScreen
          score={gameState.score}
          level={gameState.level}
          onRestart={restartGame}
          onExit={() => setAppState({ view: View.GameMenu })}
        />
      )}
    </div>
  );
};

export default GameCanvas;