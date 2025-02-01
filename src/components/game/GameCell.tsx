import { Position, Direction } from "@/lib/gameLogic";
import { Robot } from "../Robot";

interface GameCellProps {
  x: number;
  y: number;
  isRobot: boolean;
  isDirt: boolean;
  isObstacle: boolean;
  isSun: boolean;
  robotDirection: Direction;  // Changed from string to Direction type
  pathStyle?: string;
  showPanorama?: boolean;
  panoramaImage?: string;
  tileSize: number;
}

export const GameCell = ({
  x,
  y,
  isRobot,
  isDirt,
  isObstacle,
  isSun,
  robotDirection,
  pathStyle,
  showPanorama,
  panoramaImage,
  tileSize,
}: GameCellProps) => {
  return (
    <div
      key={`${x}-${y}`}
      className={`
        aspect-square relative border border-gray-200
        ${isObstacle ? 'bg-gray-400' : 'bg-gray-100'}
        ${isDirt ? 'bg-[#8B4513]' : ''} 
        ${isSun ? 'bg-yellow-100' : ''}
      `}
      style={{
        background: pathStyle,
        width: `${tileSize}px`,
        height: `${tileSize}px`
      }}
    >
      {isRobot && (
        <div className="absolute inset-1">
          <Robot direction={robotDirection} />
        </div>
      )}
      {showPanorama && panoramaImage && (
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
};