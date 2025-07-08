/**
 * Calculates the Unix timestamp (milliseconds since epoch) for the very beginning of the next day (midnight).
 * This effectively represents the "end of today" as 23:59:59.999... today, or 00:00:00.000 tomorrow.
 * It's useful for setting deadlines or scheduling events that occur at the turn of the day.
 *
 * @returns {number} The Unix timestamp (in milliseconds) of 00:00:00.000 on the day following the current date.
 */
export const getEndOfTodayTimestamp = (): number => {
  const today = new Date();
  const endOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1, // Tomorrow
    0,
    0,
    0,
    0,
  );
  return endOfToday.getTime();
};

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
