import type { Problem } from "@/types/problem";

// Update todaysSet based on current problems and current time
const updateDueProblems = () => {
  chrome.storage.local.get(["problems"], (res) => {
    const now = Date.now();
    const problems: Problem[] = res.problems || [];
    const dueProblems = problems.filter((p) => p.dueAt <= now);

    chrome.storage.local.set({ dueProblems });
  });
};

// Helper: Calculate next midnight timestamp in ms
const getNextMidnightTime = () => {
  const now = new Date();
  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0,
    0,
  );
  return nextMidnight.getTime();
};

// Setup daily alarm to refresh todaysSet at midnight and then every 24 hours
chrome.alarms.create("dailyUpdate", {
  when: getNextMidnightTime(),
  periodInMinutes: 24 * 60,
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "dailyUpdate") {
    updateDueProblems();
  }
});

chrome.webNavigation.onHistoryStateUpdated.addListener(
  (details) => {
    const url = details.url;

    const shouldInject =
      url.startsWith("https://leetcode.com/problemset/") ||
      url.startsWith("https://leetcode.com/company/") ||
      url.startsWith("https://leetcode.com/problem-list/");

    if (shouldInject) {
      chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        files: ["injectButtons.js"],
      });
    }
  },
  {
    url: [
      { urlPrefix: "https://leetcode.com/problemset/" },
      { urlPrefix: "https://leetcode.com/company/" },
      { urlPrefix: "https://leetcode.com/problem-list/" },
    ],
  },
);
