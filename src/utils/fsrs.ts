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

  const todayStartMs = new Date();
  todayStartMs.setHours(0, 0, 0, 0);

  if (problem.reviewLog.length === 0) {
    // First review
    const S0 = W[confidence - 1];
    let D0 = W[4];

    if (confidence === 2) D0 += W[5];
    else if (confidence === 3) D0 += W[6];
    else if (confidence === 4) D0 += W[7];
    else D0 += W[8];

    newStability = S0;
    newDifficulty = D0;
    intervalDays = 1; // Initial interval
  } else {
    // Subsequent reviews
    const oldS = problem.stability!;
    const oldD = problem.difficulty!;

    // --- FIX IS HERE ---
    // Access the 'reviewedAt' property from the last review log entry
    const lastReviewTimestamp =
      problem.reviewLog[problem.reviewLog.length - 1].reviewedAt;

    const elapsedDays = (reviewTimestamp - lastReviewTimestamp) / MS_PER_DAY; // Use lastReviewTimestamp
    const R = Math.exp(-elapsedDays / (oldS || 1)); // Ensure oldS is not 0 for division

    if (confidence === 1) {
      // Again (lowest confidence)
      newDifficulty = oldD + W[8];
      newStability =
        oldS *
        (W[9] *
          Math.pow(newDifficulty, W[10]) *
          Math.pow(oldS, W[11]) *
          Math.exp(W[12] * (1 - R)));
    } else {
      // Hard, Good, Easy
      let dDelta = 0;
      if (confidence === 2) dDelta = W[5];
      else if (confidence === 3) dDelta = W[6];
      else if (confidence === 4) dDelta = W[7];

      newDifficulty = oldD + dDelta;
      newStability =
        oldS *
        (W[13] *
          Math.pow(newDifficulty, -W[14]) *
          Math.pow(oldS, W[15]) *
          Math.exp(W[16] * (1 - R)));
    }

    intervalDays = newStability * ((Math.pow(Rd, 1 / W[17]) - 1) / W[18]);
    intervalDays = Math.max(1, Math.round(intervalDays)); // Interval must be at least 1 day
  }

  return {
    ...problem,
    stability: newStability,
    difficulty: newDifficulty,
    reviewLog: [
      ...problem.reviewLog,
      { reviewedAt: reviewTimestamp, confidence },
    ], // Add new entry to review log
    dueAt: todayStartMs.getTime() + intervalDays * MS_PER_DAY,
  };
};
