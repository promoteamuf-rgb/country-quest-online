/* Country Quest Rare Depths - original animated undersea art. */
(()=>{
'use strict';
const sea=document.querySelector('.sea'),stage=document.getElementById('stage');
if(!sea||!stage)return;
const MAX=7000,$=id=>document.getElementById(id);
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let lastDepth=0,anim=null,ready=false,lastScreen='',lastBurst='',sceneZone='sunlit';
const fishSvg='<svg viewBox="0 0 148 54" aria-hidden="true" focusable="false"><path d="M12 15q18-15 34 0q-16 17-34 0l-10-8 0 16z"/><path d="M76 37q14-13 27 0q-13 14-27 0l-9-6v12z"/><path d="M110 14q14-12 26 0q-13 14-26 0l-9-6v12z"/></svg>';
const subSvg='<svg viewBox="0 0 72 72" role="img" aria-label="Exploration submarine"><defs><linearGradient id="cqSubBody" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#e5ffe4"/><stop offset=".55" stop-color="#91ecd2"/><stop offset="1" stop-color="#3289a2"/></linearGradient></defs><path d="M16 36q0-18 20-18t20 18v12H16z" fill="url(#cqSubBody)" stroke="#f3fff5" stroke-width="1.6"/><path d="M26 20v-6h11" fill="none" stroke="#c5f9e7" stroke-width="3" stroke-linecap="round"/><rect x="10" y="35" width="52" height="21" rx="10" fill="#4aabb2" stroke="#e2ffe9" stroke-width="1.6"/><circle cx="23" cy="45" r="5" fill="#1b4d68" stroke="#dcfff0" stroke-width="2"/><circle cx="37" cy="45" r="5" fill="#1b4d68" stroke="#dcfff0" stroke-width="2"/><path d="M62 40l8-5v19l-8-6M12 42l-7-3v13l7-3" fill="#b7fbe2" stroke="#d7fff2" stroke-width="1"/><path d="M30 58l-4 7m18-7 4 7" stroke="#8fd6cb" stroke-width="3" stroke-linecap="round"/></svg>';
const bubbles=Array.from({length:18},(_,i)=>{
 const x=(13+i*37)%93,seconds=7+(i*13)%11,sz=3+(i*7)%13,sway=((i*31)%130)-65;
 return '<i class="particle" style="--x:'+x+'%;--s:'+sz+'px;--duration:'+seconds+'s;--delay:-'+(i*1.8).toFixed(1)+'s;--sway:'+sway+'px"></i>';
}).join('');
const jelly='<span class="bell"></span><span class="tentacles"><i></i><i></i><i></i><i></i></span>';
const scene=[
 '<div class="sea-atmosphere" aria-hidden="true"><div class="surface-waves"></div>',
 '<div class="light-shaft shaft-a"></div><div class="light-shaft shaft-b"></div>',
 '<div class="sea-particles">'+bubbles+'</div>',
 '<div class="fish-school one">'+fishSvg+'</div>',
 '<div class="fish-school two">'+fishSvg+'</div>',
 '<div class="jelly a">'+jelly+'</div><div class="jelly b">'+jelly+'</div>',
 '<div class="sea-floor"></div>',
 '<span class="zone-marker" style="--at:19%">SUNLIT REEF</span>',
 '<span class="zone-marker" style="--at:39%">BLUE TWILIGHT</span>',
 '<span class="zone-marker" style="--at:60%">MIDNIGHT REACH</span>',
 '<span class="zone-marker" style="--at:82%">THE ABYSS</span>',
 '</div><div class="scene-zone" id="sceneZone" aria-hidden="true">SUNLIT REEF</div>',
 '<div class="burst-layer" id="burstLayer" aria-hidden="true"></div>'
].join('');
sea.insertAdjacentHTML('afterbegin',scene);
const submarine=$('submersible');if(submarine)submarine.innerHTML=subSvg;
const zones=[
 {min:0,key:'sunlit',en:'SUNLIT REEF',sv:'SOLBELYST REV'},
 {min:1200,key:'twilight',en:'BLUE TWILIGHT',sv:'BLÅ SKYMNING'},
 {min:2600,key:'midnight',en:'MIDNIGHT REACH',sv:'MIDNATTSDJUPET'},
 {min:4200,key:'abyss',en:'THE ABYSS',sv:'AVGRUNDEN'},
 {min:5700,key:'trench',en:'TRENCH FLOOR',sv:'DJUPHAVSGRAVEN'}
];
function translateZone(){
 const selected=zones.find(z=>z.key===sceneZone)||zones[0];
 const zone=$('sceneZone');if(zone)zone.textContent=selected[document.documentElement.lang==='sv'?'sv':'en'];
}
function displayDepth(n){
 const locale=document.documentElement.lang==='sv'?'sv-SE':'en-GB';
 const number=Math.round(n).toLocaleString(locale),max=MAX.toLocaleString(locale);
 if($('depthValue'))$('depthValue').textContent=number+' m';
 if($('seaRank'))$('seaRank').textContent=number+' / '+max+' m';
}
function setDepth(metres){
 const target=Math.max(0,Math.min(MAX,Number(metres)||0)),from=lastDepth;
 if(anim)cancelAnimationFrame(anim);
 lastDepth=target;
 const pct=target/MAX*100;
 if($('depthFill'))$('depthFill').style.height=pct+'%';
 if($('submersible'))$('submersible').style.top=pct+'%';
 const selected=zones.slice().reverse().find(z=>target>=z.min)||zones[0];
 const previousZone=sceneZone;
 sceneZone=selected.key;document.body.dataset.zone=sceneZone;translateZone();
 if(ready&&previousZone!==sceneZone&&!reduce){
  const announcement=document.createElement('div');
  announcement.className='zone-unlocked';
  const isSwedish=document.documentElement.lang==='sv';
  announcement.innerHTML='<span>'+(isSwedish?'NY DJUPZON':'NEW DEPTH ZONE')+'</span><strong>'+selected[isSwedish?'sv':'en']+'</strong>';
  announcement.setAttribute('aria-hidden','true');
  sea.appendChild(announcement);
  setTimeout(()=>announcement.remove(),2300);
 }
 if(!ready||reduce||from===target){displayDepth(target);ready=true;return}
 const begin=performance.now(),duration=Math.min(1700,950+Math.abs(target-from)*.35);
 const frame=now=>{
  const t=Math.min(1,(now-begin)/duration),ease=1-Math.pow(1-t,3);
  displayDepth(from+(target-from)*ease);
  if(t<1)anim=requestAnimationFrame(frame);else anim=null;
 };
 anim=requestAnimationFrame(frame);
}
function subTop(){
 const track=sea.querySelector('.depth-track');if(!track)return '50%';
 const y=track.offsetTop+track.clientHeight*(lastDepth/MAX);
 return Math.max(34,Math.min(sea.clientHeight-24,y))+'px';
}
function burst(points){
 if(reduce)return;
 const target=$('burstLayer');if(!target)return;
 const y=subTop(),count=points>=80?22:points>=40?15:points>0?10:4;
 const color=points>=100?'#f9deb1':points>=80?'#d6fbc4':'#b8fae8';
 const layer=document.createElement('div');
 layer.style.cssText='position:absolute;inset:0;pointer-events:none';
 layer.setAttribute('aria-hidden','true');
 const bits=Array.from({length:count},(_,i)=>{
  const angle=i*2.399963,dist=35+(i*47)%125;
  const dx=(Math.cos(angle)*dist).toFixed(1),dy=(Math.sin(angle)*dist).toFixed(1),size=4+(i*11)%11;
  return '<span class="splash-bit" style="--by:'+y+';--dx:'+dx+'px;--dy:'+dy+'px;--sz:'+size+'px;--particle-color:'+color+'"></span>';
 }).join('');
 const toast=points>0?'<span class="score-toast" style="--by:'+y+'">+'+(points*10)+' m</span>':'';
 layer.innerHTML=bits+toast+'<span class="sea-impact" style="--by:'+y+'"></span>';
 target.appendChild(layer);setTimeout(()=>layer.remove(),1800);
}
function setTimer(ms,total){
 const remaining=Math.max(0,Number(ms)||0),duration=Math.max(1,Number(total)||25000);
 const arc=$('timerArc');if(arc)arc.style.strokeDashoffset=(94.248*(1-remaining/duration)).toFixed(3);
 const widget=$('timerGauge');if(widget)widget.classList.toggle('urgent',remaining<=7000);
}
function reject(){
 if(reduce)return;
 const field=$('answerInput');if(!field)return;
 field.classList.remove('invalid-entry');void field.offsetWidth;field.classList.add('invalid-entry');
}
function reset(){
 lastScreen='';lastBurst='';lastDepth=0;ready=false;document.body.dataset.zone='sunlit';
 const layer=$('burstLayer');if(layer)layer.innerHTML='';
 if(anim){cancelAnimationFrame(anim);anim=null}
}
function onScreen(screen,round,points){
 const key=screen+':'+round;
 stage.dataset.rarity=screen==='reveal'?String(points||0):'';
 if(lastScreen!==key){
  lastScreen=key;stage.classList.remove('screen-in');void stage.offsetWidth;stage.classList.add('screen-in');
 }
 if(screen==='playing'||screen==='reveal'){
  if(!stage.querySelector('.mission-strip')){
   const dots=Array.from({length:7},(_,i)=>'<span class="mission-dot '+(i<round?'complete':i===round?'active':'')+'"></span>').join('');
   stage.insertAdjacentHTML('afterbegin','<div class="mission-strip" aria-label="Voyage progress">'+dots+'</div>');
  }
 }
 if(screen==='reveal'){
  const id=round+':'+lastDepth;if(lastBurst!==id){lastBurst=id;burst(points)}
 }else if(screen==='done'&&lastBurst!=='done'){lastBurst='done';burst(100)}
}
function onLanguage(){translateZone();displayDepth(lastDepth)}
window.CQDiveFX={setDepth,setTimer,onScreen,reject,reset,onLanguage};
document.body.dataset.zone='sunlit';translateZone();
})();
