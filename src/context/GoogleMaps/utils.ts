const TILE_SIZE = 256;

//const MIN_ZOOM_GOOGLE = 0
//const MAX_ZOOM_GOOGLE = 22
const MIN_ZOOM = 4;
const MAX_ZOOM = 4;

type LngLat = { lng: number; lat: number };
type LngLatZoom = LngLat & { zoom: number };

export function tileIdsFromLngLat({ lng, lat }: LngLat) {
  //const zooms = range(0, 8);
  const zooms = range(MIN_ZOOM, MAX_ZOOM);
  return zooms.map((zoom) => tileName({ lng, lat, zoom }));
}

function tileName({ lng, lat, zoom }: LngLatZoom) {
  const { tileCoordinate } = coordinates({ lng, lat, zoom });

  return `${Math.floor(zoom)}-${tileCoordinate.x}-${tileCoordinate.y}`;
}

function tileNameFromCoord({ x, y, zoom }: { x: number; y: number; zoom: number }) {
  return `${Math.floor(zoom)}-${x}-${y}`;
}

function range(start: number, stop: number, step = 1) {
  return Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
}

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function unique(v: number[]) {
  return Array.from(new Set(v));
}

/**
 * ```
 * wrappedRange(28, 2, 32) // [28, 29, 30, 31, 1, 2]
 * wrappedRange(28, 30, 32) // [28, 29, 30]
 * wrappedRange(-2, 3, 32) // [ 30, 31, 0, 1, 2, 3 ]
 * ```
 */
function wrappedRange(start: number, stop: number, wrapAt: number) {
  const length = stop < start ? wrapAt - start + stop + 1 : stop - start + 1;
  return unique(Array.from({ length }, (_, i) => mod(start + i, wrapAt)));
}

function clamp(x: number, a: number, b: number) {
  return Math.max(a, Math.min(b, x));
}

export function tileNamesInView(ne: LngLat, sw: LngLat, z: number) {
  const zoom = clamp(z, MIN_ZOOM, MAX_ZOOM);
  //const zoom = z;
  //const ne = bounds.getNorthEast();
  //const sw = bounds.getSouthWest();

  //for a given zoom, this is the grid width and height of tiles
  const gridSize = 1 << zoom;

  const { tileCoordinate: topLeft } = coordinates({ lng: sw.lng, lat: ne.lat, zoom });
  const { tileCoordinate: botRight } = coordinates({ lng: ne.lng, lat: sw.lat, zoom });

  const ys = wrappedRange(topLeft.y, botRight.y, gridSize);
  const xs = wrappedRange(topLeft.x, botRight.x, gridSize);

  const tiles: string[] = [];
  for (const y of ys) {
    for (const x of xs) {
      tiles.push(tileNameFromCoord({ x, y, zoom }));
    }
  }
  return tiles;
}

function coordinates({ lng, lat, zoom }: LngLatZoom) {
  const scale = 1 << zoom;
  const worldCoordinate = project({ lng, lat });

  const pixelCoordinate = {
    x: Math.floor(worldCoordinate.x * scale),
    y: Math.floor(worldCoordinate.y * scale),
  };

  const tileCoordinate = {
    x: Math.floor((worldCoordinate.x * scale) / TILE_SIZE),
    y: Math.floor((worldCoordinate.y * scale) / TILE_SIZE),
  };

  return { worldCoordinate, pixelCoordinate, tileCoordinate };
}

// The mapping between latitude, longitude and pixels is defined by the web
// mercator projection.
function project({ lng, lat }: LngLat) {
  let siny = Math.sin((lat * Math.PI) / 180);

  // Truncating to 0.9999 effectively limits latitude to 89.189. This is
  // about a third of a tile past the edge of the world tile.
  siny = Math.min(Math.max(siny, -0.9999), 0.9999);

  return {
    x: TILE_SIZE * (0.5 + lng / 360),
    y: TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)),
  };
}
