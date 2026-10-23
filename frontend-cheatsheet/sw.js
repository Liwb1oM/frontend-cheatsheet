/* Service worker: працює офлайн.
   Стратегія: stale-while-revalidate — миттєво віддаємо з кешу, а в тлі оновлюємо.
   Після зміни файлів збільшіть VERSION, щоб старий кеш видалився. */
const VERSION = "v1";
const CACHE = "cheatsheet-" + VERSION;

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/styles.css",
  "./js/app.js",
  "./js/i18n.js",
  "./js/highlight.js",
  "./js/data/html.js",
  "./js/data/css.js",
  "./js/data/tailwind.js",
  "./js/data/javascript.js",
  "./js/data/typescript.js",
  "./js/data/react.js",
  "./js/data/tools.js",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("cheatsheet-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req, { ignoreSearch: true });
      const network = fetch(req)
        .then((res) => {
          if (res && res.ok) cache.put(req, res.clone());
          return res;
        })
        .catch(() => null);

      if (cached) {
        event.waitUntil(network);
        return cached;
      }
      const res = await network;
      if (res) return res;
      // Офлайн і немає в кеші: для переходів віддаємо головну сторінку
      if (req.mode === "navigate") return (await cache.match("./index.html")) || Response.error();
      return Response.error();
    })
  );
});
