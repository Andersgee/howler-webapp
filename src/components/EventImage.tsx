import Image from "next/image";
import { imageSizes } from "#src/utils/image-sizes";

type Props = {
  src: string;
  alt: string;
};

export function EventImage({ src, alt }: Props) {
  return (
    <div className="relative h-64 w-64 md:h-96 md:w-96">
      <Image src={src} alt={alt} sizes={imageSizes({ w: 64, md: 96 })} fill priority className="object-cover" />
    </div>
  );
}
