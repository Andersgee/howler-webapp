const TILE_SIZE = 256;

export function tilesFromBounds(bounds: google.maps.LatLngBounds, zoom: number) {
  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();
  //const topLeft = { lat: ne.lat(), lng: sw.lng() };
  //const botRight = { lat: sw.lat(), lng: ne.lng() };
  //const topLeft = new google.maps.LatLng(ne.lat(), sw.lng());
  //const botRight = new google.maps.LatLng(sw.lat(), ne.lng());

  const topLeft = coordinates(new google.maps.LatLng(ne.lat(), sw.lng()), zoom);
  const botRight = coordinates(new google.maps.LatLng(sw.lat(), ne.lng()), zoom);

  const minX = topLeft.tileCoordinate.x;
  const maxX = botRight.tileCoordinate.x;

  const minY = topLeft.tileCoordinate.y;
  const maxY = botRight.tileCoordinate.y;

  const tiles: { z: number; x: number; y: number }[] = [];
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      tiles.push({ z: Math.floor(zoom), x, y });
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
