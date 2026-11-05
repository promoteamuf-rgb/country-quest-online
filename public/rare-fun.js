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
const reefSvg="<svg viewBox=\"0 0 210 120\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\"><defs><linearGradient id=\"reefPaint\" x2=\"1\" y2=\"1\"><stop stop-color=\"#ffca63\"/><stop offset=\"1\" stop-color=\"#f25e52\"/></linearGradient></defs><path d=\"M33 61L7 23L8 101Z\" fill=\"#f9a743\" stroke=\"#ffe9aa\" stroke-width=\"3\"/><path d=\"M28 61Q65 13 129 25Q175 35 196 64Q174 103 110 106Q58 104 28 61Z\" fill=\"url(#reefPaint)\" stroke=\"#ffe9b5\" stroke-width=\"3\"/><path d=\"M70 29Q55 65 75 98M113 25Q96 64 120 104M158 42Q147 67 164 91\" fill=\"none\" stroke=\"#fff6e3\" stroke-width=\"12\"/><path d=\"M70 29Q55 65 75 98M113 25Q96 64 120 104M158 42Q147 67 164 91\" fill=\"none\" stroke=\"#1f4d63\" stroke-width=\"2\"/><circle cx=\"173\" cy=\"55\" r=\"8\" fill=\"#fff\"/><circle cx=\"175\" cy=\"55\" r=\"4\" fill=\"#123246\"/><path d=\"M88 24L112 5L134 26M90 104L110 116L135 101\" fill=\"#fdab69\" stroke=\"#ffd79b\" stroke-width=\"2\"/></svg>";
const turtleSvg="<svg viewBox=\"0 0 260 160\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\"><defs><linearGradient id=\"turtlePaint\" x2=\"1\" y2=\"1\"><stop stop-color=\"#b9f29f\"/><stop offset=\"1\" stop-color=\"#237c75\"/></linearGradient></defs><path d=\"M80 69Q23 32 11 54Q33 85 86 96M166 74Q224 27 245 52Q222 87 172 104M88 102Q32 149 20 126M169 99Q220 154 231 129\" fill=\"#7bd9ae\" stroke=\"#cdffe0\" stroke-width=\"4\"/><ellipse cx=\"126\" cy=\"82\" rx=\"77\" ry=\"59\" fill=\"url(#turtlePaint)\" stroke=\"#dbffbe\" stroke-width=\"5\"/><path d=\"M65 53L117 31L162 49L178 87L153 124L100 133L58 96L65 53M117 31L114 73L65 53M114 73L156 72L162 49M114 73L100 133M156 72L153 124\" fill=\"none\" stroke=\"#216358\" stroke-width=\"4\"/><path d=\"M185 75Q216 54 249 74Q266 90 248 111Q216 119 184 100\" fill=\"#83dab2\" stroke=\"#deffe4\" stroke-width=\"3\"/><circle cx=\"242\" cy=\"77\" r=\"5\" fill=\"#133847\"/></svg>";
const sharkSvg="<svg viewBox=\"0 0 360 170\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\"><defs><linearGradient id=\"sharkPaint\" x2=\".6\" y2=\"1\"><stop stop-color=\"#9ed0e9\"/><stop offset=\"1\" stop-color=\"#22546e\"/></linearGradient></defs><path d=\"M62 90L8 41L17 97L8 149L65 111Z\" fill=\"#396a87\"/><path d=\"M61 90Q147 44 270 66Q316 73 346 100Q303 135 198 130Q105 127 61 90Z\" fill=\"url(#sharkPaint)\" stroke=\"#b3d8e8\" stroke-width=\"2.5\"/><path d=\"M141 58L196 7L207 65M162 123L209 160L225 125\" fill=\"#3d7d98\" stroke=\"#c2e6ed\" stroke-width=\"2\"/><path d=\"M136 105Q224 140 322 106\" fill=\"none\" stroke=\"#c7e9e7\" stroke-width=\"3\"/><circle cx=\"290\" cy=\"87\" r=\"5\" fill=\"#09233a\"/><path d=\"M259 92L253 110M248 90L241 111M236 89L230 109\" stroke=\"#144153\" stroke-width=\"3\"/></svg>";
const anglerSvg="<svg viewBox=\"0 0 230 170\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\"><defs><radialGradient id=\"anglerPaint\"><stop stop-color=\"#6b70b1\"/><stop offset=\"1\" stop-color=\"#222c55\"/></radialGradient></defs><path d=\"M41 88L5 50L15 96L5 140L46 112Z\" fill=\"#343972\"/><path d=\"M35 92Q65 23 137 48Q196 61 214 101Q174 159 110 143Q51 137 35 92Z\" fill=\"url(#anglerPaint)\" stroke=\"#a7b3ed\" stroke-width=\"3\"/><path d=\"M107 51Q124 -3 159 12L175 26\" stroke=\"#c2ceff\" stroke-width=\"4\" fill=\"none\"/><circle cx=\"176\" cy=\"25\" r=\"16\" fill=\"#e8ffbb\" stroke=\"#d1fdff\" stroke-width=\"4\"/><path d=\"M135 115Q172 106 199 119Q169 152 134 131Z\" fill=\"#07172f\" stroke=\"#c5ceff\" stroke-width=\"3\"/><path d=\"M145 117l7 14 7-15 7 14 7-13 8 12 7-11\" fill=\"#dcddff\"/><circle cx=\"142\" cy=\"83\" r=\"13\" fill=\"#e9f5ff\"/><circle cx=\"145\" cy=\"85\" r=\"7\" fill=\"#19213d\"/><circle cx=\"148\" cy=\"81\" r=\"3\" fill=\"white\"/></svg>";
const squidSvg="<svg viewBox=\"0 0 180 220\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\"><defs><linearGradient id=\"squidPaint\" x2=\".5\" y2=\"1\"><stop stop-color=\"#ffc5f0\"/><stop offset=\"1\" stop-color=\"#6d79db\"/></linearGradient></defs><path d=\"M90 8Q41 28 33 104Q62 123 90 114Q119 121 146 103Q133 25 90 8Z\" fill=\"url(#squidPaint)\" stroke=\"#efd4ff\" stroke-width=\"3\"/><path d=\"M35 60L10 108L44 105M143 60L169 108L137 102\" fill=\"#a580cf\"/><ellipse cx=\"90\" cy=\"119\" rx=\"34\" ry=\"22\" fill=\"#b99ee0\"/><circle cx=\"78\" cy=\"116\" r=\"9\" fill=\"#fff\"/><circle cx=\"105\" cy=\"116\" r=\"9\" fill=\"#fff\"/><circle cx=\"78\" cy=\"116\" r=\"5\" fill=\"#12304c\"/><circle cx=\"104\" cy=\"116\" r=\"5\" fill=\"#12304c\"/><path d=\"M60 136Q42 181 58 207M78 140Q55 183 87 210M96 140Q117 182 101 209M110 139Q149 183 128 210\" fill=\"none\" stroke=\"#b6adf4\" stroke-width=\"9\" stroke-linecap=\"round\"/></svg>";
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
