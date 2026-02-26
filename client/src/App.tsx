import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "./hooks/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Game from "@/pages/Game";
import { initAudio } from "@/lib/sounds";
import { useEffect } from "react";

function AppRouter() {
  return (
    <Router hook={useHashLocation}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/play/:id" component={Game} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

function App() {
  useEffect(() => {
    const handleClick = () => {
      initAudio();
      window.removeEventListener("click", handleClick);
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <AppRouter />
        </TooltipProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
