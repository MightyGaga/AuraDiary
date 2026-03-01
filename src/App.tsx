import { DiaryEntryForm } from '@/components/DiaryEntryForm';
import { DiaryList } from '@/components/DiaryList';
import { CalendarView } from '@/components/CalendarView';
import { ExportDialog } from '@/components/ExportDialog';
import { ImportDialog } from '@/components/ImportDialog';
import { ThemeSelector, Theme } from '@/components/ThemeSelector';
import { useDiary } from '@/hooks/useDiary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/v-ui/v-tabs.tsx';
import { motion } from 'motion/react';
import { CalendarDays, List } from 'lucide-react';
import { useState, useEffect } from 'react';

function App() {
  const { entries, addEntry, deleteEntry, importEntries } = useDiary();
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('aura_diary_theme') as Theme) || 'sage';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    // Remove all theme classes
    root.classList.remove('theme-sage', 'theme-lavender', 'theme-rose', 'theme-sky', 'theme-slate');
    
    // Add current theme class (if not default 'sage', though we can add it explicitly too)
    if (theme !== 'sage') {
      root.classList.add(`theme-${theme}`);
    }
    
    localStorage.setItem('aura_diary_theme', theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 font-sans text-foreground selection:bg-primary/20 transition-colors duration-500 cursor-default">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
          <div className="text-center md:text-left">
             <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
                <h1 className="text-3xl font-light tracking-tight text-foreground">
                  AuraDiary
                </h1>
             </div>
            <p className="text-muted-foreground text-sm pl-1">
              Your minimalist space for mindfulness and reflection.
            </p>
          </div>
          <div className="flex gap-2">
            <ImportDialog onImport={importEntries} />
            <ExportDialog entries={entries} />
          </div>
        </header>

        <main className="space-y-8">
          <section>
            <DiaryEntryForm onAddEntry={addEntry} />
          </section>

          <section>
            <Tabs defaultValue="list" className="w-full">
              <div className="flex justify-center mb-6">
                <TabsList className="grid w-full max-w-[400px] grid-cols-2 bg-muted/50 p-1 rounded-full">
                  <TabsTrigger value="list" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
                    <List className="w-4 h-4 mr-2" /> Recent Entries
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
                    <CalendarDays className="w-4 h-4 mr-2" /> Calendar View
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="list" className="mt-0 focus-visible:outline-none">
                <DiaryList entries={entries} onDelete={deleteEntry} />
              </TabsContent>
              
              <TabsContent value="calendar" className="mt-0 focus-visible:outline-none">
                <CalendarView entries={entries} />
              </TabsContent>
            </Tabs>
          </section>
        </main>
      </motion.div>
    </div>
  );
}

export default App;
