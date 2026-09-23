// عمّالي — Service Worker (تخزين مؤقت للعمل دون اتصال)
const CACHE = 'amali-v35';
const CORE = ['./', './index.html', './manifest.json', './icon-180.png'];
const FONTS_FILES = ['plex','naskh','cairo','tajawal','almarai','amiri','kufi','readex','markazi'].flatMap(f=>['./fonts/'+f+'-400.woff2','./fonts/'+f+'-700.woff2']).concat(['./fonts/plex-600.woff2','./fonts/kufi-600.woff2','./fonts/readex-600.woff2']);
const OCR = ['./ocr/tesseract.min.js', './ocr/worker.min.js', './ocr/tesseract-core-simd-lstm.wasm.js', './ocr/tesseract-core-lstm.wasm.js', './ocr/ara.wasm'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE.concat(FONTS_FILES)).catch(() => {}))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return; // لا يعترض طلبات claude.ai
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
    const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy).catch(() => {})); return res;
  }).catch(() => caches.match('./index.html'))));
});
