import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RefreshCw, Play, Home } from "lucide-react";
import { Link } from "wouter";

interface WinModalProps {
  isOpen: boolean;
  levelId: number;
  onNext: () => void;
  onReplay: () => void;
}

export function WinModal({ isOpen, levelId, onNext, onReplay }: WinModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
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
              <div>
                <motion.h2 
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="text-4xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary neon-text pb-2"
                >
                  LEVEL CLEARED!
                </motion.h2>
                <p className="text-muted-foreground font-exo">Amazing puzzle solving skills.</p>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <Button 
                  size="lg" 
                  onClick={onNext}
                  className="w-full bg-primary hover:bg-primary/90 text-background font-bold h-12 text-lg shadow-[0_0_20px_rgba(0,243,255,0.4)]"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Next Level
                </Button>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={onReplay}
                    className="flex-1 border-white/10 hover:bg-white/5"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Replay
                  </Button>
                  
                  <Link href="/" className="flex-1">
                    <Button 
                      variant="outline" 
                      className="w-full border-white/10 hover:bg-white/5"
                    >
                      <Home className="w-4 h-4 mr-2" />
                      Menu
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
