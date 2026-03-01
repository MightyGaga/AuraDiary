import { MOODS, Mood } from '@/lib/types';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface MoodSelectorProps {
  value: Mood | null;
  onChange: (mood: Mood) => void;
}

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="flex justify-start gap-2">
      {MOODS.map((mood) => (
        <motion.button
          key={mood.value}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(mood.value)}
          className={cn(
            "flex flex-col items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 border",
            value === mood.value
              ? `border-primary ${mood.color} shadow-sm`
              : "border-transparent hover:bg-muted bg-muted/30 opacity-70 hover:opacity-100"
          )}
          title={mood.label}
        >
          <span className="text-sm" role="img" aria-label={mood.label}>
            {mood.emoji}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
