import { reverseGeoCodingResponseSchema, type ReverseGeoCodingResponseSchema } from "./schema";

type GoogleReverseGeocidingParams = {
  lng: number;
  lat: number;
};

export function tagGoogleReverseGeocoding(p: GoogleReverseGeocidingParams) {
  return `google-reverse-geocoding-${p.lng}-${p.lat}`;
}

export async function getGoogleReverseGeocoding(p: GoogleReverseGeocidingParams) {
  const key = process.env.GOOGLE_GEOCODING_API_KEY;

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${p.lat},${p.lng}&key=${key}`;
    const json = await fetch(url, {
      cache: "force-cache",
      next: { tags: [tagGoogleReverseGeocoding(p)] },
    }).then((res) => res.json());
    const data = reverseGeoCodingResponseSchema.parse(json);
    if (data.status !== "OK") {
      throw new Error(data.status);
    }
    const simpleName = findSimpleName(data);
    return simpleName;
  } catch (error) {
    return null;
  }
}

function findSimpleName(data: ReverseGeoCodingResponseSchema) {
  //could use the "formatted_adress" but its a bit to formal
  for (const result of data.results) {
    for (const address_component of result.address_components) {
      if (!hasNumbers(address_component.long_name)) {
        return address_component.long_name;
      }
      if (!hasNumbers(address_component.short_name)) {
        return address_component.short_name;
      }
    }
  }
  return null;
}

function hasNumbers(str: string) {
  return str
    .split(" ")
    .map((x) => !isNaN(Number(x)))
    .some(Boolean);
}
