/**
 * tailwind breakpoints -> DEVICE_SIZES as written in next.config.mjs
 * note: make sure DEVICE_SIZES match the SCREENS in tailwind.config.ts
 */
const SCREENS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

/**
 * tw width -> IMAGE_SIZES as written in next.config.mjs
 */
const SIZES = {
  "w-6": 24,
  "w-8": 32,
  "w-12": 48,
  "w-16": 64,
  "w-24": 96,
  "w-32": 128,
  "w-64": 256,
  "w-96": 384,
} as const;

type TailwindSize = keyof typeof SIZES;

type Options = {
  sm?: TailwindSize;
  md?: TailwindSize;
  lg?: TailwindSize;
  xl?: TailwindSize;
  "2xl"?: TailwindSize;
};

//the browser goes over the list of sources and picks the first one that matches
//so order matters, meaning default value last without media query condition

/**
 * helper for `<Image sizes="..."/>` media query prop with matching tailwind sizes
 * ### example usage
 * ```jsx
 * <div className="relative h-64 w-64 sm:h-96 sm:w-96">
 *     <Image src={src} alt={alt} sizes={imageSizes("w-64", { sm: "w-96" })} fill className="object-contain" />
 * </div>
 * ```
 */
export function imageSizes(width: TailwindSize, o?: Options) {
  const w = `${SIZES[width]}px`;
  if (!o) return w;

  const xl2 = o["2xl"] ? `(min-width: ${SCREENS["2xl"]}px) ${SIZES[o["2xl"]]}px, ` : "";
  const xl = o["xl"] ? `(min-width: ${SCREENS["xl"]}px) ${SIZES[o["xl"]]}px, ` : "";
  const md = o["md"] ? `(min-width: ${SCREENS["md"]}px) ${SIZES[o["md"]]}px, ` : "";
  const sm = o["sm"] ? `(min-width: ${SCREENS["sm"]}px) ${SIZES[o["sm"]]}px, ` : "";
  return `${xl2}${xl}${md}${sm}${w}`;
}
