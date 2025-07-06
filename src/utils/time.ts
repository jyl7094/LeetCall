/**
 * Calculates the Unix timestamp (milliseconds since epoch) for the next midnight.
 * This is useful for scheduling tasks or setting due dates that align with the start of the next day.
 *
 * @returns {number} The Unix timestamp (in milliseconds) of the upcoming midnight (00:00:00 of the next day).
 */
export const getNextMidnightTime = () => {
  const now = new Date();
  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1, // Advance to the next day
    0, // Set hours to 0 (midnight)
    0, // Set minutes to 0
    0, // Set seconds to 0
    0, // Set milliseconds to 0
  );
  return nextMidnight.getTime(); // Return the timestamp
};
