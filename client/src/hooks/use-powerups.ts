import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PowerUp, PowerUpEffect } from '@/lib/powerups';

interface PowerUpState {
  inventory: PowerUp[];
  activeEffects: ActiveEffect[];
  addPowerUp: (powerUp: PowerUp) => void;
  usePowerUp: (powerUpId: string) => boolean;
  hasActiveEffect: (effectType: PowerUpEffect['type']) => boolean;
  getEffectValue: (effectType: PowerUpEffect['type']) => number;
  removeEffect: (effectType: PowerUpEffect['type']) => void;
}

interface ActiveEffect {
  type: PowerUpEffect['type'];
  value: number;
  endTime?: number;
  uses?: number;
}

export const usePowerUpsStore = create<PowerUpState>()(
  persist(
    (set, get) => ({
      inventory: [],
      activeEffects: [],

      addPowerUp: (powerUp: PowerUp) => {
        set((state: PowerUpState) => ({
          inventory: [...state.inventory, powerUp]
        }));
      },

      usePowerUp: (powerUpId: string) => {
        const state = get();
        const powerUpIndex = state.inventory.findIndex((pu: PowerUp) => pu.id === powerUpId);
        
        if (powerUpIndex === -1) return false;

        const powerUp = state.inventory[powerUpIndex];
        const effect: ActiveEffect = {
          type: powerUp.effect.type,
          value: powerUp.effect.value || 1
        };

        // Set duration or uses
        if (powerUp.effect.duration) {
          effect.endTime = Date.now() + powerUp.effect.duration;
        } else if (powerUp.effect.type === 'score_multiplier') {
          effect.uses = powerUp.effect.duration || 3; // levels
        }

        // Apply immediate effects
        if (powerUp.effect.type === 'time_freeze') {
          // This will be handled by the game component
        }

        set((state: PowerUpState) => ({
          inventory: state.inventory.filter((_: PowerUp, idx: number) => idx !== powerUpIndex),
          activeEffects: [...state.activeEffects, effect]
        }));

        return true;
      },

      hasActiveEffect: (effectType: PowerUpEffect['type']) => {
        const state = get();
        const effect = state.activeEffects.find((e: ActiveEffect) => e.type === effectType);
        
        if (!effect) return false;

        // Check if effect has expired
        if (effect.endTime && Date.now() > effect.endTime) {
          get().removeEffect(effectType);
          return false;
        }

        return true;
      },

      getEffectValue: (effectType: PowerUpEffect['type']) => {
        const state = get();
        const effect = state.activeEffects.find((e: ActiveEffect) => e.type === effectType);
        
        if (!effect) return 1;

        // Check if effect has expired
        if (effect.endTime && Date.now() > effect.endTime) {
          get().removeEffect(effectType);
          return 1;
        }

        return effect.value;
      },

      removeEffect: (effectType: PowerUpEffect['type']) => {
        set((state: PowerUpState) => ({
          activeEffects: state.activeEffects.filter((e: ActiveEffect) => e.type !== effectType)
        }));
      }
    }),
    {
      name: 'neon-path-powerups'
    }
  )
);

export const usePowerUps = () => usePowerUpsStore();
