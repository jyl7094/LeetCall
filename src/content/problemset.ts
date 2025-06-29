function insertButtonsIntoProblemRows() {
  // Inject button styles only once
  if (!document.getElementById("leetcall-button-styles")) {
    const style = document.createElement("style");
    style.id = "leetcall-button-styles";
    style.textContent = `
      .leetcall-button {
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
        background-color: rgb(237, 139, 60); /* orange-ish */
        color: white;
        border-radius: 0.375rem;
        transition: background-color 0.2s ease-in-out;
        cursor: pointer;
        user-select: none;
      }
      .leetcall-button:hover {
        background-color: rgb(204, 119, 51); /* darker orange for hover */
      }
    `;
    document.head.appendChild(style); // Add styles to the <head>
  }

  // Select all problem row elements (LeetCode-like layout)
  const rows = document.querySelectorAll(
    "div.relative.flex.h-full.w-full.cursor-pointer.items-center"
  );

  rows.forEach((row) => {
    if (!(row instanceof HTMLElement)) return;

    // Skip rows that already have our button
    if (row.querySelector(".leetcall-button")) return;

    // Create the "Add" button
    const button = document.createElement("button");
    button.textContent = "Add";
    button.className = "leetcall-button";

    // Find the "acceptance rate" area to position the button before it
    const acceptanceRate = row.querySelector("div.text-sd-muted-foreground");

    if (acceptanceRate && acceptanceRate.parentElement) {
      // Insert the button just before the acceptance rate display
      acceptanceRate.parentElement.insertBefore(button, acceptanceRate);
    } else {
      // Fallback: if we can't find a good spot, just add it to the end
      row.appendChild(button);
    }

    // Button click behavior: get and log the problem title
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevents row click from firing

      // Attempt to extract the problem title
      const titleElement = row.querySelector("div.text-body div.ellipsis");
      const problemTitle =
        titleElement?.textContent?.trim() ?? "Unknown Problem";

      console.log(`Button clicked for problem: "${problemTitle}"`);
    });
  });
}

// Run initially after page loads
window.addEventListener("load", () => {
  insertButtonsIntoProblemRows();
  // Re-run shortly after to catch late-loaded content
  setTimeout(insertButtonsIntoProblemRows, 1000);
});

// Watch for SPA (Single Page App) DOM changes (e.g., when switching tabs)
const observer = new MutationObserver(() => {
  insertButtonsIntoProblemRows();
});
observer.observe(document.body, { childList: true, subtree: true });
