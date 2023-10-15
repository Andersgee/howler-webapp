"use client";

import { api } from "#src/hooks/api";
import { useImageUpload } from "#src/hooks/useImageUpload";
import { InputFileButton } from "../buttons/InputFileButton";
import { IconImage, IconLoadingSpinner } from "../Icons";
import { buttonStylesSecondary } from "../ui/Button";

type Props = {
  eventId: number;
};

export function ImageUploadButton({ eventId }: Props) {
  const apiContext = api.useContext();
  const { mutate: updateImage } = api.event.updateImage.useMutation();
  const { uploadFile, isUploading: imageIsUploading } = useImageUpload(
    { eventId },
    {
      onSuccess: ({ imageUrl }) => {
        //optimistic
        apiContext.event.info.setData({ eventId }, (prev) => {
          if (!prev) return prev;
          const data = structuredClone(prev); //dont mutate prev
          return { ...data, image: imageUrl };
        });
        //update db
        updateImage({ eventId, image: imageUrl });
      },
    }
  );

  return (
    <InputFileButton
      disabled={imageIsUploading}
      accept="image/png, image/jpeg"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          uploadFile(file);
        }
      }}
      className={buttonStylesSecondary}
    >
      {imageIsUploading ? (
        <>
          <IconLoadingSpinner /> <span className="ml-2">Uploading</span>
        </>
      ) : (
        <>
          <IconImage /> <span className="ml-2">Select Picture...</span>
        </>
      )}
    </InputFileButton>
  );
}
