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
  chrome.action.setBadgeTextColor({ color: "#f3f4f6" });
  chrome.action.setBadgeBackgroundColor({ color: "#e17015" });
};

export const clearBadge = () => {
  chrome.action.setBadgeText({ text: "" });
};

export const updateNotification = (count: number) => {
  if (count > 0) {
    setNotification(count);
    setBadge();
  } else {
    clearBadge();
  }
};
