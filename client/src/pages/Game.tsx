import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import confetti from "canvas-confetti";
import {
  useLevel,
  useSolution,
  useUpdateProgress,
  useUserId
} from "@/hooks/use-game";
import { usePowerUps, usePowerUpsStore } from "@/hooks/use-powerups";
import { useAchievements } from "@/hooks/use-achievements";
import { useTheme } from "@/hooks/use-theme";
import { Header } from "@/components/Header";
import { GameCanvas } from "@/components/GameCanvas";
import { WinModal } from "@/components/WinModal";
import { Loader2 } from "lucide-react";

export default function Game() {
  const [, params] = useRoute("/play/:id");
  const [, setLocation] = useLocation();
  const levelId = parseInt(params?.id || "1");
  const userId = useUserId();
  const { hasActiveEffect, getEffectValue, usePowerUp } = usePowerUps();
  const { updateProgress, checkAchievements } = useAchievements();
  const { getThemeColors } = useTheme();

  // Queries
  const { data: level, isLoading, error } = useLevel(levelId);
  const { data: solution, refetch: fetchHint, isFetching: isHintLoading } = useSolution(levelId);
  const updateProgressMutation = useUpdateProgress();

  // Local State
  const [showHint, setShowHint] = useState(false);
  const [hintUsedThisLevel, setHintUsedThisLevel] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [key, setKey] = useState(0); // Used to reset the canvas
  const [levelStartTime, setLevelStartTime] = useState(Date.now());

  // Apply theme colors on mount and theme change
  useEffect(() => {
    const colors = getThemeColors();
    const root = document.documentElement;
    
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value as string);
    });
  }, [getThemeColors]);

  // Prevent wheel zoom and enable smooth scrolling
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Prevent zoom on Ctrl+scroll (Windows/Linux) or Cmd+scroll (Mac)
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    // Prevent pinch zoom on touch devices
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  // Reset state when level ID changes
  useEffect(() => {
    setShowHint(false);
    setHintUsedThisLevel(false);
    setHasWon(false);
    setLives(3);
    setIsGameOver(false);
    setKey(prev => prev + 1);
    setLevelStartTime(Date.now());
  }, [levelId]);

  // Auto-hide hint after varying duration based on level
  useEffect(() => {
    if (!showHint) return;

    // Determine hint duration based on level progression
    let hintDuration = 3000; // 3 seconds (levels 1-49)
    if (levelId > 50) hintDuration = 5000; // 5 seconds (levels 51-100)
    if (levelId > 100) hintDuration = 10000; // 10 seconds (levels 101+)

    const timer = setTimeout(() => {
      setShowHint(false);
    }, hintDuration);

    return () => clearTimeout(timer);
  }, [showHint, levelId]);

  const handleWin = () => {
    if (hasWon) return; // Prevent double trigger
    setHasWon(true);

    // Celebration effect with theme colors
    const colors = getThemeColors();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors.neon
    });

    // Update achievement progress
    const completionTime = Date.now() - levelStartTime;
    const perfectLevel = !hintUsedThisLevel && lives === 3;
    
    // Update progress
    updateProgress('levels_completed', levelId);
    if (perfectLevel) updateProgress('perfect_levels', 1);
    if (!hintUsedThisLevel) updateProgress('no_hints_used', 1);
    if (completionTime < 30000) updateProgress('speed_run', 1);

    // Check for new achievements
    const newAchievements = checkAchievements();
    if (newAchievements.length > 0) {
      // Show achievement notifications (could add a toast system here)
      console.log('New achievements unlocked:', newAchievements);
    }

    // Save progress
    updateProgressMutation.mutate({
      userId,
      levelId,
      completed: true,
      hintsUsed: showHint,
    });
  };

  const handleHint = async () => {
    if (showHint || hintUsedThisLevel) return;
    
    // Check if player has path hint power-up
    if (hasActiveEffect('path_hint')) {
      setShowHint(true);
      setHintUsedThisLevel(true);
      return;
    }
    
    await fetchHint();
    setShowHint(true);
    setHintUsedThisLevel(true);
  };

  const handleBacktrack = () => {
    // Check if player has undo protection
    if (hasActiveEffect('undo_protection')) {
      // Consume the protection
      usePowerUpsStore.getState().removeEffect('undo_protection');
      return;
    }

    const newLives = lives - 1;
    setLives(newLives);

    if (newLives <= 0) {
      setIsGameOver(true);
    }
  };

  const handleGameOverRestart = () => {
    setLocation("/play/1");
  };

  const handleReset = () => {
    setKey(prev => prev + 1); // Remount canvas to reset
    setShowHint(false);
  };

  const handleNext = () => {
    if (levelId < 100) {
      setLocation(`/play/${levelId + 1}`);
    } else {
      setLocation("/");
    }
  };

  if (isGameOver) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background gap-6">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-orbitron font-bold text-destructive neon-text">GAME OVER</h2>
          <p className="text-muted-foreground font-exo text-lg">You lost all your lives. Starting from Level 1...</p>
        </div>
        <button
          onClick={handleGameOverRestart}
          className="px-8 py-3 bg-primary text-primary-foreground font-orbitron rounded hover:opacity-90 transition-opacity"
        >
          RESTART
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !level) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-destructive gap-4">
        <h2 className="text-2xl font-bold">Level Load Failed</h2>
        <button onClick={() => window.location.reload()} className="underline">Retry</button>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-background overflow-hidden">
      <Header
        levelId={levelId}
        onReset={handleReset}
        onHint={handleHint}
        hintsUsed={hintUsedThisLevel}
        isHintLoading={isHintLoading}
        lives={lives}
      />

      <main className="flex-1 relative flex items-center justify-center overflow-hidden px-2 md:px-4 py-2 md:py-4 w-full">
        {/* Background ambient effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none z-0" />

        {/* Canvas container - maintain aspect ratio and fill available space */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <div className="w-full h-full max-w-4xl max-h-[calc(100vh-120px)]">
            <GameCanvas
              key={key}
              level={level}
              onComplete={handleWin}
              showHint={showHint}
              hintPath={solution?.path}
              onBacktrack={handleBacktrack}
              onLoseLife={handleBacktrack}
              onWin={handleWin}
            />
          </div>
        </div>
      </main>

      <WinModal
        isOpen={hasWon}
        levelId={levelId}
        onNext={handleNext}
        onReplay={() => {
          setHasWon(false);
          handleReset();
        }}
      />
    </div>
  );
}
