const EmptyScreen = () => (
  <div className="text-sm text-center px-1 py-8">
    <div className="mb-6">
      👋{" "}
      <span className="font-semibold">Welcome to LeetCall!</span>
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
        👉&nbsp; You'll also see the <strong>Add</strong> button when viewing a
        specific problem directly.
      </div>
      <div>
        👉&nbsp; After submitting an answer, rate your confidence to personalize
        your practice schedule.
      </div>
    </div>
  </div>
);

export default EmptyScreen;
