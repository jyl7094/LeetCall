import { useUrlChange } from "@/hooks/useUrlChange";
import type { Problem } from "@/types/problem";
import { useEffect, useState } from "react";

const OverviewScreen = () => {
  const [progress, setProgress] = useState(0); // 0-100
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const url = useUrlChange();

  // 1. Fetch due problems once
  useEffect(() => {
    function fetchProblems() {
      chrome.storage.local.get(["problems"], (result) => {
        const allProblems: Problem[] = result.problems || [];
        const now = Date.now();
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const startOfTodayMs = startOfToday.getTime();

        // Problems due today or earlier
        const todaysProblems = allProblems.filter((p) => p.dueAt <= now);

        // Problems reviewed today or after dueAt
        const solvedToday = todaysProblems.filter(
          (p) =>
            p.lastReview && p.lastReview >= Math.max(p.dueAt, startOfTodayMs),
        );

        // Progress is how many due problems were reviewed
        const progress =
          todaysProblems.length === 0
            ? 100
            : Math.round((solvedToday.length / todaysProblems.length) * 100);

        setProblems(todaysProblems.sort((a, b) => a.dueAt - b.dueAt));
        setProgress(progress);
      });
    }

    fetchProblems();

    function handleStorageChange(
      changes: Record<string, chrome.storage.StorageChange>,
      area: string,
    ) {
      if (area === "local" && changes.problems) {
        fetchProblems();
      }
    }

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  useEffect(() => {
    const idx = problems.findIndex((p) => p.link === url);

    if (idx === -1) {
      // Viewing unrelated problem
      setCurrentProblem(null);
    } else if (idx === 0) {
      // Correct current problem
      setCurrentProblem(problems[0]);
    } else {
      // User is on a due problem, but not the first
      const newProblems = [...problems];
      const viewed = newProblems[idx];
      newProblems[idx] = newProblems[0];
      newProblems[0] = viewed;

      setCurrentProblem(viewed);
      setProblems(newProblems.slice(1)); // exclude current
    }
  }, [url, problems]);

  return (
    <div className="px-1 py-4 space-y-6">
      {/* Status */}
      <div className="flex items-center justify-center border-b pb-4 border-0 border-gray-200">
        {progress === 100 ? (
          <div className="text-center space-y-2 relative flex flex-col items-center justify-center">
            <div className="text-3xl">🎉</div>
            <div className="font-semibold text-sm">
              You're all done for today!
            </div>
            <div className="text-left px-2 leading-relaxed text-gray-700 space-y-1 mt-2">
              <p>
                🔍&nbsp; Browse{" "}
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
                ⭐&nbsp; Use the <strong>LeetCall extension</strong> on any
                problem page.
              </p>
            </div>
          </div>
        ) : (
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
                strokeDasharray={`${(progress / 100) * 220} 220`}
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
        )}
      </div>

      {/* Current Problem */}
      <div className="space-y-1">
        <div className="font-medium">Current Problem</div>
        {currentProblem ? (
          <div>
            <div className="text-blue-700">{currentProblem.title}</div>
            <div className="text-xs text-gray-500">
              {inDeck ? "In your deck" : "Not in deck"}
            </div>
          </div>
        ) : (
          <div className="text-gray-500">No active problem page</div>
        )}
      </div>

      {/* Rating Buttons */}
      <div className="space-y-2">
        <div className="font-medium">Rate Your Confidence</div>
        <div className="flex justify-between gap-2">
          {[
            {
              label: "Again",
              color:
                "text-gray-500 border-gray-200 hover:bg-gray-100 active:border-gray-500",
            },
            {
              label: "Hard",
              color:
                "text-red-500 border-gray-200 hover:bg-red-50 active:border-red-500",
            },
            {
              label: "Good",
              color:
                "text-yellow-600 border-gray-200 hover:bg-yellow-50 active:border-yellow-500",
            },
            {
              label: "Easy",
              color:
                "text-green-600 border-gray-200 hover:bg-green-50 active:border-green-500",
            },
          ].map(({ label, color }, idx) => (
            <button
              key={idx}
              className={`flex-1 min-w-0 px-2 py-1 text-sm font-medium rounded-md border bg-white transition-colors duration-150 ${color} hover:cursor-pointer focus:outline-none focus:ring-0 focus-visible:ring-0`}
              style={{ letterSpacing: 0.1, maxWidth: 80 }}
            >
              {label}
            </button>
          ))}
        </div>
        {/* {!inDeck && currentProblem && (
          <div className="text-xs text-gray-500 mt-1">
            Rating will add this problem to your deck.
          </div>
        )} */}
      </div>

      {/* Upcoming */}
      <div className="space-y-1">
        <div className="font-medium">Upcoming</div>
        {problems.length > 0 ? (
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {problems.slice(0, 1).map((problem, idx) => (
              <li key={idx}>{problem.title}</li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500">No upcoming problems</div>
        )}
      </div>
    </div>
  );
};

export default OverviewScreen;
