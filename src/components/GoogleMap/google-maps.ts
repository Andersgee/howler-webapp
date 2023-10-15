import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { setMapBounds } from "#src/store/actions";
import { debounce } from "#src/utils/debounce";
import { type Prettify } from "#src/utils/typescript";
import { calcTileIdsInView, type LngLat } from "./utils";

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
export class GoogleMaps {
  Map!: typeof google.maps.Map;
  AdvancedMarkerElement!: typeof google.maps.marker.AdvancedMarkerElement;
  PinElement!: typeof google.maps.marker.PinElement;
  InfoWindow!: typeof google.maps.InfoWindow;

  map: google.maps.Map | null;
  currentCenter: { lng: number; lat: number } | null;
  //markers: google.maps.marker.AdvancedMarkerElement[];
  //currentCenterMarker: google.maps.marker.AdvancedMarkerElement | null;
  //showCenterMarker: boolean;

  constructor() {
    this.map = null;
    this.currentCenter = null;
  }

  async loadLibs() {
    try {
      //load relevant libs
      //https://developers.google.com/maps/documentation/javascript/libraries#libraries-for-dynamic-library-import
      const { Map, InfoWindow } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
      const { AdvancedMarkerElement, PinElement } = (await google.maps.importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;

      this.Map = Map;
      this.InfoWindow = InfoWindow;
      this.AdvancedMarkerElement = AdvancedMarkerElement;
      this.PinElement = PinElement;

      return true;
    } catch (error) {
      return false;
    }
  }

  init(element: HTMLDivElement) {
    console.log("rendering google map now, this costs 0.007 USD");
    /*
    this.map = new this.Map(element, {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 12,
      mapId: TEST_MAP_ID, //required for some libs like AdvancedMarkerElement
      minZoom: 3,
    });
    */

    this.map = new this.Map(element, {
      zoom: 3,
      center: { lat: -28.024, lng: 140.887 },
      mapId: TEST_MAP_ID,
      minZoom: 3,
    });

    //this.currentCenterMarker = new this.AdvancedMarkerElement({
    //  map: this.map,
    //  position: null,
    //  title: "Placed pin",
    //});

    this.map.addListener("center_changed", () => {
      const c = this.map?.getCenter();
      this.currentCenter = c ? { lng: c.lng(), lat: c.lat() } : null;
    });

    this.map.addListener(
      "bounds_changed",
      debounce(() => {
        // send the new bounds back to your server
        const bounds = this.map?.getBounds();
        const zoom = this.map?.getZoom();
        if (bounds && zoom) {
          const ne = bounds.getNorthEast();
          const sw = bounds.getSouthWest();
          const mapBounds = { ne: { lng: ne.lng(), lat: ne.lat() }, sw: { lng: sw.lng(), lat: sw.lat() } };

          const tileIdsInView = calcTileIdsInView({ ne: mapBounds.ne, sw: mapBounds.sw, z: zoom });
          setMapBounds(tileIdsInView, mapBounds);
          //console.log("tiles:", tiles);
        }
        //const span = bounds?.toSpan(); // span is delta lng and lat between corners (not actual values of corners)
      }, 300)
    );
  }

  setPos({ lng, lat, zoom }: { lng: number; lat: number; zoom: number }) {
    if (!this.map) return;
    this.map.setCenter({ lng, lat });
    this.map.setZoom(zoom);
  }

  addMarkers(locations: Array<Prettify<LngLat & { label: string }>>) {
    if (!this.map) {
      console.log("no map");
    }
    const infoWindow = new this.InfoWindow({
      content: "",
      disableAutoPan: true,
    });

    const markers = locations.map((location, i) => {
      //const label = labels[i % labels.length];
      const label = location.label;
      const pinGlyph = new this.PinElement({
        glyph: label,
        glyphColor: "white",
      });
      const marker = new this.AdvancedMarkerElement({
        position: location,
        content: pinGlyph.element,
      });

      // markers can only be keyboard focusable when they have click listeners
      // open info window when marker is clicked
      marker.addListener("click", () => {
        infoWindow.setContent(location.lat + ", " + location.lng);
        infoWindow.open(this.map, marker);
      });
      return marker;
    });

    const markerClusterer = new MarkerClusterer({ map: this.map, markers });
  }
}

export const googleMapsInstance = new GoogleMaps();
