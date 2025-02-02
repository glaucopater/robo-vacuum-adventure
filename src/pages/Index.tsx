import { useState, useEffect } from "react";
import { GameBoard } from "@/components/GameBoard";
import { Controls } from "@/components/Controls";
import { ScoreBoard } from "@/components/ScoreBoard";
import { 
  createInitialState, 
  moveForward, 
  rotateRobot, 
  checkCollision, 
  cleanDirt,
  updateBattery,
  isSunlitPosition
} from "@/lib/gameLogic";
import { toast } from "sonner";
import { GameConfig, DEFAULT_CONFIG } from "@/types/config";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

const GRID_SIZE = 10;
const BATTERY_MOVE_COST = 3;
const BATTERY_CHARGE_RATE = 10;
const SUN_MOVE_INTERVAL = 3000;

const Index = () => {
  const [gameState, setGameState] = useState(() => {
    const savedConfig = localStorage.getItem('gameConfig');
    const config = savedConfig ? JSON.parse(savedConfig) : DEFAULT_CONFIG;
    const savedLevel = config.lastLevel || 1;
    return createInitialState(config.gridSize, savedLevel);
  });
  const [showingPanorama, setShowingPanorama] = useState(false);

  const handleRestart = () => {
    const savedConfig = localStorage.getItem('gameConfig');
    const config = savedConfig ? JSON.parse(savedConfig) : DEFAULT_CONFIG;
    config.lastLevel = 1;
    config.lastScore = 0;
    localStorage.setItem('gameConfig', JSON.stringify(config));
    setGameState(createInitialState(config.gridSize, 1));
    toast.success("Game restarted! Starting from level 1");
  };

  const handleMove = () => {
    if (gameState.battery <= 0) {
      toast.error("Battery depleted! Move to a sunny spot to recharge!");
      return;
    }

    const newPosition = moveForward(gameState.robotPosition, gameState.robotDirection, gameState.gridSize);
    
    if (!newPosition) {
      toast.error("Can't move there!");
      return;
    }

    if (checkCollision(newPosition, gameState.obstacles)) {
      toast.error("Ouch! Hit an obstacle!");
      return;
    }

    const previousDirtCount = gameState.dirtPositions.length;
    const newDirtPositions = cleanDirt(newPosition, gameState.dirtPositions);
    const dirtCleaned = previousDirtCount > newDirtPositions.length;

    if (dirtCleaned) {
      toast.success("Dirt cleaned!");
    }

    setGameState(prev => {
      const newState = {
        ...prev,
        robotPosition: newPosition,
        dirtPositions: newDirtPositions,
        score: dirtCleaned ? prev.score + 1 : prev.score,
        battery: updateBattery(prev.battery, -BATTERY_MOVE_COST),
        path: [...prev.path, newPosition]
      };

      // Save progress
      const savedConfig = localStorage.getItem('gameConfig');
      const config = savedConfig ? JSON.parse(savedConfig) : DEFAULT_CONFIG;
      config.lastLevel = prev.level;
      config.lastScore = newState.score;
      localStorage.setItem('gameConfig', JSON.stringify(config));

      if (newDirtPositions.length === 0) {
        toast.success(`Level ${prev.level} completed! Starting next level...`, {
          duration: 3000,
        });
        
        setShowingPanorama(true);
        setTimeout(() => {
          setShowingPanorama(false);
          setGameState(createInitialState(config.gridSize, prev.level + 1));
        }, 3000);
      }

      return newState;
    });
  };

  const handleRotate = (direction: 'left' | 'right') => {
    setGameState(prev => ({
      ...prev,
      robotDirection: rotateRobot(prev.robotDirection, direction)
    }));
  };

  // Handle sun movement and battery charging
  useEffect(() => {
    const sunInterval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        sunPosition: (prev.sunPosition + 1) % prev.gridSize
      }));
    }, SUN_MOVE_INTERVAL);

    const chargeInterval = setInterval(() => {
      setGameState(prev => {
        if (isSunlitPosition(prev.robotPosition, prev.sunPosition, prev.gridSize)) {
          const newBattery = updateBattery(prev.battery, BATTERY_CHARGE_RATE);
          if (prev.battery < 100 && newBattery > prev.battery) {
            toast.success("Charging battery...", { id: 'charging' });
          }
          return {
            ...prev,
            battery: newBattery
          };
        }
        return prev;
      });
    }, 1000);

    return () => {
      clearInterval(sunInterval);
      clearInterval(chargeInterval);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
        case 'w':
          handleMove();
          break;
        case 'ArrowLeft':
        case 'a':
          handleRotate('left');
          break;
        case 'ArrowRight':
        case 'd':
          handleRotate('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState]);

  return (
    <div className="min-h-[600px] bg-gray-50 py-4 px-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-center text-gray-900">
            Vacuum Robot Simulator - Level {gameState.level}
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRestart}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Restart Game
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/config'}>
              Configure
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <ScoreBoard 
            score={gameState.score}
            remainingDirt={gameState.dirtPositions.length}
          />
          
          <GameBoard gameState={gameState} showPanorama={showingPanorama} />
          
          <Controls
            onMove={handleMove}
            onRotate={handleRotate}
          />

          <p className="text-sm text-gray-600 text-center">
            Use arrow keys or WASD to control the robot:<br />
            ↑/W: Move forward • ←/A: Rotate left • →/D: Rotate right<br />
            Move to sunny spots (yellow tiles) to recharge the battery!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
