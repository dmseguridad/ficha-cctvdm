const CACHE = 'dm-fichas-v6';
const SHELL = [
  './', './manifest.json', './icon.svg', './logo.png', './apple-touch-icon.png',
  './cctv/index.html', './cctv/logo.png',
  './vehicular/index.html', './vehicular/logo.png',
  './alarmas/index.html', './alarmas/logo.png',
  './cerco/index.html', './cerco/logo.png',
  './videoporteros/index.html', './videoporteros/logo.png',
  './visita/index.html', './visita/logo.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Network-first: always use the freshest version when there is a connection;
   fall back to the last cached copy only when offline (field work with no signal). */
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(e.request).then(resp => {
      if (resp && resp.ok) {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return resp;
    }).catch(() => caches.match(e.request))
  );
});
