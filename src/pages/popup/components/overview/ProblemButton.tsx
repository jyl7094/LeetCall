const ProblemButton = ({ title, link }: { title: string; link: string }) => {
  const handleClick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.update(tabs[0].id, { url: link });
      }
    });
  };

  return (
    <button
      type="button"
      className="text-gray-900 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs px-3 py-2.5 inline-flex items-center justify-between w-full cursor-pointer transition-colors duration-200 ease-in-out text-left"
      onClick={handleClick}
    >
      <span>{title}</span>
      <span className="ml-2 text-gray-400 text-sm">›</span>
    </button>
  );
};

export default ProblemButton;
