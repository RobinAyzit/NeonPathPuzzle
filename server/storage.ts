
import { userProgress, type InsertProgressSchema } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getUserProgress(userId: string): Promise<number[]>;
  updateUserProgress(userId: string, levelId: number, completed: boolean, hintsUsed: boolean): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUserProgress(userId: string): Promise<number[]> {
    const progress = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.completed, true)));
    
    return progress.map(p => p.levelId);
  }

  async updateUserProgress(userId: string, levelId: number, completed: boolean, hintsUsed: boolean): Promise<void> {
    // Check if exists
    const [existing] = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.levelId, levelId)));

    if (existing) {
      await db
        .update(userProgress)
        .set({ 
          completed: completed || existing.completed, 
          hintsUsed: hintsUsed || existing.hintsUsed,
          updatedAt: new Date() 
        })
        .where(eq(userProgress.id, existing.id));
    } else {
      await db.insert(userProgress).values({
        userId,
        levelId,
        completed,
        hintsUsed,
      });
    }
  }
}

export const storage = new DatabaseStorage();
