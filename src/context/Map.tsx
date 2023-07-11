"use client";

import Script from "next/script";
import { createContext, useContext, useEffect, useState } from "react";

type Value = { isLoaded: boolean };
const Context = createContext<Value | undefined>(undefined);

export function useMapContext() {
  const ctx = useContext(Context);
  if (ctx === undefined) throw new Error("context does not have provider");
  return ctx;
}

export function MapProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState({ isLoaded: false });

  return (
    <Context.Provider value={value}>
      {children}
      <Script
        src="https://howler.andyfx.net/google-maps.js"
        strategy="lazyOnload"
        onLoad={() => setValue({ isLoaded: true })}
      />
    </Context.Provider>
  );
}
