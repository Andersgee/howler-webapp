"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MapComponent } from "./MapComponent";

function useElementById(elementId: string) {
  const pathname = usePathname();
  const [value, setValue] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setValue(document.getElementById(elementId));
  }, [pathname, elementId]);

  return value;
}

export function ExamplePortal() {
  const el = useElementById("myhellodiv");
  if (!el) return null;

  return createPortal(<MapComponent />, el);
}
