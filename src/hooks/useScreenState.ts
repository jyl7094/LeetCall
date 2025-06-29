import { useEffect, useState } from "react";
import { ScreenState } from "@/constants/screenState";
import type { Problem } from "@/types/problem";

export const useScreenState = () => {
  const [screen, setScreen] = useState<ScreenState>(ScreenState.Loading);

  useEffect(() => {
    chrome.storage.local.get(["problems"], (result) => {
      if (chrome.runtime.lastError) {
        setScreen(ScreenState.Instructions);
        return;
      }

      const problems = result.problems || [];

      if (problems.length === 0) {
        setScreen(ScreenState.Instructions);
        return;
      }

      const now = Date.now();
      const anyDue = problems.some(
        (p: Problem) => p.dueAt && typeof p.dueAt === "number" && p.dueAt <= now
      );

      setScreen(anyDue ? ScreenState.Review : ScreenState.Complete);
    });
  }, []);

  return [screen, setScreen] as const;
};
