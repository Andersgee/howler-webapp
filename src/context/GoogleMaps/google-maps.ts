import { increaseBears, setTileIdsInView } from "#src/hooks/store";
import { tileNamesInView } from "./utils";

//https://console.cloud.google.com/google/maps-apis/studio/maps
const TEST_MAP_ID = "478ad7a3d9f73ca4";

//https://developers.google.com/maps/documentation/javascript/events

/*
also geocoding:
https://developers.google.com/maps/documentation/geocoding/overview

also samples:
https://github.com/googlemaps/js-samples/tree/main/samples

clustering markers:
https://developers.google.com/maps/documentation/javascript/marker-clustering

tiling, how google handles map and tile coordinates:
https://developers.google.com/maps/documentation/javascript/coordinates
*/

/**
 * simpler wrapper for interacting with google maps
 */
class GoogleMaps {
  Map!: typeof google.maps.Map;
  AdvancedMarkerElement!: typeof google.maps.marker.AdvancedMarkerElement;

  map: google.maps.Map | null;
  markers: google.maps.marker.AdvancedMarkerElement[];
  isReady: boolean;
  currentCenter: { lng: number; lat: number } | null;
  currentCenterMarker: google.maps.marker.AdvancedMarkerElement | null;
  showCenterMarker: boolean;

  constructor() {
    //this.Map = null;
    //this.AdvancedMarkerElement = null;
    this.map = null;
    this.currentCenter = null;
    this.markers = [];
    this.isReady = false;
    this.currentCenterMarker = null;
    this.showCenterMarker = false;
  }

  async init() {
    //load relevant libs
    //https://developers.google.com/maps/documentation/javascript/libraries#libraries-for-dynamic-library-import
    const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
    const { AdvancedMarkerElement } = (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;

    this.Map = Map;
    this.AdvancedMarkerElement = AdvancedMarkerElement;
    this.isReady = true;
  }

  render(element: HTMLDivElement) {
    this.map = new this.Map(element, {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
      mapId: TEST_MAP_ID, //required for some libs like AdvancedMarkerElement
      minZoom: 3,
    });

    this.currentCenterMarker = new this.AdvancedMarkerElement({
      map: this.map,
      position: null,
      title: "Placed pin",
    });

    this.map.addListener("center_changed", () => {
      const c = this.map?.getCenter();
      this.currentCenter = c ? { lng: c.lng(), lat: c.lat() } : null;
      if (this.currentCenterMarker && this.showCenterMarker) {
        this.currentCenterMarker.position = this.currentCenter;
      }
    });

    this.map.addListener("bounds_changed", () => {
      // send the new bounds back to your server
      const bounds = this.map?.getBounds();
      const zoom = this.map?.getZoom();
      if (bounds && zoom) {
        const tiles = tileNamesInView(bounds, zoom);
        setTileIdsInView(tiles);
        //console.log("tiles:", tiles);
      }
      //const span = bounds?.toSpan(); // span is delta lng and lat between corners (not actual values of corners)
    });
  }

  showCurrentCenterMarker() {
    this.showCenterMarker = true;
    if (this.currentCenterMarker) {
      this.currentCenterMarker.position = this.currentCenter;
    }
  }
  hideCurrentCenterMarker() {
    this.showCenterMarker = false;
    if (this.currentCenterMarker) {
      this.currentCenterMarker.position = null;
    }
  }

  testReactStateUpdate(x: number) {
    increaseBears(x);
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

  addMarkers(markers: { lng: number; lat: number; title: string; infoWindowElementId: string }[]) {
    if (!this.AdvancedMarkerElement || !this.map) return;

    //const marker = new google.maps.Marker({
    //  position: { lng, lat },
    //  title: "This is you!",
    //});
    //marker.setMap(googlemaps.current); //add maker to map

    for (const marker of markers) {
      const infowindow = new google.maps.InfoWindow({
        content: document.getElementById(marker.infoWindowElementId),
        ariaLabel: marker.title,
      });

      const m = new this.AdvancedMarkerElement({
        map: this.map,
        position: { lat: marker.lat, lng: marker.lng },
        title: marker.title,
      });
      m.addListener("click", () => {
        infowindow.open({
          anchor: m,
          map: this.map,
        });
      });

      this.markers.push(m);
    }
  }

  showEventMarker({ lng, lat }: { lng: number; lat: number }) {
    if (!this.map) return;

    /*
    const m = new this.AdvancedMarkerElement({
      map: this.map,
      position: { lat: marker.lat, lng: marker.lng },
      title: marker.title,
    });
    */

    //this.map.getBounds();
    //this.map.setCenter({ lat: -34, lng: 151 });
    //const norrsalbo = { lat: 59.9123376, lng: 16.3244494 };
    //const salbohed = { lat: 59.9137589, lng: 16.3495998 };
    this.clearMarkers();
    this.map.setCenter({ lng, lat });
    this.map.setZoom(14);

    const marker = new this.AdvancedMarkerElement({
      map: this.map,
      position: { lng, lat },
      title: "This is where it happens",
    });

    this.markers.push(marker);
  }

  getCenter() {
    if (!this.map) return;

    const c = this.map.getCenter();
    return c ? { lng: c.lng(), lat: c.lat() } : undefined;
  }

  clearMarkers() {
    this.markers.forEach((marker) => {
      marker.position = null;
    });
    this.markers = [];
    this.hideCurrentCenterMarker();
  }
}

export const googleMaps = new GoogleMaps();
