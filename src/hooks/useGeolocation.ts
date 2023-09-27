import { useCallback, useState } from "react";

/**
 * hook for `navigator.geolocation.getCurrentPosition`
 */
export function useGeolocation() {
  const [geolocationPosition, setPos] = useState<GeolocationPosition | null>(null);

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (p) => setPos(p),
      () => {
        alert(
          "Accessing location is blocked. Please open your browser preferences or click the lock near the address bar to allow access to your location."
        );
      }
    );
  }, []);

  return { geolocationPosition, getCurrentPosition };
}
