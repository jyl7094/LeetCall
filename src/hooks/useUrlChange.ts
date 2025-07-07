import { useEffect, useState } from "react";

export const useUrlChange = () => {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    const updateUrlFromTab = () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabUrl = tabs[0]?.url || "";
        setUrl(tabUrl);
      });
    };

    updateUrlFromTab(); // initial

    const handleTabUpdate = (
      _tabId: number,
      changeInfo: chrome.tabs.TabChangeInfo,
    ) => {
      if (changeInfo.url) updateUrlFromTab();
    };

    const handleTabActivated = () => updateUrlFromTab();

    chrome.tabs.onUpdated.addListener(handleTabUpdate);
    chrome.tabs.onActivated.addListener(handleTabActivated);

    return () => {
      chrome.tabs.onUpdated.removeListener(handleTabUpdate);
      chrome.tabs.onActivated.removeListener(handleTabActivated);
    };
  }, []);

  return url;
};
