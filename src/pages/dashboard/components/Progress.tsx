import { useProblems } from "@/hooks/useProblems";

const Progress = () => {
  const { dueIds, solvedIds } = useProblems();

  const solvedCount = solvedIds.size;
  const dueCount = dueIds.size;
  const progress =
    dueCount === 0 ? 0 : Math.round((solvedCount / dueCount) * 100);

  return (
    <div className="p-6 h-1/3 flex flex-col justify-center items-center">
      <h2 className="text-xl font-semibold mb-2">Today's Progress</h2>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-green-500 h-4 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="mt-2 text-sm text-gray-700">
        {solvedCount} of {dueCount} problems solved ({progress}%)
      </p>
    </div>
  );
};

export default Progress;
