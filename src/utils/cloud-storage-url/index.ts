import { signedUrlSchema } from "./schema";

type Options = {
  fileName: string;
  contentType: string;
};

export async function getUploadCloudStoragSignedUrl({ fileName, contentType }: Options) {
  try {
    const url = `${process.env.DATABASE_HTTP_URL}/signedurl`;
    const data = signedUrlSchema.parse(
      await fetch(url, {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.DATABASE_HTTP_AUTH_HEADER,
        },
        body: JSON.stringify({ fileName, contentType }),
      }).then((res) => res.json())
    );

    return data;
  } catch (error) {
    return null;
  }
}

export async function removeImageFromEventAndCloudStorage({ eventId }: { eventId: number }) {
  try {
    const url = `${process.env.DATABASE_HTTP_URL}/removeimage`;

    const res = await fetch(url, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.DATABASE_HTTP_AUTH_HEADER,
      },
      body: JSON.stringify({ eventId }),
    });
    return res.ok;
  } catch (error) {
    return false;
  }
}
