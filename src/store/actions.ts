import type { MessagePayload } from "firebase/messaging";
import { isIdenticalLists, type LngLat } from "#src/components/GoogleMap/utils";
import { useStore } from ".";

//external setters allows usage outside react (aswell as within react)

/** for GoogleMaps external class */
export const setMapBounds = (tileIdsInView: string[], mapBounds: { ne: LngLat; sw: LngLat }) => {
  if (isIdenticalLists(useStore.getState().tileIdsInView, tileIdsInView)) {
    useStore.setState({ mapBounds });
  } else {
    useStore.setState({ tileIdsInView, mapBounds });
  }
};

//export const getTileIdsInView = useStore.select.tileIdsInView();

/** for FirebaseCloudMessaging external class */
export const setFcmLatestMessagePayload = (payload: MessagePayload) =>
  useStore.setState({ fcmLatestMessagePayload: payload });
