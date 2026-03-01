import { useState } from 'react';
import { DiaryEntry, MOODS } from '@/lib/types';
import { Calendar } from '@/components/elements/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/elements/card';
import { format, isSameDay } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

interface CalendarViewProps {
  entries: DiaryEntry[];
}

export function CalendarView({ entries }: CalendarViewProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const selectedEntries = entries.filter((entry) =>
    date ? isSameDay(new Date(entry.timestamp), date) : false
  );

  // Create a map of dates with entries to highlight them
  const modifiers = {
    hasEntry: (date: Date) => entries.some((entry) => isSameDay(new Date(entry.timestamp), date)),
  };

  const modifiersClassNames = {
    hasEntry: 'bg-primary/20 font-bold text-primary hover:bg-primary/30 rounded-md',
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto mt-8 items-start">
      <Card className="border-none shadow-sm bg-white/60 backdrop-blur-sm h-fit w-full md:w-auto mx-auto md:mx-0">
        <CardContent className="p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-xl border-none shadow-none bg-transparent p-4"
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
          />
        </CardContent>
      </Card>

      <div className="flex-1 space-y-4 min-w-0">
        <div className="flex items-center justify-between border-b pb-2 border-muted/50">
          <h3 className="text-2xl font-light text-foreground tracking-tight">
            {date ? format(date, 'MMMM d, yyyy') : 'Select a date'}
          </h3>
          <span className="text-xs font-medium text-muted-foreground bg-muted/30 px-2 py-1 rounded-full">
            {selectedEntries.length} {selectedEntries.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>
        
        <AnimatePresence mode="wait">
          {selectedEntries.length > 0 ? (
            <div className="space-y-4">
              {selectedEntries.map((entry, index) => {
                 const moodData = entry.mood ? MOODS.find(m => m.value === entry.mood) : null;
                 return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Card className="border-none shadow-sm bg-white/80 hover:bg-white transition-all duration-300 group hover:shadow-md">
                      <CardContent className="p-5 flex gap-4 items-start">
                        {moodData && (
                          <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl ${moodData.color} bg-opacity-30`}>
                            {moodData.emoji}
                          </div>
                        )}
                        <div className="flex-grow space-y-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              {format(new Date(entry.timestamp), 'h:mm a')}
                            </span>
                          </div>
                          <p className="text-base text-foreground/90 leading-relaxed whitespace-pre-wrap">
                            {entry.content}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-muted-foreground/50 border border-dashed border-muted rounded-2xl bg-white/30"
            >
              <div className="w-16 h-16 mb-4 rounded-full bg-muted/20 flex items-center justify-center">
                <span className="text-3xl">📅</span>
              </div>
              <p className="text-lg font-light text-foreground/70">No entries for this day</p>
              <p className="text-sm">Select another date or write something new.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
