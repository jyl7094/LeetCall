import Progress from "@/pages/dashboard/components/Progress";
import Settings from "@/pages/dashboard/components/Settings";
import Table from "@/pages/dashboard/components/Table";
import { useState } from "react";

const App = () => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "settings">(
    "dashboard",
  );

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-6">
      {/* Tabs - left aligned, square-ish, gray theme */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "dashboard"
              ? "bg-gray-300 text-gray-900"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "settings"
              ? "bg-gray-300 text-gray-900"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Settings
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "dashboard" && (
        <>
          <Progress />
          <Table />
        </>
      )}
      {activeTab === "settings" && <Settings />}
    </div>
  );
};

export default App;
