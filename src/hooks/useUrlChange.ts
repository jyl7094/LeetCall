import { useEffect, useState } from "react";

export const useUrlChange = () => {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    // 1. Get initial URL when the hook mounts
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab && currentTab.url) {
        setUrl(currentTab.url);
      }
    });

    // 2. Set up listener for tab updates
    const listener = (
      _tabId: number,
      changeInfo: chrome.tabs.TabChangeInfo,
      tab: chrome.tabs.Tab,
    ) => {
      // Only act if the tab is active in the current window and its URL has changed
      if (
        tab.active &&
        tab.windowId === chrome.windows.WINDOW_ID_CURRENT &&
        changeInfo.url
      ) {
        setUrl(changeInfo.url);
      }
    };

    chrome.tabs.onUpdated.addListener(listener);

    // 3. Clean up the listener when the component unmounts
    return () => {
      chrome.tabs.onUpdated.removeListener(listener);
    };
  }, []);

  return url;
};
