// رِحلة — Service Worker v2
const CACHE = 'rihla-v2';

// عند التثبيت — لا نخزن شيئاً إجبارياً
self.addEventListener('install', e => {
  self.skipWaiting();
});

// عند التفعيل — احذف الكاش القديم
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// الطلبات — Network أولاً، الكاش كنسخة احتياطية فقط
self.addEventListener('fetch', e => {
  // تجاهل أي طلب ليس GET أو ليس HTTP
  if (e.request.method !== 'GET') return;
  if (!e.request.url.startsWith('http')) return;
  // تجاهل طلبات Google Fonts وغيرها الخارجية من الكاش
  if (e.request.url.includes('fonts.googleapis') || e.request.url.includes('fonts.gstatic')) return;

  e.respondWith(
    fetch(e.request)
      .then(response => {
        // خزّن نسخة فقط إذا نجح الطلب
        if (response.ok && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return response;
      })
      .catch(() => {
        // فشل الشبكة — ابحث في الكاش
        return caches.match(e.request);
      })
  );
});
