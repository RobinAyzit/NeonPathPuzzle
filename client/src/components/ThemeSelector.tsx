import { useState } from 'react';
import { useTheme } from '@/hooks/use-theme';
import { themes, getTheme } from '@/lib/themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Palette, Check } from 'lucide-react';

export function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme, setTheme } = useTheme();

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Palette className="w-4 h-4" />
        <span>Theme</span>
      </Button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 z-50">
          <Card className="w-80 bg-background/95 backdrop-blur-sm border-border">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Choose Theme</h3>
              <div className="space-y-2">
                {themes.map((theme) => {
                  const isActive = currentTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => {
                        setTheme(theme.id);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        isActive
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50 hover:bg-accent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{theme.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {theme.description}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {theme.colors.neon.slice(0, 3).map((color, idx) => (
                              <div
                                key={idx}
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          {isActive && <Check className="w-4 h-4 text-primary" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
