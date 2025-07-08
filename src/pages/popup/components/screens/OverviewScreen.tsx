import { ratingButtons } from "@/constants/ratingButtons";
import { useProblems } from "@/hooks/useProblems";
import { useUrlChange } from "@/hooks/useUrlChange";
import CurrentProblemViewer from "@/pages/popup/components/overview/CurrentProblemViewer";
import ProblemButton from "@/pages/popup/components/overview/ProblemButton";
import RatingButton from "@/pages/popup/components/overview/RatingButton";
import Status from "@/pages/popup/components/overview/Status";
import type { Problem } from "@/types/problem";
import { calculateFsrsParams } from "@/utils/fsrs";
import { parseLeetCodeProblem } from "@/utils/parseLeetCodeProblem";
import { useEffect, useMemo, useState } from "react";

const OverviewScreen = () => {
  const {
    problemMap,
    dueIds,
    solvedIds,
    dueProblemsArray,
    updateProblemsAfterRating,
  } = useProblems();
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [isRatingDisabled, setIsRatingDisabled] = useState(true);
  const url = useUrlChange();
  const filteredDueProblems = useMemo(() => {
    const filtered = dueProblemsArray.filter((problem) => {
      if (solvedIds.has(problem.id)) {
        return false;
      }

      if (currentProblem && problem.id === currentProblem.id) {
        return false;
      }

      return true;
    });

    return filtered.slice(0, 3);
  }, [dueProblemsArray, solvedIds, currentProblem]);

  const handleRate = async (confidence: number) => {
    if (!currentProblem || solvedIds.has(currentProblem.id)) return;
    const now = new Date();
    const localNow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds(),
    ).getTime();
    const problemToUpdate = {
      ...currentProblem,
      addedAt: currentProblem.addedAt ? currentProblem.addedAt : localNow,
    };
    const updatedProblem = calculateFsrsParams(
      problemToUpdate,
      confidence,
      localNow,
    );
    updateProblemsAfterRating(updatedProblem);
  };

  useEffect(() => {
    if (!url.startsWith("https://leetcode.com/problems/")) {
      setCurrentProblem(null);
      return;
    }

    const fetchProblem = async () => {
      try {
        const parsedProblem = await parseLeetCodeProblem();
        if (parsedProblem) {
          const existingProblem = problemMap.get(parsedProblem.id);
          if (existingProblem) {
            setCurrentProblem(existingProblem);
          } else {
            setCurrentProblem(parsedProblem);
          }
        } else {
          setCurrentProblem(null);
        }
      } catch {
        setCurrentProblem(null);
      }
    };

    fetchProblem();
  }, [url, problemMap]);

  useEffect(() => {
    if (!currentProblem) {
      setIsRatingDisabled(true);
      return;
    }
    const isSolved = solvedIds.has(currentProblem.id);
    setIsRatingDisabled(isSolved);
  }, [currentProblem, solvedIds]);

  return (
    <div className="px-1 pt-4 pb-2 space-y-4">
      <div className="flex items-center justify-center border-b pb-4 border-0 border-gray-200">
        <Status dueIds={dueIds} solvedIds={solvedIds} />
      </div>
      <CurrentProblemViewer
        currentProblem={currentProblem}
        solvedIds={solvedIds}
      />
      <div className="space-y-2">
        <div className="flex items-center gap-1">
          <span className="font-medium">Rate Your Confidence</span>
          <div className="relative">
            <span className="group cursor-default text-gray-400 hover:text-gray-600">
              &#9432;
              <div className="absolute left-1/2 top-full mt-1 w-64 -translate-x-1/2 rounded-md bg-gray-50 text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 shadow-sm border border-gray-200 pointer-events-none">
                Rating marks the problem complete. If new, it’ll be added to
                your deck.
              </div>
            </span>
          </div>
        </div>
        <div className="flex justify-between gap-2">
          {ratingButtons.map(({ label, value, color }, idx) => (
            <RatingButton
              key={idx}
              label={label}
              value={value}
              color={color}
              disabled={isRatingDisabled}
              handleRate={handleRate}
            />
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <div className="font-medium">Upcoming</div>
        {filteredDueProblems.length > 0 ? (
          filteredDueProblems.map((problem) => (
            <ProblemButton
              key={problem.id}
              title={problem.title}
              link={problem.link}
            />
          ))
        ) : (
          <div className="text-gray-500 mb-2">No upcoming problems</div>
        )}
      </div>
    </div>
  );
};

export default OverviewScreen;

/* chrome.storage.local.get(["problems", "dueProblems", "solvedProblems"], (result) => {
  console.log("Stored data:", result);

  // If you want to log each individually:
  console.log("problems:", result.problems);
  console.log("dueProblems:", result.dueProblems);
  console.log("solvedProblems:", result.solvedProblems);
}); */
