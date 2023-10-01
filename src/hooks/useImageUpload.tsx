"use client";

import { useCallback, useState } from "react";
import { api } from "#src/hooks/api";

/*
1. check file type and size
2. get signed url
3. PUT it to bucket
4. return image url
*/

const MAX_SIZE_BYTES = 10000000;

type Input = {
  eventId: number;
};

type Options = {
  onSuccess?: ({ imageUrl }: { imageUrl: string }) => void;
  onError?: (msg: string) => void;
};

export function useImageUpload(input: Input, options?: Options) {
  const { mutateAsync: getSignedUrl } = api.gcs.signedUrl.useMutation();
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!(file.type === "image/png" || file.type === "image/jpeg")) {
        options?.onError?.("Only jpeg or png images please.");
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        options?.onError?.("Only images smaller than 10MB please.");
        return;
      }

      setIsUploading(true);
      const gcs = await getSignedUrl({ eventId: input.eventId, contentType: file.type });
      if (!gcs) {
        options?.onError?.("Something went wrong. Try again.");
        return;
      }

      const res = await fetch(gcs.signedUploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (res.ok) {
        options?.onSuccess?.({ imageUrl: gcs.imageUrl });
      } else {
        options?.onError?.("Something went wrong. Try again.");
      }

      setIsUploading(false);
    },
    [input, options, getSignedUrl]
  );

  return { uploadFile, isUploading };
}
