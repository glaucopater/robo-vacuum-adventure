export interface GameConfig {
  gridSize: number;
  batteryMoveCost: number;
  batteryChargeRate: number;
  sunMoveInterval: number;
  lastLevel: number;
  lastScore: number;
}

export const DEFAULT_CONFIG: GameConfig = {
  gridSize: 8, // Reduced from 10 by ~25%
  batteryMoveCost: 3,
  batteryChargeRate: 10,
  sunMoveInterval: 3000,
  lastLevel: 1,
  lastScore: 0
};