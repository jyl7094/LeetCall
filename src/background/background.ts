import type { Problem } from "@/types/problem";
import { setupDailyAlarm } from "@/utils/alarms";
import {
  clearBadge,
  setBadge,
  updateNotification,
} from "@/utils/notifications";
import { setupSettings } from "@/utils/settings";
import { getNextMidnightTime } from "@/utils/time";

// Update daily problems and notify user
const updateDailyProblems = async () => {
  const result = await chrome.storage.local.get([
    "problems",
    "dueProblems",
    "lastUpdated",
    "solvedProblems",
  ]);

  const problems: Problem[] = result.problems || [];
  const lastUpdated: string = result.lastUpdated || "";
  let dueProblems: Problem[] = result.dueProblems || [];
  const solvedIds: string[] = result.solvedProblems || [];

  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

  if (lastUpdated === today) {
    const dueCount = dueProblems.length;
    const solvedCount = solvedIds.length;
    const count = dueCount - solvedCount;
    updateNotification(count);
    return;
  }

  const endOfToday = getNextMidnightTime();

  dueProblems = problems.filter(
    (p) => typeof p.dueAt === "number" && p.dueAt < endOfToday,
  );

  dueProblems.sort((a, b) => a.dueAt! - b.dueAt!);

  const problemsToSet = {
    dueProblems,
    solvedProblems: [], // reset for the day
    lastUpdated: today,
  };

  await chrome.storage.local.set(problemsToSet);

  const count = dueProblems.length;
  updateNotification(count);
};

// --- Listeners ---
chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area === "local" && (changes.dueProblems || changes.solvedProblems)) {
    const { dueProblems = [], solvedProblems = [] } =
      await chrome.storage.local.get(["dueProblems", "solvedProblems"]);

    const dueIds = new Set(dueProblems.map((p: Problem) => p.id));
    const solvedIds = new Set(solvedProblems);
    const allDueSolved = [...dueIds].every((id) => solvedIds.has(id));

    if (dueIds.size === 0 || allDueSolved) {
      clearBadge();
    } else {
      setBadge();
    }
  }
});

// Alarm Setup and Listener
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "dailyUpdate") {
    updateDailyProblems();
  }
});

chrome.runtime.onInstalled.addListener(() => {
  setupSettings();
  setupDailyAlarm();
  updateDailyProblems();
});

chrome.runtime.onStartup.addListener(() => {
  setupDailyAlarm();
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
