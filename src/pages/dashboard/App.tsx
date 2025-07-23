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
      {/* Pill-style Tabs */}
      <div className="flex space-x-2 justify-center mb-6">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-1.5 rounded-full transition-colors ${
            activeTab === "dashboard"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-1.5 rounded-full transition-colors ${
            activeTab === "settings"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
