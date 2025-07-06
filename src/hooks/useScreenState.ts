import { ScreenState } from "@/constants/screenState";
import { useEffect, useState } from "react";

export const useScreenState = () => {
  const [screen, setScreen] = useState<ScreenState>(ScreenState.Loading);

  useEffect(() => {
    const loadingScreenState = async () => {
      try {
        const result = await chrome.storage.local.get(["problems"]);
        const problems = result.problems || [];
        if (problems.length === 0) {
          setScreen(ScreenState.Instructions);
        } else {
          setScreen(ScreenState.Overview);
        }
      } catch {
        setScreen(ScreenState.Instructions);
      }
    };
    loadingScreenState();
  }, []);

  return [screen, setScreen] as const;
};
