import type { Problem } from "@/types/problem";

/**
 * Parses the current active LeetCode problem from the browser tab.
 * This function injects a script into the active tab to extract problem details.
 *
 * @returns {Promise<Problem | null>} A Promise that resolves with a Problem object
 * if a LeetCode problem is successfully parsed from the current tab,
 * or `null` if no active tab, script injection fails, or parsing fails.
 */
export const parseLeetCodeProblem = (): Promise<Problem | null> => {
  return new Promise((resolve) => {
    // Query for the active tab in the current window
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      if (!tabId) {
        resolve(null); // Resolve with null if no active tab is found
        return;
      }

      // Execute a content script in the target tab to extract problem data from the DOM
      chrome.scripting.executeScript(
        {
          target: { tabId },
          func: () => {
            // This function runs in the isolated world of the content script
            // It selects the anchor element that contains the problem number and title
            const anchor = document.querySelector(
              'a[href^="/problems/"].no-underline.truncate',
            );
            if (!anchor) return null; // Return null if the anchor element is not found

            // Extract and clean the problem URL
            const href = (anchor.getAttribute("href") ?? "").replace(
              /\/+$/,
              "",
            );
            const fullUrl = href.startsWith("/")
              ? `https://leetcode.com${href}` // Prepend domain if relative path
              : href;

            // Extract and parse the problem ID and title from the text content
            const text = anchor.textContent?.trim() || "";
            const match = text.match(/^(\d+)\.\s+(.*)$/); // Expected format: "1. Two Sum"
            if (!match) return null; // Return null if text format doesn't match

            const [, id, title] = match; // Destructure matched groups
            return { id, title, link: fullUrl }; // Return extracted data
          },
        },
        (injectionResults) => {
          if (chrome.runtime.lastError) {
            console.error("Script injection failed:", chrome.runtime.lastError);
            resolve(null); // Resolve with null if the script injection itself failed
            return;
          }

          // Access the result from the executed script
          const result = injectionResults?.[0]?.result;
          if (
            result &&
            typeof result.id === "string" &&
            typeof result.title === "string" &&
            typeof result.link === "string"
          ) {
            // If valid data is extracted, construct and resolve a Problem object
            resolve({
              ...result,
              reviewLog: [], // Initialize empty review log
              addedAt: new Date().getTime(), // Set the timestamp when the problem was first added/parsed
              dueAt: undefined, // 'dueAt' will be set by the FSRS algorithm after the first review
              stability: undefined, // FSRS parameter, initialized after first review
              difficulty: undefined, // FSRS parameter, initialized after first review
              // confidence: undefined, // If your Problem type includes 'confidence' it should be initialized here too
            });
          } else {
            resolve(null); // Resolve with null if the parsed result is invalid or incomplete
          }
        },
      );
    });
  });
};
