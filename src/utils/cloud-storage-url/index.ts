import { signedUrlsSchema } from "./schema";

type P = {
  fileName: string;
};

export async function getUploadCloudStoragSignedUrl({ fileName }: P) {
  try {
    const url = `${process.env.DATABASE_HTTP_URL}/signedurls`;
    const signedUrls = signedUrlsSchema.parse(
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.DATABASE_HTTP_AUTH_HEADER,
        },
        body: JSON.stringify({ fileName }),
      }).then((r) => r.json())
    );

    return signedUrls;
  } catch (error) {
    return null;
  }
}
