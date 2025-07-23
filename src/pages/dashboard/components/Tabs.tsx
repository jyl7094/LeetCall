const Tabs = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: "dashboard" | "settings";
  setActiveTab: (value: React.SetStateAction<"dashboard" | "settings">) => void;
}) => {
  return (
    <div className="relative flex space-x-0 border-b border-gray-300">
      <button
        onClick={() => setActiveTab("dashboard")}
        className={`
          cursor-pointer px-4 py-2 text-sm font-medium transition-colors rounded-t focus:outline-none
          ${
            activeTab === "dashboard"
              ? "bg-white text-gray-700 border-x border-t border-gray-300 z-10 -mb-px" // Active tab styling
              : "text-gray-400 hover:text-gray-600" // Inactive tab styling (no borders)
          }
        `}
      >
        Dashboard
      </button>
      <button
        onClick={() => setActiveTab("settings")}
        className={`
          cursor-pointer px-4 py-2 text-sm font-medium transition-colors rounded-t focus:outline-none
          ${
            activeTab === "settings"
              ? "bg-white text-gray-700 border-x border-t border-gray-300 z-10 -mb-px" // Active tab styling
              : "text-gray-400 hover:text-gray-600" // Inactive tab styling (no borders)
          }
        `}
      >
        Settings
      </button>
    </div>
  );
};

export default Tabs;
