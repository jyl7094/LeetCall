import { ScreenState } from "@/constants/screenState";
import { useScreenState } from "@/hooks/useScreenState";
import Header from "@/pages/popup/components/common/Header";
import InstructionsScreen from "@/pages/popup/components/screens/InstructionsScreen";
import LoadingScreen from "@/pages/popup/components/screens/LoadingScreen";
import OverviewScreen from "@/pages/popup/components/screens/OverviewScreen";

const App = () => {
  const [screen] = useScreenState();

  const handleDashboard = () => {
    const url = chrome.runtime.getURL("src/pages/dashboard/index.html");
    chrome.tabs.create({ url });
  };

  const renderScreen = () => {
    switch (screen) {
      case ScreenState.Loading:
        return <LoadingScreen />;
      case ScreenState.Instructions:
        return <InstructionsScreen />;
      case ScreenState.Overview:
        return <OverviewScreen />;
      default:
        return null;
    }
  };
  renderScreen();

  return (
    <div className="w-[350px] flex flex-col antialiased py-4 px-5 gap-1 text-gray-900 bg-gray-50">
      <Header />
      {renderScreen()}
      <button
        onClick={handleDashboard}
        className="bg-blue-500 hover:bg-blue-600 text-gray-50 py-2 rounded cursor-pointer transition-colors duration-200 ease-in-out"
      >
        Dashboard
      </button>
    </div>
  );
};

export default App;
