import type { Problem } from "@/types/problem";
import { getNextMidnightTime } from "@/utils/time";

// Update todaysSet based on current problems and current time
const updateDueProblems = () => {
  chrome.storage.local.get(["problems"], (res) => {
    const now = Date.now();
    const problems: Problem[] = res.problems || [];
    const dueProblems = problems.filter((p) => p.dueAt! <= now);
    const problemsToSet = {
      dueProblems: dueProblems,
      solvedProblems: [], // <--- This line clears solvedProblems for the new "day"
    };
    chrome.storage.local.set(problemsToSet, () => {
      if (chrome.runtime.lastError) {
        return;
      }

      const count = dueProblems.length;
      if (count > 0) {
        const plural = count === 1 ? "problem" : "problems";
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icon128.png",
          title: "LeetCall",
          message: `You have ${count} ${plural} due for review today.`,
          priority: 1,
        });
      }
    });
  });
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
