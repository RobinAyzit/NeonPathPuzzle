
import { type Point } from "@shared/schema";

// Simple seeded random number generator
function mulberry32(a: number) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

export interface GeneratedLevel {
  id: number;
  gridSize: number;
  start: Point;
  nodes: Point[];
  solution: Point[];
}

export function generateLevel(levelId: number): GeneratedLevel {
  // 1. Determine parameters based on level ID (Aggressive Difficulty scaling)
  // Level 1-5: 3x3
  // Level 6-15: 4x4
  // Level 16-30: 5x5
  // Level 31-50: 6x6
  // Level 51-75: 7x7
  // Level 76-100: 8x8
  let gridSize = 3;
  if (levelId > 5) gridSize = 4;
  if (levelId > 15) gridSize = 5;
  if (levelId > 30) gridSize = 6;
  if (levelId > 50) gridSize = 7;
  if (levelId > 75) gridSize = 8;

  // Use levelId as seed for reproducibility
  const rng = mulberry32(levelId * 1337 + 42);

  // 2. Generate a valid Hamiltonian path on a subset of the grid
  // Target length increases with levelId within the same gridSize
  const gridCells = gridSize * gridSize;
  const progressInTier = levelId / 100; 
  const minLengthFactor = 0.5 + (progressInTier * 0.45); // Scales from 50% to 95% of grid
  const minLength = Math.max(3, Math.floor(gridCells * minLengthFactor));
  
  // Try to generate a valid level.
  let attempts = 0;
  while (attempts < 200) {
    const result = attemptGeneratePath(gridSize, minLength, rng, levelId);
    if (result) {
      return {
        id: levelId,
        gridSize,
        start: result[0],
        nodes: [...result].sort((a, b) => (a.y - b.y) || (a.x - b.x)),
        solution: result
      };
    }
    attempts++;
  }

  // Fallback
  return {
    id: levelId,
    gridSize: 3,
    start: { x: 0, y: 0 },
    nodes: [{x:0,y:0}, {x:1,y:0}, {x:2,y:0}, {x:2,y:1}, {x:1,y:1}, {x:0,y:1}, {x:0,y:2}, {x:1,y:2}, {x:2,y:2}],
    solution: [{x:0,y:0}, {x:1,y:0}, {x:2,y:0}, {x:2,y:1}, {x:1,y:1}, {x:0,y:1}, {x:0,y:2}, {x:1,y:2}, {x:2,y:2}]
  };
}

function attemptGeneratePath(size: number, minLength: number, rng: () => number, levelId: number): Point[] | null {
  const visited = new Set<string>();
  const path: Point[] = [];
  
  // Start position varies more by level
  const startX = Math.floor(rng() * size);
  const startY = Math.floor(rng() * size);
  const start = { x: startX, y: startY };
  
  path.push(start);
  visited.add(`${startX},${startY}`);
  
  if (extendPath(start, path, visited, size, minLength, rng)) {
    return path;
  }
  
  return null;
}

function extendPath(
  current: Point, 
  path: Point[], 
  visited: Set<string>, 
  size: number, 
  minLength: number,
  rng: () => number
): boolean {
  if (path.length === size * size) {
    return true;
  }

  const neighbors = [
    { x: current.x, y: current.y - 1 },
    { x: current.x, y: current.y + 1 },
    { x: current.x - 1, y: current.y },
    { x: current.x + 1, y: current.y }
  ].filter(p => 
    p.x >= 0 && p.x < size && 
    p.y >= 0 && p.y < size && 
    !visited.has(`${p.x},${p.y}`)
  );

  // Shuffle neighbors
  for (let i = neighbors.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [neighbors[i], neighbors[j]] = [neighbors[j], neighbors[i]];
  }

  for (const next of neighbors) {
    path.push(next);
    visited.add(`${next.x},${next.y}`);
    
    if (extendPath(next, path, visited, size, minLength, rng)) {
      return true;
    }
    
    visited.delete(`${next.x},${next.y}`);
    path.pop();
  }

  // Only accept if we met the length requirement and it's a dead end
  return path.length >= minLength;
}
