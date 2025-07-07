import type { Problem } from "@/types/problem";

interface CurrentProblemViewerProps {
  currentProblem: Problem | null;
  solvedIds: Set<string>;
}

const CurrentProblemViewer = ({
  currentProblem,
  solvedIds,
}: CurrentProblemViewerProps) => (
  <div className="space-y-2">
    <div className="font-medium">Current Problem</div>
    {currentProblem ? (
      <div className="border border-gray-200 rounded-lg text-xs px-3 py-2.5 inline-flex items-center justify-between w-full text-left">
        {currentProblem.title}
        {solvedIds.has(currentProblem.id) && (
          <div className="text-emerald-600 font-medium">Completed</div>
        )}
      </div>
    ) : (
      <div className="text-gray-500">No active problem</div>
    )}
  </div>
);

export default CurrentProblemViewer;
