// import { useEffect, useState } from "react";

const App = () => {
  // const [isLeetCode, setIsLeetCode] = useState(false);

  // useEffect(() => {
  //   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //     const currentTab = tabs[0];
  //     if (currentTab.url?.includes("leetcode.com")) {
  //       setIsLeetCode(true);
  //     } else {
  //       setIsLeetCode(false);
  //     }
  //   });
  // }, []);

  const handleClose = () => {
    window.close();
  };

  return (
    <div className="w-[350px] flex flex-col justify-center items-center antialiased">
      <div className="flex w-full justify-between items-center px-5 py-2.5 select-none">
        <div className="flex items-center">
          <img src="/icon128.png" className="mr-1.5 pointer-events-none w-5" />
          <h1 className="font-semibold">LeetCall</h1>
        </div>
        <button onClick={handleClose} type="button" className="cursor-pointer">
          ✕
        </button>
      </div>

      {/* {isLeetCode ? <LeetCodeView /> : <NonLeetCodeView />} */}
      <button className="bg-amber-400 mb-4.5 w-[90%] rounded-xs">
        Dashboard
      </button>
    </div>
  );
};

export default App;
