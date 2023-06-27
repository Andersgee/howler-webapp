import Image from "next/image";
import Link from "next/link";
import { hashidFromId } from "#src/utils/hashid";

type ImageProps = {
  src: string;
  alt: string;
};
export function UserImage({ src, alt }: ImageProps) {
  return <Image className="shadow-imageborder m-2 h-8 w-8 rounded-full" src={src} alt={alt} width={48} height={48} />;
}

export function UserImageLarge({ src, alt }: ImageProps) {
  return <Image className="shadow-imageborder h-12 w-12 rounded-full" src={src} alt={alt} width={48} height={48} />;
}

type LinkProps = {
  userId: number;
  src: string;
  alt: string;
};

export function LinkUserImage({ userId, src, alt }: LinkProps) {
  return (
    <Link href={`/u/${hashidFromId(userId)}`}>
      <UserImage src={src} alt={alt} />
    </Link>
  );
}

export function LinkUserImageLarge({ userId, src, alt }: LinkProps) {
  return (
    <Link href={`/u/${hashidFromId(userId)}`}>
      <UserImageLarge src={src} alt={alt} />
    </Link>
  );
}
