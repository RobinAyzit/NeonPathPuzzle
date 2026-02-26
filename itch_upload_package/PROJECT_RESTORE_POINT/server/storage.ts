
import { userProgress, type InsertProgressSchema } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getUserProgress(userId: string): Promise<number[]>;
  updateUserProgress(userId: string, levelId: number, completed: boolean, hintsUsed: boolean): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUserProgress(userId: string): Promise<number[]> {
    try {
      const progress = await db
        .select()
        .from(userProgress)
        .where(and(eq(userProgress.userId, userId), eq(userProgress.completed, 1 as any)));
      
      return progress.map(p => p.levelId);
    } catch (error) {
      console.error("Error getting user progress:", error);
      return [];
    }
  }

  async updateUserProgress(userId: string, levelId: number, completed: boolean, hintsUsed: boolean): Promise<void> {
    try {
      // Check if exists
      const existing = await db
        .select()
        .from(userProgress)
        .where(and(eq(userProgress.userId, userId), eq(userProgress.levelId, levelId)));

      if (existing.length > 0) {
        await db
          .update(userProgress)
          .set({ 
            completed: (completed || existing[0].completed) ? 1 : 0,
            hintsUsed: (hintsUsed || existing[0].hintsUsed) ? 1 : 0,
            updatedAt: new Date() 
          })
          .where(eq(userProgress.id, existing[0].id));
      } else {
        await db.insert(userProgress).values({
          userId,
          levelId,
          completed: completed ? 1 : 0,
          hintsUsed: hintsUsed ? 1 : 0,
          updatedAt: new Date()
        } as any);
      }
    } catch (error) {
      console.error("Error updating user progress:", error);
    }
  }
}

export const storage = new DatabaseStorage();
