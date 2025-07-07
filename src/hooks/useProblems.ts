import type { Problem } from "@/types/problem";
import { useCallback, useEffect, useRef, useState } from "react";

export const useProblems = () => {
  const [problemMap, setProblemMap] = useState<Map<string, Problem>>(new Map());
  const [dueIds, setDueIds] = useState<Set<string>>(new Set());
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [dueProblemsArray, setDueProblemsArray] = useState<Problem[]>([]);
  const isSelfUpdateRef = useRef(false);

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

    const solvedProblemsArray: string[] = result.solvedProblems || [];
    setSolvedIds(new Set(solvedProblemsArray));
  }, []);

  const handleStorageChange = useCallback(
    (changes: Record<string, chrome.storage.StorageChange>, area: string) => {
      if (
        area === "local" &&
        (changes.problems || changes.dueProblems || changes.solvedProblems)
      ) {
        if (isSelfUpdateRef.current) {
          isSelfUpdateRef.current = false;
          return;
        }
        fetchProblems();
      }
    },
    [fetchProblems], // Dependency: ensures the callback is stable
  );

  const updateProblemsAfterRating = useCallback(
    async (updatedProblem: Problem) => {
      const updatedProblemMap = new Map(problemMap);
      updatedProblemMap.set(updatedProblem.id, updatedProblem);

      const updatedSolvedIds = new Set(solvedIds);
      updatedSolvedIds.add(updatedProblem.id);

      const updatedDueIds = new Set(dueIds);
      updatedDueIds.add(updatedProblem.id);

      const dueProblemExists = dueProblemsArray.some(
        (p) => p.id === updatedProblem.id,
      );

      const updatedDueProblemsArray = dueProblemExists
        ? dueProblemsArray.map((p) =>
            p.id === updatedProblem.id ? updatedProblem : p,
          )
        : [...dueProblemsArray, updatedProblem];

      setProblemMap(updatedProblemMap);
      setSolvedIds(updatedSolvedIds);
      setDueIds(updatedDueIds);
      setDueProblemsArray(updatedDueProblemsArray);

      // Mark self-update to prevent triggering fetchProblems
      isSelfUpdateRef.current = true;

      await chrome.storage.local.set({
        problems: Array.from(updatedProblemMap.values()),
        solvedProblems: Array.from(updatedSolvedIds),
        dueProblems: updatedDueProblemsArray,
      });
    },
    [problemMap, solvedIds, dueIds, dueProblemsArray],
  );

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
    updateProblemsAfterRating,
  };
};
