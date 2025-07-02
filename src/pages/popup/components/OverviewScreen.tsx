import { useUrlChange } from "@/hooks/useUrlChange";
import type { Problem } from "@/types/problem";
import { useEffect, useState } from "react";

const OverviewScreen = () => {
  const [progress, setProgress] = useState(0); // 0-100
  const [allDone, setAllDone] = useState(false);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [inDeck, setInDeck] = useState(false);
  const [upcoming, setUpcoming] = useState<Problem[]>([]);
  const url = useUrlChange();

  useEffect(() => {
    // Get only due problems from chrome.storage.local
    console.log("[LeetCall] Loading overview screen...");
    if (
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.local
    ) {
      chrome.storage.local.get(["problems"], (result) => {
        const problems: Problem[] = Array.isArray(result.problems)
          ? result.problems
          : [];
        const now = Date.now();
        // Only problems that are due
        const dueProblems = problems.filter(
          (p) => typeof p.dueAt === "number" && p.dueAt <= now,
        );
        setUpcoming(dueProblems);
        setAllDone(dueProblems.length === 0);
        // Default: set first due problem
        const selectedProblem = dueProblems.length > 0 ? dueProblems[0] : null;
        // Detect if current tab is a LeetCode problem page and match by link
        if (url && url.startsWith("https://leetcode.com/problems/")) {
          // Robust normalization: decode, lowercase, strip query/hash, trailing slash, trim
          const normalize = (u: string) =>
            decodeURIComponent(u)
              .toLowerCase()
              .replace(/([?#]).*$/, "")
              .replace(/\/$/, "")
              .trim();
          const canonicalUrl = normalize(url);
          console.log("[LeetCall] current url:", url, "->", canonicalUrl);
          let found: Problem | null = null;
          for (const p of dueProblems) {
            const normLink = normalize(p.link);
            console.log("[LeetCall] comparing:", normLink, "vs", canonicalUrl);
            if (normLink === canonicalUrl) {
              found = p;
              break;
            }
          }
          console.log("[LeetCall] match:", found);
          setCurrentProblem(found || selectedProblem);
        } else {
          setCurrentProblem(selectedProblem);
        }
        // Optionally, set progress here if you want
        // setProgress(...)
        setInDeck(true);
        setProgress(1);
      });
    }
  }, [url]);

  return (
    <div className="px-1 py-4 space-y-6">
      {/* Status */}
      <div className="flex items-center justify-center border-b pb-4 border-0 border-gray-200">
        {allDone ? (
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
        {!inDeck && currentProblem && (
          <div className="text-xs text-gray-500 mt-1">
            Rating will add this problem to your deck.
          </div>
        )}
      </div>

      {/* Upcoming */}
      <div className="space-y-1">
        <div className="font-medium">Upcoming</div>
        {upcoming.length > 0 ? (
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {upcoming.slice(0, 3).map((problem, idx) => (
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
