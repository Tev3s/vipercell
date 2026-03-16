const CACHE_NAME = 'vipercell-pwa-v11.8.5';
const urlsToCache = [
  './index.html',
  './manifest.json'
];

// Install Service Worker & Cache File
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Bersihkan Cache Lama jika ada Update
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Mode Offline (Ambil dari Cache jika tidak ada sinyal)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    }).catch(() => {
      return caches.match('./index.html');
    })
  );
});

// Menangani Notifikasi Asli (Push)
self.addEventListener('push', event => {
  let data = { title: 'Vipercell', body: 'Ada pengumuman baru untuk Anda!' };
  
  if (event.data) {
    data = event.data.json();
  }
  
  const options = {
    body: data.body,
    icon: 'https://via.placeholder.com/192/f97316/ffffff?text=VC',
    badge: 'https://via.placeholder.com/96/f97316/ffffff?text=VC',
    vibrate: [200, 100, 200],
    data: { url: self.location.origin }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Aksi saat Notifikasi Diklik (Buka Aplikasi)
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      if (windowClients.length > 0) {
        windowClients[0].focus();
      } else {
        clients.openWindow('/');
      }
    })
  );
});