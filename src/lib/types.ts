export type Mood = 'great' | 'good' | 'neutral' | 'bad' | 'awful';

export interface DiaryEntry {
  id: string;
  content: string;
  timestamp: string; // ISO string
  mood?: Mood;
}

export const MOODS: { value: Mood; label: string; color: string; emoji: string }[] = [
  { value: 'great', label: 'Great', color: 'bg-teal-100 border-teal-200', emoji: '😁' },
  { value: 'good', label: 'Good', color: 'bg-green-100 border-green-200', emoji: '🙂' },
  { value: 'neutral', label: 'Neutral', color: 'bg-yellow-100 border-yellow-200', emoji: '😐' },
  { value: 'bad', label: 'Bad', color: 'bg-orange-100 border-orange-200', emoji: '🙁' },
  { value: 'awful', label: 'Awful', color: 'bg-red-100 border-red-200', emoji: '😫' },
];
