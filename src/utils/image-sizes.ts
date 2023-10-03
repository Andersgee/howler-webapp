/*
tiilwind breakpoints -> DEVICE_SIZES as written in next.config.mjs
also make sure these match the actual tailwind SCREENS in tailwind.config.ts
*/
const SCREENS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xl2: 1536,
} as const;

/** tw width -> pixels as IMAGE_SIZES written in next.config.mjs */
const SIZES = {
  6: 24,
  8: 32,
  12: 48,
  16: 64,
  24: 96,
  32: 128,
  64: 256,
  96: 384,
} as const;

type TailwindSize = keyof typeof SIZES;

type Options = {
  w: TailwindSize;
  sm?: TailwindSize;
  md?: TailwindSize;
  lg?: TailwindSize;
  xl?: TailwindSize;
  xl2?: TailwindSize;
};

//the browser goes over the list of sources and picks the first one that matches
//so order matters, default is last

/**
 * helper for `<Image sizes="..."/>` media query prop/> matching tailwind sizes
 * ### example usage
 * ```jsx
 * <div className="relative h-64 w-64 md:h-96 md:w-96">
 *     <Image src={src} alt={alt} sizes={imageSizes({ w: 64, md: 96 })} fill className="object-cover" />
 * </div>
 * ```
 */
export function imageSizes(o: Options) {
  const xl2 = o.xl2 ? `(min-width: ${SCREENS.xl2}px) ${SIZES[o.xl2]}px, ` : "";
  const xl = o.xl ? `(min-width: ${SCREENS.xl}px) ${SIZES[o.xl]}px, ` : "";
  const md = o.md ? `(min-width: ${SCREENS.md}px) ${SIZES[o.md]}px, ` : "";
  const sm = o.sm ? `(min-width: ${SCREENS.sm}px) ${SIZES[o.sm]}px, ` : "";
  const w = `${SIZES[o.w]}px`;
  return `${xl2}${xl}${md}${sm}${w}`;
}
