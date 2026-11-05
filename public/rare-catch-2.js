/* RARE CATCH 2.0 — cinematic motion director.
   Runs visual effects only; scoring stays in the quiz logic. */
(()=>{
'use strict';
const scene=document.querySelector('.catch-world');
if(!scene)return;
const reduce=!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const $=id=>document.getElementById(id);
const html=[
'<div class="catch-cinematic" aria-hidden="true">',
'<div class="cinematic-film"></div><div class="cinematic-caustics"></div><div class="cinematic-boat-glow"></div>',
'<div class="cinematic-fish-school"><span>🐠</span><span>🐟</span><span>🐡</span></div>',
'<div class="cinematic-rod"><svg viewBox="0 0 280 260" preserveAspectRatio="xMinYMax meet">',
'<path class="rod-core" d="M20 235 Q85 110 233 19"/>',
'<path class="rod-gold" d="M20 235 Q85 110 233 19"/>',
'<path class="rod-glint" d="M35 220 Q82 126 204 38"/>',
'<path class="rod-line" d="M233 19 Q311 115 257 250"/>',
'<circle cx="233" cy="19" r="7" fill="#e8ffff" stroke="#2ac4e8" stroke-width="3"/>',
'<circle cx="41" cy="205" r="12" fill="#f9d479" stroke="#433e53" stroke-width="4"/></svg></div>',
'<div class="cinematic-cast-trail"><svg viewBox="0 0 1440 900" preserveAspectRatio="none"><path d="M921 267 C946 64 1235 66 1272 170 C1323 242 1070 220 1079 288"/></svg></div>',
'<div class="cinematic-float" id="cinematicFloat"><span class="float-top"></span><span class="float-core"></span><span class="float-pin"></span></div>',
'<div class="cinematic-splash"><svg viewBox="0 0 220 140"><ellipse class="water-ring" cx="111" cy="112" rx="84" ry="19"/>',
'<ellipse class="water-ring" cx="111" cy="112" rx="54" ry="9" opacity=".65"/>',
'<path class="water-spout" d="M99 118Q78 64 84 29L107 76L128 18L124 81L171 51L143 111Z"/>',
'<circle class="water-spout" cx="42" cy="39" r="5"/><circle class="water-spout" cx="168" cy="22" r="7"/>',
'<circle class="water-spout" cx="184" cy="70" r="4"/><circle class="water-spout" cx="68" cy="70" r="3"/></svg></div>',
'<div class="cinematic-bite-alert"><span id="biteText">NAPP!</span><small>⚡ FISH ON THE LINE ⚡</small></div>',
'<div class="cinematic-fight-rings"></div><div class="cinematic-halo"></div><div class="cinematic-zoom"></div>',
'<div class="cinematic-particles" id="cinematicParticles"></div>',
'<div class="cinematic-victory" id="cinematicVictory"><strong id="cinematicRank">LEGENDARY!</strong><span id="cinematicWeight">100 kg</span></div>',
'</div>'
].join('');
scene.insertAdjacentHTML('beforeend',html);
const classes=['cq-casting','cq-playing','cq-bite','cq-fight','cq-reeling','cq-landing','cq-reveal','cq-epic','cq-done','cq-jolt'];
const body=document.body;
let clearImpact=null,phase='intro',currentFish=null;
const sv=()=>document.documentElement.lang==='sv';
function cleanClasses(){
 for(const c of classes)body.classList.remove(c);
 if(clearImpact){clearTimeout(clearImpact);clearImpact=null}
}
function restartAnimation(c){
 body.classList.remove(c);
 void body.offsetWidth;
 body.classList.add(c);
}
function particles(type='water',n=22){
 if(reduce)return;
 const root=$('cinematicParticles');if(!root)return;
 const holder=document.createElement('div');
 holder.style.cssText='position:absolute;inset:0;pointer-events:none';
 const colours=type==='gold'?['#ffe092','#fff7d0','#fff0a4','#9ffbea']:type==='rare'?['#d4b9ff','#8cf9e9','#fcf5c6']:['#dcffff','#88f4ff','#bfffe6'];
 holder.innerHTML=Array.from({length:n},(_,i)=>{
   const phi=i*2.399963,dist=30+(i*41)%210;
   const vx=Math.round(Math.cos(phi)*dist),vy=Math.round(Math.sin(phi)*dist);
   const x=(type==='cast'?74:76)+(i%5-2)*1.2;
   const y=(type==='cast'?29:type==='gold'?28:34)+(i%4-2)*.8;
   const size=3+(i*11)%10,dur=(.6+(i%6)*.13).toFixed(2),color=colours[i%colours.length];
   return '<i style="--px:'+x+'%;--py:'+y+'%;--s:'+size+'px;--vx:'+vx+'px;--vy:'+vy+'px;--dur:'+dur+'s;--c:'+color+'"></i>';
 }).join('');
 root.appendChild(holder);
 setTimeout(()=>holder.remove(),1800);
}
function impact(){
 if(reduce)return;
 restartAnimation('cq-jolt');
 if(clearImpact)clearTimeout(clearImpact);
 clearImpact=setTimeout(()=>{body.classList.remove('cq-jolt');clearImpact=null},590);
}
function updateVictory(fish){
 const p=fish?.points||0;
 const labels=sv()?{10:'VANLIG FÅNGST!',25:'BRA FÅNGST!',40:'OVANLIG!',60:'SÄLLSYNT!',80:'EPISK FÅNGST!',100:'LEGENDARISK!'}:
 {10:'COMMON CATCH!',25:'NICE CATCH!',40:'UNCOMMON!',60:'RARE CATCH!',80:'EPIC CATCH!',100:'LEGENDARY!'};
 const e=$('cinematicRank');if(e)e.textContent=labels[p]||'FISH ON!';
 const wt=$('cinematicWeight');
 if(wt)wt.textContent=Number(fish?.weight||0).toLocaleString(sv()?'sv-SE':'en-GB',{maximumFractionDigits:1})+' kg';
}
function languageUpdate(){
 const bite=$('biteText');if(bite)bite.textContent=sv()?'NAPP!':'FISH ON!';
 const small=document.querySelector('.cinematic-bite-alert small');
 if(small)small.textContent=sv()?'⚡ STORFISK PÅ KROKEN ⚡':'⚡ FISH ON THE LINE ⚡';
 if(currentFish)updateVictory(currentFish);
}
function reset(){
 phase='idle';currentFish=null;cleanClasses();
 body.removeAttribute('data-rarity');
 const p=$('cinematicParticles');if(p)p.replaceChildren();
}
function cast(){
 cleanClasses();phase='casting';body.removeAttribute('data-rarity');
 restartAnimation('cq-casting');
 setTimeout(()=>{if(phase==='casting')particles('cast',26)},850);
}
function question(){
 phase='playing';cleanClasses();body.classList.add('cq-playing');
}
function bite(fish){
 if(!fish)return;
 cleanClasses();phase='bite';currentFish=fish;
 body.dataset.rarity=String(fish.points);
 restartAnimation('cq-bite');
 impact();particles('water',23);
}
function fight(fish){
 phase='fight';currentFish=fish||currentFish;
 body.classList.remove('cq-bite');restartAnimation('cq-fight');
 particles('rare',18);
}
function reel(fish){
 phase='reeling';currentFish=fish||currentFish;
 body.classList.remove('cq-fight');restartAnimation('cq-reeling');
 impact();particles(fish?.points>=80?'gold':'water',35);
}
function reveal(fish){
 if(!fish)return;
 phase='reveal';currentFish=fish;
 cleanClasses();body.dataset.rarity=String(fish.points);
 updateVictory(fish);restartAnimation('cq-landing');
 body.classList.add('cq-reveal');
 if(fish.points>=80)body.classList.add('cq-epic');
 if(fish.points===100){particles('gold',68);impact()}
 else if(fish.points>=60)particles('rare',34);
 else particles('water',16);
}
function miss(){
 cleanClasses();phase='miss';currentFish=null;body.removeAttribute('data-rarity');
 particles('water',12);
}
function done(){
 cleanClasses();phase='done';currentFish=null;body.classList.add('cq-done');
 particles('gold',28);
}
languageUpdate();
window.CQRareFX={reset,cast,question,bite,fight,reel,reveal,miss,done,languageUpdate};
})();
