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

export function UserImage({ src, alt, className }: ImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={30}
      height={30}
      sizes="30px"
      className={cn("shadow-imageborder h-8 w-8 rounded-full p-[1px]", className)}
    />
  );
}

export function UserImageClickable({ src, alt, className }: ImageProps) {
  return (
    <div className="hover:bg-secondary flex h-12 w-12 items-center justify-center rounded-full">
      <UserImage src={src} alt={alt} className={className} />
    </div>
  );
}

export function UserImageLarge({ src, alt }: ImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={46}
      height={46}
      sizes="46px"
      className="shadow-imageborder h-12 w-12 rounded-full p-[1px]"
    />
  );
}

type LinkProps = {
  userId: number;
  src: string;
  alt: string;
};

export function LinkUserImage({ userId, src, alt }: LinkProps) {
  return (
    <Link href={`/u/${hashidFromId(userId)}`}>
      <UserImageClickable src={src} alt={alt} />
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
