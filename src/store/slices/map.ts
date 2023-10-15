import type { Component } from "react";
import type { StateCreator } from "zustand";
import { googleMapsInstance, type GoogleMaps } from "#src/components/GoogleMap/google-maps";
import type { LngLat } from "#src/components/GoogleMap/utils";
import type { HtmlPortalNode } from "#src/lib/reverse-portal";

export type MapSlice = {
  tileIdsInView: string[];
  mapBounds: { ne: LngLat; sw: LngLat };
  /** when this exists, everything is ready to go. */
  googleMaps: GoogleMaps | null;
  googleMapsLibsAreLoaded: boolean;
  loadGoogleMapsLibs: () => Promise<void>;
  initGoogleMaps: (element: HTMLDivElement) => void;
  mapPortalNode: HtmlPortalNode<Component<any>> | null;
  mapSetPortalNode: (node: HtmlPortalNode<Component<any>>) => void;
};

export const createMapSlice: StateCreator<MapSlice, [], [], MapSlice> = (set, get) => ({
  tileIdsInView: [],
  mapBounds: { ne: { lng: 0, lat: 0 }, sw: { lng: 0, lat: 0 } },
  googleMaps: null,
  googleMapsLibsAreLoaded: false,
  loadGoogleMapsLibs: async () => {
    if (get().googleMaps !== null) return;
    const ok = await googleMapsInstance.loadLibs();
    if (ok) {
      set({ googleMapsLibsAreLoaded: true });
    }
  },
  initGoogleMaps: (element) => {
    if (get().googleMaps !== null) return;
    googleMapsInstance.init(element);
    set({ googleMaps: googleMapsInstance });
  },
  mapPortalNode: null,
  mapSetPortalNode: (node) => set({ mapPortalNode: node }),
});
