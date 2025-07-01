import { ScreenState } from "@/constants/screenState";
import { useEffect, useState } from "react";

export const useScreenState = () => {
  const [screen, setScreen] = useState<ScreenState>(ScreenState.Loading);

  useEffect(() => {
    chrome.storage.local.get(["problems"], (result) => {
      if (chrome.runtime.lastError) {
        return;
      }

      const problems = result.problems || [];

      if (problems.length === 0) {
        setScreen(ScreenState.Instructions);
        return;
      }

      setScreen(ScreenState.Overview);
    });
  }, []);

  return [screen, setScreen] as const;
};
