"use client";

import Script from "next/script";
import { useEffect, useRef, useState, type Component } from "react";
import { createHtmlPortalNode, InPortal, OutPortal, type HtmlPortalNode } from "#src/lib/reverse-portal";
import { useStore } from "#src/store";
import { absUrl } from "#src/utils/url";

/** renders google-maps without reloading everything (OutPortal) */
export function GoogleMap() {
  const mapPortalNode = useStore.select.mapPortalNode();
  if (!mapPortalNode) return null;

  return <OutPortal node={mapPortalNode} />;
}

/**
 * load google-maps into an external dom node (InPortal)
 */
export function GoogleMapPortal() {
  const mapSetPortalNode = useStore.select.mapSetPortalNode();
  const portalNode = useHtmlPortalNode();

  useEffect(() => {
    if (portalNode) {
      mapSetPortalNode(portalNode);
    }
  }, [portalNode, mapSetPortalNode]);

  if (!portalNode) return null;
  return (
    <InPortal node={portalNode} className="h-full w-full bg-cyan-500">
      <GoogleMapDiv />
    </InPortal>
  );
}

export function GoogleMapsScript() {
  const initGoogleMaps = useStore.select.initGoogleMaps();
  return (
    <Script
      src={absUrl("/google-maps.js")} //"https://howler.andyfx.net/google-maps.js"
      strategy="lazyOnload"
      onLoad={() => initGoogleMaps()}
    />
  );
}

function GoogleMapDiv() {
  const mapRef = useRef(null);
  const googleMaps = useStore.select.googleMaps();

  useEffect(() => {
    if (!googleMaps || !mapRef.current) return;
    googleMaps.render(mapRef.current);
  }, [googleMaps]);

  return <div ref={mapRef} className="h-full w-full" />;
}

function useHtmlPortalNode() {
  const [portalNode, setPortalNode] = useState<HtmlPortalNode<Component<any>> | null>(null);
  useEffect(() => {
    //more or less document.createElement()
    const node = createHtmlPortalNode({
      attributes: { style: "width:100%;height:100%;" },
    });
    setPortalNode(node);
  }, []);

  return portalNode;
}
