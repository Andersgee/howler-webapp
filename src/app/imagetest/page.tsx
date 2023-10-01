"use client";

import Image from "next/image";
import { useState } from "react";
import { api } from "#src/hooks/api";

// https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
// next/image only allows jpeg, png, webp and avif?
const imageTypes = [
  "image/jpeg",
  "image/png",
  "image/avif",
  "image/webp",
  //"image/apng",
  //"image/bmp",
  //"image/gif",
  //"image/pjpeg",
  //"image/svg+xml",
  //"image/tiff",
  //"image/x-icon",
];

//https://storage.googleapis.com/howler-event-images/1-1.png

export default function Page() {
  const { mutateAsync: getSignedUrl } = api.gcs.signedUrl.useMutation();
  const [isUploading, setIsUploading] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log("no file");
      return;
    }

    if (!(file.type === "image/png" || file.type === "image/jpeg")) {
      alert("Only jpeg or png images please.");
      return;
    }
    if (file.size > 10000000) {
      alert("Only images smaller than 10MB please.");
      return;
    }

    setIsUploading(true);
    const { imageUrl, signedUrl } = await getSignedUrl({ eventId: 2, contentType: file.type });
    if (!signedUrl) {
      console.log("no signedUrls");
      setIsUploading(false);
      return;
    }

    const res = await fetch(signedUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (res.ok) {
      setImgSrc(imageUrl);
    }
    setIsUploading(false);
  };

  return (
    <div>
      {isUploading && <div>is uploading</div>}
      <div>img:</div>
      {imgSrc && <img className="h-48 w-48" src={imgSrc} alt="img-some-event" />}
      <div>Image:</div>
      {imgSrc && <Image src={imgSrc} alt="nextimg-some-event" width={192} height={192} />}
      <div>upload test</div>
      <input
        type="file"
        disabled={isUploading}
        accept="image/png, image/jpeg"
        onChange={handleChange}
        className="disabled:bg-red-400"
      />
    </div>
  );
}
