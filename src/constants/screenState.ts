export const ScreenState = {
  Loading: "LOADING",
  Instructions: "INSTRUCTIONS",
  Review: "REVIEW",
  Complete: "COMPLETE",
} as const;

export type ScreenState = (typeof ScreenState)[keyof typeof ScreenState];
