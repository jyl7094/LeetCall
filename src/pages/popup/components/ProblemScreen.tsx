const ProblemScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-lg font-semibold mb-4">Problem Encountered</h2>
      <p className="text-sm text-gray-600 mb-4">
        An error occurred while processing your request. Please try again later.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-2 px-4 rounded cursor-pointer transition-colors duration-200 ease-in-out"
      >
        Retry
      </button>
    </div>
  );
};

export default ProblemScreen;
