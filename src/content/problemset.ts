function logHelloWorld() {
  console.log("hello world");
}

function observePage() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          logHelloWorld();
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Initial run
  logHelloWorld();
}

observePage();
