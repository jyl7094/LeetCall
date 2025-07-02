import type { Problem } from "@/types/problem";

const getCanonicalProblemLink = (row: HTMLElement) => {
  // Try to find closest parent <a> with href
  const parentA = row.closest(
    "a[href^='/problems/']",
  ) as HTMLAnchorElement | null;
  if (parentA && parentA.href) return parentA.href;
  // Try to find a child <a> with href
  const childA = row.querySelector(
    "a[href^='/problems/']",
  ) as HTMLAnchorElement | null;
  if (childA && childA.href) return childA.href;
  // Try to find a parent <a> (for card layout)
  let el: HTMLElement | null = row;
  while (el && el !== document.body) {
    if (
      el.tagName === "A" &&
      (el as HTMLAnchorElement).href &&
      (el as HTMLAnchorElement).href.includes("/problems/")
    ) {
      return (el as HTMLAnchorElement).href;
    }
    el = el.parentElement;
  }
  // Fallback to current page
  return window.location.href;
};

const normalizeLeetCodeProblemUrl = (link: string) => {
  // Ensure absolute URL
  if (link.startsWith("/")) link = window.location.origin + link;
  try {
    const urlObj = new URL(link);
    const match = urlObj.pathname.match(/^\/problems\/[^/]+\/?$/);
    if (match) return urlObj.origin + match[0];
    // If path is /problems/<slug>/something, keep only /problems/<slug>
    const slugMatch = urlObj.pathname.match(/^\/problems\/[^/]+/);
    if (slugMatch) return urlObj.origin + slugMatch[0];
  } catch {
    // Intentionally ignore URL parse errors
  }
  return link;
};

function insertButtonsIntoProblemSet() {
  // Inject button styles only once
  if (!document.getElementById("leetcall-button-styles")) {
    const style = document.createElement("style");
    style.id = "leetcall-button-styles";
    style.textContent = `
      .leetcall-button {
        padding: 0.25rem 0.5rem;
        font-size: 0.95rem;
        font-weight: 500;
        background: #ed8b3c;
        color: #fff;
        border: 1px solid #ed8b3c;
        border-radius: 9999px;
        transition: background 0.15s, border-color 0.15s, color 0.15s;
        cursor: pointer;
        min-width: 56px;
        max-width: 90px;
        letter-spacing: 0.1px;
      }
      .leetcall-button:hover {
        background: #ffb877;
        color: #fff;
        border-color: #ed8b3c;
      }
      .leetcall-button:active {
        border-color: #ed8b3c;
        background: #e07a1a;
        color: #fff;
      }
      .leetcall-button:focus {
        outline: none;
        box-shadow: 0 0 0 2px #ffe5ca;
      }
    `;
    document.head.appendChild(style);
  }

  const rows = document.querySelectorAll(
    // Matches both <div> on problemset/company and <a> on custom lists
    "div.relative.flex.h-full.w-full.cursor-pointer.items-center, a.relative.flex.h-full.w-full.items-center",
  );

  rows.forEach((row) => {
    if (!(row instanceof HTMLElement)) return;
    if (row.querySelector(".leetcall-button")) return;

    const button = document.createElement("button");
    button.textContent = "Add";
    button.className = "leetcall-button";

    const acceptanceRate = row.querySelector("div.text-sd-muted-foreground");

    if (acceptanceRate?.parentElement) {
      acceptanceRate.parentElement.insertBefore(button, acceptanceRate);
    } else {
      row.appendChild(button);
    }

    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      button.blur(); // Remove focus highlight after click
      // Extract info for Problem type
      const titleElement = row.querySelector("div.ellipsis");
      const problemTitle =
        titleElement?.textContent?.replace(/^\d+\.\s*/, "").trim() ??
        "Unknown Problem";
      // Try to extract id from the title (e.g., '9. Palindrome Number')
      let id = "unknown";
      const idMatch = titleElement?.textContent?.match(/^(\d+)\./);
      if (idMatch) id = idMatch[1];
      // Use helpers for link extraction and normalization
      let link = getCanonicalProblemLink(row);
      link = normalizeLeetCodeProblemUrl(link);
      // Compose Problem object (add difficulty and acceptance as extra fields)
      const now = Date.now();
      const problem: Problem = {
        id,
        title: problemTitle,
        link,
        addedAt: now,
        dueAt: now,
        lastReview: undefined,
        stability: 0.5,
        difficulty: 5.0,
        confidence: undefined,
      };
      // Save to chrome.storage.local (append, no duplicates by id)
      // if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      //   chrome.storage.local.get(["leetcall_problems"], (result) => {
      //     const problems = Array.isArray(result.leetcall_problems) ? result.leetcall_problems : [];
      //     const exists = problems.some((p) => p.id === problem.id);
      //     if (!exists) {
      //       problems.push(problem);
      //       chrome.storage.local.set({ leetcall_problems: problems }, () => {
      //         console.log("[LeetCall] Problem saved:", problem);
      //       });
      //     } else {
      //       console.log("[LeetCall] Problem already exists:", problem);
      //     }
      //   });
      // } else {
      console.log("[LeetCall] Problem added:", problem);
      // }
    });
  });
}

// Initial injection on page load
window.addEventListener("load", () => {
  insertButtonsIntoProblemSet();
  setTimeout(insertButtonsIntoProblemSet, 1000); // in case of async content
});

// Set up MutationObserver to monitor SPA DOM changes
const observer = new MutationObserver(() => {
  insertButtonsIntoProblemSet();
});

observer.observe(document.body, { childList: true, subtree: true });

// Cleanup to avoid memory leaks
window.addEventListener("beforeunload", () => {
  observer.disconnect();
});
