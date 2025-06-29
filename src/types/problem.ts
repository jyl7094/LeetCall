export type Problem = {
  id: string; // Unique problem ID
  title: string; // Problem title
  link: string; // URL to the problem

  addedAt: number; // Timestamp (ms since epoch) when problem was added
  dueAt: number; // Timestamp for next review (ms since epoch)

  interval: number; // Interval length in days (can be fractional)
  easeFactor: number; // Ease factor (starts ~2.5, minimum 1.3)
  repetitions: number; // Number of successful reviews in a row

  confidence?: number; // Optional: last user confidence rating (0-5 scale)
};
