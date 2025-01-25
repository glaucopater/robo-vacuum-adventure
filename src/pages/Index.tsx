import { useState, useEffect } from "react";
import { GameBoard } from "@/components/GameBoard";
import { Controls } from "@/components/Controls";
import { ScoreBoard } from "@/components/ScoreBoard";
import { createInitialState, moveForward, rotateRobot, checkCollision, cleanDirt } from "@/lib/gameLogic";
import { toast } from "sonner";

const GRID_SIZE = 8;

const Index = () => {
  const [gameState, setGameState] = useState(createInitialState(GRID_SIZE));

  const handleMove = () => {
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
        score: dirtCleaned ? prev.score + 1 : prev.score
      };

      // Check if level is complete (all dirt cleaned)
      if (newDirtPositions.length === 0) {
        toast.success(`Level ${prev.level} completed! Starting next level...`, {
          duration: 3000,
        });
        
        // After a short delay, start the next level
        setTimeout(() => {
          setGameState(createInitialState(GRID_SIZE, prev.level + 1));
        }, 2000);
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
    
    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState]); // Include gameState in dependencies since handleMove uses it

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
          
          <GameBoard gameState={gameState} />
          
          <Controls
            onMove={handleMove}
            onRotate={handleRotate}
          />

          <p className="text-sm text-gray-600 text-center">
            Use arrow keys or WASD to control the robot:<br />
            ↑/W: Move forward • ←/A: Rotate left • →/D: Rotate right
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;