export async function postFcmToken(fcmToken: string) {
  const res = await fetch("/api/fcmtoken", {
    method: "POST",
    cache: "no-store",
    body: JSON.stringify({ fcmToken }),
  });
  if (res.status === 200) {
    //saved it to db
    return true;
  }
  return false;
}
