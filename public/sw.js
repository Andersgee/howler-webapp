self.addEventListener("install", (event) => {
    event.waitUntil((async () => {
        await self.skipWaiting();
        console.log("SW: installed");
    })());
});
self.addEventListener("activate", (event) => {
    event.waitUntil((async () => {
        await self.clients.claim();
        console.log("SW: activated");
    })());
});
self.addEventListener("fetch", onFetch);
function onFetch(event) {
    event.respondWith((async () => {
        const response = await event.preloadResponse;
        if (response) {
            console.log("SW: returning preloadResponse instead of fetching");
            return response;
        }
        console.log("SW: returning regular fetch response");
        return fetch(event.request);
    })());
}
export {};
