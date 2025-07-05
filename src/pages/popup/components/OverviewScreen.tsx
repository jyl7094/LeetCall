import { useUrlChange } from "@/hooks/useUrlChange";
import ProblemButton from "@/pages/popup/components/ProblemButton";
import type { Problem } from "@/types/problem";
import { useCallback, useEffect, useState } from "react";

const OverviewScreen = () => {
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [solvedProblems, setSolvedProblems] = useState<Set<string>>(new Set());
  const [problemsList, setProblemsList] = useState<Problem[]>([]);
  const [problemsMap, setProblemsMap] = useState<Map<string, Problem>>(
    new Map(),
  );
  const url = useUrlChange();

  const fetchDueProblems = useCallback(() => {
    chrome.storage.local.get(["dueProblems"], (result) => {
      const dueProblems: Problem[] = result.dueProblems || [];

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const startOfTodayMs = startOfToday.getTime();

      const solved = new Set<string>();
      const map = new Map<string, Problem>();

      for (const p of dueProblems) {
        if (p.reviewLog.some((ts) => ts >= startOfTodayMs)) {
          solved.add(p.id);
        }
        map.set(p.link, p);
      }

      const sorted = [...dueProblems].sort((a, b) => a.dueAt! - b.dueAt!);
      setProblemsList(sorted);
      setProblemsMap(map);
      setSolvedProblems(solved);
    });
  }, []);

  const handleStorageChange = useCallback(
    (changes: Record<string, chrome.storage.StorageChange>, area: string) => {
      if (area === "local" && changes.dueProblems) {
        fetchDueProblems();
      }
    },
    [fetchDueProblems],
  );

  const extractProblemFromTab = (callback: (p: Problem | null) => void) => {
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
            console.error("Script injection failed:", chrome.runtime.lastError);
            callback(null);
            return;
          }

          const result = injectionResults?.[0]?.result;
          if (
            result &&
            typeof result.id === "string" &&
            typeof result.title === "string" &&
            typeof result.link === "string"
          ) {
            callback({
              ...result,
              reviewLog: [],
              addedAt: undefined,
              dueAt: undefined,
              stability: undefined,
              difficulty: undefined,
              confidence: undefined,
            });
          } else {
            callback(null);
          }
        },
      );
    });
  };

  useEffect(() => {
    fetchDueProblems();
    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, [fetchDueProblems, handleStorageChange]);

  useEffect(() => {
    if (problemsList.length === 0) {
      setCurrentProblem(null);
      return;
    }

    const problemFromMap = problemsMap.get(url);
    if (problemFromMap) {
      setCurrentProblem(problemFromMap);
    } else {
      extractProblemFromTab((result) => setCurrentProblem(result));
    }
  }, [url, problemsList, problemsMap]);

  const handleRate = (confidence: number) => {
    if (!currentProblem) return;

    const now = Date.now();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMs = today.getTime();
    const Rd = 0.9;

    const W = [
      0.212, 1.2931, 2.3065, 8.2956, 6.4133, 0.8334, 3.0194, 0.001, 1.8722,
      0.1666, 0.796, 1.4835, 0.0614, 0.2629, 1.6483, 0.6014, 1.8729, 0.5425,
      0.0912,
    ];

    chrome.storage.local.get(["problems", "dueProblems"], (result) => {
      const problems: Problem[] = result.problems || [];
      const dueProblems: Problem[] = result.dueProblems || [];

      let found = false;
      let updatedProblem: Problem | undefined = undefined;

      const updatedProblems = problems.map((p) => {
        if (p.id !== currentProblem.id) return p;
        found = true;

        const lastReview = p.reviewLog[p.reviewLog.length - 1] ?? p.addedAt;
        const elapsedDays = (now - lastReview) / (1000 * 60 * 60 * 24);
        const R = Math.exp(-elapsedDays / (p.stability || 1));

        let newStability: number;
        let newDifficulty: number;
        let interval: number;

        if (p.reviewLog.length === 0) {
          const S0 = W[confidence - 1];
          let D0 = W[4];

          if (confidence === 2) D0 += W[5];
          else if (confidence === 3) D0 += W[6];
          else if (confidence === 4) D0 += W[7];
          else D0 += W[8];

          newStability = S0;
          newDifficulty = D0;
          interval = 1;
        } else {
          const oldS = p.stability!;
          const oldD = p.difficulty!;

          if (confidence === 1) {
            newDifficulty = oldD + W[8];
            newStability =
              oldS *
              (W[9] *
                Math.pow(newDifficulty, W[10]) *
                Math.pow(oldS, W[11]) *
                Math.exp(W[12] * (1 - R)));
          } else {
            let dDelta = 0;
            if (confidence === 2) dDelta = W[5];
            if (confidence === 3) dDelta = W[6];
            if (confidence === 4) dDelta = W[7];

            newDifficulty = oldD + dDelta;
            newStability =
              oldS *
              (W[13] *
                Math.pow(newDifficulty, -W[14]) *
                Math.pow(oldS, W[15]) *
                Math.exp(W[16] * (1 - R)));
          }

          interval = newStability * ((Math.pow(Rd, 1 / W[17]) - 1) / W[18]);
          interval = Math.max(1, Math.round(interval));
        }

        updatedProblem = {
          ...p,
          stability: newStability,
          difficulty: newDifficulty,
          confidence,
          reviewLog: [...p.reviewLog, now],
          dueAt: todayMs + interval * 86400000,
        };

        return updatedProblem;
      });

      if (!found) {
        const S0 = W[confidence - 1];
        let D0 = W[4];

        if (confidence === 2) D0 += W[5];
        else if (confidence === 3) D0 += W[6];
        else if (confidence === 4) D0 += W[7];
        else D0 += W[8];

        const interval = S0 * ((Math.pow(Rd, 1 / W[17]) - 1) / W[18]);
        const newInterval = Math.max(1, Math.round(interval));

        updatedProblem = {
          ...currentProblem,
          addedAt: now,
          reviewLog: [now],
          stability: S0,
          difficulty: D0,
          confidence,
          dueAt: todayMs + newInterval * 86400000,
        };

        updatedProblems.push(updatedProblem);
      }

      const sorted = [...dueProblems].sort((a, b) => a.dueAt! - b.dueAt!);
      if (updatedProblem) {
        const inDue = dueProblems.some((p) => p.id === updatedProblem!.id);
        const updatedDue = inDue
          ? dueProblems.map((p) =>
              p.id === updatedProblem!.id ? updatedProblem! : p,
            )
          : [...dueProblems, updatedProblem!];

        setProblemsList(sorted);
        setProblemsMap(new Map(sorted.map((p) => [p.link, p])));
        setSolvedProblems((prev) => {
          const newSet = new Set(prev);
          newSet.add(updatedProblem!.id);
          return newSet;
        });

        chrome.storage.local.set({
          problems: updatedProblems,
          dueProblems: updatedDue,
        });
      }
    });
  };

  const renderStatus = () => {
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
          <div className="font-semibold text-sm">
            You're all done for today!
          </div>
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
              ⭐ Use the <strong>LeetCall extension</strong> on any problem
              page.
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

  const renderCurrentProblem = () => (
    <div className="space-y-2">
      <div className="font-medium">Current Problem</div>
      {currentProblem ? (
        <div className="border border-gray-200 rounded-lg text-xs px-3 py-2.5 inline-flex items-center justify-between w-full text-left">
          {currentProblem.title}
          {solvedProblems.has(currentProblem.id) && (
            <div className="text-emerald-600 font-medium">Completed</div>
          )}
        </div>
      ) : (
        <div className="text-gray-500">No active problem</div>
      )}
    </div>
  );

  const renderRatingButtons = () => {
    const disabled = !currentProblem || solvedProblems.has(currentProblem.id);
    return (
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
              value: 1,
              color: {
                text: "text-gray-500",
                border: "border-gray-200",
                hover: "hover:bg-gray-200 active:border-gray-500",
              },
            },
            {
              label: "Hard",
              value: 2,
              color: {
                text: "text-red-500",
                border: "border-gray-200",
                hover: "hover:bg-red-100 active:border-red-500",
              },
            },
            {
              label: "Good",
              value: 3,
              color: {
                text: "text-yellow-600",
                border: "border-gray-200",
                hover: "hover:bg-yellow-100 active:border-yellow-500",
              },
            },
            {
              label: "Easy",
              value: 4,
              color: {
                text: "text-green-600",
                border: "border-gray-200",
                hover: "hover:bg-green-100 active:border-green-500",
              },
            },
          ].map(({ label, value, color }, idx) => (
            <button
              key={idx}
              onClick={() => handleRate(value)}
              disabled={disabled}
              className={`
      flex-1 min-w-0 px-2 py-1 text-sm font-medium rounded-md border
      transition-colors duration-150
      ${color.text} ${color.border}
      ${disabled ? "opacity-40" : `${color.hover} hover:cursor-pointer`}
      max-w-[80px] tracking-normal focus:outline-none focus:ring-0 focus-visible:ring-0
    `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderUpcoming = () => {
    const currentId = currentProblem?.id;
    const upcoming = problemsList
      .filter((p) => !solvedProblems.has(p.id) && p.id !== currentId)
      .slice(0, 3);

    return (
      <div className="space-y-2">
        <div className="font-medium">Upcoming</div>
        {upcoming.length > 0 ? (
          upcoming.map((problem) => (
            <ProblemButton
              key={problem.id}
              title={problem.title}
              link={problem.link}
            />
          ))
        ) : (
          <div className="text-gray-500">No upcoming problems</div>
        )}
      </div>
    );
  };

  return (
    <div className="px-1 pt-4 pb-2 space-y-4">
      <div className="flex items-center justify-center border-b pb-4 border-0 border-gray-200">
        {renderStatus()}
      </div>
      {renderCurrentProblem()}
      {renderRatingButtons()}
      {renderUpcoming()}
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
