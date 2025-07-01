const InstructionsScreen = () => (
  <div className="px-3 py-4 mb-2">
    <div className="text-center space-y-1.5 mb-3">
      <div className="text-base font-semibold">👋 Welcome to LeetCall!</div>
      <p>
        Crack DSA. <span className="text-[#ed8b3c] font-semibold">Remember forever.</span> Train
        with spaced repetition.
      </p>
    </div>

    <div className="leading-relaxed text-gray-700 space-y-4">
      <p>
        🔍&nbsp; Browse{" "}
        <a
          href="https://leetcode.com/problemset/all/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          the LeetCode Problem Set
        </a>{" "}
        or problem lists by topic, company, favorites, or saved. Click{" "}
        <strong>Add</strong> to save problems to your deck.
      </p>

      <p>
        ⭐&nbsp; On any problem page, click the{" "}
        <strong>LeetCall extension</strong> to rate your confidence. This adds
        the problem to your deck and schedules reviews.
      </p>

      <p>
        📅&nbsp; Visit your <strong>Dashboard</strong> anytime to manage your
        deck and track progress.
      </p>
    </div>
  </div>
);

export default InstructionsScreen;
