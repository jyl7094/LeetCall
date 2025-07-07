// src/utils/sm2Algorithm.ts
import type { Problem } from "@/types/problem";

const FSRS_PARAMS = [
  0.212, 1.2931, 2.3065, 8.2956, 6.4133, 0.8334, 3.0194, 0.001, 1.8722, 0.1666,
  0.796, 1.4835, 0.0614, 0.2629, 1.6483, 0.6014, 1.8729, 0.5425, 0.0912,
];
const Rd = 0.9;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Calculates updated FSRS algorithm parameters for a problem.
 * @param problem The problem object before review.
 * @param confidence The user's confidence rating (1-4).
 * @param reviewTimestamp The timestamp of the current review.
 * @returns A new Problem object with updated FSRS parameters and review log.
 */
export const calculateFsrsParams = (
  problem: Problem,
  confidence: number,
  reviewTimestamp: number,
): Problem => {
  const W = FSRS_PARAMS;

  let newStability: number;
  let newDifficulty: number;
  let intervalDays: number;

  if (problem.reviewLog.length === 0) {
    // First review
    const S0 = W[confidence - 1]; // initial stability
    let D0 = W[4]; // base difficulty

    D0 += W[5] * (confidence - 3); // difficulty adjustment based on confidence

    newStability = S0;
    newDifficulty = D0;
    intervalDays = 1; // first interval
  } else {
    // Subsequent review
    const oldS = problem.stability!;
    const oldD = problem.difficulty!;
    const lastReviewTimestamp =
      problem.reviewLog[problem.reviewLog.length - 1].reviewedAt;

    const elapsedDays = (reviewTimestamp - lastReviewTimestamp) / MS_PER_DAY;
    const R = Math.exp(-elapsedDays / oldS);

    if (confidence === 1) {
      // Again (failure)
      newDifficulty = oldD + W[8]; // usually a penalty
      newStability =
        oldS *
        (W[9] *
          Math.pow(newDifficulty, W[10]) *
          Math.pow(oldS, W[11]) *
          Math.exp(W[12] * (1 - R)));
    } else {
      // Hard / Good / Easy
      newDifficulty = oldD + W[5] * (confidence - 3);
      newDifficulty = Math.max(1.0, Math.min(10.0, newDifficulty)); // clamp difficulty

      newStability =
        oldS *
        (W[13] *
          Math.pow(newDifficulty, -W[14]) *
          Math.pow(oldS, W[15]) *
          Math.exp(W[16] * (1 - R)));
    }

    intervalDays = newStability * ((Math.pow(Rd, 1 / W[17]) - 1) / W[18]);
    intervalDays = Math.max(1, Math.round(intervalDays));
  }

  return {
    ...problem,
    stability: newStability,
    difficulty: newDifficulty,
    reviewLog: [
      ...problem.reviewLog,
      { reviewedAt: reviewTimestamp, confidence },
    ],
    dueAt: reviewTimestamp + intervalDays * MS_PER_DAY,
  };
};
