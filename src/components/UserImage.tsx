import Image from "next/image";
import Link from "next/link";
import { hashidFromId } from "src/utils/hashid";

type ImageProps = {
  src: string;
  alt: string;
};
export function UserImage({ src, alt }: ImageProps) {
  return <Image className="h-8 w-8 m-2 rounded-full shadow-imageborder" src={src} alt={alt} width={48} height={48} />;
}

export function UserImageLarge({ src, alt }: ImageProps) {
  return <Image className="h-12 w-12 rounded-full shadow-imageborder" src={src} alt={alt} width={48} height={48} />;
}

type LinkProps = {
  id: number;
  src: string;
  alt: string;
};

export function LinkUserImage({ id, src, alt }: LinkProps) {
  return (
    <Link href={`/profile/${hashidFromId(id)}`}>
      <UserImage src={src} alt={alt} />
    </Link>
  );
}

export function LinkUserImageLarge({ id, src, alt }: LinkProps) {
  return (
    <Link href={`/profile/${hashidFromId(id)}`}>
      <UserImageLarge src={src} alt={alt} />
    </Link>
  );
}
