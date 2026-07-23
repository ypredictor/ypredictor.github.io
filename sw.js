const APP_VERSION="0ecb274df7ba";
const CACHE='pred-cache-v3';
const ASSETS=['index.html','corpus.gz','manifest.webmanifest','version.json','predictor-tree.json.gz'];
const PASSTHRU=/\/(sitemap\.xml|robots\.txt|google[0-9a-f]+\.html)$/;
const shouldCache=function shouldCache(resp) {
  const OK_TYPES = new Set(["basic", "default", "cors"]);
  return !!resp && resp.ok === true && resp.status === 200 && OK_TYPES.has(resp.type);
};
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS.map(u=>new Request(u,{cache:'no-cache'})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
async function swr(key){
  const cache=await caches.open(CACHE);
  const cached=await cache.match(key,{ignoreSearch:true});
  const net=fetch(key,{cache:'no-cache'}).then(async resp=>{ if(shouldCache(resp)){ await cache.put(key,resp.clone()); } return resp; }).catch(()=>null);
  return cached||net||fetch(key);
}
async function checkUpdate(){
  try{ const cache=await caches.open(CACHE);
    const resp=await fetch('version.json',{cache:'no-store'}); if(!shouldCache(resp))return;
    const {version}=await resp.clone().json();
    const html=await fetch('index.html',{cache:'no-store'}); if(!shouldCache(html))return;
    await cache.put('version.json',resp.clone()); await cache.put('index.html',html.clone());
    if(version!==APP_VERSION){ const gz=await fetch('corpus.gz',{cache:'no-store'}); if(shouldCache(gz)) await cache.put('corpus.gz',gz.clone()); const tg=await fetch('predictor-tree.json.gz',{cache:'no-store'}).catch(()=>null); if(tg&&shouldCache(tg)) await cache.put('predictor-tree.json.gz',tg.clone()); const cs=await self.clients.matchAll(); cs.forEach(c=>c.postMessage({type:'updated',version})); }
  }catch(e){}
}
self.addEventListener('fetch',e=>{ const u=new URL(e.request.url);
  if(PASSTHRU.test(u.pathname)){ return; }
  if(e.request.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('index.html')){ e.respondWith(swr('index.html')); return; }
  if(u.pathname.endsWith('version.json')){ e.respondWith(swr('version.json')); return; }
  if(u.pathname.endsWith('corpus.gz')){ e.respondWith(caches.open(CACHE).then(c=>c.match('corpus.gz',{ignoreSearch:true})).then(r=>r||fetch('corpus.gz'))); return; }
  if(u.pathname.endsWith('predictor-tree.json.gz')){ e.respondWith(caches.open(CACHE).then(c=>c.match('predictor-tree.json.gz',{ignoreSearch:true})).then(r=>r||fetch('predictor-tree.json.gz'))); return; }
});
self.addEventListener('message',e=>{ if(e.data==='check-update') checkUpdate(); });
self.addEventListener('activate',()=>checkUpdate());
