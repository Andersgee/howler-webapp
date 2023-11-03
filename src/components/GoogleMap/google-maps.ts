import { GridAlgorithm, MarkerClusterer } from "@googlemaps/markerclusterer";
import { setMapBounds, setMapClickedEventId } from "#src/store/actions";
import { debounce } from "#src/utils/debounce";
import { type Prettify } from "#src/utils/typescript";
import { absUrl } from "#src/utils/url";
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

const INITIAL_ZOOM = 5;
const INITIAL_CENTER = { lat: 55.49, lng: 13.04 };
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
  markerClusterer: MarkerClusterer | null;
  //markers: google.maps.marker.AdvancedMarkerElement[];
  //currentCenterMarker: google.maps.marker.AdvancedMarkerElement | null;
  //showCenterMarker: boolean;

  eventMarker: google.maps.marker.AdvancedMarkerElement | null;
  chooseEventLocationMarker: google.maps.marker.AdvancedMarkerElement | null;
  constructor() {
    this.map = null;
    this.currentCenter = null;
    this.markerClusterer = null;
    this.eventMarker = null;
    this.chooseEventLocationMarker = null;
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
    //tldr on cost:
    //the google cloud billing account gets 200 USD free usage each month for "Google Maps Platform APIs"
    //geocoding is 0.005 USD per request see https://developers.google.com/maps/documentation/geocoding/usage-and-billing#pricing-for-product
    //google maps is 0.007 USD per load, see https://developers.google.com/maps/documentation/javascript/usage-and-billing#pricing-for-product
    //
    //so essentially 28500 map loads per month is free

    this.map = new this.Map(element, {
      zoom: INITIAL_ZOOM,
      center: INITIAL_CENTER,
      mapId: TEST_MAP_ID,
      minZoom: 3,
    });

    //this.markerClusterer = new MarkerClusterer({ map: this.map });
    this.markerClusterer = new MarkerClusterer({ map: this.map, algorithm: new GridAlgorithm({ gridSize: 50 }) });

    this.map.addListener("center_changed", () => {
      const c = this.map?.getCenter();
      this.currentCenter = c ? { lng: c.lng(), lat: c.lat() } : null;

      if (this.chooseEventLocationMarker !== null && this.chooseEventLocationMarker.position !== null) {
        this.chooseEventLocationMarker.position = this.currentCenter;
      }
    });

    this.map.addListener(
      "bounds_changed",
      debounce(() => {
        try {
          const bounds = this.map?.getBounds();
          const zoom = this.map?.getZoom();
          if (bounds && zoom) {
            const ne = bounds.getNorthEast();
            const sw = bounds.getSouthWest();
            const mapBounds = { ne: { lng: ne.lng(), lat: ne.lat() }, sw: { lng: sw.lng(), lat: sw.lat() } };

            const tileIdsInView = calcTileIdsInView({ ne: mapBounds.ne, sw: mapBounds.sw, z: zoom });
            setMapBounds(tileIdsInView, mapBounds);
          }
        } catch {
          /*
          Im rendering google-maps in a div that might not currently be on the page with <OutPortal>...
          so getNorthEast() etc which internally does fromLatLngToDivPixel() which "computes the pixel coordinates of the given geographical
          location in the DOM element that holds the draggable map" will fail cuz  the element does not exist in the DOM if not showing map.

          anyway just ignore error, "bounds_changed" will re-run once map is actually painted
          */
        }
      }, 1000)
    );
  }

  setPos({ lng, lat, zoom }: { lng: number; lat: number; zoom: number }) {
    if (!this.map) return;
    this.map.setCenter({ lng, lat });
    this.map.setZoom(zoom);
  }

  //clearMarkers() {
  //  if (this.eventMarker) {
  //    this.eventMarker.position = null;
  //  }
  //  this.markerClusterer?.clearMarkers();
  //}

  hideAllMarkers() {
    if (this.eventMarker && this.eventMarker.position !== null) {
      this.eventMarker.position = null;
    }

    if (this.chooseEventLocationMarker && this.chooseEventLocationMarker.position !== null) {
      this.chooseEventLocationMarker.position = null;
    }
    this.markerClusterer?.clearMarkers();
  }

  setEventMarker(location: LngLat) {
    this.hideAllMarkers();
    if (this.eventMarker === null) {
      const pin = new this.PinElement({
        scale: 1.5,
      });
      this.eventMarker = new this.AdvancedMarkerElement({
        map: this.map,
        content: pin.element,
        position: location,
        title: "This is where it happens.",
      });
    } else {
      this.eventMarker.position = location;
    }

    //eventMarker.map = null //remove marker like this
    //eventMarker.position = null // or remove marker like this
  }

  setChooseEventLocationMarkerCurrentCenter() {
    this.setChooseEventLocationMarker(this.currentCenter || INITIAL_CENTER);
  }

  setChooseEventLocationMarker(location: LngLat) {
    this.hideAllMarkers();

    if (this.chooseEventLocationMarker === null) {
      const pin = new this.PinElement({
        scale: 1.5,
      });
      this.chooseEventLocationMarker = new this.AdvancedMarkerElement({
        map: this.map,
        content: pin.element,
        position: location,
        title: "This is where it happens.",
      });
    } else {
      this.chooseEventLocationMarker.position = location;
    }

    //eventMarker.map = null //remove marker like this
    //eventMarker.position = null // or remove marker like this
  }

  setExploreMarkers(events: Array<Prettify<LngLat & { id: number; what: string }>>) {
    if (!this.map) return;

    const markers = events.map((event) => {
      const glyphImg = document.createElement("img");
      glyphImg.src = absUrl("/icons/pin.svg");
      const pinGlyph = new this.PinElement({
        glyph: glyphImg,
        glyphColor: "#fff",
        background: "#fff",
        borderColor: "#fff",
        scale: 1.5, //default looks like 24px, recommended is atleast 44px, lets do 36? adjust pin.svg accordingly
      });
      const marker = new this.AdvancedMarkerElement({
        map: this.map,
        position: { lng: event.lng, lat: event.lat },
        content: pinGlyph.element, //can not pass same element to multiple.
        title: event.what || "anything",
      });

      marker.addListener("click", () => {
        setMapClickedEventId(event.id);
      });

      return marker;
    });

    try {
      this.hideAllMarkers();
      this.markerClusterer?.addMarkers(markers);
    } catch (error) {
      // fromLatLngToDivPixel error cuz google maps DOM node is not on page
    }
  }
}

//export const googleMapsInstance = new GoogleMaps();
