export const setupSettings = async () => {
  const { settings } = await chrome.storage.local.get("settings");

  if (!settings || typeof settings.sendNotifications !== "boolean") {
    await chrome.storage.local.set({
      settings: {
        sendNotifications: true,
      },
    });
  }
};

export const getSettings = async (): Promise<{
  sendNotifications: boolean;
}> => {
  return new Promise((resolve) => {
    chrome.storage.local.get("settings", ({ settings }) => {
      resolve(settings || { sendNotifications: true });
    });
  });
};

export const setSettings = async (settings: {
  sendNotifications: boolean;
}): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.set({ settings }, () => {
      resolve();
    });
  });
};
