import { generateLevel, GeneratedLevel } from "./shared/level-generator";

function levelsAreEqual(a: GeneratedLevel, b: GeneratedLevel): boolean {
  if (a.gridSize !== b.gridSize) return false;
  if (a.nodes.length !== b.nodes.length) return false;
  
  // Check if all nodes are the same (order doesn't matter)
  const aNodes = new Set(a.nodes.map(n => `${n.x},${n.y}`));
  const bNodes = new Set(b.nodes.map(n => `${n.x},${n.y}`));
  
  if (aNodes.size !== bNodes.size) return false;
  
  for (const node of aNodes) {
    if (!bNodes.has(node)) return false;
  }
  
  return true;
}

function calculateDifficultyMetrics(level: GeneratedLevel) {
  const gridCells = level.gridSize * level.gridSize;
  const nodeCount = level.nodes.length;
  const coverage = nodeCount / gridCells;
  
  // Count path complexity (number of direction changes)
  let directionChanges = 0;
  let prevDx = 0;
  let prevDy = 0;
  
  for (let i = 1; i < level.solution.length; i++) {
    const dx = level.solution[i].x - level.solution[i-1].x;
    const dy = level.solution[i].y - level.solution[i-1].y;
    
    if (i > 1 && (dx !== prevDx || dy !== prevDy)) {
      directionChanges++;
    }
    prevDx = dx;
    prevDy = dy;
  }
  
  return {
    gridSize: level.gridSize,
    nodeCount,
    coverage: Math.round(coverage * 100),
    directionChanges
  };
}

console.log("🔍 Verifying all 200 levels...\n");

const levels: GeneratedLevel[] = [];
const duplicates: number[][] = [];
const errors: { level: number; error: string }[] = [];

// Generate all levels
for (let i = 1; i <= 200; i++) {
  try {
    const level = generateLevel(i);
    levels.push(level);
    
    // Check for duplicates with previous levels
    for (let j = 0; j < levels.length - 1; j++) {
      if (levelsAreEqual(level, levels[j])) {
        duplicates.push([j + 1, i]);
      }
    }
  } catch (e) {
    errors.push({ level: i, error: String(e) });
  }
}

// Report results
console.log("📊 GENERATION RESULTS:");
console.log(`   Total levels generated: ${levels.length}/200`);
console.log(`   Errors: ${errors.length}`);

if (errors.length > 0) {
  console.log("\n❌ ERRORS:");
  errors.forEach(e => console.log(`   Level ${e.level}: ${e.error}`));
}

console.log("\n🔍 DUPLICATE CHECK:");
if (duplicates.length === 0) {
  console.log("   ✅ All levels are unique!");
} else {
  console.log(`   ⚠️ Found ${duplicates.length} duplicate pairs:`);
  duplicates.forEach(([a, b]) => {
    console.log(`      Level ${a} === Level ${b}`);
  });
}

// Difficulty progression analysis
console.log("\n📈 DIFFICULTY PROGRESSION:");

const ranges = [
  { name: "Level 1 (Tutorial)", start: 1, end: 1 },
  { name: "Levels 2-4 (Easy Start)", start: 2, end: 4 },
  { name: "Levels 5-10 (Beginner)", start: 5, end: 10 },
  { name: "Levels 11-16 (Intermediate)", start: 11, end: 16 },
  { name: "Levels 17-31 (Advanced)", start: 17, end: 31 },
  { name: "Levels 32-60 (Expert)", start: 32, end: 60 },
  { name: "Levels 61-100 (Master)", start: 61, end: 100 },
  { name: "Levels 101-130 (Extreme)", start: 101, end: 130 },
  { name: "Levels 131-170 (Insane)", start: 131, end: 170 },
  { name: "Levels 171-200 (Nightmare)", start: 171, end: 200 }
];

ranges.forEach(range => {
  const rangeLevels = levels.filter(l => l.id >= range.start && l.id <= range.end);
  if (rangeLevels.length === 0) return;
  
  const avgGrid = Math.round(rangeLevels.reduce((sum, l) => sum + l.gridSize, 0) / rangeLevels.length);
  const avgNodes = Math.round(rangeLevels.reduce((sum, l) => sum + l.nodes.length, 0) / rangeLevels.length);
  const avgCoverage = Math.round(rangeLevels.reduce((sum, l) => sum + (l.nodes.length / (l.gridSize * l.gridSize)), 0) / rangeLevels.length * 100);
  
  console.log(`\n   ${range.name}:`);
  console.log(`      Grid: ${avgGrid}x${avgGrid}, Nodes: ~${avgNodes}, Coverage: ~${avgCoverage}%`);
  
  // Show sample level
  const sample = rangeLevels[0];
  console.log(`      Sample (Level ${sample.id}): ${sample.gridSize}x${sample.gridSize} grid, ${sample.nodes.length} nodes`);
});

// Verify specific progression requirements
console.log("\n✅ VALIDATION CHECKS:");

// Check 1: Level 1 should be easiest
const level1 = levels[0];
console.log(`   Level 1: ${level1.gridSize}x${level1.gridSize} grid, ${level1.nodes.length} nodes - ${level1.nodes.length <= 5 ? '✅ Easy enough' : '⚠️ Might be too hard'}`);

// Check 2: Level 200 should be hardest
const level200 = levels[199];
const metrics200 = calculateDifficultyMetrics(level200);
console.log(`   Level 200: ${level200.gridSize}x${level200.gridSize} grid, ${level200.nodes.length} nodes (${metrics200.coverage}% coverage) - ${metrics200.coverage >= 80 ? '✅ Very challenging' : '⚠️ Might be too easy'}`);

// Check 3: Progressive node count
let progressionOk = true;
for (let i = 1; i < levels.length; i++) {
  const prev = levels[i-1];
  const curr = levels[i];
  
  // Generally, later levels should have more nodes (but not strictly)
  if (curr.gridSize < prev.gridSize && i > 10) {
    console.log(`   ⚠️ Level ${curr.id} has smaller grid than Level ${prev.id}`);
    progressionOk = false;
  }
}

if (progressionOk) {
  console.log("   ✅ Grid size progression looks good");
}

console.log("\n🎉 VERIFICATION COMPLETE!");
