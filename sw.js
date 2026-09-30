const CACHE='cm-v13';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.hostname.includes('script.google.com')||u.hostname.includes('googleusercontent.com'))return;
  if(r.mode==='navigate'){ // cache se turant kholo (slow net me bhi), peeche se naya version le aao
    e.respondWith(caches.match('index.html').then(m=>{
      const n=fetch(r).then(x=>{if(x.ok){const c=x.clone();caches.open(CACHE).then(k=>k.put('index.html',c))}return x}).catch(()=>m);
      return m||n}));return}
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{const c=x.clone();caches.open(CACHE).then(k=>k.put(r,c));return x})));
});
