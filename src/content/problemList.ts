function insertButtonsIntoLeetCodeProblemList() {
  // Inject button styles only once
  if (!document.getElementById("leetcall-button-styles")) {
    const style = document.createElement("style");
    style.id = "leetcall-button-styles";
    style.textContent = `
      .leetcall-button {
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
        background-color: rgb(237, 139, 60);
        color: white;
        border-radius: 0.375rem;
        transition: background-color 0.2s ease-in-out;
        cursor: pointer;
        user-select: none;
      }
      .leetcall-button:hover {
        background-color: rgb(204, 119, 51);
      }
    `;
    document.head.appendChild(style);
  }

  // Select all problem link elements
  const rows = document.querySelectorAll('a[href^="/problems/"]');

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
      const titleElement = row.querySelector("div.text-body div.ellipsis");
      const problemTitle =
        titleElement?.textContent?.trim() ?? "Unknown Problem";
      console.log(`Button clicked for problem: "${problemTitle}"`);
    });
  });
}

// Run once on load
window.addEventListener("load", () => {
  insertButtonsIntoLeetCodeProblemList();
  setTimeout(insertButtonsIntoLeetCodeProblemList, 1000); // Handle late-loading content
});

// MutationObserver to handle SPA-style updates
const observer = new MutationObserver(() => {
  insertButtonsIntoLeetCodeProblemList();
});

observer.observe(document.body, { childList: true, subtree: true });

// Clean up on unload
window.addEventListener("beforeunload", () => {
  observer.disconnect();
});
