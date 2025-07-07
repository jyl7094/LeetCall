/**
 * Calculates the completion progress percentage.
 * @param solvedCount The number of solved problems.
 * @param totalCount The total number of problems.
 * @returns The progress percentage (0-100), or 100 if totalCount is 0.
 */
export const calculateProgressPercentage = (
  solvedCount: number,
  totalCount: number,
): number => {
  if (totalCount === 0) {
    return 100; // Or 0, depending on desired behavior for empty list
  }
  return Math.round((solvedCount / totalCount) * 100);
};

/**
 * Calculates the circumference of a circle given its radius.
 * @param radius The radius of the circle.
 * @returns The circumference.
 */
export const calculateCircumference = (radius: number): number => {
  return 2 * Math.PI * radius;
};

/**
 * Calculates the stroke-dasharray values for an SVG circle to represent progress.
 * @param solvedCount The number of solved problems.
 * @param totalCount The total number of problems.
 * @param circumference The full circumference of the circle.
 * @returns A tuple [dash, circumference] for strokeDasharray.
 */
export const calculateStrokeDasharray = (
  solvedCount: number,
  totalCount: number,
  circumference: number,
): [number, number] => {
  if (totalCount === 0) return [circumference, 0];

  const percent = solvedCount / totalCount;
  const dash = Math.round(percent * circumference);
  const gap = circumference - dash;
  return [dash, gap];
};
