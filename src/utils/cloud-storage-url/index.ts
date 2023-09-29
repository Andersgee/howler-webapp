import { cloudStorageUrlSchema } from "./schema";

type P = {
  eventId: number;
  userId: number;
};

export async function getUploadCloudStoragSignedUrl({ eventId, userId }: P) {
  try {
    const url = `${process.env.DATABASE_HTTP_URL}/generateV4UploadSignedUrl`;
    const { googleCloudStorageSignedUrl } = cloudStorageUrlSchema.parse(
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.DATABASE_HTTP_AUTH_HEADER,
        },
        body: JSON.stringify({ eventId, userId }),
      }).then((r) => r.json())
    );

    return googleCloudStorageSignedUrl;
  } catch (error) {
    return null;
  }
}
