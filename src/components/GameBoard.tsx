import { Position, GameState } from "@/lib/gameLogic";
import { Robot } from "./Robot";
import { Battery } from "lucide-react";

interface GameBoardProps {
  gameState: GameState;
}

export const GameBoard = ({ gameState }: GameBoardProps) => {
  const { robotPosition, robotDirection, dirtPositions, obstacles, gridSize, sunPosition, battery } = gameState;

  const isRobotHere = (x: number, y: number) => 
    robotPosition.x === x && robotPosition.y === y;

  const isDirtHere = (x: number, y: number) =>
    dirtPositions.some(dirt => dirt.x === x && dirt.y === y);

  const isObstacleHere = (x: number, y: number) =>
    obstacles.some(obstacle => obstacle.x === x && obstacle.y === y);

  const isSunHere = (x: number, y: number) =>
    y === 0 && Math.abs(x - sunPosition) <= 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 justify-center">
        <Battery className="w-6 h-6" />
        <div className="w-32 h-4 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${battery}%` }}
          />
        </div>
      </div>

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
                  ${isSunHere(x, y) ? 'bg-yellow-100' : ''}
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
    </div>
  );
};