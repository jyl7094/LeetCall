function insertButtonsIntoProblemRows() {
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

  const rows = document.querySelectorAll(
    "div.relative.flex.h-full.w-full.cursor-pointer.items-center",
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
      const titleElement = row.querySelector("div.text-body div.ellipsis");
      const problemTitle =
        titleElement?.textContent?.trim() ?? "Unknown Problem";
      console.log(`Button clicked for problem: "${problemTitle}"`);
    });
  });
}

// Initial injection on page load
window.addEventListener("load", () => {
  insertButtonsIntoProblemRows();
  setTimeout(insertButtonsIntoProblemRows, 1000); // in case of async content
});

// Set up MutationObserver to monitor SPA DOM changes
const observer = new MutationObserver(() => {
  insertButtonsIntoProblemRows();
});

observer.observe(document.body, { childList: true, subtree: true });

// Cleanup to avoid memory leaks
window.addEventListener("beforeunload", () => {
  observer.disconnect();
});
