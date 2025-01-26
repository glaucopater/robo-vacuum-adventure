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

const GRID_SIZE = 8;
const BATTERY_MOVE_COST = 3;
const BATTERY_CHARGE_RATE = 10;
const SUN_MOVE_INTERVAL = 3000;

const Index = () => {
  const [gameState, setGameState] = useState(createInitialState(GRID_SIZE));
  const [showingPanorama, setShowingPanorama] = useState(false);

  const handleMove = () => {
    if (gameState.battery <= 0) {
      toast.error("Battery depleted! Move to a sunny spot to recharge!");
      return;
    }

    const newPosition = moveForward(gameState.robotPosition, gameState.robotDirection, GRID_SIZE);
    
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

      if (newDirtPositions.length === 0) {
        toast.success(`Level ${prev.level} completed! Starting next level...`, {
          duration: 3000,
        });
        
        setShowingPanorama(true);
        setTimeout(() => {
          setShowingPanorama(false);
          setGameState(createInitialState(GRID_SIZE, prev.level + 1));
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-gray-900">
          Vacuum Robot Simulator - Level {gameState.level}
        </h1>
        
        <div className="flex flex-col items-center gap-6">
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