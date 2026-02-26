import { useState, useEffect } from "react";
import { useLevels, useUserId } from "@/hooks/use-game";
import { LevelCard } from "@/components/LevelCard";
import { StartMenu } from "@/components/StartMenu";
import { AchievementsPanel } from "@/components/AchievementsPanel";
import { ThemeSelector } from "@/components/ThemeSelector";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Trophy } from "lucide-react";

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const [activeTab, setActiveTab] = useState("levels");
  const userId = useUserId();
  const { data: levels, isLoading, error, refetch } = useLevels(userId);

  // Refetch levels when returning to home
  useEffect(() => {
    refetch();
  }, [gameStarted, refetch]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !levels) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-destructive gap-4">
        <h2 className="text-2xl font-bold">System Error</h2>
        <p>Failed to load level matrix.</p>
      </div>
    );
  }

  if (!gameStarted) {
    return <StartMenu onStart={() => setGameStarted(true)} />;
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-center space-y-4 flex-1">
            <h1 className="text-5xl md:text-7xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary via-white to-secondary neon-text tracking-tighter">
              NEON PATH
            </h1>
            <p className="text-muted-foreground font-exo text-lg max-w-lg mx-auto">
              Connect the nodes. One continuous line. <br />
              <span className="text-primary">200 Levels</span> of cyber-logic puzzles.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSelector />
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="levels" className="flex items-center gap-2">
              <span className="text-lg">🎮</span>
              Levels
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="levels" className="space-y-8">
            {/* Level Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-4">
              {levels.map((level, idx) => (
                <LevelCard
                  key={level.id}
                  id={level.id}
                  isLocked={level.isLocked}
                  isCompleted={level.isCompleted}
                  delay={idx % 20} // Stagger animation for visible items
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-8">
            <AchievementsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
