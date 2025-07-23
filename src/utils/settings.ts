export const setupSettings = async () => {
  const result = await new Promise<{
    settings?: { sendNotifications: boolean };
  }>((resolve) => {
    chrome.storage.local.get("settings", (res) => resolve(res));
  });

  const settings = result.settings;

  if (!settings || typeof settings.sendNotifications !== "boolean") {
    await new Promise<void>((resolve) => {
      chrome.storage.local.set({ settings: { sendNotifications: true } }, () =>
        resolve(),
      );
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
