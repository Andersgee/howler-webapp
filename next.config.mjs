import "./src/utils/validate-process-env.mjs";
import { withPlausibleProxy } from "next-plausible";

/*
https://nextjs.org/docs/app/api-reference/components/image#advanced
TLDR on <Image> component:
loads an optimized (webp or avif instead of jpg etc) and sized from "/_next/image/..." instead of original image source
eg:
<Image sizes="190px"/> would make browser load a 256px wide image (edit imageSizes for valuesr)
<Image/> without sizes takes screen width instead eg loads a 1920px wide image if screen is 1800 or whatever (edit deviceSizes for values)

sizes can use media query like so (last item must be without media query):
<Image sizes="(max-width: 768px) 100vw, 500px"/>
this would load a
640px wide image on for example a 500px screen width (matches (max-width: 768px))
750px wide image on for example a 700px screen width (matches (max-width: 768px))
500px wide image on for example a 1000px screen width (default match)

The total generated different images (srcset) is [...IMAGE_SIZES, ...DEVICE_SIZES]
The largest value in IMAGE_SIZES needs to be smaller than smallest in DEVICE_SIZES

summary:
the sizes="..." props is just for specifying which one to load if
the default (full width, based on device width) is not needed.
*/
const NEXTJS_IMAGE_DEFAULT_deviceSizes = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
const NEXTJS_IMAGE_DEFAULT_imageSizes = [16, 32, 48, 64, 96, 128, 256, 384];

//<Image sizes="(min-width: 640px) 640px, 100vw"/>

//matching tailwind sizes:
//                       sm   md    lg    xl    2xl   3xl...
const DEVICE_SIZES = [640, 768, 1024, 1280, 1536, 2048];
//  w-               6   8   12  16  24  32   64   96
const IMAGE_SIZES = [24, 32, 48, 64, 96, 128, 256, 384];

//the following would be w-[48px] lg:w-[96px] aka w-12 lg:w-24
//<Image sizes="(min-width: 1024px) 96px, 48px"/>

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/howler-event-images/**",
      },
    ],
  },
};

//https://storage.cloud.google.com/howler-event-images/1-1

export default withPlausibleProxy()(nextConfig);
