
import { useState, useEffect, useRef, useCallback } from 'react';
import { Item, GameResult } from '../types';
import { GameState, Difficulty, Lane, Obstacle, Player, DestinationSlot, PowerUp } from '../components/leap/types';
import { sfx } from '../utils/sfx';

const PLAYER_WIDTH = 25;
const PLAYER_HEIGHT = 25;
const NUM_SLOTS = 5;
const TRAIN_HEIGHT = 30;
const POWERUP_SIZE = 20;

const useLeapGameLogic = (
    items: Item[], 
    cue: keyof Item, 
    logGameResult: (result: Omit<GameResult, 'timestamp'>) => void,
    listName: string
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | undefined>(undefined);
  
  interface GameStateExtended extends GameState {
    unansweredQuestions: Item[];
    slowdownTimer: number;
    speedupTimer: number;
  }

  const [gameState, setGameState] = useState<GameStateExtended>({
    status: 'menu',
    score: 0,
    lives: 3,
    level: 1,
    player: null,
    lanes: [],
    currentQuestion: null,
    destinationSlots: [],
    powerUps: [],
    agentsHome: 0,
    unansweredQuestions: [],
    slowdownTimer: 0,
    speedupTimer: 0,
  });

  const resetPlayer = useCallback((canvas: HTMLCanvasElement) => {
      if (!canvas) return null;
      const laneHeight = canvas.height / 12;
      sfx.playDeath();
      return {
        x: canvas.width / 2 - PLAYER_WIDTH / 2,
        y: canvas.height - laneHeight + (laneHeight - PLAYER_HEIGHT) / 2,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        isCorrect: false,
        isWrong: false,
        ridingOnId: null,
        offsetX: null,
      };
  }, []);
  
  const getLaneConfig = useCallback((level: number, canvasWidth: number, canvasHeight: number, allItems: Item[], question: Item | null): Lane[] => {
      const validItems = allItems.filter(item => item[cue]);
      if (!question || validItems.length === 0) return [];
      
      const lanes: Lane[] = [];
      const laneHeight = canvasHeight / 12;
      const baseSpeed = (0.75 + (level * 0.25));

      lanes.push({ y: 0, height: laneHeight, type: 'safe', obstacles: []});
      
      for (let i = 1; i <= 10; i++) {
          if (i % 2 !== 0) { // Road lanes
            const speed = (baseSpeed + Math.random() * 0.5) * (i % 3 === 0 ? 1 : -1);
            const obstacleCount = Math.floor(2 + Math.random() * 2);
            const width = 100 + Math.random() * 100;
            const obstacles: Obstacle[] = [];
            
            const distractors = validItems.filter(item => item.id !== question.id);
            const itemPool = [question, ...distractors];

            for (let j = 0; j < obstacleCount; j++) {
                obstacles.push({
                    id: `obs-${i}-${j}-${Date.now()}`,
                    x: j * (canvasWidth / obstacleCount + Math.random() * 100),
                    y: i * laneHeight + (laneHeight - TRAIN_HEIGHT) / 2,
                    width: width,
                    height: TRAIN_HEIGHT,
                    speed: speed,
                    item: itemPool[Math.floor(Math.random() * itemPool.length)]
                });
            }
            // Ensure at least one correct train exists
            if (!obstacles.some(obs => obs.item.id === question.id)) {
                obstacles[Math.floor(Math.random() * obstacles.length)].item = question;
            }

            lanes.push({ y: i * laneHeight, height: laneHeight, type: 'road', obstacles });
          } else {
             lanes.push({ y: i * laneHeight, height: laneHeight, type: 'safe', obstacles: [] });
          }
      }

      lanes.push({ y: 11 * laneHeight, height: laneHeight, type: 'safe', obstacles: [] });
      return lanes;
  }, [cue]);

  const startGame = useCallback((difficulty: Difficulty) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    const shuffledItems = [...items].sort(() => 0.5 - Math.random());
    const questionsForSession = shuffledItems.slice(0, NUM_SLOTS);
    
    if (questionsForSession.length < NUM_SLOTS) {
        console.error("Not enough items for the game.");
        return;
    }
    
    const firstQuestion = questionsForSession[0];
    const remainingQuestions = questionsForSession.slice(1);
    
    let level: number;
    switch (difficulty) {
      case 'Easy': level = 1; break;
      case 'Medium': level = 3; break;
      case 'Hard': level = 5; break;
      default: level = 1;
    }

    const newLanes = getLaneConfig(level, canvas.width, canvas.height, items, firstQuestion);
    
    const slotWidth = PLAYER_WIDTH * 1.5;
    const slotSpacing = (canvas.width - NUM_SLOTS * slotWidth) / (NUM_SLOTS + 1);
    const laneHeight = canvas.height / 12;
    const newSlots = Array.from({ length: NUM_SLOTS }, (_, i) => ({
        x: slotSpacing + i * (slotWidth + slotSpacing),
        y: (laneHeight / 2) - (PLAYER_HEIGHT * 1.2 / 2),
        width: slotWidth,
        height: PLAYER_HEIGHT * 1.2,
        filled: false,
    }));
    
    setGameState({
      status: 'playing',
      score: 0,
      lives: 3,
      level: level,
      player: resetPlayer(canvas),
      lanes: newLanes,
      currentQuestion: firstQuestion,
      destinationSlots: newSlots,
      powerUps: [],
      agentsHome: 0,
      unansweredQuestions: remainingQuestions,
      slowdownTimer: 0,
      speedupTimer: 0,
    });
  }, [items, resetPlayer, getLaneConfig]);

  const restartGame = useCallback(() => setGameState(prev => ({ ...prev, status: 'menu' })), []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !gameRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const drawRoundedRect = (x: number, y: number, width: number, height: number, radius: number) => {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.closePath();
    };

    gameState.lanes.forEach(lane => {
      ctx.fillStyle = lane.type === 'safe' ? 'rgba(0, 245, 212, 0.05)' : '#12141d';
      ctx.fillRect(0, lane.y, canvas.width, lane.height);
      ctx.strokeStyle = "rgba(100, 116, 139, 0.1)";
      ctx.strokeRect(0, lane.y, canvas.width, lane.height);

      lane.obstacles.forEach(obstacle => {
        ctx.fillStyle = 'rgba(50, 50, 60, 0.8)';
        ctx.strokeStyle = '#4A5568';
        ctx.lineWidth = 1;

        drawRoundedRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height, 10);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 224, 0.7)';
        ctx.beginPath();
        if (obstacle.speed > 0) {
            ctx.moveTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height / 2);
            ctx.lineTo(obstacle.x + obstacle.width + 10, obstacle.y + obstacle.height / 2 - 5);
            ctx.lineTo(obstacle.x + obstacle.width + 10, obstacle.y + obstacle.height / 2 + 5);
        } else {
             ctx.moveTo(obstacle.x, obstacle.y + obstacle.height / 2);
            ctx.lineTo(obstacle.x - 10, obstacle.y + obstacle.height / 2 - 5);
            ctx.lineTo(obstacle.x - 10, obstacle.y + obstacle.height / 2 + 5);
        }
        ctx.closePath();
        ctx.fill();


        ctx.fillStyle = '#E0E0E0';
        ctx.font = '12px "Space Mono"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(obstacle.item.term, obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2, obstacle.width - 10);
      });
    });
    
    gameState.destinationSlots.forEach(slot => {
        ctx.strokeStyle = '#00F5D4';
        ctx.lineWidth = 2;
        if(slot.filled) {
            ctx.fillStyle = 'rgba(0, 245, 212, 0.4)';
            drawRoundedRect(slot.x, slot.y, slot.width, slot.height, 5);
            ctx.fill();
        }
        drawRoundedRect(slot.x, slot.y, slot.width, slot.height, 5);
        ctx.stroke();
    });

    gameState.powerUps.forEach(powerUp => {
        ctx.beginPath();
        ctx.arc(powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height / 2, powerUp.width / 2, 0, Math.PI * 2);
        ctx.font = 'bold 14px "Space Mono"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        switch (powerUp.type) {
            case 'life': ctx.fillStyle = 'rgba(239, 68, 68, 0.8)'; ctx.fill(); ctx.fillStyle = 'white'; ctx.fillText('+', powerUp.x + powerUp.width/2, powerUp.y + powerUp.height/2 + 1); break;
            case 'coin': ctx.fillStyle = 'rgba(252, 211, 77, 0.9)'; ctx.fill(); ctx.fillStyle = 'black'; ctx.fillText('$', powerUp.x + powerUp.width/2, powerUp.y + powerUp.height/2 + 1); break;
            case 'slow': ctx.fillStyle = 'rgba(59, 130, 246, 0.8)'; ctx.fill(); ctx.fillStyle = 'white'; ctx.fillText('S', powerUp.x + powerUp.width/2, powerUp.y + powerUp.height/2 + 1); break;
            case 'fast': ctx.fillStyle = 'rgba(236, 72, 153, 0.8)'; ctx.fill(); ctx.fillStyle = 'white'; ctx.fillText('F', powerUp.x + powerUp.width/2, powerUp.y + powerUp.height/2 + 1); break;
        }
    });

  }, [gameState]);

  const update = useCallback(() => {
    setGameState(prev => {
        if (prev.status !== 'playing' || !prev.player) return prev;

        let newPlayer = { ...prev.player };
        let newLanes = [...prev.lanes];
        let newPowerUps = [...prev.powerUps];
        let newLives = prev.lives;
        let newScore = prev.score;
        let newAgentsHome = prev.agentsHome;
        let newSlots = [...prev.destinationSlots];
        let newQuestion = prev.currentQuestion;
        let newUnanswered = [...prev.unansweredQuestions];
        // FIX: Explicitly type `newStatus` to prevent incorrect type inference.
        let newStatus: GameState['status'] = prev.status;
        let loseLife = false;

        // Handle power-up timers
        let baseSpeedModifier = 1.0;
        let newSlowdownTimer = prev.slowdownTimer > 0 ? prev.slowdownTimer - 1 : 0;
        let newSpeedupTimer = prev.speedupTimer > 0 ? prev.speedupTimer - 1 : 0;
        if (newSlowdownTimer > 0) baseSpeedModifier = 0.5;
        if (newSpeedupTimer > 0) baseSpeedModifier = 1.5;

        // Move obstacles and update player if riding
        newLanes = prev.lanes.map(lane => ({
            ...lane,
            obstacles: lane.obstacles.map(obstacle => {
                const canvasWidth = canvasRef.current?.width || 800;
                let newX = obstacle.x + obstacle.speed * baseSpeedModifier;
                if (obstacle.speed > 0 && newX > canvasWidth) newX = -obstacle.width;
                if (obstacle.speed < 0 && newX < -obstacle.width) newX = canvasWidth;
                
                if (newPlayer.ridingOnId === obstacle.id) {
                    newPlayer.x = newX + (newPlayer.offsetX || 0);
                }
                return { ...obstacle, x: newX };
            })
        }));
        
        if (newPlayer.x < 0 || newPlayer.x > canvasRef.current!.width - newPlayer.width) {
            loseLife = true;
        }

        const laneHeight = canvasRef.current!.height / 12;
        const currentLaneIndex = Math.floor((newPlayer.y + newPlayer.height / 2) / laneHeight);
        const currentLane = newLanes[currentLaneIndex];
        let onObstacle = false;

        if (currentLane && currentLane.type === 'road') {
            for (const obstacle of currentLane.obstacles) {
                if (newPlayer.x < obstacle.x + obstacle.width && newPlayer.x + newPlayer.width > obstacle.x) {
                    onObstacle = true;
                    if (obstacle.item.id === prev.currentQuestion?.id) {
                        if (newPlayer.ridingOnId !== obstacle.id) {
                           newPlayer.ridingOnId = obstacle.id;
                           newPlayer.offsetX = newPlayer.x - obstacle.x;
                           sfx.playLand();
                        }
                    } else {
                        loseLife = true;
                    }
                    break;
                }
            }
            if (!onObstacle) loseLife = true;
        } else {
            newPlayer.ridingOnId = null;
            newPlayer.offsetX = null;
        }
        
        // Goal check
        if (currentLaneIndex === 0) {
            let inSlot = false;
            for (let i = 0; i < newSlots.length; i++) {
                const slot = newSlots[i];
                if (!slot.filled && newPlayer.x < slot.x + slot.width && newPlayer.x + newPlayer.width > slot.x) {
                    newSlots[i] = { ...slot, filled: true };
                    inSlot = true;
                    newPlayer = resetPlayer(canvasRef.current!)!;
                    sfx.playWinLevel();
                    
                    newAgentsHome++;
                    newScore += 100;

                    if (newAgentsHome === NUM_SLOTS) {
                        newStatus = 'gameOver'; // Win state
                        newScore += 500;
                    } else {
                        newQuestion = newUnanswered[0];
                        newUnanswered = newUnanswered.slice(1);
                        newLanes = getLaneConfig(prev.level, canvasRef.current!.width, canvasRef.current!.height, items, newQuestion);
                    }
                    break;
                }
            }
            if (!inSlot) loseLife = true;
        }

        // Power-up collision
        for (let i = newPowerUps.length - 1; i >= 0; i--) {
            const powerUp = newPowerUps[i];
            if (newPlayer.x < powerUp.x + powerUp.width && newPlayer.x + newPlayer.width > powerUp.x && newPlayer.y < powerUp.y + powerUp.height && newPlayer.y + newPlayer.height > powerUp.y) {
                sfx.playPowerUp();
                if(powerUp.type === 'life') newLives++;
                if(powerUp.type === 'coin') newScore += 50;
                if(powerUp.type === 'slow') { newSlowdownTimer = 300; newSpeedupTimer = 0; }
                if(powerUp.type === 'fast') { newSpeedupTimer = 300; newSlowdownTimer = 0; }
                newPowerUps.splice(i, 1);
            }
        }
        
        // Power-up spawn
        if (Math.random() < 0.005) {
            const safeLanes = newLanes.filter((l, idx) => l.type === 'safe' && idx > 0 && idx < 11);
            if(safeLanes.length > 0) {
                const lane = safeLanes[Math.floor(Math.random() * safeLanes.length)];
                const types: PowerUp['type'][] = ['life', 'coin', 'slow', 'fast'];
                newPowerUps.push({
                    id: `pu-${Date.now()}`, x: Math.random() * (canvasRef.current!.width - POWERUP_SIZE), y: lane.y + (lane.height - POWERUP_SIZE) / 2,
                    width: POWERUP_SIZE, height: POWERUP_SIZE, type: types[Math.floor(Math.random() * types.length)],
                });
            }
        }

        if (loseLife) {
            newLives--;
            newPlayer = resetPlayer(canvasRef.current!)!;
        }

        return {
            ...prev, player: newPlayer, lanes: newLanes, lives: newLives, score: newScore, powerUps: newPowerUps,
            agentsHome: newAgentsHome, destinationSlots: newSlots, currentQuestion: newQuestion, unansweredQuestions: newUnanswered,
            status: newLives <= 0 ? 'gameOver' : newStatus,
            slowdownTimer: newSlowdownTimer, speedupTimer: newSpeedupTimer,
        };
    });
  }, [resetPlayer, getLaneConfig, items]);
  
  useEffect(() => {
    if (gameState.status === 'gameOver') {
      logGameResult({
          game: 'LEAP!', listName, score: gameState.score, total: gameState.level,
      });
    }
  }, [gameState.status, gameState.score, gameState.level, logGameResult, listName]);

  const gameLoop = useCallback(() => {
    update();
    draw();
    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, [update, draw]);

  useEffect(() => {
    if (gameState.status === 'playing') {
      animationFrameId.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [gameState.status, gameLoop]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if(gameState.status !== 'playing') return;
        e.preventDefault();
        
        setGameState(prev => {
            if(!prev.player) return prev;
            let newPlayer: Player = {...prev.player};
            const canvas = canvasRef.current;
            if (!canvas) return prev;
            const laneHeight = canvas.height / 12;
            
            let moved = false;
            switch (e.key) {
                case 'ArrowUp': newPlayer.y -= laneHeight; moved = true; break;
                case 'ArrowDown': newPlayer.y = Math.min(canvas.height - laneHeight, newPlayer.y + laneHeight); moved = true; break;
                case 'ArrowLeft': newPlayer.x -= 30; break;
                case 'ArrowRight': newPlayer.x += 30; break;
            }

            if (newPlayer.x < 0) newPlayer.x = 0;
            if (newPlayer.x > canvas.width - newPlayer.width) newPlayer.x = canvas.width - newPlayer.width;

            if(moved) {
                sfx.playJump();
                newPlayer.ridingOnId = null;
                newPlayer.offsetX = null;
            }
            return {...prev, player: newPlayer};
        });
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.status]);

   useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current && gameRef.current) {
                canvasRef.current.width = gameRef.current.clientWidth;
                canvasRef.current.height = gameRef.current.clientHeight;
                setGameState(prev => ({...prev, status: 'menu'}));
            }
        };

        if (canvasRef.current && gameRef.current) {
            canvasRef.current.width = gameRef.current.clientWidth;
            canvasRef.current.height = gameRef.current.clientHeight;
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

  return { gameState, gameRef, canvasRef, startGame, restartGame };
};

export default useLeapGameLogic;