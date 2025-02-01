import { Position, GameState } from "@/lib/gameLogic";
import { Robot } from "./Robot";
import { Battery } from "lucide-react";
import { useState, useEffect } from "react";
import { DEFAULT_CONFIG } from "@/types/config";

interface GameBoardProps {
  gameState: GameState;
  showPanorama?: boolean;
}

const UNSPLASH_IMAGES = [
  'photo-1472396961693-142e6e269027',
  'photo-1482938289607-e9573fc25ebb',
  'photo-1509316975850-ff9c5deb0cd9',
  'photo-1469474968028-56623f02e42e',
  'photo-1470071459604-3b5ec3a7fe05'
];

export const GameBoard = ({ gameState, showPanorama = false }: GameBoardProps) => {
  const { robotPosition, robotDirection, dirtPositions, obstacles, gridSize, sunPosition, battery, path } = gameState;
  const [panoramaImage] = useState(() => 
    UNSPLASH_IMAGES[Math.floor(Math.random() * UNSPLASH_IMAGES.length)]
  );
  const [tileSize, setTileSize] = useState(DEFAULT_CONFIG.tileSize);

  useEffect(() => {
    const savedConfig = localStorage.getItem('gameConfig');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setTileSize(config.tileSize || DEFAULT_CONFIG.tileSize);
    }
  }, []);

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
    <div className="space-y-4 container px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 justify-center">
        <Battery className="w-6 h-6" />
        <div className="w-32 h-4 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${battery}%` }}
          />
        </div>
      </div>

      <div className="aspect-square w-full max-w-4xl mx-auto">
        <div className="grid gap-0" style={{ 
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`
        }}>
          {Array.from({ length: gridSize * gridSize }).map((_, index) => {
            const x = index % gridSize;
            const y = Math.floor(index / gridSize);
            const pathIndex = isInPath(x, y);
            
            return (
              <div
                key={`${x}-${y}`}
                className={`
                  aspect-square relative border border-gray-200
                  ${isObstacleHere(x, y) ? 'bg-gray-400' : 'bg-gray-100'}
                  ${isDirtHere(x, y) ? 'dirt bg-[#8B4513]' : ''} 
                  ${isSunHere(x, y) ? 'bg-yellow-100' : ''}
                `}
                style={{
                  background: pathIndex !== -1 ? getPathStyle(pathIndex) : undefined,
                  width: `${tileSize}px`,
                  height: `${tileSize}px`
                }}
              >
                {isRobotHere(x, y) && (
                  <div className="absolute inset-1">
                    <Robot direction={robotDirection} />
                  </div>
                )}
                {showPanorama && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 transition-all duration-500">
                    <img 
                      src={`https://source.unsplash.com/${panoramaImage}`}
                      alt="Level completion panorama"
                      className="w-full h-full object-cover opacity-50"
                    />
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