//export const runtime = "edge";

//https://developers.google.com/maps/documentation/geocoding/requests-reverse-geocoding#reverse-requests
async function getExamplePlaces() {
  const key = process.env.GOOGLE_GEOCODING_API_KEY;
  const lng = -73.961452;
  const lat = 40.714224;

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

export default async function Page() {
  const places = await getExamplePlaces();
  return <pre>{JSON.stringify(places, null, 2)}</pre>;
}
