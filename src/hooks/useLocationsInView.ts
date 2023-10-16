import { useEffect, useRef } from "react";
import { useStore } from "#src/store";
import { api } from "./api";

export function useLocationsInView() {
  //const [locationsInView, setLocationsInView] = useState(1);
  const tileIdsInView = useStore.select.tileIdsInView();

  const googleMaps = useStore.select.googleMaps();
  const didRender = useRef(false);

  const { data: locationsInView } = api.tile.multipleTileLocations.useQuery({ tileIds: tileIdsInView });

  useEffect(() => {
    if (!googleMaps) return;

    //make sure to hide markers once
    if (didRender.current == false) {
      googleMaps.hideAllMarkers();
      didRender.current = true;
    }

    if (!locationsInView) return;
    googleMaps.setExploreMarkers(locationsInView);
  }, [googleMaps, locationsInView]);

  return locationsInView;
}

export function useLocationsInTiles() {
  //const [locationsInView, setLocationsInView] = useState(1);
  const tileIdsInView = useStore.select.tileIdsInView();

  const { data } = api.tile.multipleTileLocations.useQuery({ tileIds: tileIdsInView });

  return data;
}
