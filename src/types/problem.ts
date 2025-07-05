export type Problem = {
  id: string;
  title: string;
  link: string;

  addedAt?: number;
  dueAt?: number;
  reviewLog: ReviewLogEntry[];

  stability?: number;
  difficulty?: number;
};

type ReviewLogEntry = {
  reviewedAt: number;
  confidence: number;
};
