"use client";

import Script from "next/script";
import { useEffect, useRef, useState, type Component } from "react";
import { createHtmlPortalNode, InPortal, OutPortal, type HtmlPortalNode } from "#src/lib/reverse-portal";
import { useStore } from "#src/store";
import { absUrl } from "#src/utils/url";

/**
 * renders google-maps without reloading everything (OutPortal)
 *
 * parent element decides size
 */
export function GoogleMap() {
  const mapPortalNode = useStore.use.mapPortalNode();
  if (!mapPortalNode) return null;

  return <OutPortal node={mapPortalNode} />;
}

/**
 * load google-maps into an external dom node (InPortal)
 */
export function GoogleMapPortal() {
  const mapSetPortalNode = useStore.use.mapSetPortalNode();
  const portalNode = useHtmlPortalNode();

  useEffect(() => {
    if (portalNode) {
      mapSetPortalNode(portalNode);
    }
  }, [portalNode, mapSetPortalNode]);

  if (!portalNode) return null;
  return (
    <InPortal node={portalNode} className="h-full w-full">
      <GoogleMapDiv />
    </InPortal>
  );
}

export function GoogleMapsScript() {
  const loadGoogleMapsLibs = useStore.use.loadGoogleMapsLibs();
  return <Script src={absUrl("/google-maps.js")} strategy="lazyOnload" onLoad={() => loadGoogleMapsLibs()} />;
}

function GoogleMapDiv() {
  const mapRef = useRef(null);
  const googleMapsIsReadyToRender = useStore.use.googleMapsLibsAreLoaded();
  const initGoogleMaps = useStore.use.initGoogleMaps();

  useEffect(() => {
    if (!googleMapsIsReadyToRender || !mapRef.current) return;
    initGoogleMaps(mapRef.current);
  }, [googleMapsIsReadyToRender, initGoogleMaps]);

  return <div ref={mapRef} id="my-google-map-div" className="h-full w-full" />;
}

function useHtmlPortalNode() {
  const [portalNode, setPortalNode] = useState<HtmlPortalNode<Component<any>> | null>(null);
  useEffect(() => {
    //more or less document.createElement()
    //this creates the <OutPortal> div that renders what you put as children to <InPortal>
    const node = createHtmlPortalNode({
      attributes: { style: "width:100%;height:100%;" },
    });
    setPortalNode(node);
  }, []);

  return portalNode;
}
