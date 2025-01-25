export type Position = {
  x: number;
  y: number;
};

export type Direction = 'up' | 'right' | 'down' | 'left';

export type GameState = {
  robotPosition: Position;
  robotDirection: Direction;
  dirtPositions: Position[];
  obstacles: Position[];
  score: number;
  gridSize: number;
  level: number;
};

const generateLevel = (level: number, gridSize: number): Pick<GameState, 'dirtPositions' | 'obstacles'> => {
  const dirtCount = Math.min(3 + level, Math.floor(gridSize * gridSize * 0.3));
  const obstacleCount = Math.min(2 + level, Math.floor(gridSize * gridSize * 0.2));
  
  const positions: Position[] = [];
  const dirtPositions: Position[] = [];
  const obstacles: Position[] = [];

  // Helper to generate random position
  const generateRandomPosition = (): Position => {
    let pos: Position;
    do {
      pos = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
      };
      // Ensure position is not (0,0) (robot start) and not already used
    } while ((pos.x === 0 && pos.y === 0) || 
             positions.some(p => p.x === pos.x && p.y === pos.y));
    
    positions.push(pos);
    return pos;
  };

  // Generate dirt positions
  for (let i = 0; i < dirtCount; i++) {
    dirtPositions.push(generateRandomPosition());
  }

  // Generate obstacles
  for (let i = 0; i < obstacleCount; i++) {
    obstacles.push(generateRandomPosition());
  }

  return { dirtPositions, obstacles };
};

export const createInitialState = (gridSize: number, level: number = 1): GameState => {
  const { dirtPositions, obstacles } = generateLevel(level, gridSize);
  
  return {
    robotPosition: { x: 0, y: 0 },
    robotDirection: 'right',
    dirtPositions,
    obstacles,
    score: 0,
    gridSize,
    level,
  };
};

export const rotateRobot = (currentDirection: Direction, rotation: 'left' | 'right'): Direction => {
  const directions: Direction[] = ['up', 'right', 'down', 'left'];
  const currentIndex = directions.indexOf(currentDirection);
  const delta = rotation === 'left' ? -1 : 1;
  const newIndex = (currentIndex + delta + directions.length) % directions.length;
  return directions[newIndex];
};

export const moveForward = (position: Position, direction: Direction, gridSize: number): Position | null => {
  const newPosition = { ...position };
  
  switch (direction) {
    case 'up':
      newPosition.y = Math.max(0, position.y - 1);
      break;
    case 'right':
      newPosition.x = Math.min(gridSize - 1, position.x + 1);
      break;
    case 'down':
      newPosition.y = Math.min(gridSize - 1, position.y + 1);
      break;
    case 'left':
      newPosition.x = Math.max(0, position.x - 1);
      break;
  }

  return newPosition;
};

export const checkCollision = (position: Position, obstacles: Position[]): boolean => {
  return obstacles.some(obstacle => obstacle.x === position.x && obstacle.y === position.y);
};

export const cleanDirt = (position: Position, dirtPositions: Position[]): Position[] => {
  return dirtPositions.filter(dirt => !(dirt.x === position.x && dirt.y === position.y));
};
