const CACHE_NAME = 'space-invaders-v1';
const urlsToCache = [
    './',
    './index.html',
    './css/style.css',
    './css/mobile.css',
    './css/fullscreen.css',
    './js/main.js',
    './js/config.js',
    './js/scenes/MenuScene.js',
    './js/scenes/GameScene.js',
    './js/scenes/GameOverScene.js',
    './js/mobile/TouchControls.js',
    './js/mobile/FullscreenHelper.js',
    './js/mobile/SimpleFullscreen.js',
    './assets/images/favicon.png',
    './assets/images/oembed.png',
    './manifest.json',
    'https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.min.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            }
        )
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
}); 