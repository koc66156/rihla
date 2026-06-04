const CACHE = 'rihla-' + '2026-06-04';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // حذف الكاش القديم تلقائياً
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // HTML دائماً من الشبكة (أحدث نسخة)
  if(e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  // باقي الملفات من الكاش
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
