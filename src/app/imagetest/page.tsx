"use client";

import Image from "next/image";

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

async function upload(signedUrl: string, buf: ArrayBuffer) {
  const res = await fetch(signedUrl, {
    method: "PUT",
    headers: {
      //"Content-Type": "application/octet-stream",
      //"Content-Type": "image/jpeg",
      "Content-Type": "image/png",
    },
    body: buf,
  });
  console.log({ res });
  if (res.ok) return true;
  return false;
}

async function getGcsSignedUrl({ eventId }: { eventId: number }) {
  const res = await fetch("/api/gcs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ eventId }),
  });
  if (res.ok) {
    const url = await res.text();
    return url;
  }
  return null;
}

//https://storage.googleapis.com/howler-event-images/1-1.png

export default function Page() {
  return (
    <div>
      <img
        className="h-24 w-24"
        src="https://storage.googleapis.com/howler-event-images/1-1.png"
        alt="img-some-event"
      />
      <Image
        src="https://storage.googleapis.com/howler-event-images/1-1.png"
        alt="nextimg-some-event"
        width={100}
        height={100}
      />
      <div>upload test</div>
      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) {
            console.log("no file");
            return;
          }
          console.log({ file });

          const signedUrl = await getGcsSignedUrl({ eventId: 1 });
          if (!signedUrl) {
            console.log("no signedUrl");
            return;
          }

          const buf = await file.arrayBuffer();
          console.log({ buf });
          if (buf.byteLength > 10000000) {
            //might aswell check size client side aswell
            alert("Size of image too large (max 10MB). Please pick a smaller image.");
            return;
          }

          const success = await upload(signedUrl, buf);

          console.log({ success });
        }}
      />
    </div>
  );
}
