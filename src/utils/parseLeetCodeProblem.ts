import type { Problem } from "@/types/problem";

export const parseLeetCodeProblem = (): Promise<Problem | null> => {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      if (!tabId) {
        resolve(null); // Resolve with null if no active tab
        return;
      }

      chrome.scripting.executeScript(
        {
          target: { tabId },
          func: () => {
            // This function runs in the context of the content script
            const anchor = document.querySelector(
              'a[href^="/problems/"].no-underline.truncate',
            );
            if (!anchor) return null;

            const href = (anchor.getAttribute("href") ?? "").replace(
              /\/+$/,
              "",
            );
            const fullUrl = href.startsWith("/")
              ? `https://leetcode.com${href}`
              : href;

            const text = anchor.textContent?.trim() || "";
            const match = text.match(/^(\d+)\.\s+(.*)$/);
            if (!match) return null;

            const [, id, title] = match;
            return { id, title, link: fullUrl };
          },
        },
        (injectionResults) => {
          if (chrome.runtime.lastError) {
            console.error("Script injection failed:", chrome.runtime.lastError);
            resolve(null); // Resolve with null on script injection failure
            return;
          }

          const result = injectionResults?.[0]?.result;
          if (
            result &&
            typeof result.id === "string" &&
            typeof result.title === "string" &&
            typeof result.link === "string"
          ) {
            // Ensure all Problem properties are initialized
            resolve({
              ...result,
              reviewLog: [],
              addedAt: new Date().getTime(), // Set addedAt on creation
              dueAt: undefined, // Will be set by FSRS on first review
              stability: undefined,
              difficulty: undefined,
            });
          } else {
            resolve(null); // Resolve with null if parsing failed or result is invalid
          }
        },
      );
    });
  });
};
