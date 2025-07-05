import type { Problem } from "@/types/problem";

const parseLeetCodeProblem = (callback: (p: Problem | null) => void) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0]?.id;
    if (!tabId) return;

    chrome.scripting.executeScript(
      {
        target: { tabId },
        func: () => {
          const anchor = document.querySelector(
            'a[href^="/problems/"].no-underline.truncate',
          );
          if (!anchor) return null;

          const href = (anchor.getAttribute("href") ?? "").replace(/\/+$/, "");
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
          callback(null);
          return;
        }

        const result = injectionResults?.[0]?.result;
        if (
          result &&
          typeof result.id === "string" &&
          typeof result.title === "string" &&
          typeof result.link === "string"
        ) {
          callback({
            ...result,
            reviewLog: [],
            addedAt: undefined,
            dueAt: undefined,
            stability: undefined,
            difficulty: undefined,
          });
        } else {
          callback(null);
        }
      },
    );
  });
};

export default parseLeetCodeProblem;
