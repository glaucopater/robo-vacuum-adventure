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
};

export const createInitialState = (gridSize: number): GameState => ({
  robotPosition: { x: 0, y: 0 },
  robotDirection: 'right',
  dirtPositions: [
    { x: 2, y: 2 },
    { x: 3, y: 4 },
    { x: 5, y: 3 },
  ],
  obstacles: [
    { x: 2, y: 3 },
    { x: 4, y: 4 },
  ],
  score: 0,
  gridSize,
});

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