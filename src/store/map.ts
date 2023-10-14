import type { Component } from "react";
import type { StateCreator } from "zustand";
import { GoogleMaps } from "#src/components/GoogleMap/google-maps";
import type { HtmlPortalNode } from "#src/lib/reverse-portal";

export type MapSlice = {
  tileIdsInView: string[];
  googleMaps: GoogleMaps | null;
  initGoogleMaps: () => Promise<void>;
  showGoogleMaps: boolean;
  setShowGoogleMaps: (b: boolean) => void;
  toggleShowGoogleMaps: () => void;
  mapPortalNode: HtmlPortalNode<Component<any>> | null;
  mapSetPortalNode: (node: HtmlPortalNode<Component<any>>) => void;
};

export const createMapSlice: StateCreator<MapSlice, [], [], MapSlice> = (set, get) => ({
  tileIdsInView: [],
  googleMaps: null,
  initGoogleMaps: async () => {
    if (get().googleMaps !== null) return;

    const googleMaps = new GoogleMaps();
    const ok = await googleMaps.init();
    if (ok) {
      set({ googleMaps });
    }
  },
  showGoogleMaps: false,
  setShowGoogleMaps: (b: boolean) => set({ showGoogleMaps: b }),
  toggleShowGoogleMaps: () => set((prev) => ({ showGoogleMaps: !prev.showGoogleMaps })),
  mapPortalNode: null,
  mapSetPortalNode: (node) => set({ mapPortalNode: node }),
});
