import Image from "next/image";

type Props = {
  src: string;
  alt: string;
};

export function EventImage({ src, alt }: Props) {
  return (
    <div className="relative h-64 w-64">
      <Image src={src} alt={alt} sizes="256px" fill priority className="object-cover" />
    </div>
  );
}
