/* Country Quest Rare Depths - original animated undersea art. */
(()=>{
'use strict';
const sea=document.querySelector('.sea'),stage=document.getElementById('stage');
if(!sea||!stage)return;
const MAX=7000,$=id=>document.getElementById(id);
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let lastDepth=0,anim=null,ready=false,lastScreen='',lastBurst='',sceneZone='sunlit';
const fishSvg='<svg viewBox="0 0 148 54" aria-hidden="true" focusable="false"><path d="M12 15q18-15 34 0q-16 17-34 0l-10-8 0 16z"/><path d="M76 37q14-13 27 0q-13 14-27 0l-9-6v12z"/><path d="M110 14q14-12 26 0q-13 14-26 0l-9-6v12z"/></svg>';
const anchorSvg='<svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diving anchor"><defs><linearGradient id="cqAnchorMetal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff6d9"/><stop offset=".48" stop-color="#a0f1e1"/><stop offset="1" stop-color="#4c9db9"/></linearGradient></defs><g fill="none" stroke="url(#cqAnchorMetal)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"><circle cx="50" cy="16" r="10"/><path d="M50 30V92M28 48H72M18 73C19 98 42 105 50 88C58 105 81 98 82 73"/></g><g fill="#d4fff0" stroke="#d4fff0" stroke-linejoin="round"><path d="M15 67L31 77L14 87Z"/><path d="M85 67L69 77L86 87Z"/></g><path d="M50 36v47" stroke="#eafff4" stroke-width="2.5" opacity=".75"/></svg>';
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
const submarine=$('submersible');if(submarine)submarine.innerHTML=anchorSvg;
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
function burst(points,showScore=true){
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
 const toast=points>0&&showScore?'<span class="score-toast" style="--by:'+y+'">+'+(points*10)+' m</span>':'';
 layer.innerHTML=bits+toast+'<span class="sea-impact" style="--by:'+y+'"></span>';
 target.appendChild(layer);setTimeout(()=>layer.remove(),1800);
}
/* Correct answers trigger a cinematic anchor drop, with the ocean
   rushing upwards to create a sense of real downward travel. */
let plungeTicket=0,plungeTimer=null;
function plunge(points){
 if(points<=0||reduce)return;
 if(plungeTimer)clearTimeout(plungeTimer);
 const ticket=++plungeTicket;
 sea.classList.remove('ocean-plunging');
 const prior=$('anchorDiveOverlay');if(prior)prior.remove();
 void sea.offsetWidth;
 sea.classList.add('ocean-plunging');
 const layer=document.createElement('div');
 layer.className='anchor-dive-overlay';
 layer.id='anchorDiveOverlay';
 layer.setAttribute('aria-hidden','true');
 layer.innerHTML='<div class="anchor-plunge-ghost">'+anchorSvg+'</div>'
   +Array.from({length:14},(_,i)=>'<i class="anchor-speed-bubble" style="--i:'+i+';--shift:'+((i*17)%145-72)+'px"></i>').join('')
   +'<span class="anchor-plunge-label">+'+(points*10)+' m</span>';
 sea.appendChild(layer);
 plungeTimer=setTimeout(()=>{
   if(ticket!==plungeTicket)return;
   layer.remove();sea.classList.remove('ocean-plunging');
   plungeTimer=null;
 },1950);
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
 plungeTicket++;if(plungeTimer){clearTimeout(plungeTimer);plungeTimer=null}
 sea.classList.remove('ocean-plunging');
 const fly=$('anchorDiveOverlay');if(fly)fly.remove();
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
 }else if(screen==='done'&&lastBurst!=='done'){lastBurst='done';burst(100,false)}
}
function onLanguage(){translateZone();displayDepth(lastDepth)}
window.CQDiveFX={setDepth,plunge,setTimer,onScreen,reject,reset,onLanguage};
document.body.dataset.zone='sunlit';translateZone();
})();
