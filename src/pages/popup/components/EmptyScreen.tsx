const EmptyScreen = () => (
  <div className="text-sm text-center px-1 py-4">
    <div className="mb-6">
      👋{" "}
      <span className="font-semibold text-gray-900">Welcome to LeetCall!</span>
      <br />
      Start building your personalized problem deck.
    </div>

    <div className="text-left text-xs leading-relaxed text-gray-600 space-y-4 max-w-md mx-auto">
      <div>
        👉&nbsp; Go to{" "}
        <a
          href="https://leetcode.com/problemset/all/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          LeetCode Problem Set
        </a>{" "}
        and start adding problems to your deck.
      </div>
      <div>
        👉&nbsp; Use the <strong>Add</strong> button next to any problem title
        to include it in your deck.
      </div>
      <div>
        👉&nbsp; You’ll also see the <strong>Add</strong> button when viewing a
        specific problem.
      </div>
      <div>
        👉&nbsp; After solving a problem, you can rate your confidence. This
        automatically adds it to your deck and sets when you’ll review it.
      </div>
      <div>
        👉&nbsp; Head to your <strong>Dashboard</strong> to view your deck,
        track progress, delete problems, or customize review intervals.
      </div>
    </div>
  </div>
);

export default EmptyScreen;
