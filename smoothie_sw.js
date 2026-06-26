/* Smoothie Builder — offline service worker */
const CACHE = 'smoothie-v14';
const ASSETS = [
  'index.html',
  'smoothie_manifest.json',
  'smoothie_icon.svg'
];

self.addEventListener('install', e => {
  // pre-cache the new assets but DON'T auto-activate — wait for the page to
  // send SKIP_WAITING (user taps "Update") so we never reload mid-use.
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

// page asks us to take over now (user tapped Update / Check for updates)
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached =>
      cached || fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return res;
      }).catch(() => cached)
    )
  );
});
