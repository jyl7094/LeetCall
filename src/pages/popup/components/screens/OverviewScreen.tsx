import { useProblems } from "@/hooks/useProblems";
import { useUrlChange } from "@/hooks/useUrlChange";
// import type { Problem } from "@/types/problem";
// import { useState } from "react";

const OverviewScreen = () => {
  const {
    problemMap,
    dueIds,
    solvedIds, // Renamed for clarity
  } = useProblems();
  // const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);

  const url = useUrlChange();
  console.log(url, problemMap, dueIds, solvedIds);
  // Derived states:
  // const isCurrentProblemSolved = currentProblem
  //   ? solvedIds.has(currentProblem.id)
  //   : false;
  // const disabledRating = !currentProblem || isCurrentProblemSolved;

  // const upcoming = problemMap
  // .filter((p) => !solvedProblems.has(p.id) && p.id !== currentProblem?.id)
  // .slice(0, 3);

  // useEffect(() => {
  //   if (loading) return; // Wait for problems data to load

  //   if (problemsList.length === 0) {
  //     setCurrentProblem(null);
  //     return;
  //   }

  //   const problemInMap = problemsMap.get(url);

  //   if (problemInMap) {
  //     // If found in our stored problems, set it as the current problem
  //     setCurrentProblem(problemInMap);
  //   } else {
  //     // If the problem is not in our known list (e.g., first time visiting this URL),
  //     // try to extract its details from the current tab using `parseLeetCodeProblem`.
  //     // The `parseLeetCodeProblem` function no longer takes `url` as an argument;
  //     // it gets the URL from the active tab itself.
  //     parseLeetCodeProblem()
  //       .then((parsedProblem) => {
  //         // IMPORTANT VALIDATION:
  //         // After an async operation, it's crucial to check if the context (e.g., `url`)
  //         // is still the same as when the operation was initiated. This prevents
  //         // setting problem data for a URL the user has already navigated away from.
  //         if (parsedProblem && parsedProblem.link === url) {
  //           setCurrentProblem(parsedProblem);
  //         } else {
  //           // If no problem was parsed, or the parsed problem's link doesn't match
  //           // the current `url` state, then there's no relevant problem for this URL.
  //           setCurrentProblem(null);
  //         }
  //       })
  //       .catch((error) => {
  //         // Log any errors during parsing
  //         console.error("Error parsing LeetCode problem from tab:", error);
  //         setCurrentProblem(null); // Clear the current problem on error
  //       });
  //   }
  // }, [url, problemsList, problemsMap, loading]);

  // const handleRate = async (confidence: number) => {
  //   if (!currentProblem || disabledRating) return;

  //   const now = Date.now();
  //   // Use the extracted SM-2 algorithm to get the updated problem
  //   const updatedProblem = calculateFsrsParams(currentProblem, confidence, now);

  //   // Use the addOrUpdateProblem from the hook to persist and update state
  //   await addOrUpdateProblem(updatedProblem);

  //   // No need to manually update local states here, the `useProblemsData` hook's
  //   // storage listener will handle the re-fetch and state update.
  // };

  return (
    <div className="px-1 pt-4 pb-2 space-y-4">
      {/* <div className="flex items-center justify-center border-b pb-4 border-0 border-gray-200">
        <Status problemsList={problemsList} solvedProblems={solvedProblems} />
      </div>
      <CurrentProblemViewer
        currentProblem={currentProblem}
        solvedProblems={solvedProblems}
      />
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
          {ratingButtons.map(({ label, value, color }, idx) => (
            <RatingButton
              key={idx}
              label={label}
              value={value}
              color={color}
              disabled={disabledRating}
              handleRate={handleRate}
            />
          ))}
        </div>
      </div>
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
      </div> */}
    </div>
  );
};

export default OverviewScreen;

/* chrome.storage.local.get(["problems", "dueProblems", "solvedProblems"], (result) => {
  console.log("Stored data:", result);

  // If you want to log each individually:
  console.log("problems:", result.problems);
  console.log("dueProblems:", result.dueProblems);
  console.log("solvedProblems:", result.sovledProblems);
}); */
