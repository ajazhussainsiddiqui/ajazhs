'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeProvider';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="w-9 h-9 rounded-full"
        disabled
      >
        <div className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="w-9 h-9 rounded-full transition-all duration-300 hover:bg-accent"
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? (
        <Moon className="h-[1.2rem] w-[1.2rem] text-foreground transition-all" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] text-foreground transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
