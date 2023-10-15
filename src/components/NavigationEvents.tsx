"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function NavigationEvents() {
  const pathname = usePathname();
  //const searchParams = useSearchParams();

  useEffect(() => {
    //const url = `${pathname}?${searchParams}`;
    const paths = pathname.split("/");
    //console.log({ paths }); // [ "", "test" ]
    const isEventPage = paths.length === 3 && paths[1] === "event";

    if (isEventPage) {
      //
    } else {
      //
    }
  }, [pathname]);

  return null;
}
