
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { generateLevel } from "./lib/level-generator";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // === API: List Levels ===
  app.get(api.levels.list.path, async (req, res) => {
    // We have 100 levels.
    // Check user progress to see which are unlocked.
    // Default: Level 1 unlocked, others locked unless completed previous.
    // For simplicity, we trust the client or use a userId query/cookie.
    // Let's rely on a 'userId' header or query for now, or just return default state
    // and let frontend merge with its knowledge if we wanted pure stateless.
    // But we have a DB!
    
    // In a real app we'd use session middleware. 
    // Here we'll check a custom header 'x-user-id' from the frontend.
    const userId = req.headers['x-user-id'] as string || "guest";
    
    const progress = await storage.getUserProgress(userId);
    const completedSet = new Set(progress);
    
    const levels = [];
    for (let i = 1; i <= 100; i++) {
      const isCompleted = completedSet.has(i);
      // Level is locked if it's not Level 1 AND previous level is not completed
      const isLocked = i > 1 && !completedSet.has(i - 1);
      
      levels.push({
        id: i,
        isCompleted,
        isLocked
      });
    }
    
    res.json(levels);
  });

  // === API: Get Level Data ===
  app.get(api.levels.get.path, async (req, res) => {
    const levelId = parseInt(req.params.id);
    if (isNaN(levelId) || levelId < 1 || levelId > 100) {
      return res.status(404).json({ message: "Level not found" });
    }

    const level = generateLevel(levelId);
    
    // Don't send the solution in the main GET!
    res.json({
      id: level.id,
      gridSize: level.gridSize,
      start: level.start,
      nodes: level.nodes
    });
  });

  // === API: Get Solution (Hint) ===
  app.get(api.levels.solution.path, async (req, res) => {
    const levelId = parseInt(req.params.id);
    const userId = req.headers['x-user-id'] as string || "guest";
    
    if (isNaN(levelId) || levelId < 1 || levelId > 100) {
      return res.status(404).json({ message: "Level not found" });
    }

    // Mark hint as used in DB
    // We don't mark 'completed', just update 'hintsUsed'
    await storage.updateUserProgress(userId, levelId, false, true);

    const level = generateLevel(levelId);
    res.json({ path: level.solution });
  });

  // === API: Sync Progress ===
  app.post(api.progress.sync.path, async (req, res) => {
    try {
      const input = api.progress.sync.input.parse(req.body);
      await storage.updateUserProgress(input.userId, input.levelId, input.completed, input.hintsUsed);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ success: false });
    }
  });

  return httpServer;
}
