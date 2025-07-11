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

export const setBadge = () => {
  chrome.action.setBadgeText({ text: "DUE" });
  chrome.action.setBadgeBackgroundColor({ color: "#3c9eed" });
};

export const clearBadge = () => {
  chrome.action.setBadgeText({ text: "" });
};
