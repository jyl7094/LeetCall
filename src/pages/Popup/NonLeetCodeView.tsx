const NonLeetCodeView = () => (
  <div className="p-4 text-center">
    <p className="mb-2 text-lg font-semibold">
      You have no pending problems for today!
    </p>
    <p className="text-sm text-gray-600">
      Visit{" "}
      <a
        href="https://leetcode.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        leetcode.com
      </a>{" "}
      to start solving new problems.
    </p>
  </div>
);

export default NonLeetCodeView;
