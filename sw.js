/* Núcleo Reposição – funcionamento como aplicativo (PWA) */
const VERSION = 'nucleo-v3';
const CORE = ['./', './index.html', './app.js', './changelog.js', './comissao.js', './admin.js', './alertas.js', './painel_tv.js', './design.js', './design.css', './feedbacks.js', './nc.js', './fbdocs.js', './retornos.js', './lancamentos.js', './coletores.js', './devolucao.js', './scanner.js', './manifest.json', './icon-192.png', './icon-512.png', './logo.png', './logo-branco.png'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    await Promise.all(CORE.map(u => c.add(u).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== VERSION) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;                       // envios (login, bases) passam direto
  const u = new URL(req.url);
  // dados do Google (planilhas, Apps Script) NUNCA vêm do cache: sempre ao vivo
  if (u.hostname.endsWith('google.com') || u.hostname.endsWith('googleusercontent.com')) return;
  if (u.origin === location.origin) { e.respondWith(networkFirst(req)); return; }
  if (/cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|unpkg\.com|fonts\.googleapis\.com|fonts\.gstatic\.com/.test(u.hostname)) e.respondWith(cacheFirst(req));
});

// Site: tenta a versão nova (até 4 s); sem internet ou rede lenta, usa a cópia salva.
async function networkFirst(req) {
  const c = await caches.open(VERSION);
  const net = fetch(req, { cache: 'no-cache' }).then(r => { if (r && r.ok) c.put(req, r.clone()); return r; });
  net.catch(() => {});
  const cached = (await c.match(req, { ignoreSearch: true })) || (req.mode === 'navigate' ? await c.match('./index.html') : undefined);
  if (!cached) return net;
  try { return await Promise.race([net, new Promise((_, rej) => setTimeout(() => rej(0), 4000))]); }
  catch (e) { return cached; }
}

// Bibliotecas e fontes: usa a cópia salva; baixa só na primeira vez.
async function cacheFirst(req) {
  const c = await caches.open(VERSION);
  const m = await c.match(req);
  if (m) return m;
  const r = await fetch(req);
  if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone());
  return r;
}

/* Notificações push (celular e computador), mesmo com o aplicativo fechado */
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { corpo: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.titulo || 'Núcleo Reposição', {
    body: d.corpo || '', tag: d.tag || 'nucleo', renotify: true, icon: './icon-192.png', badge: './icon-192.png', data: { url: d.url || './' }
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil((async () => {
    const lista = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of lista) { if ('focus' in c) { await c.focus(); c.postMessage({ tipo: 'abrir-alertas' }); return; } }
    await self.clients.openWindow((e.notification.data && e.notification.data.url) || './');
  })());
});
