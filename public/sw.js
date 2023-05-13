System.register("fetch", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
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
    exports_1("default", onFetch);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("sw", ["fetch"], function (exports_2, context_2) {
    "use strict";
    var fetch_1;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (fetch_1_1) {
                fetch_1 = fetch_1_1;
            }
        ],
        execute: function () {
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
            self.addEventListener("fetch", fetch_1.default);
        }
    };
});
