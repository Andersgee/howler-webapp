import Image from "next/image";
import { imagePlaceholder } from "#src/utils/image-shimmer";
import { imageSizes } from "#src/utils/image-sizes";

type Props = {
  src: string;
  alt: string;
};

export function EventImage({ src, alt }: Props) {
  return (
    <div className="relative h-64 w-64 sm:h-96 sm:w-96">
      <Image
        src={src}
        alt={alt}
        sizes={imageSizes("w-64", { sm: "w-96" })}
        placeholder={imagePlaceholder(256, 256)}
        fill
        priority
        quality={100}
        className="object-contain"
      />
    </div>
  );
}
