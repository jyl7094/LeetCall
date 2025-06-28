const EmptyScreen = () => (
  <div className="text-sm text-center text-gray-600">
    <div>
      👋 <span className="font-medium">Welcome to LeetCall!</span>
      <br />
      Start building your personalized problem deck.
    </div>

    <div className="text-left text-xs leading-relaxed text-gray-500 space-y-2">
      <div>
        👉 Go to{" "}
        <a
          href="https://leetcode.com/problemset/all/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          LeetCode Problem Set
        </a>
        .
      </div>
      <div>
        👉 Use the <strong>Add</strong> button next to any problem title to
        include it in your deck.
      </div>
      <div>
        👉 You'll also see the Add button when viewing a specific problem
        directly.
      </div>
    </div>
  </div>
);

export default EmptyScreen;
