export type Problem = {
  id: string;
  title: string;
  link: string;

  addedAt: number;
  dueAt: number;
  lastReview?: number;

  stability: number;
  difficulty: number;

  confidence?: number;
};
