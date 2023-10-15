import type { MessagePayload } from "firebase/messaging";
import { create } from "zustand";
import { isIdenticalLists, type LngLat } from "#src/components/GoogleMap/utils";
import { createBearSlice, type BearSlice } from "./bear";
import { createDialogSlice, type DialogSlice } from "./dialog";
import { createFcmSlice, type FcmSlice } from "./fcm";
import { createFishSlice, type FishSlice } from "./fish";
import { createMapSlice, type MapSlice } from "./map";
import { createSelectors } from "./selectors";
import { createUserSlice, type Userlice } from "./user";

type StoreState = BearSlice & FishSlice & DialogSlice & MapSlice & Userlice & FcmSlice;

const useStoreBase = create<StoreState>()((...a) => ({
  ...createBearSlice(...a),
  ...createFishSlice(...a),
  ...createDialogSlice(...a),
  ...createMapSlice(...a),
  ...createUserSlice(...a),
  ...createFcmSlice(...a),
}));

export const useStore = createSelectors(useStoreBase);

//external setters allows usage outside react (aswell as within react)

/** for GoogleMaps external class */
export const setMapBounds = (tileIdsInView: string[], mapBounds: { ne: LngLat; sw: LngLat }) => {
  const prevTileIdsInView = useStore.getState().tileIdsInView;
  if (isIdenticalLists(prevTileIdsInView, tileIdsInView)) {
    useStore.setState({ mapBounds });
  } else {
    useStore.setState({ tileIdsInView, mapBounds });
  }
};

//export const getTileIdsInView = useStore.select.tileIdsInView();

/** for FirebaseCloudMessaging external class */
export const setFcmLatestMessagePayload = (payload: MessagePayload) =>
  useStore.setState({ fcmLatestMessagePayload: payload });
