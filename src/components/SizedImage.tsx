import Image from "next/image";

//matching tailwind sizes:
//  w-               6   8   12  16  24  32   64   96
const IMAGE_SIZES = [24, 32, 48, 64, 96, 128, 256, 384] as const;
const IMAGE_SIZES_TW = [6, 8, 12, 16, 24, 32, 64, 96] as const;

//                       sm   md    lg    xl    2xl   3xl...
const DEVICE_SIZES = [640, 768, 1024, 1280, 1536, 2048] as const;

//the following would be w-[48px] lg:w-[96px] aka w-12 lg:w-24
//<Image sizes="(min-width: 1024px) 96px, 48px"/>

//<SizedImage w={8} lg={12}/>

const D = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xl2: 1536,
};

const S = {
  6: 24,
  8: 32,
  12: 48,
  16: 64,
  24: 96,
  32: 128,
  64: 256,
  96: 384,
} as const;

type Sizes = (typeof IMAGE_SIZES_TW)[number];

type Props = {
  src: string;
  alt: string;
  priority?: boolean;
  w: Sizes;
  sm?: Sizes;
  md?: Sizes;
  lg?: Sizes;
  xl?: Sizes;
  xl2?: Sizes;
};

function makeSizesString(p: Props) {
  const xl2 = p.xl2 ? `(min-width: ${D.xl2}px) ${S[p.xl2]}px, ` : "";
  const xl = p.xl ? `(min-width: ${D.xl}px) ${S[p.xl]}px, ` : "";
  const md = p.md ? `(min-width: ${D.md}px) ${S[p.md]}px, ` : "";
  const sm = p.sm ? `(min-width: ${D.sm}px) ${S[p.sm]}px, ` : "";
  const w = `${p.w}px`;
  return `${xl2}${xl}${md}${sm}${w}`;
}

export function SizedImage(p: Props) {
  const sizes = makeSizesString(p);
  return (
    <div className="relative h-64 w-64">
      <Image src={p.src} alt={p.alt} priority={p.priority} fill className="object-cover" sizes={sizes} />
    </div>
  );
}
