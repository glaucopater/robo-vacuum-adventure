import { GameState } from "@/lib/gameLogic";
import { useState, useEffect } from "react";
import { DEFAULT_CONFIG } from "@/types/config";
import { BatteryIndicator } from "./game/BatteryIndicator";
import { GameGrid } from "./game/GameGrid";

const UNSPLASH_IMAGES = [
  "photo-1691007751887-667bbe17b2dd",
  "photo-1691007751887-667bbe17b2dd",
  "photo-1691007751887-667bbe17b2dd",
  "photo-1691007751887-667bbe17b2dd",
  "photo-1691007751887-667bbe17b2dd",
  "photo-1691007751887-667bbe17b2dd",
];

interface GameBoardProps {
  gameState: GameState;
  showPanorama?: boolean;
}

export const GameBoard = ({
  gameState,
  showPanorama = false,
}: GameBoardProps) => {
  const [panoramaImage] = useState(
    () => UNSPLASH_IMAGES[Math.floor(Math.random() * UNSPLASH_IMAGES.length)]
  );
  const [tileSize, setTileSize] = useState(DEFAULT_CONFIG.tileSize);

  useEffect(() => {
    const savedConfig = localStorage.getItem("gameConfig");
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setTileSize(config.tileSize || DEFAULT_CONFIG.tileSize);
    }
  }, []);

  return (
    <div className="space-y-4 container px-4 sm:px-6 lg:px-8">
      <BatteryIndicator battery={gameState.battery} />
      <div
        className="aspect-square w-full max-w-4xl mx-auto"
        style={
          {
            display: "flex",
            placeContent: "center",
            placeItems: "center",
          } as React.CSSProperties
        }
      >
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
