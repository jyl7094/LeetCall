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
