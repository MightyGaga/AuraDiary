import { useState, useRef, ChangeEvent } from 'react';
import { DiaryEntry, Mood } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { parse } from 'date-fns';

interface ImportDialogProps {
  onImport: (entries: DiaryEntry[]) => void;
}

export function ImportDialog({ onImport }: ImportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    const text = await file.text();
    
    try {
      const entries = parseMarkdown(text);
      if (entries.length === 0) {
        setError('No valid entries found in the file.');
        return;
      }
      onImport(entries);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      setError('Failed to parse the file. Please ensure it is a valid AuraDiary export.');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const parseMarkdown = (text: string): DiaryEntry[] => {
    const entries: DiaryEntry[] = [];
    // Split by "## " which denotes a new entry date header
    // The first part is the file header, so we skip it
    const parts = text.split('\n## ');
    
    // Skip the first part (header)
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      const lines = part.split('\n');
      
      // First line is the date
      const dateString = lines[0].trim();
      let timestamp = new Date().toISOString();
      
      try {
        // Format: MMMM d, yyyy h:mm a
        // Example: March 1, 2026 2:30 PM
        const parsedDate = parse(dateString, 'MMMM d, yyyy h:mm a', new Date());
        if (!isNaN(parsedDate.getTime())) {
          timestamp = parsedDate.toISOString();
        }
      } catch (e) {
        console.warn('Failed to parse date:', dateString);
        continue; // Skip invalid dates
      }

      let mood: Mood | undefined = undefined;
      let contentStartIndex = 1;

      // Check for mood
      // Format: **Mood:** [Mood]
      if (lines.length > 1 && lines[1].startsWith('**Mood:** ')) {
        const moodStr = lines[1].replace('**Mood:** ', '').trim().toLowerCase();
        if (['great', 'good', 'neutral', 'bad', 'awful'].includes(moodStr)) {
          mood = moodStr as Mood;
        }
        contentStartIndex = 2;
      }

      // Extract content
      // Remove the "---" separator at the end if it exists
      let content = lines.slice(contentStartIndex).join('\n').trim();
      if (content.endsWith('---')) {
        content = content.substring(0, content.length - 3).trim();
      }

      if (content) {
        entries.push({
          id: crypto.randomUUID(),
          timestamp,
          content,
          mood,
        });
      }
    }

    return entries;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="w-4 h-4" /> Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Entries</DialogTitle>
          <DialogDescription>
            Upload a previously exported AuraDiary Markdown file.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 py-4">
          <div 
            className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 w-full flex flex-col items-center justify-center cursor-pointer hover:bg-muted/10 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <FileText className="w-10 h-10 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground font-medium">
              Click to select a .md file
            </p>
            <input 
              type="file" 
              accept=".md" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md w-full">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
