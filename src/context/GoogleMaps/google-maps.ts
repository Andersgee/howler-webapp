//https://console.cloud.google.com/google/maps-apis/studio/maps
const TEST_MAP_ID = "478ad7a3d9f73ca4";

export const GOOGLE_MAPS_ELEMENT_ID = "google-maps-div";

/**
 * simpler wrapper for interacting with google maps
 */
class GoogleMaps {
  map: google.maps.Map | null;
  AdvancedMarkerElement: typeof google.maps.marker.AdvancedMarkerElement | null;

  markers: google.maps.marker.AdvancedMarkerElement[];
  isReady: boolean;

  constructor() {
    this.map = null;
    this.AdvancedMarkerElement = null;

    this.markers = [];

    this.isReady = false;
  }

  async initialize(elementId: string) {
    const element = document.getElementById(elementId);
    if (!element) return;

    //load libs
    const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
    const { AdvancedMarkerElement } = (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;

    //initiailize
    this.map = new Map(element, {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
      mapId: TEST_MAP_ID, //required for AdvancedMarkerElement
    });

    this.AdvancedMarkerElement = AdvancedMarkerElement;

    this.isReady = true;
  }

  setPos({ lng, lat, zoom }: { lng: number; lat: number; zoom: number }) {
    if (!this.map) return;

    this.map.setCenter({ lng, lat });
    this.map.setZoom(zoom);
  }

  addMarker({ lng, lat }: { lng: number; lat: number }) {
    if (!this.AdvancedMarkerElement || !this.map) return;

    //const marker = new google.maps.Marker({
    //  position: { lng, lat },
    //  title: "This is you!",
    //});
    //marker.setMap(googlemaps.current); //add maker to map

    const marker = new this.AdvancedMarkerElement({
      map: this.map,
      position: { lat, lng: lng + 0.1 },
      title: "This is you (advanced marker)",
    });

    this.markers.push(marker);
  }

  clearMarkers() {
    this.markers.forEach((marker) => {
      marker.position = null;
    });
  }
}

export const googleMaps = new GoogleMaps();
