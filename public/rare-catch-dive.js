/* Rare Catch hook-camera: a lightweight 2D descent driven only by
   CSS transforms, short timers and the existing fish SVGs. */
(()=>{
'use strict';
const scene=document.getElementById('diveScene');
if(!scene)return;
const el=id=>document.getElementById(id);
const reduce=!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const tiers={
 10:{depth:22,travel:48,duration:850,scale:.65},
 25:{depth:65,travel:83,duration:1050,scale:.8},
 40:{depth:140,travel:140,duration:1270,scale:.95},
 60:{depth:310,travel:202,duration:1510,scale:1.14},
 80:{depth:660,travel:269,duration:1730,scale:1.3},
 100:{depth:1120,travel:348,duration:1980,scale:1.5}
};
let timers=[],ticker=null,run=0,current=null,labels=null,startedAt=0;
const zones=[
 {max:50,en:'SUNLIT SHALLOWS',sv:'SOLIGT GRUNDVATTEN'},
 {max:160,en:'CORAL REEF',sv:'KORALLREV'},
 {max:380,en:'OPEN BLUE',sv:'ÖPPET BLÅTT HAV'},
 {max:780,en:'TWILIGHT ZONE',sv:'SKYMNINGSZONEN'},
 {max:Infinity,en:'LEGENDARY DEEP',sv:'LEGENDARISKT DJUP'}
];
const currentLang=()=>document.documentElement.lang==='sv'?'sv':'en';
const zoneFor=depth=>zones.find(z=>depth<=z.max)||zones[zones.length-1];
const format=number=>Math.round(number).toLocaleString(currentLang()==='sv'?'sv-SE':'en-GB');
function cancel(){
 run++;
 for(const t of timers)clearTimeout(t);
 timers=[];
 if(ticker){clearInterval(ticker);ticker=null}
 scene.classList.remove('sinking','landed','active');
 scene.hidden=true;
 document.body.classList.remove('dive-in-progress');
 current=null;labels=null;
}
function updateText(depth){
 if(!current)return;
 el('diveDepthValue').textContent=format(depth)+' m';
 const zone=zoneFor(depth)[currentLang()];
 el('diveDepthZone').textContent=zone;
}
function start(fish,fishSvg,copy,after){
 cancel();
 const token=run;
 current=tiers[fish.points]||tiers[10];
 labels=copy;
 const duration=reduce?80:current.duration;
 scene.style.setProperty('--descent','-'+current.travel+'vh');
 scene.style.setProperty('--dive-duration',duration+'ms');
 scene.style.setProperty('--fish-scale',String(current.scale));
 el('diveFish').innerHTML=fishSvg;
 el('diveTitle').textContent=copy.heading;
 el('diveLabel').textContent=copy.description;
 el('diveDepthCaption').textContent=copy.depth;
 el('diveTarget').textContent=copy.target+': '+format(current.depth)+' m';
 el('diveRarity').textContent=copy.rarity;
 scene.hidden=false;
 document.body.classList.add('dive-in-progress');
 scene.classList.add('active');
 updateText(0);
 const started=Date.now();
 startedAt=started;
 const queue=(fn,delay)=>{const id=setTimeout(()=>{if(token!==run)return;fn()},delay);timers.push(id)};
 queue(()=>{
  scene.classList.add('sinking');
  if(!reduce){
   ticker=setInterval(()=>{
    if(token!==run)return;
    const progress=Math.min(1,(Date.now()-startedAt)/(duration||1));
    const eased=1-Math.pow(1-progress,2);
    updateText(current.depth*eased);
   },65);
  }
 },36);
 queue(()=>{
  if(ticker){clearInterval(ticker);ticker=null}
  updateText(current.depth);
  el('diveTitle').textContent=copy.fishFound;
  el('diveLabel').textContent=copy.bite;
  scene.classList.add('landed');
 },duration+40);
 queue(()=>{
  cancel();
  after();
 },duration+(reduce?145:600));
}
function updateLanguage(copy){
 if(!labels||!current)return;
 labels=copy;
 el('diveDepthCaption').textContent=copy.depth;
 el('diveRarity').textContent=copy.rarity;
 el('diveTarget').textContent=copy.target+': '+format(current.depth)+' m';
 updateText(Number(el('diveDepthValue').textContent.replace(/[^\d]/g,''))||0);
 el('diveTitle').textContent=scene.classList.contains('landed')?copy.fishFound:copy.heading;
 el('diveLabel').textContent=scene.classList.contains('landed')?copy.bite:copy.description;
}
window.CQRareDive={start,reset:cancel,updateLanguage,tiers};
})();
