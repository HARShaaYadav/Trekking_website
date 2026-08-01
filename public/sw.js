// Service Worker for Trekking Arunachal Pradesh
const CACHE_NAME = "arunachal-trek-cache-v2";

const PRECACHE_ASSETS = [
    "/",
    "/offline",
    "/manifest.webmanifest",
    "/icon.svg",
    "/Sangester.png",
    "/Ziro.png",
    "/DongValley.png",
    "/anini.png",
    "/Gorichen.png",
    "/BaileyTrek.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_ASSETS).catch((err) => {
                console.warn("Pre-caching partial failure:", err);
            });
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    const { request } = event;

    // Ignore non-GET requests and API calls
    if (request.method !== "GET" || request.url.includes("/api/")) {
        return;
    }

    // HTML Navigation requests: Network-first, fallback to cache, then offline page
    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response.status === 200) {
                        const copy = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                    }
                    return response;
                })
                .catch(async () => {
                    const cachedResponse = await caches.match(request);
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    const offlinePage = await caches.match("/offline");
                    if (offlinePage) {
                        return offlinePage;
                    }
                    return new Response("Offline - Trekking Arunachal Pradesh", {
                        headers: { "Content-Type": "text/plain" }
                    });
                })
        );
        return;
    }

    // Static assets (images, fonts, scripts, css): Cache-first with network fallback
    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) {
                return cached;
            }
            return fetch(request).then((response) => {
                if (response.status === 200) {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                }
                return response;
            }).catch(() => {
                // Return empty if completely unreachable
                return new Response("", { status: 408 });
            });
        })
    );
});
