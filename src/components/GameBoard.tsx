import { GameState } from "@/lib/gameLogic";
import { useState, useEffect } from "react";
import { DEFAULT_CONFIG } from "@/types/config";
import { BatteryIndicator } from "./game/BatteryIndicator";
import { GameGrid } from "./game/GameGrid";

const UNSPLASH_IMAGES = [
  'photo-1472396961693-142e6e269027',
  'photo-1482938289607-e9573fc25850',
  'photo-1509316975850-ff9c5deb0cd9',
  'photo-1469474968028-56623f02e42e',
  'photo-1470071459604-3b5ec3a7fe05'
];

interface GameBoardProps {
  gameState: GameState;
  showPanorama?: boolean;
}

export const GameBoard = ({ gameState, showPanorama = false }: GameBoardProps) => {
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

  return (
    <div className="space-y-4 container px-4 sm:px-6 lg:px-8">
      <BatteryIndicator battery={gameState.battery} />
      <div className="aspect-square w-full max-w-4xl mx-auto">
        <GameGrid 
          gameState={gameState}
          showPanorama={showPanorama}
          panoramaImage={panoramaImage}
          tileSize={tileSize}
        />
      </div>
    </div>
  );
};