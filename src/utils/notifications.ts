export const setNotification = (count: number) => {
  const plural = count === 1 ? "problem" : "problems";
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icon128.png",
    title: "LeetCall",
    message: `You have ${count} ${plural} due for review today.`,
    priority: 1,
  });
};
