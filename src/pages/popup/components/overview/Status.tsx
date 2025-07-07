import {
  calculateCircumference,
  calculateProgressPercentage,
  calculateStrokeDasharray,
} from "@/utils/statusUtils";
import clsx from "clsx";
import { useState } from "react";

interface StatusProps {
  dueIds: Set<string>;
  solvedIds: Set<string>;
}

const Status = ({ dueIds, solvedIds }: StatusProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const numDueProblems = dueIds.size;
  const numSolvedProblems = solvedIds.size;
  const progress = calculateProgressPercentage(
    numSolvedProblems,
    numDueProblems,
  );
  const radius = 55;
  const strokeWidth = 10;

  const circumfercence = calculateCircumference(radius);
  const [dash, circumference] = calculateStrokeDasharray(
    numSolvedProblems,
    numDueProblems,
    circumfercence,
  );

  const svgSize = (radius + strokeWidth / 2) * 2;
  const center = svgSize / 2; // Center point for circles and text

  if (numDueProblems === 0 || numSolvedProblems === numDueProblems) {
    return (
      <div className="text-center space-y-2 relative flex flex-col items-center justify-center">
        <div className="text-3xl">🎉</div>
        <div className="font-semibold text-sm">You're all done for today!</div>
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
            ⭐ Use the <strong>LeetCall extension</strong> on any problem page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <svg
      width={svgSize}
      height={svgSize}
      className="block cursor-default"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="img"
    >
      <g transform={`rotate(-90 ${center} ${center})`}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#2563eb"
          strokeWidth={strokeWidth}
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
        className={clsx(
          "font-semibold text-xl transition-opacity duration-300 ease-in-out",
          isHovered ? "opacity-0 fill-gray-800" : "opacity-100 fill-gray-800",
        )}
        aria-live="polite"
      >
        {numSolvedProblems}/{numDueProblems}
      </text>
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        className={clsx(
          "font-semibold text-xl transition-opacity duration-300 ease-in-out",
          isHovered ? "opacity-100 fill-gray-800" : "opacity-0 fill-gray-800",
        )}
        aria-live="polite"
      >
        {progress}%
      </text>
    </svg>
  );
};

export default Status;
