import type { Problem } from "@/types/problem";
import { getNextMidnightTime } from "@/utils/time";

// Update daily problems and notify user
const updateDailyProblems = async () => {
  const result = await chrome.storage.local.get(["problems"]);
  const problems: Problem[] = result.problems || [];
  const endOfToday = getNextMidnightTime();
  const dueProblems = problems.filter(
    (p) => typeof p.dueAt === "number" && p.dueAt < endOfToday,
  );

  // Sort by due date ascending
  dueProblems.sort((a, b) => a.dueAt! - b.dueAt!);

  const problemsToSet = {
    dueProblems,
    solvedProblems: [], // reset for the day
  };

  await chrome.storage.local.set(problemsToSet);

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
};

// Alarm Setup and Listener
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "dailyUpdate") {
    updateDailyProblems();
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("dailyUpdate", {
    when: getNextMidnightTime(),
    periodInMinutes: 24 * 60,
  });

  updateDailyProblems();
});

chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.create("dailyUpdate", {
    when: getNextMidnightTime(),
    periodInMinutes: 24 * 60,
  });

  updateDailyProblems();
});

// Inject buttons into LeetCode problem pages
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
