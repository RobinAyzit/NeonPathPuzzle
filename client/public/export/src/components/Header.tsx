import { Link } from "wouter";
import { ArrowLeft, RefreshCw, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  levelId: number;
  onReset: () => void;
  onHint: () => void;
  hintsUsed: boolean;
  isHintLoading: boolean;
}

export function Header({ levelId, onReset, onHint, hintsUsed, isHintLoading }: HeaderProps) {
  return (
    <header className="w-full h-20 px-6 flex items-center justify-between border-b border-white/10 bg-background/80 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h2 className="text-xl font-orbitron font-bold text-foreground">
            LEVEL <span className="text-primary neon-text">{levelId}</span>
          </h2>
          <div className="text-xs text-muted-foreground font-exo">
            ONE LINE MASTER
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={onReset}
          className="border-white/10 hover:border-primary/50 hover:bg-primary/10 text-primary-foreground/80 hover:text-primary"
        >
          <RefreshCw className="w-5 h-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onHint}
          disabled={hintsUsed || isHintLoading}
          className={`
            border-white/10 transition-all duration-300
            ${hintsUsed 
              ? 'opacity-50 cursor-not-allowed text-muted-foreground' 
              : 'hover:border-secondary/50 hover:bg-secondary/10 text-secondary hover:text-secondary-foreground hover:shadow-[0_0_15px_rgba(138,43,226,0.3)]'
            }
          `}
        >
          <Lightbulb className={`w-5 h-5 ${isHintLoading ? 'animate-pulse' : ''}`} />
        </Button>
      </div>
    </header>
  );
}
