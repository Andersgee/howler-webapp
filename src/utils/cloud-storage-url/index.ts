import { signedUrlSchema } from "./schema";

type P = {
  fileName: string;
  contentType: string;
};

export async function getUploadCloudStoragSignedUrl({ fileName, contentType }: P) {
  try {
    const url = `${process.env.DATABASE_HTTP_URL}/signedurl`;
    const data = signedUrlSchema.parse(
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.DATABASE_HTTP_AUTH_HEADER,
        },
        body: JSON.stringify({ fileName, contentType }),
      }).then((r) => r.json())
    );

    return data;
  } catch (error) {
    return null;
  }
}
