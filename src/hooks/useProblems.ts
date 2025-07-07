import type { Problem } from "@/types/problem";
import { useCallback, useEffect, useState } from "react";

export const useProblems = () => {
  const [problemMap, setProblemMap] = useState<Map<string, Problem>>(new Map());
  const [dueIds, setDueIds] = useState<Set<string>>(new Set());
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [dueProblemsArray, setDueProblemsArray] = useState<Problem[]>([]);

  const fetchProblems = useCallback(async () => {
    const result = await chrome.storage.local.get([
      "problems",
      "dueProblems",
      "solvedProblems",
    ]);

    const problemsArray: Problem[] = result.problems || [];
    const newProblemMap = new Map(problemsArray.map((p) => [p.id, p]));
    setProblemMap(newProblemMap);

    const dueProblemsArray: Problem[] = result.dueProblems || [];
    setDueProblemsArray(dueProblemsArray);
    setDueIds(new Set(dueProblemsArray.map((p) => p.id)));

    const solvedProblemsArray: Problem[] = result.solvedProblems || [];
    setSolvedIds(new Set(solvedProblemsArray.map((p) => p.id)));
  }, []);

  const handleStorageChange = useCallback(
    (changes: Record<string, chrome.storage.StorageChange>, area: string) => {
      if (area === "local") {
        // If any of the relevant storage keys change, re-fetch all data
        if (changes.problems || changes.dueProblems || changes.solvedProblems) {
          fetchProblems();
        }
      }
    },
    [fetchProblems], // Dependency: ensures the callback is stable
  );

  //todo: implement adding a problem to all three maps

  // Effect to perform initial data fetch and set up the listener
  useEffect(() => {
    fetchProblems(); // Initial data load when hook mounts
    chrome.storage.onChanged.addListener(handleStorageChange);

    // Cleanup: remove the listener when the component (or hook) unmounts
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, [fetchProblems, handleStorageChange]);

  return {
    problemMap,
    dueIds,
    solvedIds,
    dueProblemsArray,
  };
};
