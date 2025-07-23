import { ratingButtons } from "@/constants/rating-buttons";
import { useProblems } from "@/hooks/useProblems";

const Table = () => {
  const { problemMap, deleteProblem } = useProblems();

  const problems = Array.from(problemMap.values());
  const getConfidenceLabel = (confidence: number) => {
    const match = ratingButtons.find((r) => r.value === confidence);
    return match ? `${match.label} (${match.value})` : confidence;
  };

  return (
    <div className="p-6 h-2/3 overflow-auto">
      <h2 className="text-xl font-semibold mb-4">All Problems</h2>
      <table className="table-auto w-full text-left text-sm">
        <thead className="text-gray-500 border-b">
          <tr>
            <th className="pb-2">Title</th>
            <th className="pb-2">Added At</th>
            <th className="pb-2">Last Solved</th>
            <th className="pb-2">Confidence</th>
            <th className="pb-2">Next Due</th>
            <th className="pb-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem) => {
            const latestReview =
              problem.reviewLog?.[problem.reviewLog.length - 1];
            return (
              <tr key={problem.id} className="border-b hover:bg-gray-50">
                <td className="py-2 text-blue-600 underline">
                  <a
                    href={problem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {problem.title}
                  </a>
                </td>
                <td className="py-2">
                  {problem.addedAt
                    ? new Date(problem.addedAt).toLocaleDateString()
                    : "-"}
                </td>
                <td className="py-2">
                  {latestReview?.reviewedAt
                    ? new Date(latestReview.reviewedAt).toLocaleDateString()
                    : "-"}
                </td>
                <td className="py-2">
                  {latestReview?.confidence != null
                    ? getConfidenceLabel(latestReview.confidence)
                    : "-"}
                </td>
                <td className="py-2">
                  {problem.dueAt
                    ? new Date(problem.dueAt).toLocaleDateString()
                    : "-"}
                </td>
                <td className="py-2">
                  <button
                    onClick={() => deleteProblem(problem.id)}
                    className="flex-1 min-w-0 px-2 py-1 text-sm font-medium rounded-md border transition-colors duration-150 max-w-[80px] tracking-normal focus:outline-none focus:ring-0 focus-visible:ring-0 hover:cursor-pointer text-red-500 border-gray-200 hover:bg-red-100 active:border-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
