export const ScreenState = {
  Loading: "LOADING",
  Empty: "EMPTY",
  Review: "REVIEW",
  Complete: "COMPLETE",
} as const;

export type ScreenState = (typeof ScreenState)[keyof typeof ScreenState];
