const TILE_SIZE = 256;

//const MIN_ZOOM_GOOGLE = 0
//const MAX_ZOOM_GOOGLE = 22
const MIN_ZOOM = 4;
const MAX_ZOOM = 5;

function tileName({ lng, lat, zoom }: { lng: number; lat: number; zoom: number }) {
  const latLng = new google.maps.LatLng(lat, lng);
  const { tileCoordinate } = coordinates(latLng, zoom);

  return `${Math.floor(zoom)}-${tileCoordinate.x}-${tileCoordinate.y}`;
}

function tileNameFromCoord({ x, y, zoom }: { x: number; y: number; zoom: number }) {
  return `${Math.floor(zoom)}-${x}-${y}`;
}

function range(start: number, stop: number, step = 1) {
  return Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
}

function clamp(x: number, a: number, b: number) {
  return Math.max(a, Math.min(b, x));
}

export function tileNamesForAllZoomLevels({ lng, lat }: { lng: number; lat: number }) {
  //const zooms = range(0, 8);
  const zooms = range(MIN_ZOOM, MAX_ZOOM);
  return zooms.map((zoom) => tileName({ lng, lat, zoom }));
}

export function tileNamesInView(bounds: google.maps.LatLngBounds, z: number) {
  const zoom = clamp(z, MIN_ZOOM, MAX_ZOOM);
  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();

  const topLeft = coordinates(new google.maps.LatLng(ne.lat(), sw.lng()), zoom);
  const botRight = coordinates(new google.maps.LatLng(sw.lat(), ne.lng()), zoom);

  const minX = topLeft.tileCoordinate.x;
  const maxX = botRight.tileCoordinate.x;

  const minY = topLeft.tileCoordinate.y;
  const maxY = botRight.tileCoordinate.y;

  //const tiles: { z: number; x: number; y: number }[] = [];
  const tiles: string[] = [];
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      //tiles.push({ z: Math.floor(zoom), x, y });
      tiles.push(tileNameFromCoord({ x, y, zoom }));
    }
  }
  return tiles;
}

function coordinates(latLng: google.maps.LatLng, zoom: number) {
  const scale = 1 << zoom;
  const worldCoordinate = project(latLng);

  const pixelCoordinate = new google.maps.Point(
    Math.floor(worldCoordinate.x * scale),
    Math.floor(worldCoordinate.y * scale)
  );

  const tileCoordinate = new google.maps.Point(
    Math.floor((worldCoordinate.x * scale) / TILE_SIZE),
    Math.floor((worldCoordinate.y * scale) / TILE_SIZE)
  );

  return { worldCoordinate, pixelCoordinate, tileCoordinate };
}

// The mapping between latitude, longitude and pixels is defined by the web
// mercator projection.
function project(latLng: google.maps.LatLng) {
  let siny = Math.sin((latLng.lat() * Math.PI) / 180);

  // Truncating to 0.9999 effectively limits latitude to 89.189. This is
  // about a third of a tile past the edge of the world tile.
  siny = Math.min(Math.max(siny, -0.9999), 0.9999);

  return new google.maps.Point(
    TILE_SIZE * (0.5 + latLng.lng() / 360),
    TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))
  );
}
