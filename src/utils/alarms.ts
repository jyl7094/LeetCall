import { getNextMidnightTime } from "@/utils/time";

export const setupDailyAlarm = () => {
  chrome.alarms.create("dailyUpdate", {
    when: getNextMidnightTime(),
    periodInMinutes: 24 * 60,
  });
};
