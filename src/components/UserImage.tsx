import Image from "next/image";
import Link from "next/link";
import { cn } from "#src/utils/cn";
import { hashidFromId } from "#src/utils/hashid";

type ImageProps = {
  src: string;
  alt: string;
  clickable?: boolean;
  className?: string;
};

const clickableStyles = "hover:bg-secondary h-12 w-12 p-3";

export function UserImage({ src, alt, clickable, className }: ImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={24}
      height={24}
      sizes="24px"
      className={cn("shadow-imageborder rounded-full", clickable && clickableStyles, className)}
    />
  );
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
