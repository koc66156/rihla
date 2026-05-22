// رِحلة — Service Worker v3
// نسخة بسيطة جداً — بدون كاش إجباري
const CACHE = 'rihla-v3';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // احذف كل الكاش القديم
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// لا نتدخل في أي طلبات — الشبكة أولاً دائماً
self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
