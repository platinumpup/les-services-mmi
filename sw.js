const CACHE_NAME = "les-services-mmi-v32";
const ASSETS = [
  "./",
  "./index.html",
  "./fr/",
  "./fr/index.html",
  "./styles.css",
  "./app.js",
  "./ruler.css",
  "./ruler.js",
  "./manifest.webmanifest",
  "./robots.txt",
  "./assets/favicon.ico",
  "./assets/favicon.svg",
  "./assets/favicon-16.png",
  "./assets/favicon-32.png",
  "./assets/apple-touch-icon.png",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/maskable-icon-512.png",
  "./assets/mmi-icon-16.png",
  "./assets/mmi-icon-32.png",
  "./assets/mmi-icon-48.png",
  "./assets/mmi-icon-64.png",
  "./assets/mmi-icon-128.png",
  "./assets/mmi-icon-180.png",
  "./assets/mmi-icon-192.png",
  "./assets/mmi-icon-256.png",
  "./assets/mmi-icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).catch(() => {
        if (event.request.mode === "navigate") {
          return event.request.url.includes("/fr/")
            ? caches.match("./fr/index.html")
            : caches.match("./index.html");
        }
        return caches.match("./index.html");
      });
    })
  );
});
