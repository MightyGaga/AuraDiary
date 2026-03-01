import { useState, useEffect } from 'react';
import { DiaryEntry } from '@/lib/types';

const STORAGE_KEY = 'aura_diary_entries';

export function useDiary() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse diary entries', e);
      }
    }
  }, []);

  const addEntry = (entry: Omit<DiaryEntry, 'id' | 'timestamp'>) => {
    const newEntry: DiaryEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    
    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
  };

  const importEntries = (newEntries: DiaryEntry[]) => {
    // Filter out potential duplicates if IDs match (though unlikely with random UUIDs from other instances)
    // and sort by date descending
    const combined = [...newEntries, ...entries]
      .filter((entry, index, self) => 
        index === self.findIndex((t) => t.id === entry.id)
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
    setEntries(combined);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(combined));
  };

  const deleteEntry = (id: string) => {
    const updatedEntries = entries.filter(e => e.id !== id);
    setEntries(updatedEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
  };

  return { entries, addEntry, deleteEntry, importEntries };
}
