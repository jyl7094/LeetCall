import type { Problem } from "@/types/problem";

const getCanonicalProblemLink = (row: HTMLElement) => {
  const parentA = row.closest(
    "a[href^='/problems/']",
  ) as HTMLAnchorElement | null;
  if (parentA?.href) return parentA.href;
  const childA = row.querySelector(
    "a[href^='/problems/']",
  ) as HTMLAnchorElement | null;
  if (childA?.href) return childA.href;

  let el: HTMLElement | null = row;
  while (el && el !== document.body) {
    if (
      el.tagName === "A" &&
      (el as HTMLAnchorElement).href?.includes("/problems/")
    ) {
      return (el as HTMLAnchorElement).href;
    }
    el = el.parentElement;
  }
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

function injectButtons() {
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
      .leetcall-button-disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: #e5e7eb !important;
        color: #a1a1aa !important;
        border-color: #e5e7eb !important;
      }
    `;
    document.head.appendChild(style);
  }

  if (
    typeof chrome === "undefined" ||
    !chrome.storage ||
    !chrome.storage.local
  ) {
    console.warn("[LeetCall] Chrome storage not available");
    return;
  }

  chrome.storage.local.get(["problems"], (result) => {
    const problems: Problem[] = Array.isArray(result.problems)
      ? result.problems
      : [];
    const problemIdSet = new Set(problems.map((p) => p.id));

    const rows = document.querySelectorAll(
      "div.relative.flex.h-full.w-full.cursor-pointer.items-center, a.relative.flex.h-full.w-full.items-center",
    );

    rows.forEach((row) => {
      if (!(row instanceof HTMLElement)) return;
      if (row.querySelector(".leetcall-button")) return;

      const titleElement = row.querySelector("div.ellipsis");
      const idMatch = titleElement?.textContent?.match(/^(\d+)\./);
      const id = idMatch ? idMatch[1] : "unknown";

      const button = document.createElement("button");
      button.textContent = "Add";
      button.className = "leetcall-button";

      if (problemIdSet.has(id)) {
        button.disabled = true;
        button.classList.add("leetcall-button-disabled");
        button.textContent = "Added";
      }

      const acceptanceRate = row.querySelector("div.text-sd-muted-foreground");
      if (acceptanceRate?.parentElement) {
        acceptanceRate.parentElement.insertBefore(button, acceptanceRate);
      } else {
        row.appendChild(button);
      }

      button.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        button.blur();

        const titleElement = row.querySelector("div.ellipsis");
        const problemTitle =
          titleElement?.textContent?.replace(/^\d+\.\s*/, "").trim() ??
          "Unknown Problem";

        let id = "unknown";
        const idMatch = titleElement?.textContent?.match(/^(\d+)\./);
        if (idMatch) id = idMatch[1];

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

        chrome.storage.local.get(["problems"], (result) => {
          const problems: Problem[] = Array.isArray(result.problems)
            ? result.problems
            : [];
          if (!problems.some((p) => p.id === problem.id)) {
            problems.push(problem);
            chrome.storage.local.set({ problems }, () => {
              button.disabled = true;
              button.classList.add("leetcall-button-disabled");
              button.textContent = "Added";
              console.log("[LeetCall] Problem saved:", problem);
            });
          } else {
            button.disabled = true;
            button.classList.add("leetcall-button-disabled");
            button.textContent = "Added";
            console.log("[LeetCall] Problem already exists:", problem);
          }
        });
      });
    });
  });
}

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
