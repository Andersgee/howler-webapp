import type { MessagePayload } from "firebase/messaging";
import { FirebaseCloudMessaging } from "#src/components/CloudMessaging/firebase-cloud-messaging";
import { isIdenticalLists, type LngLat } from "#src/components/GoogleMap/utils";
import { registerSW } from "#src/utils/service-worker";
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

/** for GoogleMaps external class */
export const setMapClickedEventId = (eventId: number | null) => {
  useStore.setState({ mapClickedEventId: eventId });
};

//export const getTileIdsInView = useStore.select.tileIdsInView();

/** for FirebaseCloudMessaging external class */
export const setFcmLatestMessagePayload = (payload: MessagePayload) =>
  useStore.setState({ fcmLatestMessagePayload: payload });

export const initFcm = async () => {
  if (useStore.getState().fcm !== null) return;

  const registration = await registerSW();
  if (registration) {
    const fcm = new FirebaseCloudMessaging(registration);
    const ok = await fcm.init();
    if (ok) {
      useStore.setState({ fcm });
    }
  }
};
