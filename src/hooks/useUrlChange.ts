import { useEffect, useState } from "react";

export const useUrlChange = () => {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    const updateUrlFromTab = () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabUrl = tabs[0].url || "";
        setUrl(tabUrl);
      });
    };
    updateUrlFromTab();
    const interval = setInterval(updateUrlFromTab, 1000);
    return () => clearInterval(interval);
  }, []);

  return url;
};
