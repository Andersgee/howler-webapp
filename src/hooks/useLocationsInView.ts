import { useStore } from "#src/store";
import { api } from "./api";

export function useLocationsInView() {
  //const [locationsInView, setLocationsInView] = useState(1);
  const tileIdsInView = useStore.select.tileIdsInView();

  const { data: locationsInView } = api.tile.multipleTileLocations.useQuery({ tileIds: tileIdsInView });

  return locationsInView;
}
