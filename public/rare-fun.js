/* Country Quest / Rare Depths: original deep-sea wildlife, sonar and opt-in sounds. */
(()=>{
'use strict';
const sea=document.querySelector('.sea');
if(!sea)return;
const $=id=>document.getElementById(id);
const reduce=!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const whale='<svg viewBox="0 0 500 190" aria-hidden="true"><path d="M17 103c28 4 57 0 83-15 50-25 95-39 157-29 28 5 43 6 72 4 25-2 49-14 65-26-5 26-20 42-33 48 15 15 25 28 30 53-20-13-43-20-62-18-42 4-78 26-140 28-38 1-75-14-101-21-30-7-55-11-71-24z"/><path d="M148 118c10 23 44 54 69 62l-11-44z"/><circle cx="104" cy="101" r="4" fill="#c5f7ef"/></svg>';
const manta='<svg viewBox="0 0 440 180" aria-hidden="true"><path d="M220 34c65 5 108 15 190 70-50 7-89 1-125-12-16 23-31 50-66 52-32-1-51-27-68-52-41 14-92 18-131 10 77-51 126-64 200-68z"/><path d="M216 127l9 51 10-51z"/><circle cx="206" cy="81" r="3" fill="#c1f2f1"/></svg>';
const coral='<svg viewBox="0 0 300 180" aria-hidden="true"><defs><linearGradient id="cqCoralA" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#57c8c4"/><stop offset="1" stop-color="#155272"/></linearGradient><linearGradient id="cqCoralB" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#ee987b"/><stop offset="1" stop-color="#6b427a"/></linearGradient></defs><path d="M14 177q20-47 13-96t17 1q-2 38 11 95M38 175q-15-53-3-93t8 11q-6 34 13 83M253 177q-26-59-11-99t13 9q-8 35 11 89" fill="none" stroke="url(#cqCoralA)" stroke-width="12" stroke-linecap="round"/><path d="M80 177V68l-22-22m22 61 32-28M80 108 53 96m27-44 14-22m9 147v-65l23-21m-23 42-18-16m112 60v-52l-18-21m18 45 25-16m-18-7-6-21" fill="none" stroke="url(#cqCoralB)" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/><path d="M0 179q43-21 84-7t70 2q68-19 146 5" fill="none" stroke="#0b394d" stroke-width="12"/></svg>';
const sparks=Array.from({length:24},(_,i)=>{
 const left=(9+i*43)%95,top=8+(i*29)%77,size=2+(i*13)%4;
 const delay=((i*3.1)%15).toFixed(1),period=3+(i*17)%6;
 return '<i class="fun-spark" style="--left:'+left+'%;--top:'+top+'%;--size:'+size+'px;--delay:-'+delay+'s;--period:'+period+'s"></i>';
}).join('');
sea.insertAdjacentHTML('afterbegin',
  '<div class="fun-world" aria-hidden="true">'
 +'<div class="fun-whale">'+whale+'</div><div class="fun-manta">'+manta+'</div>'
 +'<div class="fun-coral">'+coral+'</div><div class="fun-relic">🪸</div>'
 +sparks+'<div class="fun-sonar-layer" id="funSonarLayer"></div></div>');
let soundEnabled=false,context=null;
try{soundEnabled=localStorage.getItem('cq-rare-sound')==='on'}catch{}
function audioContext(){
 const C=window.AudioContext||window.webkitAudioContext;
 if(!C)return null;
 try{if(!context)context=new C();if(context.state==='suspended')context.resume().catch(()=>{});return context}catch{return null}
}
function note(frequency,delay,duration,type='sine',volume=.05){
 if(!soundEnabled)return;
 const ctx=audioContext();if(!ctx)return;
 try{
  const now=ctx.currentTime+delay,osc=ctx.createOscillator(),gain=ctx.createGain();
  osc.type=type;osc.frequency.setValueAtTime(frequency,now);
  gain.gain.setValueAtTime(0.0001,now);
  gain.gain.exponentialRampToValueAtTime(volume,now+.016);
  gain.gain.exponentialRampToValueAtTime(0.0001,now+duration);
  osc.connect(gain);gain.connect(ctx.destination);
  osc.start(now);osc.stop(now+duration+.02);
 }catch{}
}
function play(kind){
 if(!soundEnabled)return;
 if(kind==='start'){note(294,0,.14);note(392,.12,.18);note(523,.26,.27)}
 if(kind==='sonar'){note(700,0,.5,'sine',.04);note(920,.14,.49,'sine',.035)}
 if(kind==='wrong'){note(200,0,.16,'triangle',.05);note(160,.12,.17,'triangle',.03)}
 if(kind==='next'){note(375,0,.14,'sine',.024)}
 if(kind==='common'){note(420,0,.15);note(500,.13,.17)}
 if(kind==='rare'){note(420,0,.19);note(560,.13,.20);note(710,.25,.27)}
 if(kind==='epic'){note(349,0,.18);note(523,.13,.20);note(698,.25,.22);note(1046,.39,.38)}
 if(kind==='finish'){note(392,0,.18);note(494,.15,.18);note(587,.32,.22);note(784,.49,.43)}
}
const button=$('funSound');
function setLabels(lang){
 if(!button)return;
 const on=lang==='sv'?'Ljud på':'Sound on',off=lang==='sv'?'Ljud av':'Sound off';
 const label=soundEnabled?on:off;
 button.setAttribute('aria-pressed',String(soundEnabled));
 button.setAttribute('aria-label',label);
 button.title=label;
 const icon=button.querySelector('.fun-sound-icon'),text=button.querySelector('.fun-sound-label');
 if(icon)icon.textContent=soundEnabled?'🔊':'🔇';
 if(text)text.textContent=label;
}
if(button)button.addEventListener('click',()=>{
 soundEnabled=!soundEnabled;
 try{localStorage.setItem('cq-rare-sound',soundEnabled?'on':'off')}catch{}
 setLabels(document.documentElement.lang);
 if(soundEnabled)play('start');
});
setLabels(document.documentElement.lang);
function sonar(){
 const target=$('funSonarLayer');if(!target)return;
 play('sonar');
 if(reduce)return;
 const waves=document.createElement('div');
 waves.className='fun-scan';
 waves.innerHTML='<span class="fun-sonar-wave"></span><span class="fun-sonar-wave"></span><span class="fun-sonar-wave"></span>';
 target.appendChild(waves);
 setTimeout(()=>waves.remove(),1700);
}
function confetti(){
 if(reduce)return;
 const layer=document.createElement('div');
 layer.className='fun-celebrate';
 const hues=['#c1ffe5','#f4dc9f','#97b9ff','#f2a5de','#d2fff9'];
 layer.innerHTML=Array.from({length:35},(_,i)=>{
  const left=(i*47+13)%100,size=5+(i*11)%10,delay=(i*7%23)/100,time=2+(i*11%15)/10;
  const color=hues[i%hues.length],rotate=(i*21)%360;
  return '<i style="--left:'+left+'%;--size:'+size+'px;--color:'+color+';--time:'+time+'s;--delay:'+delay+'s;--rotate:'+rotate+'deg"></i>';
 }).join('');
 document.body.appendChild(layer);
 setTimeout(()=>layer.remove(),3500);
}
function reveal(points,streak){
 if(points>=100||streak>=3){play('epic');confetti()}
 else if(points>=60)play('rare');
 else if(points>0)play('common');
 else play('wrong');
}
function finish(){play('finish');confetti()}
function reset(){
 const sonarLayer=$('funSonarLayer');if(sonarLayer)sonarLayer.innerHTML='';
}
window.CQFun={play,sonar,reveal,finish,reset,setLabels,soundEnabled:()=>soundEnabled};
})();
