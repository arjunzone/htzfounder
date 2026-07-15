// Himal Trading Zone Admin Panel — minimal service worker
// শুধু PWA ইন্সটল-এর শর্ত পূরণের জন্য (offline caching দরকার নেই, কারণ Firebase লাইভ ডেটা লাগে)

const CACHE_NAME = 'htz-admin-shell-v1';
const SHELL_FILES = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

// Network-first: সবসময় লাইভ ডেটা/আপডেট আগে চেষ্টা করবে, শুধু নেট না থাকলে cache থেকে shell দেখাবে
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
