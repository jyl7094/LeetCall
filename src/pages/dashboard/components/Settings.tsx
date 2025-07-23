import { getSettings, setSettings } from "@/utils/settings";
import { useEffect, useState } from "react";

const Settings = () => {
  const [sendNotifications, setSendNotifications] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await getSettings();
      setSendNotifications(settings.sendNotifications);
    };

    loadSettings();
  }, []);

  const toggleNotifications = async () => {
    const newValue = !sendNotifications;
    setSendNotifications(newValue);
    await setSettings({ sendNotifications: newValue });
  };

  return (
    <div className="p-6 h-1/3 flex flex-col justify-center items-start">
      {/* items-start aligns children to the left */}
      <div className="flex items-center space-x-4">
        <span className="text-gray-700 text-sm">Enable Notifications</span>
        <button
          onClick={toggleNotifications}
          className={`cursor-pointer w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
            sendNotifications ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
              sendNotifications ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default Settings;
