import type { Problem } from "@/types/problem";
import { useCallback, useEffect, useState } from "react";

interface ProblemsData {
  problemsList: Problem[];
  solvedProblems: Set<string>;
  problemsMap: Map<string, Problem>;
  loading: boolean;
  addOrUpdateProblem: (problem: Problem) => Promise<void>;
  refreshProblems: () => void;
}

export const useProblems = (): ProblemsData => {
  const [problemsList, setProblemsList] = useState<Problem[]>([]);
  const [solvedProblems, setSolvedProblems] = useState<Set<string>>(new Set());
  const [problemsMap, setProblemsMap] = useState<Map<string, Problem>>(
    new Map(),
  );
  const [loading, setLoading] = useState(true);

  // Helper function to wrap chrome.storage.local.get in a Promise
  const getChromeStorageLocal = useCallback(
    (
      keys: string | string[] | Record<string, unknown> | null,
    ): Promise<Record<string, unknown>> => {
      return new Promise((resolve, reject) => {
        chrome.storage.local.get(keys, (result) => {
          if (chrome.runtime.lastError) {
            console.error(
              "chrome.storage.local.get error:",
              chrome.runtime.lastError,
            );
            return reject(chrome.runtime.lastError);
          }
          resolve(result);
        });
      });
    },
    [],
  );

  // Helper function to wrap chrome.storage.local.set in a Promise
  const setChromeStorageLocal = useCallback(
    (items: Record<string, unknown>): Promise<void> => {
      return new Promise((resolve, reject) => {
        chrome.storage.local.set(items, () => {
          if (chrome.runtime.lastError) {
            console.error(
              "chrome.storage.local.set error:",
              chrome.runtime.lastError,
            );
            return reject(chrome.runtime.lastError);
          }
          resolve();
        });
      });
    },
    [],
  );

  const fetchProblemsFromStorage = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getChromeStorageLocal(["problems"]);
      // Type assertion: Assuming 'problems' key will store an array of Problem objects
      const allProblems: Problem[] =
        (result.problems as Problem[] | undefined) || [];

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const startOfTodayMs = startOfToday.getTime();

      const currentDueProblems: Problem[] = [];
      const solvedToday = new Set<string>();
      const allProblemsMap = new Map<string, Problem>();

      for (const p of allProblems) {
        allProblemsMap.set(p.link, p);

        if (p.dueAt && p.dueAt <= startOfTodayMs) {
          currentDueProblems.push(p);
        }

        if (p.reviewLog.some((entry) => entry.reviewedAt >= startOfTodayMs)) {
          solvedToday.add(p.id);
        }
      }

      const sortedDueProblems = [...currentDueProblems].sort(
        (a, b) => (a.dueAt || 0) - (b.dueAt || 0),
      );

      setProblemsList(sortedDueProblems);
      setProblemsMap(allProblemsMap);
      setSolvedProblems(solvedToday);
    } catch (error) {
      console.error("Error fetching problems from storage:", error);
    } finally {
      setLoading(false);
    }
  }, [getChromeStorageLocal]);

  const addOrUpdateProblem = useCallback(
    async (newProblem: Problem) => {
      try {
        const { problems } = await getChromeStorageLocal(["problems"]);
        const updatedProblems: Problem[] =
          (problems as Problem[] | undefined) || []; // Type assertion here too

        const existingProblemIndex = updatedProblems.findIndex(
          (p) => p.id === newProblem.id,
        );

        if (existingProblemIndex !== -1) {
          updatedProblems[existingProblemIndex] = newProblem;
        } else {
          updatedProblems.push(newProblem);
        }

        await setChromeStorageLocal({ problems: updatedProblems });
      } catch (error) {
        console.error("Error adding/updating problem:", error);
        throw error;
      }
    },
    [getChromeStorageLocal, setChromeStorageLocal],
  );

  useEffect(() => {
    fetchProblemsFromStorage();

    const handleStorageChange = (
      changes: Record<string, chrome.storage.StorageChange>,
      area: string,
    ) => {
      if (area === "local" && changes.problems) {
        fetchProblemsFromStorage();
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, [fetchProblemsFromStorage]);

  return {
    problemsList,
    solvedProblems,
    problemsMap,
    loading,
    addOrUpdateProblem,
    refreshProblems: fetchProblemsFromStorage,
  };
};
