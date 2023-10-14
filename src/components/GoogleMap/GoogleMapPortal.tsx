"use client";

import { useEffect, useState, type Component } from "react";
import { createHtmlPortalNode, InPortal, OutPortal, type HtmlPortalNode } from "#src/lib/reverse-portal";
import { useStore } from "#src/store";
import { MapComponent } from "./MapComponent";

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

export function GoogleMapInPortal() {
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
      <MapComponent />
    </InPortal>
  );
}

export function GoogleMapOutPortal() {
  const mapPortalNode = useStore.select.mapPortalNode();
  if (!mapPortalNode) return null;

  return <OutPortal node={mapPortalNode} />;
}
