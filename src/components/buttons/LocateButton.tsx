import { cn } from "#src/utils/cn";
import { IconLocate } from "../Icons";
import { Button } from "../ui/Button";

export type Pos = { lng: number; lat: number };

type Props = {
  className?: string;
  label: string;
  onLocated: (pos: Pos) => void;
};

export function LocateButton({ className, onLocated, label }: Props) {
  return (
    <Button
      variant="secondary"
      className={cn("font-semibold", className)}
      onClick={() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };

              //infoWindow.setPosition(pos);
              //infoWindow.setContent("Location found.");
              //infoWindow.open(map);
              //map.setCenter(pos);
              //return pos;
              onLocated(pos);
            },
            () => {
              alert(
                "Accessing location is blocked. Please open your browser preferences or click the lock near the address bar to allow access to your location."
              );

              //handleLocationError(true, infoWindow, map.getCenter());
            }
          );
        } else {
          // Browser doesn't support Geolocation
          //handleLocationError(false, infoWindow, map.getCenter());
        }
      }}
    >
      <IconLocate /> <span className="ml-2">{label}</span>
    </Button>
  );
}
