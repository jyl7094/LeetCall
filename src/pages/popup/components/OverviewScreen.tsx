import { useUrlChange } from "@/hooks/useUrlChange";
import type { Problem } from "@/types/problem";
import { useEffect, useState } from "react";
import ProblemButton from "./ProblemButton";

const OverviewScreen = () => {
  // State for progress bar (0-100)
  const [progress, setProgress] = useState(0);

  // The currently focused problem (null if none)
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);

  // Set of solved problem IDs (solved today)
  const [solvedProblems, setSolvedProblems] = useState<Set<string>>(new Set());

  // List of all due problems, sorted by due date
  const [problemsList, setProblemsList] = useState<Problem[]>([]);

  // Map from problem link to Problem object for quick lookup
  const [problemsMap, setProblemsMap] = useState<Map<string, Problem>>(
    new Map(),
  );

  const [upcoming, setUpcoming] = useState<Problem[]>([]);

  // The current URL (from a custom hook)
  const url = useUrlChange();

  // --- Effect: Fetch due problems from storage and listen for changes ---
  useEffect(() => {
    // Fetches due problems from chrome.storage and updates state
    const fetchProblems = () => {
      chrome.storage.local.get(["dueProblems"], (result) => {
        const dueProblems: Problem[] = result.dueProblems || [];

        // Calculate start of today for review log checks
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const startOfTodayMs = startOfToday.getTime();

        // Track solved problems and build a map for quick lookup
        const solved = new Set<string>();
        const map = new Map<string, Problem>();

        for (const p of dueProblems) {
          // If reviewed today, mark as solved
          if (p.reviewLog.some((ts) => ts >= startOfTodayMs)) {
            solved.add(p.id);
          }
          map.set(p.link, p);
        }

        // Calculate progress as percent of due problems solved
        const progress =
          dueProblems.length === 0
            ? 100
            : Math.round((solved.size / dueProblems.length) * 100);

        // Sort due problems by due date (ascending)
        const sorted = [...dueProblems].sort((a, b) => a.dueAt! - b.dueAt!);

        setProgress(progress);
        setProblemsList(sorted);
        setProblemsMap(map);
        setSolvedProblems(solved);
      });
    };

    fetchProblems();

    // Listen for changes in chrome.storage and refetch if dueProblems changes
    const handleStorageChange = (
      changes: Record<string, chrome.storage.StorageChange>,
      area: string,
    ) => {
      if (area === "local" && changes.dueProblems) {
        fetchProblems();
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    // Cleanup listener on unmount
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  // --- Effect: Determine the current problem based on URL and problemsList ---
  useEffect(() => {
    if (problemsList.length === 0) {
      setCurrentProblem(null);
      return;
    }

    // Try to find problem from map by exact URL match
    const problemFromMap = problemsMap.get(url);

    if (problemFromMap) {
      setCurrentProblem(problemFromMap);
    } else {
      // Fallback: inject content script to try to extract problem info from page
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[0]?.id;
        if (!tabId) return;

        chrome.scripting.executeScript(
          {
            target: { tabId },
            func: () => {
              const anchor = document.querySelector(
                'a[href^="/problems/"].no-underline.truncate',
              );
              if (!anchor) return null;

              const href = (anchor.getAttribute("href") ?? "").replace(
                /\/+$/,
                "",
              );
              const fullUrl = href.startsWith("/")
                ? `https://leetcode.com${href}`
                : href;

              const text = anchor.textContent?.trim() || "";
              const match = text.match(/^(\d+)\.\s+(.*)$/);
              if (!match) return null;

              const [, id, title] = match;
              return { id, title, link: fullUrl };
            },
          },
          (injectionResults) => {
            if (chrome.runtime.lastError) {
              console.error(
                "Script injection failed:",
                chrome.runtime.lastError,
              );
              return;
            }

            const result = injectionResults?.[0]?.result;
            if (
              result &&
              typeof result.id === "string" &&
              typeof result.title === "string" &&
              typeof result.link === "string"
            ) {
              const enrichedProblem: Problem = {
                ...result,
                reviewLog: [],
                stability: 0,
                difficulty: 0.3,
              };
              setCurrentProblem(enrichedProblem);
            } else {
              console.warn("Could not extract problem info from anchor.");
              setCurrentProblem(null);
            }
          },
        );
      });
    }
  }, [url, problemsList, problemsMap]);

  useEffect(() => {
    const currentId = currentProblem?.id;

    const filtered = problemsList.filter((p) => {
      if (solvedProblems.has(p.id) || p.id === currentId) return false;
      return true;
    });

    setUpcoming(filtered);
  }, [problemsList, solvedProblems, currentProblem]);

  return (
    <div className="px-1 pt-4 pb-2 space-y-4">
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
          // Circular progress bar
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
      <div className="space-y-2">
        <div className="font-medium">Current Problem</div>
        {currentProblem ? (
          <ProblemButton
            title={currentProblem.title}
            link={currentProblem.link}
          />
        ) : (
          <div className="text-gray-500">No active problem</div>
        )}
      </div>

      {/* Rating Buttons */}
      <div className="space-y-2">
        <div className="flex items-center gap-1">
          <span className="font-medium">Rate Your Confidence</span>
          <div className="relative">
            <span className="group cursor-pointer text-gray-400 hover:text-gray-600">
              &#9432;
              <div className="absolute left-1/2 top-full mt-1 w-64 -translate-x-1/2 rounded-md bg-gray-50 text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 shadow-sm border border-gray-200 pointer-events-none">
                Rating marks the problem complete. If new, it’ll be added to
                your deck.
              </div>
            </span>
          </div>
        </div>
        <div className="flex justify-between gap-2">
          {[
            {
              label: "Again",
              color:
                "text-gray-500 border-gray-200 hover:bg-gray-200 active:border-gray-500",
            },
            {
              label: "Hard",
              color:
                "text-red-500 border-gray-200 hover:bg-red-100 active:border-red-500",
            },
            {
              label: "Good",
              color:
                "text-yellow-600 border-gray-200 hover:bg-yellow-100 active:border-yellow-500",
            },
            {
              label: "Easy",
              color:
                "text-green-600 border-gray-200 hover:bg-green-100 active:border-green-500",
            },
          ].map(({ label, color }, idx) => (
            <button
              key={idx}
              className={`flex-1 min-w-0 px-2 py-1 text-sm font-medium rounded-md border transition-colors duration-150 ${color} hover:cursor-pointer focus:outline-none focus:ring-0 focus-visible:ring-0`}
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
        {/* REVIEW: The rating buttons do not have any onClick logic.
            SUGGESTION: Implement handlers to record the user's rating and update storage. */}
      </div>

      {/* Upcoming */}
      <div className="space-y-2">
        <div className="font-medium">Upcoming</div>
        {upcoming.length > 0 ? (
          <>
            {upcoming.slice(0, 3).map((problem) => (
              <ProblemButton
                key={problem.id}
                title={problem.title}
                link={problem.link}
              />
            ))}
          </>
        ) : (
          <div className="text-gray-500">No upcoming problems</div>
        )}
      </div>
    </div>
  );
};

export default OverviewScreen;

/* chrome.storage.local.get(["problems", "dueProblems"], (result) => {
  console.log("Stored data:", result);

  // If you want to log each individually:
  console.log("problems:", result.problems);
  console.log("dueProblems:", result.dueProblems);
}); */
