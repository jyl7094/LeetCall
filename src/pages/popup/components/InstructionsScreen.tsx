const InstructionsScreen = () => (
  <div className="text-sm text-center px-1 py-4 mb-2">
    <div className="space-y-2 mb-4">
      <div className="font-semibold">👋 Welcome to LeetCall!</div>
      <p>Level up faster with spaced repetition.</p>
    </div>

    <div className="text-left text-xs leading-relaxed text-gray-600 space-y-4">
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
        ⭐&nbsp; On any problem page, click the <strong>LeetCall icon</strong>{" "}
        to rate your confidence. This adds the problem to your deck and
        schedules reviews.
      </p>

      <p>
        📅&nbsp; Visit your <strong>Dashboard</strong> anytime to manage your
        deck and track progress.
      </p>
    </div>
  </div>
);
export default InstructionsScreen;
