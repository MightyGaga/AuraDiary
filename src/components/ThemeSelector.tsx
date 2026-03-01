import { Button } from "@/ui/button.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/ui/popover.tsx";
import { BookHeart, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type Theme = 'sage' | 'lavender' | 'rose' | 'sky' | 'slate';

interface ThemeSelectorProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const THEMES: { value: Theme; label: string; color: string }[] = [
  { value: 'sage', label: 'Sage', color: 'bg-[oklch(0.65_0.12_150)]' },
  { value: 'lavender', label: 'Lavender', color: 'bg-[oklch(0.7_0.12_290)]' },
  { value: 'rose', label: 'Rose', color: 'bg-[oklch(0.7_0.14_15)]' },
  { value: 'sky', label: 'Sky', color: 'bg-[oklch(0.65_0.12_240)]' },
  { value: 'slate', label: 'Slate', color: 'bg-[oklch(0.5_0_0)]' },
];

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors w-12 h-12"
        >
          <BookHeart className="w-6 h-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-40 p-1">
        <div className="flex flex-col gap-1">
          {THEMES.map((theme) => (
            <Button
              key={theme.value}
              variant="ghost"
              onClick={() => onThemeChange(theme.value)}
              className={cn(
                "justify-start gap-2 w-full font-normal h-9 px-2",
                currentTheme === theme.value && "bg-accent text-accent-foreground"
              )}
            >
              <div className={cn("w-3 h-3 rounded-full shrink-0", theme.color)} />
              <span className="flex-1 text-left">{theme.label}</span>
              {currentTheme === theme.value && (
                <Check className="w-4 h-4 text-primary shrink-0" />
              )}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
