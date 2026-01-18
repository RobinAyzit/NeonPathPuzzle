
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
  // 1. Determine parameters based on level ID (Difficulty scaling)
  let gridSize = 3;
  if (levelId > 10) gridSize = 4;
  if (levelId > 25) gridSize = 5;
  if (levelId > 50) gridSize = 6;
  if (levelId > 75) gridSize = 7;
  if (levelId > 90) gridSize = 8;

  // Use levelId as seed for reproducibility
  const rng = mulberry32(levelId * 1337);

  // 2. Generate a valid Hamiltonian path on a subset of the grid
  // We want the path to be long enough to be interesting.
  // Target length: 60% to 100% of grid cells.
  const minLength = Math.max(4, Math.floor(gridSize * gridSize * 0.6));
  
  // Try to generate a valid level. If we get stuck, retry with new seed offset.
  let attempts = 0;
  while (attempts < 100) {
    const result = attemptGeneratePath(gridSize, minLength, rng);
    if (result) {
      return {
        id: levelId,
        gridSize,
        start: result[0],
        nodes: result.sort((a, b) => (a.y - b.y) || (a.x - b.x)), // Sort for consistent rendering
        solution: result
      };
    }
    attempts++;
  }

  // Fallback for safety (should rare happen with backtracking)
  return {
    id: levelId,
    gridSize: 3,
    start: { x: 0, y: 0 },
    nodes: [{x:0,y:0}, {x:1,y:0}, {x:2,y:0}],
    solution: [{x:0,y:0}, {x:1,y:0}, {x:2,y:0}]
  };
}

function attemptGeneratePath(size: number, minLength: number, rng: () => number): Point[] | null {
  const visited = new Set<string>();
  const path: Point[] = [];
  
  // Random start position
  const startX = Math.floor(rng() * size);
  const startY = Math.floor(rng() * size);
  const start = { x: startX, y: startY };
  
  path.push(start);
  visited.add(`${startX},${startY}`);
  
  // DFS to extend path
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
  // Heuristic: If we reached a decent length and randomly decide to stop, or filled grid
  if (path.length >= minLength && rng() > 0.8) {
     return true;
  }
  if (path.length === size * size) {
    return true;
  }

  // Get neighbors (shuffled)
  const neighbors = [
    { x: current.x, y: current.y - 1 }, // Up
    { x: current.x, y: current.y + 1 }, // Down
    { x: current.x - 1, y: current.y }, // Left
    { x: current.x + 1, y: current.y }  // Right
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
    
    // Backtrack
    visited.delete(`${next.x},${next.y}`);
    path.pop();
  }

  // If we are here, we are stuck. 
  // If we already met the min length, we can accept this as a valid path (even if dead end)
  if (path.length >= minLength) {
    return true;
  }

  return false;
}
