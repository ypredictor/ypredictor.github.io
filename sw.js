const APP_VERSION="1ebadb6630d3";
const CACHE='pred-cache-v2';
const ASSETS=['index.html','manifest.webmanifest','version.json'];
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
    if(version!==APP_VERSION){ const cs=await self.clients.matchAll(); cs.forEach(c=>c.postMessage({type:'updated',version})); }
  }catch(e){}
}
self.addEventListener('fetch',e=>{ const u=new URL(e.request.url);
  if(e.request.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('index.html')){ e.respondWith(swr('index.html')); return; }
  if(u.pathname.endsWith('version.json')){ e.respondWith(swr('version.json')); return; }
});
self.addEventListener('message',e=>{ if(e.data==='check-update') checkUpdate(); });
self.addEventListener('activate',()=>checkUpdate());
