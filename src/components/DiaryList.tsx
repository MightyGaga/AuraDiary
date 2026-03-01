import { DiaryEntry, MOODS } from '@/lib/types';
import { format } from 'date-fns';
import { Card, CardContent } from './v-ui/card';
import { motion } from 'motion/react';
import { Trash2 } from 'lucide-react';
import { Button } from './v-ui/button';

interface DiaryListProps {
  entries: DiaryEntry[];
  onDelete: (id: string) => void;
}

export function DiaryList({ entries, onDelete }: DiaryListProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No entries yet. Start your journey today.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto mt-8">
      {entries.map((entry, index) => {
        const moodData = entry.mood ? MOODS.find(m => m.value === entry.mood) : null;
        return (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-white/60 backdrop-blur-sm overflow-hidden group">
              <CardContent className="p-5 flex gap-4">
                {moodData && (
                  <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${moodData.color} bg-opacity-50`}>
                    {moodData.emoji}
                  </div>
                )}
                <div className="flex-grow space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {format(new Date(entry.timestamp), 'MMMM d, yyyy • h:mm a')}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(entry.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">
                    {entry.content}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
