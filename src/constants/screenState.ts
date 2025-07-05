export const ScreenState = {
  Loading: "LOADING",
  Instructions: "INSTRUCTIONS",
  Overview: "OVERVIEW",
} as const;

export type ScreenState = (typeof ScreenState)[keyof typeof ScreenState];
