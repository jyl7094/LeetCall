const targetNode = document.body;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const observer = new MutationObserver(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(() => {
    console.log("hello — mutations settled");
    // Your logic here
  }, 300);
});

observer.observe(targetNode, { childList: true, subtree: true });
