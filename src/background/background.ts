chrome.webNavigation.onHistoryStateUpdated.addListener(
  (details) => {
    const url = details.url;

    if (url.startsWith("https://leetcode.com/problemset/")) {
      chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        files: ["problemset.js"],
      });
    } else if (url.startsWith("https://leetcode.com/company/")) {
      chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        files: ["company.js"],
      });
    } else if (url.startsWith("https://leetcode.com/problem-list/")) {
      chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        files: ["problemList.js"],
      });
    }
  },
  {
    url: [{ hostContains: "leetcode.com" }],
  },
);
