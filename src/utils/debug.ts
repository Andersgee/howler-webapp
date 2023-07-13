import type { NextRequest } from "next/server";

/** simulate slow db call */
export async function artificialDelay(ms = 2000) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
  //if (process.env.NODE_ENV === "development") {
  //  return await new Promise((resolve) => setTimeout(resolve, ms));
  //}
}

//https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent?utm_source=mozilla&utm_medium=devtools-netmonitor&utm_campaign=default
//syntax:
//User-Agent: <product> / <product-version> <comment>
export function consolelog_useragent(req: NextRequest) {
  const User_Agent = req.headers.get("User-Agent");
  console.log("User-Agent:", User_Agent);
}
