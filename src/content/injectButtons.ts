import { LEETCALL_BUTTON_STYLES } from "@/constants/leetcallButtonStyles";
import type { Problem } from "@/types/problem";

const addButtonStyle = () => {
  if (!document.getElementById("leetcall-button-styles")) {
    const style = document.createElement("style");
    style.id = "leetcall-button-styles";
    style.textContent = LEETCALL_BUTTON_STYLES;
    document.head.appendChild(style);
  }
};

const getCanonicalProblemLink = (row: HTMLElement): string => {
  // Use closest to find the nearest ancestor (or the element itself) that is
  // an <a> tag and has an href starting with '/problems/'.
  const linkElement = row.closest(
    "a[href^='/problems/']",
  ) as HTMLAnchorElement | null;

  if (linkElement?.href) {
    return linkElement.href;
  }

  // If no direct ancestor/self link, check for a descendant link within the row.
  // This is less common for "canonical" links but good to have as a fallback.
  const childLink = row.querySelector(
    "a[href^='/problems/']",
  ) as HTMLAnchorElement | null;
  if (childLink?.href) {
    return childLink.href;
  }

  // Fallback if no specific problem link is found
  return window.location.href;
};

const normalizeLeetCodeProblemUrl = (link: string): string => {
  if (link.startsWith("/")) {
    link = window.location.origin + link;
  }

  try {
    const urlObj = new URL(link);
    const match = urlObj.pathname.match(/^\/problems\/[^/]+/);
    if (match) {
      return urlObj.origin + match[0]; // match[0] contains the full matched string, e.g., "/problems/two-sum"
    }
  } catch (e) {
    console.warn("[LeetCall] Error normalizing URL:", link, e);
    return link;
  }

  return link;
};

const injectButtons = async () => {
  addButtonStyle();

  const result = await chrome.storage.local.get(["problems", "dueProblems"]);
  const problems: Problem[] = result.problems || [];
  const dueProblems: Problem[] = result.dueProblems || [];
  const problemIdSet = new Set(problems.map((p) => p.id));

  const rows = document.querySelectorAll(
    "div.relative.flex.h-full.w-full.cursor-pointer.items-center, a.relative.flex.h-full.w-full.items-center",
  );

  rows.forEach((row) => {
    if (
      !(row instanceof HTMLElement) ||
      row.querySelector(".leetcall-button")
    ) {
      return;
    }

    const titleElement = row.querySelector("div.ellipsis");
    const rawTitle = titleElement?.textContent ?? "";
    const idMatch = rawTitle.match(/^(\d+)\./);
    const id = idMatch ? idMatch[1] : "unknown";
    const problemTitle = rawTitle.replace(/^\d+\.\s*/, "").trim();

    const isAdded = problemIdSet.has(id);
    const button = document.createElement("button");
    button.disabled = isAdded;
    button.textContent = isAdded ? "Added" : "Add";
    button.className = `leetcall-button ${isAdded ? "leetcall-button-disabled" : ""}`;

    const acceptanceRate = row.querySelector("div.text-sd-muted-foreground");
    if (acceptanceRate?.parentElement) {
      acceptanceRate.parentElement.insertBefore(button, acceptanceRate);
    } else {
      row.appendChild(button);
    }

    button.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      button.blur();

      const link = normalizeLeetCodeProblemUrl(getCanonicalProblemLink(row));
      const now = Date.now();
      const problem: Problem = {
        id,
        title: problemTitle,
        link,
        addedAt: now,
        dueAt: now,
        reviewLog: [],
        stability: undefined,
        difficulty: undefined,
      };

      problems.push(problem);
      dueProblems.push(problem);
      await chrome.storage.local.set({ problems, dueProblems });
      problemIdSet.add(problem.id);
      button.disabled = true;
      button.classList.add("leetcall-button-disabled");
      button.textContent = "Added";
    });
  });
};

window.addEventListener("load", () => {
  injectButtons();
  setTimeout(injectButtons, 1000);
});

const observer = new MutationObserver(() => {
  injectButtons();
});

observer.observe(document.body, { childList: true, subtree: true });

window.addEventListener("beforeunload", () => {
  observer.disconnect();
});
