import { ScreenState } from "@/constants/screenState";
import { useEffect, useState } from "react";
import { useUrlChange } from "./useUrlChange";

export const useScreenState = () => {
  const [screen, setScreen] = useState<ScreenState>(ScreenState.Loading);
  const url = useUrlChange();

  useEffect(() => {
    const loadingScreenState = async () => {
      try {
        const result = await chrome.storage.local.get(["problems"]);
        const problems = result.problems || [];
        if (url.startsWith("https://leetcode.com/problems/")) {
          setScreen(ScreenState.Overview);
        } else {
          setScreen(
            problems.length === 0
              ? ScreenState.Instructions
              : ScreenState.Overview,
          );
        }
      } catch {
        setScreen(ScreenState.Instructions);
      }
    };
    loadingScreenState();
  }, [url]);

  return [screen, setScreen] as const;
};
