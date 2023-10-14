export async function requestNotificationPermission() {
  if (!("Notification" in window)) return false;

  if ("Notification" in window && Notification.permission === "denied") {
    alert(
      "Notifications are blocked. Please open your browser preferences or click the lock near the address bar to change your notification preferences."
    );
    return false;
  }

  if ("Notification" in window && Notification.permission === "granted") return true;

  const permission = await Notification.requestPermission();
  if (permission === "granted") return true;
  return false;
}

export function notificationsAlreadyGranted() {
  if ("Notification" in window && Notification.permission === "granted") return true;
  return false;
}
