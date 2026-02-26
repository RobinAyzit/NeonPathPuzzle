import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Lock, CheckCircle, Heart } from "lucide-react";
import { generateLevelCode, getLevelFromCode } from "@/lib/levelCodes";
import { getLevelMessage } from "@/lib/levelMessages";
import { useLevels, useUserId } from "@/hooks/use-game";

interface StartMenuProps {
  onStart: () => void;
}

type MenuScreen = "main" | "info" | "completed";

export function StartMenu({ onStart }: StartMenuProps) {
  const [screen, setScreen] = useState<MenuScreen>("main");
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");
  const [selectedLevelMessage, setSelectedLevelMessage] = useState<{ id: number; message: string } | null>(null);
  const [, setLocation] = useLocation();
  const userId = useUserId();
  const { data: levels, refetch } = useLevels(userId);

  // Refetch when returning to completed screen
  const handleShowCompleted = () => {
    refetch();
    setScreen("completed");
  };

  const completedLevels = levels?.filter(l => l.isCompleted) || [];

  const handleLevelClick = (levelId: number) => {
    const message = getLevelMessage(levelId);
    setSelectedLevelMessage({ id: levelId, message });
  };

  const handleCodeSubmit = () => {
    setCodeError("");
    const levelId = getLevelFromCode(codeInput);
    
    if (!levelId) {
      setCodeError("Invalid code. Please check and try again.");
      return;
    }

    // Check if level is actually completed (code is only valid for completed levels)
    const isLevelCompleted = completedLevels.some(l => l.id === levelId);
    if (!isLevelCompleted && levelId < 10) {
      setCodeError("This level hasn't been unlocked yet.");
      return;
    }

    // Navigate to level
    setLocation(`/play/${levelId}`);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        {screen === "main" ? (
          // Main Menu
          <div className="text-center space-y-12">
            <div className="space-y-6">
              <h1 className="text-6xl md:text-8xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary via-white to-secondary neon-text tracking-tighter">
                NEON PATH
              </h1>
              <p className="text-muted-foreground font-exo text-lg">
                Connect the nodes. One continuous line.
              </p>
            </div>

            {/* Code Input Section */}
            <div className="space-y-4 bg-muted/20 border border-primary/20 rounded-lg p-6">
              <h3 className="text-lg font-orbitron font-bold text-primary">ENTER LEVEL CODE</h3>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  maxLength={4}
                  placeholder="0000"
                  value={codeInput}
                  onChange={(e) => {
                    setCodeInput(e.target.value.replace(/\D/g, ""));
                    setCodeError("");
                  }}
                  className="w-full px-4 py-2 text-center text-2xl font-mono font-bold bg-background/50 border border-primary/30 rounded text-primary placeholder-muted-foreground focus:outline-none focus:border-primary"
                />
                {codeError && (
                  <p className="text-destructive text-sm font-exo">{codeError}</p>
                )}
                <Button
                  onClick={handleCodeSubmit}
                  disabled={codeInput.length !== 4}
                  className="w-full bg-secondary hover:bg-secondary/90 text-background font-exo disabled:opacity-50"
                >
                  Jump to Level
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:justify-center">
              <Button
                onClick={onStart}
                className="px-8 py-6 text-lg font-exo font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
              >
                START GAME
              </Button>
              <Button
                onClick={() => setScreen("info")}
                variant="outline"
                className="px-8 py-6 text-lg font-exo font-semibold border-primary text-primary hover:bg-primary/10"
              >
                HOW TO PLAY
              </Button>
              <Button
                onClick={handleShowCompleted}
                variant="outline"
                className="px-8 py-6 text-lg font-exo font-semibold border-secondary text-secondary hover:bg-secondary/10"
              >
                COMPLETED ({completedLevels.length})
              </Button>
            </div>
          </div>
        ) : screen === "info" ? (
          // Info Screen
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-orbitron font-bold text-primary neon-text">
                HOW TO PLAY
              </h2>
              <button
                onClick={() => setScreen("main")}
                className="p-2 text-primary hover:text-secondary transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 bg-muted/20 border border-primary/20 rounded-lg p-6 font-exo">
              <div>
                <h3 className="text-lg font-bold text-primary mb-2">📍 OBJECTIVE</h3>
                <p className="text-muted-foreground">
                  Connect all nodes with a single continuous line. Each node must be visited exactly once, and your path cannot cross itself.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-secondary mb-2">🎮 CONTROLS</h3>
                <ul className="text-muted-foreground space-y-1">
                  <li>• <span className="text-primary">Click</span> to place your path</li>
                  <li>• <span className="text-primary">Click & Drag</span> to draw your solution</li>
                  <li>• <span className="text-primary">Clear</span> button to reset and try again</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-primary mb-2">❤️ LIVES & BACKTRACKING</h3>
                <ul className="text-muted-foreground space-y-1">
                  <li>• You start each level with <span className="text-destructive">3 lives</span></li>
                  <li>• Each backtrack costs <span className="text-destructive">1 life</span></li>
                  <li>• Lose all lives = Game Over (restart from Level 1)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-secondary mb-2">💡 HINTS & LEVEL CODES</h3>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Use hint to see the solution (visible for 3 seconds)</li>
                  <li>• Only 1 hint per level</li>
                  <li>• After completing <span className="text-secondary">Level 10</span>, you'll unlock unique codes</li>
                  <li>• Each level has a unique 4-digit code to jump directly to it</li>
                  <li>• Enter the code in the menu to skip to that level</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-primary mb-2">� MOTIVATIONAL MESSAGES</h3>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Each level you complete comes with a <span className="text-secondary">unique positive message</span></li>
                  <li>• Go to <span className="text-secondary">COMPLETED</span> to see all your finished levels</li>
                  <li>• <span className="text-primary">Click any completed level</span> to read its special message</li>
                  <li>• Every new level you unlock has a fresh message waiting for you</li>
                  <li>• 100 unique messages for 100 levels of encouragement and support</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-primary mb-2">�🔒 PROGRESSION</h3>
                <p className="text-muted-foreground mb-2">
                  Complete levels sequentially to unlock the next challenges. 100 levels of increasing difficulty await you in the cyber-logic puzzle matrix. Codes are only valid for completed levels.
                </p>
                <p className="text-muted-foreground">
                  <span className="text-secondary font-bold">ELITE CHALLENGE (Levels 101-200):</span> Complete all 100 main levels to unlock the ultimate difficulty tier. These 100 additional levels feature extreme puzzles for champions. Both tiers combined = 200 total levels of relentless progression.
                </p>
              </div>
            </div>

            <Button
              onClick={() => setScreen("main")}
              className="w-full px-8 py-6 text-lg font-exo font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
            >
              BACK TO MENU
            </Button>
          </div>
        ) : (
          // Completed Levels Screen
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-orbitron font-bold text-secondary neon-text">
                COMPLETED LEVELS
              </h2>
              <button
                onClick={() => setScreen("main")}
                className="p-2 text-secondary hover:text-primary transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="bg-muted/20 border border-secondary/20 rounded-lg p-6">
              {/* Levels 1-100 */}
              <div className="mb-8">
                <h3 className="text-lg font-orbitron font-bold text-primary mb-3">LEVELS 1-100</h3>
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
                  {Array.from({ length: 100 }).map((_, idx) => {
                    const levelId = idx + 1;
                    const isCompleted = completedLevels.some(l => l.id === levelId);
                    const levelCode = generateLevelCode(levelId);
                    const showCode = levelId >= 10 && isCompleted;

                    return (
                      <motion.button
                        key={levelId}
                        onClick={() => isCompleted && handleLevelClick(levelId)}
                        disabled={!isCompleted}
                        whileHover={isCompleted ? { scale: 1.1 } : {}}
                        whileTap={isCompleted ? { scale: 0.95 } : {}}
                        className={`
                          relative aspect-square flex items-center justify-center rounded-lg font-orbitron font-bold text-sm
                          transition-all duration-200 disabled:cursor-not-allowed
                          ${isCompleted
                            ? "bg-gradient-to-br from-primary to-secondary neon-border shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.5)]"
                            : "bg-muted/40 border border-muted/20 text-muted-foreground"
                          }
                        `}
                        title={showCode ? `Code: ${levelCode}\nClick for message!` : ""}
                      >
                        {isCompleted ? (
                          <div className="flex flex-col items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-xs">{levelId}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">{levelId}</span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Levels 101-200 - Locked until all 100 completed */}
              <div>
                <h3 className="text-lg font-orbitron font-bold text-secondary mb-3 flex items-center gap-2">
                  LEVELS 101-200
                  {completedLevels.length < 100 && (
                    <Lock className="w-4 h-4 text-destructive" />
                  )}
                </h3>
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
                  {Array.from({ length: 100 }).map((_, idx) => {
                    const levelId = idx + 101;
                    const isCompleted = completedLevels.some(l => l.id === levelId);
                    const allFirstHundredCompleted = completedLevels.length === 100;
                    const isUnlocked = allFirstHundredCompleted;
                    const levelCode = generateLevelCode(levelId);
                    const showCode = levelId >= 110 && isCompleted;

                    return (
                      <motion.button
                        key={levelId}
                        onClick={() => isCompleted && handleLevelClick(levelId)}
                        disabled={!isCompleted || !isUnlocked}
                        whileHover={isCompleted && isUnlocked ? { scale: 1.1 } : {}}
                        whileTap={isCompleted && isUnlocked ? { scale: 0.95 } : {}}
                        className={`
                          relative aspect-square flex items-center justify-center rounded-lg font-orbitron font-bold text-sm
                          transition-all duration-200 disabled:cursor-not-allowed
                          ${!isUnlocked
                            ? "bg-muted/30 border border-muted/10 text-muted-foreground opacity-50"
                            : isCompleted
                            ? "bg-gradient-to-br from-secondary to-primary neon-border shadow-[0_0_20px_rgba(138,43,226,0.3)] hover:shadow-[0_0_30px_rgba(138,43,226,0.5)]"
                            : "bg-muted/40 border border-muted/20 text-muted-foreground"
                          }
                        `}
                        title={
                          !isUnlocked 
                            ? "Unlock by completing all levels 1-100"
                            : showCode 
                            ? `Code: ${levelCode}\nClick for message!`
                            : ""
                        }
                      >
                        {!isUnlocked ? (
                          <Lock className="w-5 h-5 text-muted-foreground/50" />
                        ) : isCompleted ? (
                          <div className="flex flex-col items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-xs">{levelId}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">{levelId}</span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <p className="mt-6 text-center text-muted-foreground font-exo text-sm">
                Progress: <span className="text-primary">{completedLevels.length}</span> / 200 levels completed
                {completedLevels.length < 100 && (
                  <br className="block mt-2" />
                )}
                {completedLevels.length < 100 && (
                  <span className="text-secondary text-xs">
                    Complete all 100 levels to unlock the elite challenge (101-200)
                  </span>
                )}
              </p>
            </div>

            <Button
              onClick={() => setScreen("main")}
              className="w-full px-8 py-6 text-lg font-exo font-semibold bg-gradient-to-r from-secondary to-primary hover:opacity-90 transition-opacity"
            >
              BACK TO MENU
            </Button>
          </div>
        )}

        {/* Message Modal */}
        <AnimatePresence>
          {selectedLevelMessage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="w-full max-w-md bg-card/90 border border-primary/30 p-8 rounded-2xl shadow-[0_0_50px_rgba(0,243,255,0.15)] relative overflow-hidden"
              >
                {/* Background Glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 blur-[60px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/20 blur-[60px] rounded-full pointer-events-none" />

                <div className="text-center space-y-6 relative z-10">
                  <div className="flex justify-center">
                    <motion.div
                      animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Heart className="w-12 h-12 text-primary fill-primary" />
                    </motion.div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-orbitron font-bold text-secondary mb-2">
                      LEVEL {selectedLevelMessage.id} COMPLETED!
                    </h3>
                    <p className="text-lg font-exo text-primary neon-text">
                      {selectedLevelMessage.message}
                    </p>
                  </div>

                  <Button
                    onClick={() => setSelectedLevelMessage(null)}
                    className="w-full bg-primary hover:bg-primary/90 text-background font-bold shadow-[0_0_20px_rgba(0,243,255,0.4)]"
                  >
                    CLOSE
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
