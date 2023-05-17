/// <reference lib="webworker" />
//import { CACHES } from "./utils/constants"
//import onFetch from "./fetch";
//import onMessage from "./messages"

export {}; //typescript considers this file a script...

declare var self: ServiceWorkerGlobalScope;

//events: install, activate, message
//Functional events: fetch, sync, push

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      //const cache = await caches.open(CACHES.next)
      //await cache.add("/")
      await self.skipWaiting();

      console.log("SW: installed");
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // remove caches that aren't used anymore
      //const cacheNames = await caches.keys();
      //const appCaches = Object.values(CACHES);
      //await Promise.allSettled(
      //  cacheNames.filter((cacheName) => !appCaches.includes(cacheName)).map((cacheName) => caches.delete(cacheName))
      //);

      // immediately claim clients to avoid de-sync
      await self.clients.claim();

      console.log("SW: activated");
    })()
  );
});

//self.addEventListener("message", onMessage);
self.addEventListener("fetch", onFetch);
//self.addEventListener("push", onPush)

function onFetch(event: FetchEvent) {
  //may or may not check service worker cache here
  //see https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent/preloadResponse#examples
  //lets keep it simple for now but atleast use the preloadResponse if it exists
  event.respondWith(
    (async () => {
      const response = await event.preloadResponse;
      if (response) {
        console.log("SW: returning preloadResponse instead of fetching");
        return response;
      }
      console.log("SW: returning regular fetch response");
      return fetch(event.request);
    })()
  );
}
