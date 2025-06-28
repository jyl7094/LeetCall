import { useEffect, useState } from "react";
import LeetCodeView from "@/pages/Popup/LeetCodeView";
import NonLeetCodeView from "@/pages/Popup/NonLeetCodeView";

const Popup = () => {
  const [isLeetCode, setIsLeetCode] = useState(false);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab.url?.includes("leetcode.com")) {
        setIsLeetCode(true);
      } else {
        setIsLeetCode(false);
      }
    });
  }, []);

  const handleClose = () => {
    window.close();
  };

  return (
    <div className="w-[350] h-full flex flex-col justify-center items-center">
      <div className="flex w-full justify-between items-center bg-amber-400">
        <div>
          <image />
          <h1>LeetCall</h1>
        </div>
        <button onClick={handleClose} type="button" className="cursor-pointer">
          ✕
        </button>
      </div>

      {isLeetCode ? <LeetCodeView /> : <NonLeetCodeView />}
      <button className="bg-amber-400 my-5 w-[90%] rounded-xs">
        Dashboard
      </button>
    </div>
  );
};

export default Popup;
