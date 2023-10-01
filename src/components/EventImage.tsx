import Image from "next/image";

type Props = {
  src: string;
  alt: string;
};

export function EventImage({ src, alt }: Props) {
  return (
    <div className="relative mt-2 h-48 w-48">
      <Image src={src} alt={alt} sizes="192px" fill className="object-cover" />
    </div>
  );
}
