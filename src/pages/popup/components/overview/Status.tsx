import type { Problem } from "@/types/problem";

const Status = ({
  problemsList,
  solvedProblems,
}: {
  problemsList: Problem[];
  solvedProblems: Set<string>;
}) => {
  const dueProblems = problemsList;
  const solved = solvedProblems;
  const progress =
    dueProblems.length === 0
      ? 100
      : Math.round((solved.size / dueProblems.length) * 100);
  const circumference = 2 * Math.PI * 35;
  const percent =
    dueProblems.length === 0 ? 1 : solved.size / dueProblems.length;
  const dash = Math.round(percent * circumference);

  if (dueProblems.length === 0 || solved.size === dueProblems.length) {
    return (
      <div className="text-center space-y-2 relative flex flex-col items-center justify-center">
        <div className="text-3xl">🎉</div>
        <div className="font-semibold text-sm">You're all done for today!</div>
        <div className="text-left px-2 leading-relaxed text-gray-700 space-y-1 mt-2">
          <p>
            🔍 Browse{" "}
            <a
              href="https://leetcode.com/problemset/all/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              LeetCode
            </a>{" "}
            and click <strong>Add</strong> to grow your deck.
          </p>
          <p>
            ⭐ Use the <strong>LeetCall extension</strong> on any problem page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <svg width="80" height="80" className="block">
      <g transform="rotate(-90 40 40)">
        <circle
          cx="40"
          cy="40"
          r="35"
          stroke="#e5e7eb"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="40"
          cy="40"
          r="35"
          stroke="#2563eb"
          strokeWidth="8"
          strokeDasharray={`${dash} ${circumference}`}
          fill="none"
          strokeLinecap="round"
        />
      </g>
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="fill-gray-800 font-semibold text-base"
      >
        {progress}%
      </text>
    </svg>
  );
};

export default Status;
