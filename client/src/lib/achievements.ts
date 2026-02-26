export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: AchievementRequirement;
  reward: AchievementReward;
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
}

export interface AchievementRequirement {
  type: 'levels_completed' | 'perfect_levels' | 'no_hints_used' | 'speed_run' | 'power_up_collector' | 'theme_collector';
  value: number;
  condition?: string;
}

export interface AchievementReward {
  type: 'power_up' | 'theme_unlock' | 'badge' | 'title';
  value: string;
  description: string;
}

export const achievements: Achievement[] = [
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Complete your first level',
    icon: '👶',
    requirement: {
      type: 'levels_completed',
      value: 1
    },
    reward: {
      type: 'power_up',
      value: 'undo_protection',
      description: 'Undo Shield power-up'
    },
    rarity: 'bronze'
  },
  {
    id: 'getting_started',
    name: 'Getting Started',
    description: 'Complete 10 levels',
    icon: '🎯',
    requirement: {
      type: 'levels_completed',
      value: 10
    },
    reward: {
      type: 'power_up',
      value: 'path_hint',
      description: 'Path Reveal power-up'
    },
    rarity: 'bronze'
  },
  {
    id: 'dedicated_player',
    name: 'Dedicated Player',
    description: 'Complete 50 levels',
    icon: '⭐',
    requirement: {
      type: 'levels_completed',
      value: 50
    },
    reward: {
      type: 'theme_unlock',
      value: 'retro',
      description: 'Unlock Retro Wave theme'
    },
    rarity: 'silver'
  },
  {
    id: 'master_puzzler',
    name: 'Master Puzzler',
    description: 'Complete 100 levels',
    icon: '🏆',
    requirement: {
      type: 'levels_completed',
      value: 100
    },
    reward: {
      type: 'theme_unlock',
      value: 'cosmic',
      description: 'Unlock Cosmic theme'
    },
    rarity: 'gold'
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Complete 10 levels without using hints',
    icon: '💎',
    requirement: {
      type: 'no_hints_used',
      value: 10
    },
    reward: {
      type: 'power_up',
      value: 'undo_protection',
      description: 'Undo Shield power-up'
    },
    rarity: 'silver'
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete a level in under 30 seconds',
    icon: '⚡',
    requirement: {
      type: 'speed_run',
      value: 30
    },
    reward: {
      type: 'power_up',
      value: 'time_freeze',
      description: 'Time Freeze power-up'
    },
    rarity: 'gold'
  },
  {
    id: 'power_collector',
    name: 'Power Collector',
    description: 'Collect 10 power-ups',
    icon: '🎁',
    requirement: {
      type: 'power_up_collector',
      value: 10
    },
    reward: {
      type: 'power_up',
      value: 'score_multiplier',
      description: 'Score Boost power-up'
    },
    rarity: 'silver'
  },
  {
    id: 'theme_explorer',
    name: 'Theme Explorer',
    description: 'Try all available themes',
    icon: '🎨',
    requirement: {
      type: 'theme_collector',
      value: 5
    },
    reward: {
      type: 'theme_unlock',
      value: 'matrix',
      description: 'Unlock Matrix theme'
    },
    rarity: 'gold'
  },
  {
    id: 'legendary_puzzler',
    name: 'Legendary Puzzler',
    description: 'Complete all 200 levels',
    icon: '👑',
    requirement: {
      type: 'levels_completed',
      value: 200
    },
    reward: {
      type: 'theme_unlock',
      value: 'sunset',
      description: 'Unlock Neon Sunset theme'
    },
    rarity: 'platinum'
  },
  {
    id: 'perfect_run',
    name: 'Perfect Run',
    description: 'Complete 25 levels without losing a single life',
    icon: '🛡️',
    requirement: {
      type: 'perfect_levels',
      value: 25
    },
    reward: {
      type: 'title',
      value: 'Perfect',
      description: 'Perfect title badge'
    },
    rarity: 'diamond'
  }
];

export const getAchievement = (achievementId: string): Achievement | undefined => {
  return achievements.find(a => a.id === achievementId);
};

export const getRarityColor = (rarity: Achievement['rarity']) => {
  switch (rarity) {
    case 'bronze': return '#cd7f32';
    case 'silver': return '#c0c0c0';
    case 'gold': return '#ffd700';
    case 'platinum': return '#e5e4e2';
    case 'diamond': return '#b9f2ff';
    default: return '#94a3b8';
  }
};

export const getRarityOrder = (rarity: Achievement['rarity']): number => {
  switch (rarity) {
    case 'bronze': return 1;
    case 'silver': return 2;
    case 'gold': return 3;
    case 'platinum': return 4;
    case 'diamond': return 5;
    default: return 0;
  }
};
