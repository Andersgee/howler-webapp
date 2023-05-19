import type { Metadata } from "next";
import { absUrl } from "./url";

type Config = {
  /**
   * The title of your object as it should appear within the graph, e.g., "The Rock".
   */
  title: string;
  /**
   * A one to two sentence description of your object.
   */
  description: string;
  /**
   * USAGE WITH THIS FUNCTION: either absolute or relative url such as "/hello" is ok
   *
   * An image URL which should represent your object within the graph.
   *
   * size should be 1200x630 to be safe
   */
  image: string;
  /**
   * USAGE WITH THIS FUNCTION: either absolute or relative url such as "/hello" is ok
   *
   * The canonical URL of your object that will be used as its permanent ID in the graph, e.g., "https://www.imdb.com/title/tt0117500".
   */
  url: string;
  /**
   * The type of your object, e.g., "website" or "video.movie". Depending on the type you specify, other properties may also be required.
   */
  type?: "website" | "video.movie";
  /**
   * USAGE WITH THIS FUNCTION: either absolute or relative url such as "/hello" is ok
   *
   * A URL to an audio file to accompany this object. example "https://example.com/bond/theme.mp3"
   */
  audio?: string;
  /**
   * USAGE WITH THIS FUNCTION: either absolute or relative url such as "/hello" is ok
   *
   * A URL to a video file that complements this object.
   */
  video?: string;
  /**
   * The word that appears before this object's title in a sentence. An enum of (a, an, the, "", auto). If auto is chosen, the consumer of your data should chose between "a" or "an". Default is "" (blank).
   */
  determiner?: "" | "a" | "auto" | "an" | "the";
  /**
   *  The locale these tags are marked up in. Of the format language_TERRITORY. Default is en_US.
   */
  locale?: string;
  /**
   * An array of other locales this page is available in.
   */
  locale_alternatives?: string[];
  /**
   * If your object is part of a larger web site, the name which should be displayed for the overall site. e.g., "IMDb".
   */
  site_name?: string;
};

/**
 * meta tags for SEO, with sensible required fields although technically nothing is required.
 *
 * NOTE: for convenience, this function allows relative url such as `"/about"` instead of `"https://some.page.com/about"`
 *
 * reference:
 * https://ogp.me/
 * https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary-card-with-large-image
 * https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup
 * https://api.slack.com/robots
 *
 * also for icons, this is nice : https://maskable.app/editor
 *
 * testing:
 * facebook: https://developers.facebook.com/tools/debug/
 * google: https://developers.google.com/search/docs/appearance/structured-data
 * twitter: https://cards-dev.twitter.com/validator (deprecated, recommended way is now to just paste into twitter and see how it looks)
 * slack: apparently uses same as twitter
 *
 */
export function seo({
  type = "website",
  site_name = "Howler",
  title,
  url,
  image,
  audio,
  description,
  determiner,
  locale,
  locale_alternatives,
  video,
}: Config) {
  const metadata: Metadata = {
    title: title,
    description: description,
    applicationName: "Howler",
    referrer: "origin-when-cross-origin",
    viewport: "width=device-width, initial-scale=1",
    themeColor: "#fafafa",
    manifest: absUrl("/manifest.json"),
    icons: [
      { rel: "icon", type: "image/svg+xml", url: absUrl("/icons/favicon.svg") },
      { rel: "apple-touch-icon", url: absUrl("/icons/favicon-maskable-512x512.png") },
    ],
    openGraph: {
      type: type,
      title: title,
      description: description,
      siteName: site_name,
      url: absUrl(url),
      images: [
        {
          url: absUrl(image),
        },
      ],
      audio: audio,
      videos: video,
      determiner: determiner,
      locale: locale,
      alternateLocale: locale_alternatives,
    },
    twitter: {
      title: title,
      card: "summary_large_image",
      description:
        "Looking for something to do in real life? A place to quickly find/plan stuff to do with friends, or with anyone really.",
      images: [absUrl(image)],
    },
  };

  return metadata;
}