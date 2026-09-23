// عمّالي — Service Worker (تخزين مؤقت للعمل دون اتصال)
const CACHE = 'amali-v33';
const CORE = ['./', './index.html', './manifest.json', './icon-180.png'];
const OCR = ['./ocr/tesseract.min.js', './ocr/worker.min.js', './ocr/tesseract-core-simd-lstm.wasm.js', './ocr/tesseract-core-lstm.wasm.js', './ocr/ara.wasm'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE).catch(() => {}))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return; // لا يعترض طلبات claude.ai
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
    const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy).catch(() => {})); return res;
  }).catch(() => caches.match('./index.html'))));
});
