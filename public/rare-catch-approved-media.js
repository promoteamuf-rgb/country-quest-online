/* Approved Rare Catch 2.0 illustrations and animated WebP previews.
   All assets are served from this website, not third-party hosts. */
(()=>{
'use strict';
const valid=new Set(['hero','cast_art','splash_art','deep_art','legendary_art','results_art','fish_tiers_art','cast_animation','legendary_animation']);
const promises=new Map(),$=id=>document.getElementById(id);
const box=document.querySelector('.catch-world');
if(!box)return;
box.insertAdjacentHTML('beforeend','<div class="approved-scene" id="approvedScene" aria-hidden="true"><div class="approved-frame"><img id="approvedMedia" alt="" decoding="async"></div><div class="approved-light"></div></div>');
async function get(name){
 if(!valid.has(name))throw Error('Unknown media '+name);
 if(promises.has(name))return promises.get(name);
 const task=fetch('/cq2-assets/'+name+'.webp.base64',{cache:'force-cache'})
  .then(r=>{if(!r.ok)throw Error('Asset not found: '+name);return r.text()})
  .then(s=>{
   const b64=s.trim();
   if(b64.length<1000||!(/^[A-Za-z0-9+/]+={0,2}$/.test(b64)))throw Error('Invalid asset '+name);
   return 'data:image/webp;base64,'+b64;
  });
 promises.set(name,task);
 return task;
}
let requested=0;
function show(name){
 const token=++requested,root=$('approvedScene'),img=$('approvedMedia');
 if(!root||!img)return;
 root.classList.remove('visible','media-ready');
 root.dataset.scene=name;
 get(name).then(src=>{
  if(requested!==token)return;
  img.src=src;
  root.classList.add('visible');
  requestAnimationFrame(()=>root.classList.add('media-ready'));
 }).catch(()=>{if(requested===token)root.classList.remove('visible')});
}
function hide(){
 requested++;
 const root=$('approvedScene');
 if(root){root.classList.remove('visible','media-ready');root.dataset.scene=''}
}
function applyImage(name,id){
 get(name).then(src=>{const e=$(id);if(e)e.src=src}).catch(()=>{});
}
function loadHero(){
 return get('hero').then(src=>{
  const poster=$('posterArt');
  if(poster){poster.src=src;document.body.classList.add('poster-ready')}
  return src;
 });
}
function preload(){
 for(const name of ['hero','cast_animation','legendary_animation','deep_art','legendary_art','fish_tiers_art']){
  get(name).catch(()=>{});
 }
}
window.CQRareMedia={get,show,hide,applyImage,loadHero,preload};
preload();
})();
