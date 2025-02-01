import { Position, GameState } from "@/lib/gameLogic";
import { GameCell } from "./GameCell";

interface GameGridProps {
  gameState: GameState;
  showPanorama?: boolean;
  panoramaImage: string;
  tileSize: number;
}

export const GameGrid = ({ gameState, showPanorama, panoramaImage, tileSize }: GameGridProps) => {
  const { robotPosition, robotDirection, dirtPositions, obstacles, gridSize, sunPosition, path } = gameState;

  const isRobotHere = (x: number, y: number) => 
    robotPosition.x === x && robotPosition.y === y;

  const isDirtHere = (x: number, y: number) =>
    dirtPositions.some(dirt => dirt.x === x && dirt.y === y);

  const isObstacleHere = (x: number, y: number) =>
    obstacles.some(obstacle => obstacle.x === x && obstacle.y === y);

  const isSunHere = (x: number, y: number) =>
    y === 0 && Math.abs(x - sunPosition) <= 1;

  const isInPath = (x: number, y: number) => {
    return path.findIndex(pos => pos.x === x && pos.y === y);
  };

  const getPathStyle = (index: number) => {
    if (index === -1) return '';
    const percentage = (index / path.length) * 100;
    return `linear-gradient(90deg, hsla(139, 70%, 75%, ${percentage}%), hsla(63, 90%, 76%, ${percentage}%))`;
  };

  return (
    <div 
      className="grid grid-flow-row" 
      style={{ 
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        gap: 0
      }}
    >
      {Array.from({ length: gridSize * gridSize }).map((_, index) => {
        const x = index % gridSize;
        const y = Math.floor(index / gridSize);
        const pathIndex = isInPath(x, y);
        
        return (
          <GameCell
            key={`${x}-${y}`}
            x={x}
            y={y}
            isRobot={isRobotHere(x, y)}
            isDirt={isDirtHere(x, y)}
            isObstacle={isObstacleHere(x, y)}
            isSun={isSunHere(x, y)}
            robotDirection={robotDirection}
            pathStyle={getPathStyle(pathIndex)}
            showPanorama={showPanorama}
            panoramaImage={panoramaImage}
            tileSize={tileSize}
          />
        );
      })}
    </div>
  );
};