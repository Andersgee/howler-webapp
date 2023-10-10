"use client";

import Script from "next/script";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { absUrl } from "#src/utils/url";
import { GOOGLE_MAPS_ELEMENT_ID, googleMaps } from "./google-maps";

type Value = {
  googleMapIsReady: boolean;
  visible: boolean;
  //setVisible: Dispatch<SetStateAction<boolean>>;
};

const initialState: Value = {
  googleMapIsReady: false,
  visible: false,
};

const Context = createContext<Value | undefined>(undefined);
const Dispatch = createContext<React.Dispatch<Action> | undefined>(undefined);

export function useMapContext() {
  const ctx = useContext(Context);
  if (ctx === undefined) throw new Error("context does not have provider");
  return ctx;
}

export function useMapDispatch() {
  const ctx = useContext(Dispatch);
  if (ctx === undefined) throw new Error("context does not have provider");
  return ctx;
}

export function GoogleMapsProvider({ children }: { children: React.ReactNode }) {
  const [value, dispatch] = useReducer(reducer, initialState);
  const [libIsLoaded, setLibIsloaded] = useState(false);

  useEffect(() => {
    if (!libIsLoaded || value.googleMapIsReady) return;

    //console.log("google maps init");
    googleMaps
      .init()
      .then(() => {
        dispatch({ type: "ready" });
        //console.log("google maps ready");
        //setGoogleMapIsReady(true);
      })
      .catch(() => {
        //ignore
      });
  }, [libIsLoaded, value.googleMapIsReady]);

  return (
    <Context.Provider value={value}>
      <Dispatch.Provider value={dispatch}>{children}</Dispatch.Provider>
      <Script
        src={absUrl("/google-maps.js")} //"https://howler.andyfx.net/google-maps.js"
        strategy="lazyOnload"
        onLoad={() => setLibIsloaded(true)}
      />
    </Context.Provider>
  );
}

type Action =
  | { type: "ready" }
  | { type: "show"; name: "map" }
  | { type: "hide"; name: "map" }
  | { type: "toggle"; name: "map" };

function reducer(value: Value, action: Action): Value {
  if (action.type === "ready") {
    return { ...value, googleMapIsReady: true };
  } else if (action.type === "toggle") {
    if (value.visible) {
      return { ...value, visible: false };
    } else {
      return { ...value, visible: true };
    }
  } else if (action.type === "show" && action.name === "map") {
    return { ...value, visible: true };
  } else if (action.type === "hide" && action.name === "map") {
    return { ...value, visible: false };
  } else {
    return value;
  }
}
