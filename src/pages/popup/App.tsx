import Header from "@/pages/popup/components/Header";
import EmptyScreen from "@/pages/popup/components/EmptyScreen";
import ReviewScreen from "@/pages/popup/components/ReviewScreen";
import LoadingScreen from "@/pages/popup/components/LoadingScreen";
import CompleteScreen from "@/pages/popup/components/CompleteScreen";
import { useScreenState } from "@/hooks/useScreenState";
import { ScreenState } from "@/constants/screenState";

const App = () => {
  const [screen] = useScreenState();

  const handleDashboard = () => {
    const url = chrome.runtime.getURL("src/pages/extension/index.html");
    chrome.tabs.create({ url });
  };

  const renderScreen = () => {
    switch (screen) {
      case ScreenState.Loading:
        return <LoadingScreen />;
      case ScreenState.Empty:
        return <EmptyScreen />;
      case ScreenState.Review:
        return <ReviewScreen />;
      case ScreenState.Complete:
        return <CompleteScreen />;
      default:
        return null;
    }
  };

  return (
    <div className="w-[350px] flex flex-col antialiased py-4 px-5 gap-5">
      <Header />
      {renderScreen()}
      <button
        onClick={handleDashboard}
        className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-2 rounded"
      >
        Dashboard
      </button>
    </div>
  );
};

export default App;
