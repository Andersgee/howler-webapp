/// <reference lib="webworker" />

export default function onFetch(event: FetchEvent) {
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
