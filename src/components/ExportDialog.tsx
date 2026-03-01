import { useState } from 'react';
import { DiaryEntry } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog-ui';
import { Button } from '@/components/ui/button-ui';
import { Calendar } from '@/components/ui/calendar-ui';
import { Download, FileText } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

interface ExportDialogProps {
  entries: DiaryEntry[];
}

export function ExportDialog({ entries }: ExportDialogProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = (formatType: 'markdown' | 'json') => {
    if (!dateRange?.from || !dateRange?.to) return;

    const filteredEntries = entries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return isWithinInterval(entryDate, {
        start: startOfDay(dateRange.from!),
        end: endOfDay(dateRange.to!)
      });
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    let content = '';
    let mimeType = '';
    let extension = '';

    if (formatType === 'markdown') {
      content = `# AuraDiary Export\n\n`;
      content += `Range: ${format(dateRange.from, 'MMMM d, yyyy')} - ${format(dateRange.to, 'MMMM d, yyyy')}\n\n`;
      
      filteredEntries.forEach(entry => {
        content += `## ${format(new Date(entry.timestamp), 'MMMM d, yyyy h:mm a')}\n`;
        if (entry.mood) {
          content += `**Mood:** ${entry.mood}\n\n`;
        }
        content += `${entry.content}\n\n`;
        content += `---\n\n`;
      });
      mimeType = 'text/markdown';
      extension = 'md';
    } else {
      content = JSON.stringify(filteredEntries, null, 2);
      mimeType = 'application/json';
      extension = 'json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aura-diary-export-${format(new Date(), 'yyyy-MM-dd')}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Entries</DialogTitle>
          <DialogDescription>
            Select a date range to export your journal entries.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            className="rounded-md border shadow-sm"
          />
          <div className="flex gap-2 w-full justify-center">
            <Button 
              onClick={() => handleExport('markdown')} 
              disabled={!dateRange?.from || !dateRange?.to}
              className="w-full"
            >
              <FileText className="w-4 h-4 mr-2" /> Export Markdown
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
