export type Problem = {
  id: string;
  title: string;
  addedAt: number;
  dueAt: number;
  interval: number;
  easeFactor: number;
  repetitions: number;
  confidence?: number;
};
