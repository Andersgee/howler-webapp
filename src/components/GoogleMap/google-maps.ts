import { GridAlgorithm, MarkerClusterer } from "@googlemaps/markerclusterer";
import { setMapBounds } from "#src/store/actions";
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

const INITIAL_CENTER = { lat: -34.397, lng: 150.644 };
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
    console.log("rendering google map now"); //this costs 0.007 USD

    this.map = new this.Map(element, {
      zoom: 10,
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
    if (this.currentCenter) {
      this.setChooseEventLocationMarker(this.currentCenter);
    } else {
      this.setChooseEventLocationMarker(INITIAL_CENTER);
    }
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

  setExploreMarkers(locations: Array<Prettify<LngLat & { what: string }>>) {
    if (!this.map) return;

    const infoWindow = new this.InfoWindow({
      content: "",
      disableAutoPan: true,
    });

    const markers = locations.map((location) => {
      //const label = labels[i % labels.length];
      const label = location.what;
      //const pinGlyph = new this.PinElement({
      //  glyph: label,
      //  glyphColor: "white",
      //});
      //const marker = new this.AdvancedMarkerElement({
      //  position: location,
      //  content: pinGlyph.element,
      //});

      // A marker with a custom SVG glyph.
      const glyphImg = document.createElement("img");
      glyphImg.src = absUrl("/icons/pin.svg");
      const pinGlyph = new this.PinElement({
        glyph: glyphImg,
        glyphColor: "#fff",
        background: "#fff",
        borderColor: "#fff",
        scale: 2, //default looks like 24px, recommended is atleast 44px 48px
      });
      const marker = new this.AdvancedMarkerElement({
        //map,
        position: location,
        content: pinGlyph.element, //can not pass same element to multiple.
        //title: "A marker using a custom SVG for the glyph.",
      });

      // markers can only be keyboard focusable when they have click listeners
      // open info window when marker is clicked
      marker.addListener("click", () => {
        infoWindow.setContent(location.lat + ", " + location.lng);
        infoWindow.open(this.map, marker);
      });
      return marker;
    });

    this.hideAllMarkers();
    this.markerClusterer?.addMarkers(markers);
  }
}

export const googleMapsInstance = new GoogleMaps();
