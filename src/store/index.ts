import type { MessagePayload } from "firebase/messaging";
import { create } from "zustand";
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

//allows usage outside react (aswell as within react)
export const setTileIdsInView = (tileIdsInView: string[]) => useStore.setState({ tileIdsInView });
//export const getTileIdsInView = useStore.select.tileIdsInView();

export const setFcmLatestMessagePayload = (payload: MessagePayload) =>
  useStore.setState({ fcmLatestMessagePayload: payload });
