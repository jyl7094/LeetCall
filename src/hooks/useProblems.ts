import type { Problem } from "@/types/problem";
import { useCallback, useEffect, useState } from "react";

export const useProblems = () => {
  // 1. Master list of ALL problems, stored as a Map for O(1) lookup by ID.
  const [problemMap, setProblemMap] = useState<Map<string, Problem>>(new Map());

  // 2. IDs of problems that the background script has marked as "due" for TODAY.
  //    These come from the 'dueProblems' chrome.storage key.
  const [dueIds, setDueIds] = useState<Set<string>>(new Set());

  // 3. IDs of problems that have been marked as "solved" by the user TODAY.
  //    These come from the 'solvedProblems' chrome.storage key (which is cleared daily).
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());

  // 4. Loading state to inform UI that data is being fetched.
  const [isLoading, setIsLoading] = useState(true);

  // ... (rest of the hook logic will go here)
  const fetchAllRelevantStorageData = useCallback(() => {
    setIsLoading(true); // Start loading

    // Fetch all three keys simultaneously
    chrome.storage.local.get(
      ["problems", "dueProblems", "solvedProblems"],
      (result) => {
        // Process the 'problems' (master list) into a Map
        const problemsArray: Problem[] = result.problems || [];
        const newAllProblemsMap = new Map<string, Problem>();
        problemsArray.forEach((p) => newAllProblemsMap.set(p.id, p));
        setProblemMap(newAllProblemsMap);

        // Process 'dueProblems' into a Set of IDs
        const dueProblemsArray: Problem[] = result.dueProblems || [];
        const newCurrentDayDueProblemIds = new Set<string>(
          dueProblemsArray.map((p) => p.id),
        );
        setDueIds(newCurrentDayDueProblemIds);

        // Process 'solvedProblems' into a Set of IDs
        // ASSUMPTION: 'solvedProblems' storage key contains an array of Problem objects,
        // and we just need their IDs for the Set. Adjust if it's already an array of string IDs.
        const solvedProblemsArray: Problem[] = result.solvedProblems || [];
        const newCurrentDaySolvedProblemIds = new Set<string>(
          solvedProblemsArray.map((p) => p.id),
        );
        setSolvedIds(newCurrentDaySolvedProblemIds);

        setIsLoading(false); // End loading
      },
    );
  }, []);

  const handleStorageChange = useCallback(
    (changes: Record<string, chrome.storage.StorageChange>, area: string) => {
      if (area === "local") {
        // If any of the relevant storage keys change, re-fetch all data
        if (changes.problems || changes.dueProblems || changes.solvedProblems) {
          fetchAllRelevantStorageData();
        }
      }
    },
    [fetchAllRelevantStorageData], // Dependency: ensures the callback is stable
  );

  // Effect to perform initial data fetch and set up the listener
  useEffect(() => {
    fetchAllRelevantStorageData(); // Initial data load when hook mounts
    chrome.storage.onChanged.addListener(handleStorageChange);

    // Cleanup: remove the listener when the component (or hook) unmounts
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, [fetchAllRelevantStorageData, handleStorageChange]);
};
