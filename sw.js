// Service worker: сначала сеть (чтобы приходили обновления), а если сети нет — копия из кэша
var CACHE = 'och41-v3', FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', function(e) { e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(FILES); }).then(function() { return self.skipWaiting(); })); });
self.addEventListener('activate', function(e) { e.waitUntil(caches.keys().then(function(ks) { return Promise.all(ks.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); })); }).then(function() { return self.clients.claim(); })); });
self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(function(r) { var c = r.clone(); caches.open(CACHE).then(function(ch) { ch.put(e.request, c); }); return r; }).catch(function() { return caches.match(e.request); }));
});
