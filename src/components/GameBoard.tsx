import { Position, GameState } from "@/lib/gameLogic";
import { Robot } from "./Robot";

interface GameBoardProps {
  gameState: GameState;
}

export const GameBoard = ({ gameState }: GameBoardProps) => {
  const { robotPosition, robotDirection, dirtPositions, obstacles, gridSize } = gameState;

  const isRobotHere = (x: number, y: number) => 
    robotPosition.x === x && robotPosition.y === y;

  const isDirtHere = (x: number, y: number) =>
    dirtPositions.some(dirt => dirt.x === x && dirt.y === y);

  const isObstacleHere = (x: number, y: number) =>
    obstacles.some(obstacle => obstacle.x === x && obstacle.y === y);

  return (
    <div className="aspect-square w-full max-w-2xl">
      <div className="grid gap-1" style={{ 
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)`
      }}>
        {Array.from({ length: gridSize * gridSize }).map((_, index) => {
          const x = index % gridSize;
          const y = Math.floor(index / gridSize);
          
          return (
            <div
              key={`${x}-${y}`}
              className={`
                aspect-square rounded-sm
                ${isObstacleHere(x, y) ? 'bg-gray-400' : 'bg-gray-100'}
                ${isDirtHere(x, y) ? 'dirt bg-yellow-200' : ''}
                relative
              `}
            >
              {isRobotHere(x, y) && (
                <div className="absolute inset-1">
                  <Robot direction={robotDirection} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};