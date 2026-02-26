import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Achievement, AchievementRequirement } from '@/lib/achievements';
import { achievements, getAchievement } from '@/lib/achievements';
import { getPowerUp } from '@/lib/powerups';
import { usePowerUpsStore } from './use-powerups';
import { useThemeStore } from './use-theme';

interface AchievementState {
  unlockedAchievements: string[];
  progress: Record<string, number>;
  unlockAchievement: (achievementId: string) => void;
  updateProgress: (requirementType: AchievementRequirement['type'], value: number) => void;
  checkAchievements: () => Achievement[];
  isUnlocked: (achievementId: string) => boolean;
}

export const useAchievementsStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      unlockedAchievements: [],
      progress: {
        levels_completed: 0,
        perfect_levels: 0,
        no_hints_used: 0,
        speed_run: 0,
        power_up_collector: 0,
        theme_collector: 0
      },

      unlockAchievement: (achievementId: string) => {
        set((state: AchievementState) => {
          if (state.unlockedAchievements.includes(achievementId)) {
            return state;
          }

          return {
            unlockedAchievements: [...state.unlockedAchievements, achievementId]
          };
        });
      },

      updateProgress: (requirementType: AchievementRequirement['type'], value: number) => {
        set((state: AchievementState) => ({
          progress: {
            ...state.progress,
            [requirementType]: Math.max(state.progress[requirementType] || 0, value)
          }
        }));
      },

      checkAchievements: () => {
        const { unlockedAchievements, progress } = get();
        const powerUpsStore = usePowerUpsStore.getState();
        const themeStore = useThemeStore.getState();
        
        const newlyUnlocked: Achievement[] = [];

        achievements.forEach((achievement: Achievement) => {
          if (unlockedAchievements.includes(achievement.id)) return;

          const requirement = achievement.requirement;
          const currentProgress = progress[requirement.type] || 0;

          if (currentProgress >= requirement.value) {
            // Unlock achievement
            get().unlockAchievement(achievement.id);
            newlyUnlocked.push(achievement);

            // Apply reward
            switch (achievement.reward.type) {
              case 'power_up':
                const powerUp = getPowerUp(achievement.reward.value);
                if (powerUp) {
                  powerUpsStore.addPowerUp(powerUp);
                }
                break;
              case 'theme_unlock':
                themeStore.setTheme(achievement.reward.value);
                break;
            }
          }
        });

        return newlyUnlocked;
      },

      isUnlocked: (achievementId: string) => {
        return get().unlockedAchievements.includes(achievementId);
      }
    }),
    {
      name: 'neon-path-achievements'
    }
  )
);

export const useAchievements = () => useAchievementsStore();
