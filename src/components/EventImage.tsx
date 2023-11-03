import Image from "next/image";
//import { imagePlaceholder } from "#src/utils/image-shimmer";
import { imageSizes } from "#src/utils/image-sizes";

type Props = {
  src: string;
  aspectRatio: number;
  alt: string;
};

export function EventImage({ src, alt, aspectRatio }: Props) {
  //const h256 = Math.round(256 / aspectRatio);
  //const h384 = Math.round(384 / aspectRatio);

  //x doesnt matter, only for aspect ratio: https://nextjs.org/docs/app/api-reference/components/image#responsive-image-with-aspect-ratio
  //const x = 256
  const x = 256;
  return (
    <Image
      src={src}
      alt={alt}
      quality={100}
      priority
      sizes={imageSizes("w-64", { sm: "w-96" })}
      className="h-auto w-64 sm:w-96"
      width={x}
      height={Math.round(x / aspectRatio)}
      //placeholder={imagePlaceholder(256, h256)}
    />
  );
}
/*
return (
    //<div className={cn("relative w-64 sm:w-96", `h-[${h64}px] sm:h-[${h96}px]`)}>

    <>
      <Image
        src={src}
        alt={alt}
        quality={100}
        sizes={imageSizes("w-64")}
        className="block sm:hidden"
        width={256}
        height={h256}
        placeholder={imagePlaceholder(256, h256)}
      />
      <Image
        src={src}
        alt={alt}
        quality={100}
        sizes={imageSizes("w-96")}
        className="hidden sm:block"
        width={384}
        height={h384}
        placeholder={imagePlaceholder(384, h384)}
      />
    </>
  );
  */
