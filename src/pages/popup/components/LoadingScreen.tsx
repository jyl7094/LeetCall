const LoadingScreen = () => (
  <div className="text-sm text-center text-gray-600 px-6 py-8 max-w-md mx-auto">
    <svg
      className="h-6 w-6 mx-auto mb-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
    >
      {/* Full background ring */}
      <circle
        className="text-gray-300"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      {/* Spinner arc segment */}
      <path
        className="text-blue-600"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="4"
        d="M22 12a10 10 0 00-10-10"
      />
    </svg>
    Loading...
  </div>
);

export default LoadingScreen;
