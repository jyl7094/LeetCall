import type { Problem } from "@/types/problem";

const LEETCALL_BUTTON_STYLES = `
      .leetcall-button {
        padding: 0.25rem 0.5rem;
        font-size: 0.95rem;
        font-weight: 500;
        background: #ed8b3c;
        color: #fff;
        border: 1px solid #ed8b3c;
        border-radius: 6px;
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
      .leetcall-button-disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: #e5e7eb !important;
        color: #a1a1aa !important;
        border-color: #e5e7eb !important;
      }
    `;

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

const normalizeLeetCodeProblemUrl = (link: string) => {
  if (link.startsWith("/")) link = window.location.origin + link;
  try {
    const urlObj = new URL(link);
    const match = urlObj.pathname.match(/^\/problems\/[^/]+\/?$/);
    if (match) return urlObj.origin + match[0];
    const slugMatch = urlObj.pathname.match(/^\/problems\/[^/]+/);
    if (slugMatch) return urlObj.origin + slugMatch[0];
  } catch {
    return link; // fallback: do nothing
  }
  return link;
};

const injectButtons = () => {
  if (!document.getElementById("leetcall-button-styles")) {
    const style = document.createElement("style");
    style.id = "leetcall-button-styles";
    style.textContent = LEETCALL_BUTTON_STYLES;
    document.head.appendChild(style);
  }

  chrome.storage.local.get(["problems"], (result) => {
    const problems: Problem[] = result.problems || [];
    const problemIdSet = new Set(problems.map((p) => p.id));

    const rows = document.querySelectorAll(
      "div.relative.flex.h-full.w-full.cursor-pointer.items-center, a.relative.flex.h-full.w-full.items-center",
    );

    rows.forEach((row) => {
      if (
        !(row instanceof HTMLElement) ||
        row.querySelector(".leetcall-button")
      )
        return;

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

        let link = getCanonicalProblemLink(row);
        link = normalizeLeetCodeProblemUrl(link);

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

        problems.push(problem);
        chrome.storage.local.set({ problems });
        problemIdSet.add(problem.id);
        button.disabled = true;
        button.classList.add("leetcall-button-disabled");
        button.textContent = "Added";
      });
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
