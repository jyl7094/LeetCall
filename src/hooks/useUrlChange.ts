import { useEffect, useState } from "react";

export const useUrlChange = () => {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    // Query the active tab's URL using chrome.tabs.query
    const updateUrlFromTab = () => {
      if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.query) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const tabUrl = tabs[0]?.url || "";
          setUrl(tabUrl);
          console.log("[LeetCall] Active tab URL:", tabUrl);
        });
      }
    };
    updateUrlFromTab();
    // Optionally, poll for changes every second (since popup can't listen to tab navigation)
    const interval = setInterval(updateUrlFromTab, 1000);
    return () => clearInterval(interval);
  }, []);

  return url;
};
