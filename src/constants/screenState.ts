export const ScreenState = {
  Loading: "LOADING",
  Instructions: "INSTRUCTIONS",
  Review: "REVIEW",
  Problem: "PROBLEM",
  Complete: "COMPLETE",
} as const;

export type ScreenState = (typeof ScreenState)[keyof typeof ScreenState];
