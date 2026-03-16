const CACHE_NAME = 'vipercell-pwa-v11.8.6';

// Langsung install tanpa syarat file eksternal (Bulletproof)
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// Wajib ada event fetch agar Chrome meresmikan ini sebagai PWA
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response('Vipercell sedang offline. Pastikan koneksi internet aktif.');
    })
  );
});

// Handle Notifikasi Push Native
self.addEventListener('push', event => {
  let data = { title: 'Vipercell', body: 'Ada pengumuman baru untuk Anda!' };
  if (event.data) {
    data = event.data.json();
  }
  const options = {
    body: data.body,
    vibrate: [200, 100, 200]
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

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
