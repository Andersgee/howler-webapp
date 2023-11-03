import type { Component } from "react";
import type { StateCreator } from "zustand";
import { GoogleMaps } from "#src/components/GoogleMap/google-maps";
import type { LngLat } from "#src/components/GoogleMap/utils";
import type { HtmlPortalNode } from "#src/lib/reverse-portal";

export type MapSlice = {
  mapClickedEventId: number | null;
  mapSetClickedEventId: (number: number | null) => void;
  tileIdsInView: string[];
  mapBounds: { ne: LngLat; sw: LngLat };
  /** when this exists, everything is ready to go. */
  googleMaps: GoogleMaps | null;
  googleMapsLibsAreLoaded: GoogleMaps | null;
  loadGoogleMapsLibs: () => Promise<void>;
  initGoogleMaps: (element: HTMLDivElement) => void;
  mapPortalNode: HtmlPortalNode<Component<any>> | null;
  mapSetPortalNode: (node: HtmlPortalNode<Component<any>>) => void;
};

export const createMapSlice: StateCreator<MapSlice, [], [], MapSlice> = (set, get) => ({
  mapClickedEventId: null,
  mapSetClickedEventId: (x) => {
    set({ mapClickedEventId: x });
  },
  tileIdsInView: [],
  mapBounds: { ne: { lng: 0, lat: 0 }, sw: { lng: 0, lat: 0 } },
  googleMaps: null,
  googleMapsLibsAreLoaded: null,
  loadGoogleMapsLibs: async () => {
    if (get().googleMaps !== null) return;
    const googleMapsInstance = new GoogleMaps();
    const ok = await googleMapsInstance.loadLibs();
    if (ok) {
      set({ googleMapsLibsAreLoaded: googleMapsInstance });
    }
  },
  initGoogleMaps: (element) => {
    const { googleMaps, googleMapsLibsAreLoaded } = get();
    if (googleMaps !== null || googleMapsLibsAreLoaded === null) return;

    googleMapsLibsAreLoaded.init(element);
    set({ googleMaps: googleMapsLibsAreLoaded });
  },
  mapPortalNode: null,
  mapSetPortalNode: (node) => set({ mapPortalNode: node }),
});
