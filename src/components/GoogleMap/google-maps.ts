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
            //console.log("tiles:", tiles);
          }
          //const span = bounds?.toSpan(); // span is delta lng and lat between corners (not actual values of corners)
        } catch (error) {
          /*
          try to fix this error: Cannot read properties of undefined (reading 'fromLatLngToDivPixel')
          it seems to only happens on phone when navigating back/forward

          Im rendeing into a div that might not currently be on the page with <OutPortal> so this is likely the issue
          
          note to self:
          node_modules/@types/google-maps:
          fromLatLngToDivPixel() Computes the pixel coordinates of the given geographical
          location in the DOM element that holds the draggable map.

          fromLatLngToDivPixel seems to be called in
          - in google maps draw()
          - in markerclusterer latLngBoundsToPixelBounds()

          */
        }
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

  setExploreMarkers(locations: Array<Prettify<LngLat & { what: string; id: number }>>) {
    if (!this.map) return;

    const infoWindow = new this.InfoWindow({
      content: "",
      disableAutoPan: true,
    });

    const markers = locations.map((location) => {
      //const label = labels[i % labels.length];
      //const label = location.what;
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
        const element = document.getElementById(String(location.id));
        if (element === null) {
          //infoWindow.setContent(location.lat + ", " + location.lng);
          infoWindow.setContent(`what: ${location.what}`);
        } else {
          const clonedElement = element.cloneNode(true) as HTMLElement;
          //should change id of clone. see https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode
          clonedElement.id = `cloned-${element.id}`;
          clonedElement.classList.remove("sr-only");
          infoWindow.setContent(clonedElement);
        }
        infoWindow.open({
          map: this.map,
          anchor: marker,
          //shouldFocus: true,
        });
        //infoWindow.open(this.map, marker);
      });
      return marker;
    });

    try {
      this.hideAllMarkers();
      this.markerClusterer?.addMarkers(markers);
    } catch (error) {
      // fromLatLngToDivPixel error cuz google maps DOM node is not page?
    }
  }
}

//export const googleMapsInstance = new GoogleMaps();
