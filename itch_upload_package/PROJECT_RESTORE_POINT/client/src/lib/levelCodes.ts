/**
 * Generate a deterministic 4-digit code for a level
 * Same level always generates the same code
 * Different levels always generate different codes
 */
export function generateLevelCode(levelId: number): string {
  // No code for levels 1-9 and 101-109
  if (levelId < 10 || (levelId >= 101 && levelId < 110)) {
    return "";
  }

  // Use a deterministic hash based on levelId
  // Shift level ID to get unique 4-digit codes
  const seed = levelId * 9973; // Prime multiplier for better distribution
  const hash = Math.abs(seed % 10000);
  
  // Ensure it's always 4 digits
  return String(hash).padStart(4, "0");
}

/**
 * Find level ID from code
 * Returns null if code is invalid
 */
export function getLevelFromCode(code: string): number | null {
  if (!/^\d{4}$/.test(code)) {
    return null;
  }

  // Try levels 10-100 and 110-200
  for (let levelId = 10; levelId <= 100; levelId++) {
    if (generateLevelCode(levelId) === code) {
      return levelId;
    }
  }
  
  for (let levelId = 110; levelId <= 200; levelId++) {
    if (generateLevelCode(levelId) === code) {
      return levelId;
    }
  }

  return null;
}
