const InstructionsScreen = () => (
  <div className="text-sm text-center px-1 py-4">
    <div className="mb-6">
      👋{" "}
      <span className="font-semibold text-gray-900">Welcome to LeetCall!</span>
      <br />
      Start building your personalized problem deck.
    </div>

    <div className="text-left text-xs leading-relaxed text-gray-600 space-y-4 max-w-md mx-auto">
      <div>
        👉&nbsp; Visit{" "}
        <a
          href="https://leetcode.com/problemset/all/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          the LeetCode Problem Set
        </a>
        , a company’s list, or a curated list and add problems by clicking the{" "}
        <strong>Add</strong> button next to any title.
      </div>
      <div>
        👉&nbsp; Alternatively, on a specific problem page, you can add it with
        the <strong>Add</strong> button or, once you’ve solved the problem, rate
        your confidence and the extension will add it and schedule your next
        review automatically.
      </div>
      <div>
        👉&nbsp; Visit your <strong>Dashboard</strong> anytime to view your
        deck, track progress, remove problems, or adjust reviews.
      </div>
    </div>
  </div>
);

export default InstructionsScreen;
