import Progress from "@/pages/dashboard/components/Progress";
import Settings from "@/pages/dashboard/components/Settings";
import Table from "@/pages/dashboard/components/Table";
import Tabs from "@/pages/dashboard/components/Tabs";
import { useState, type JSX } from "react";

const App = () => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "settings">(
    "dashboard",
  );

  let tabContent: JSX.Element;
  switch (activeTab) {
    case "dashboard":
      tabContent = (
        <>
          <Progress />
          <Table />
        </>
      );
      break;
    case "settings":
      tabContent = <Settings />;
      break;
    default:
      tabContent = <div>Error</div>;
  }

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-6">
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {tabContent}
      <p className="text-center mt-96 text-gray-500">
        Questions, feedback, or bug reports?{" "}
        <a
          href="mailto:help.leetcall@gmail.com?subject=Feedback%20on%20LeetCall"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Email us
        </a>
        .
      </p>
    </div>
  );
};

export default App;
