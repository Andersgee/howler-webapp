"use client";

import Image from "next/image";
import { useState } from "react";
import { api } from "#src/hooks/api";

// https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
const fileTypes = [
  "image/apng",
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/pjpeg",
  "image/png",
  "image/svg+xml",
  "image/tiff",
  "image/webp",
  "image/x-icon",
];

//https://storage.googleapis.com/howler-event-images/1-1.png

export default function Page() {
  const { mutateAsync: getSignedUrls } = api.gcs.signedUrls.useMutation();
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
    const { imageUrl, signedUrls } = await getSignedUrls({ eventId: 2 });
    if (!signedUrls) {
      console.log("no signedUrls");
      setIsUploading(false);
      return;
    }

    if (file.type === "image/png") {
      const res = await fetch(signedUrls.signedUrlPng, {
        method: "PUT",
        headers: {
          //"Content-Type": "application/octet-stream",
          "Content-Type": "image/png",
        },
        body: file,
      });
      if (res.ok) {
        setImgSrc(imageUrl);
      }
    } else if (file.type === "image/jpeg") {
      const res = await fetch(signedUrls.signedUrlJpeg, {
        method: "PUT",
        headers: {
          //"Content-Type": "application/octet-stream",
          "Content-Type": "image/jpeg",
        },
        body: file,
      });
      if (res.ok) {
        setImgSrc(imageUrl);
      }
    }
    setIsUploading(false);
  };

  return (
    <div>
      {isUploading && <div>is uploading</div>}
      <div>img:</div>
      {imgSrc && <img className="h-24 w-24" src={imgSrc} alt="img-some-event" />}
      <div>Image:</div>
      {imgSrc && <Image src={imgSrc} alt="nextimg-some-event" width={96} height={96} />}
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
