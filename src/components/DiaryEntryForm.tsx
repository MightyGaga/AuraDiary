import { useState } from 'react';
import { MoodSelector } from './MoodSelector';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Mood } from '@/lib/types';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DiaryEntryFormProps {
  onAddEntry: (entry: { content: string; mood?: Mood }) => void;
}

export function DiaryEntryForm({ onAddEntry }: DiaryEntryFormProps) {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Mood | undefined>(undefined);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    if (!content.trim()) return;

    onAddEntry({
      content,
      mood,
    });

    setContent('');
    setMood(undefined);
    setIsFocused(false);
  };

  const handleMoodChange = (selectedMood: Mood) => {
    setMood(prev => prev === selectedMood ? undefined : selectedMood);
  };

  const isActive = isFocused || content.length > 0;

  return (
    <Card className="w-full max-w-4xl mx-auto border-none shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden transition-all duration-300 cursor-default">
      <CardContent className="px-6 py-2">
        <div className="flex items-center gap-2 mb-4 px-1 cursor-default">
          <Sparkles 
            className={cn(
              "w-4 h-4 transition-colors duration-300", 
              isActive ? "text-primary fill-primary/20" : "text-muted-foreground/50"
            )} 
          />
          <span className={cn(
            "text-sm font-normal transition-colors duration-300",
            isActive ? "text-primary/80" : "text-muted-foreground/70"
          )}>
            How are you feeling right now?
          </span>
        </div>
        
        <div className="space-y-0">
          <motion.div
            layout
            className="space-y-4"
          >
            <Textarea
              placeholder="Pour your thoughts here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="min-h-[300px] resize-none border-muted bg-muted/20 focus:bg-white transition-colors text-base rounded-xl p-4"
            />
            
            <div className="flex justify-between items-center pt-2">
              <MoodSelector value={mood || null} onChange={handleMoodChange} />
              
              <AnimatePresence>
                {(isFocused || content || mood) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Button 
                      onClick={handleSubmit} 
                      disabled={!content.trim()}
                      className="rounded-full px-6 transition-all duration-300 hover:shadow-md"
                      size="sm"
                    >
                      Save <Send className="w-3 h-3 ml-2" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
