import { ScreenState } from "@/constants/screenState";
import type { Problem } from "@/types/problem";
import { useEffect, useState } from "react";

export const useScreenState = () => {
  const [screen, setScreen] = useState<ScreenState>(ScreenState.Loading);

  useEffect(() => {
    // First: check current tab URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      const url = activeTab?.url || "";

      // If URL matches LeetCode problem list page, show a different screen
      if (url.startsWith("https://leetcode.com/problems/")) {
        setScreen(ScreenState.Problem);
        return;
      }

      // Otherwise, fall back to stored problems check
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
          (p: Problem) =>
            p.dueAt && typeof p.dueAt === "number" && p.dueAt <= now,
        );

        setScreen(anyDue ? ScreenState.Review : ScreenState.Complete);
      });
    });
  }, []);

  return [screen, setScreen] as const;
};
