import { useEffect, useState } from "react";
import { ScreenState } from "@/constants/screenState";

export function useScreenState() {
  const [screen, setScreen] = useState<ScreenState>(ScreenState.Loading);

  useEffect(() => {
    chrome.storage.local.get(["problems"], (result) => {
      if (chrome.runtime.lastError) {
        setScreen(ScreenState.Empty);
        return;
      }

      const problems = result.problems || [];

      if (problems.length === 0) {
        setScreen(ScreenState.Empty);
        return;
      }

      const now = Date.now();
      const anyDue = problems.some(
        (p: any) => p.dueAt && typeof p.dueAt === "number" && p.dueAt <= now
      );

      setScreen(anyDue ? ScreenState.Review : ScreenState.Complete);
    });
  }, []);

  return [screen, setScreen] as const;
}
