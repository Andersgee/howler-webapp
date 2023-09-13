"use client";

import Script from "next/script";
import { createContext, useContext, useEffect, useState } from "react";
import { GOOGLE_MAPS_ELEMENT_ID, googleMaps } from "./google-maps";

type Value = { isLoaded: boolean };
const Context = createContext<Value | undefined>(undefined);

export function useMapContext() {
  const ctx = useContext(Context);
  if (ctx === undefined) throw new Error("context does not have provider");
  return ctx;
}

export function GoogleMapsProvider({ children }: { children: React.ReactNode }) {
  const [libIsLoaded, setLibIsloaded] = useState(false);
  const [value, setValue] = useState({ isLoaded: false });

  useEffect(() => {
    if (!libIsLoaded) return;

    googleMaps
      .initialize(GOOGLE_MAPS_ELEMENT_ID)
      .then(() => {
        setValue({ isLoaded: true });
      })
      .catch(() => {
        //ignore
      });
  }, [libIsLoaded]);

  return (
    <Context.Provider value={value}>
      {children}
      <Script
        src="https://howler.andyfx.net/google-maps.js"
        strategy="lazyOnload"
        onLoad={() => setLibIsloaded(true)}
      />
    </Context.Provider>
  );
}
