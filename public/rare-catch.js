/* RARE CATCH — original bilingual fishing / geography game for Country Quest. */
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const BANK=Array.isArray(window.CQ_RARE_BANK)?window.CQ_RARE_BANK:[];
const TOTAL=7,LIMIT=25;
const LANG_KEY='cq-language',DECK_KEY='cq-rare-catch-question-deck';
const strip=s=>String(s??'').normalize('NFKD').toLowerCase().replace(/[\u0300-\u036f]/g,'').replace(/&/g,'and').replace(/[^a-z0-9]/g,'');
const esc=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const shuffle=arr=>{const a=[...arr];for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const FISH={
10:{en:'Silver sardine',sv:'Silversardin',min:.5,max:1.3,rank:'common',icon:'🐟',color1:'#9ac4df',color2:'#3c7ba2'},
25:{en:'Golden reef fish',sv:'Guldfärgad revfisk',min:2,max:5,rank:'familiar',icon:'🐠',color1:'#ffe06b',color2:'#ec784e'},
40:{en:'Coral snapper',sv:'Korallsnapper',min:7,max:15,rank:'uncommon',icon:'🐡',color1:'#ffc5b0',color2:'#f16c8d'},
60:{en:'Giant grouper',sv:'Jättehavabborre',min:23,max:42,rank:'rare',icon:'🐟',color1:'#c8adff',color2:'#5670ad'},
80:{en:'Bluefin tuna',sv:'Blåfenad tonfisk',min:70,max:110,rank:'epic',icon:'🐟',color1:'#8fe7ff',color2:'#3277d1'},
100:{en:'Legendary sailfish',sv:'Legendarisk segelfisk',min:180,max:310,rank:'legendary',icon:'🐠',color1:'#d6ceff',color2:'#1e76f3'}
};
const TEXT={
en:{
navAll:'All games',navSolo:'Solo games',hud:'FISHING LOG',fishCaught:'FISH CAUGHT',totalWeight:'TOTAL WEIGHT',biggest:'BIGGEST FISH',footer:'Original Country Quest game · Rarity estimates are curated, not real player statistics',
kicker:'COUNTRY QUEST · FISHING ADVENTURE',intro:'Answer rarer. Catch bigger fish.',description:'You are fishing from a yacht. Cast your line, then answer seven geography questions. The more unusual your correct answer, the bigger the fish you reel in!',
begin:'CAST YOUR LINE',facts:['7 ROUNDS','25 SECONDS','RARE ANSWERS = BIG FISH'],how:'From tiny sardines to legendary sailfish — what will you catch?',
casting:'Casting your line…',castingLine:'Your bait is sinking. Get ready for your question!',round:'ROUND',of:'OF',question:'NAME ONE CORRECT ANSWER',placeholder:'Type a country or capital…',send:'HOOK IT!',sonar:'📡 Sonar hint',sonarGuide:'2 hints per fishing trip',hintFound:'Sonar found one valid example:',hintCaution:'Try something rarer for a bigger fish.',tryAgain:'That answer is not in the accepted list. Try another!',empty:'Enter an answer first.',hintNone:'No sonar hints left.',reeling:'FISH ON THE LINE!',reelingLead:'A fish is biting! Reel it in…',
catch:'YOU CAUGHT A FISH!',noCatch:'THE FISH GOT AWAY!',noCatchText:'No recognized answer before time ran out. Better luck on the next cast.',rarity:'ANSWER RARITY',result:'Correct geography answer',weight:'FISH WEIGHT',score:'RARITY POINTS',next:'CAST AGAIN →',end:'SEE YOUR FISHING LOG →',another:'Fish again',replay:'Go fishing again',best:'BEST CATCH',summary:'YOUR FISHING TRIP',summaryText:'Seven questions, seven chances to land a big one. Here is your fishing log.',
noAnswer:'No fish',points:'pts',record:'Best trip weight',rareInfo:'Scores are curated rarity tiers, not measured from other players.',note:'The more unusual your correct answer, the larger your fish.',copy:'Copy result',copied:'Copied!',fishType:'FISH SPECIES',catchTotal:'TOTAL WEIGHT',fishUnit:'kg',rank10:'COMMON',rank25:'FAMILIAR',rank40:'UNCOMMON',rank60:'RARE',rank80:'EPIC',rank100:'LEGENDARY',diveHeading:'FOLLOW THE HOOK',diveLine:'Rarer answer means a deeper dive and a bigger fish.',diveDepth:'DEPTH',diveTarget:'FISH ZONE',diveFishFound:'FISH SPOTTED!',diveBite:'The fish has taken the bait!',diveGoing:'YOUR HOOK IS DIVING',diveGoingLine:'Watch the hook travel down to your catch.'
},
sv:{
navAll:'Alla spel',navSolo:'Spela själv',hud:'FÅNGSTJOURNAL',fishCaught:'FÅNGADE FISKAR',totalWeight:'TOTAL VIKT',biggest:'STÖRSTA FISKEN',footer:'Eget Country Quest-spel · Sällsynthetspoängen är uppskattade, inte riktig spelarstatistik',
kicker:'COUNTRY QUEST · FISKEÄVENTYR',intro:'Svara ovanligare. Fånga större fiskar.',description:'Du fiskar från en yacht. Kasta ut linan och svara på sju geografifrågor. Ju ovanligare rätt svar du ger, desto större fisk får du på kroken!',
begin:'KASTA UT LINAN',facts:['7 RUNDOR','25 SEKUNDER','OVANLIGT SVAR = STOR FISK'],how:'Från små sardiner till legendariska segelfiskar – vad kommer du att fånga?',
casting:'Kastar ut linan …',castingLine:'Betet sjunker. Gör dig redo för nästa fråga!',round:'RUNDA',of:'AV',question:'ANGE ETT RÄTT SVAR',placeholder:'Skriv ett land eller en huvudstad …',send:'FÅNGA!',sonar:'📡 Sonarledtråd',sonarGuide:'2 ledtrådar per fisketur',hintFound:'Sonaren hittade ett godkänt exempel:',hintCaution:'Prova något ovanligare för en större fisk.',tryAgain:'Svaret finns inte i vår godkända lista. Försök igen!',empty:'Skriv ett svar först.',hintNone:'Inga sonarledtrådar kvar.',reeling:'NAPP PÅ KROKEN!',reelingLead:'En fisk har nappat! Dra upp den …',
catch:'DU FÅNGADE EN FISK!',noCatch:'FISKEN KOM UNDAN!',noCatchText:'Inget godkänt svar innan tiden tog slut. Bättre lycka vid nästa kast.',rarity:'SVARETS SÄLLSYNTHET',result:'Rätt geografisvar',weight:'FISKENS VIKT',score:'SÄLLSYNTHETSPOÄNG',next:'KASTA IGEN →',end:'SE FÅNGSTJOURNALEN →',another:'Fiska igen',replay:'Fiska en gång till',best:'BÄSTA FÅNGSTEN',summary:'DIN FISKETUR',summaryText:'Sju frågor, sju chanser att få en riktig storfisk. Här är din fångstjournal.',
noAnswer:'Ingen fisk',points:'p',record:'Bästa totalvikt',rareInfo:'Poängen är uppskattade sällsynthetsnivåer, inte uppmätta från andra spelare.',note:'Ju ovanligare rätt svar, desto större fisk.',copy:'Kopiera resultat',copied:'Kopierat!',fishType:'FISKART',catchTotal:'TOTAL VIKT',fishUnit:'kg',rank10:'VANLIG',rank25:'VÄLKÄND',rank40:'MINDRE VANLIG',rank60:'SÄLLSYNT',rank80:'EPISK',rank100:'LEGENDARISK',diveHeading:'FÖLJ KROKEN',diveLine:'Ovanligare svar ger ett djupare dyk och en större fisk.',diveDepth:'DJUP',diveTarget:'FISKZON',diveFishFound:'FISK UPPTÄCKT!',diveBite:'Fisken har nappat!',diveGoing:'KROKEN DYKER NER',diveGoingLine:'Följ kroken ner till din fångst.'
}
};
let lang='en';try{const v=localStorage.getItem(LANG_KEY);if(v==='sv'||v==='en')lang=v}catch{}
const val=key=>TEXT[lang][key];
const local=answer=>lang==='sv'?answer.sv||answer.name:answer.name;
const num=n=>Number(n).toLocaleString(lang==='sv'?'sv-SE':'en-GB',{maximumFractionDigits:1});
const kg=n=>num(n)+' '+val('fishUnit');
const lookup=new Map();
for(const q of BANK){
 const a=new Map();
 for(const answer of q.answers){
   for(const alias of [answer.name,answer.sv,...(answer.aliases||[])]){
     const k=strip(alias);if(!k)continue;
     if(!a.has(k))a.set(k,answer);
   }
 }
 lookup.set(q.id,a);
}
let phase='intro',questions=[],round=0,deadline=0,interval=null,transition=null,answers=[],points=0,totalWeight=0,biggest=0,sonar=2,sonarAnswer=null,typed='',message='',latest=null;
let posterSrc='';
function read(key,fallback){try{const v=JSON.parse(localStorage.getItem(key)||'null');return v??fallback}catch{return fallback}}
function save(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch{}}
function newQuestions(){
 const ids=BANK.map(q=>q.id),seen=new Set(),out=[];
 let deck=read(DECK_KEY,[]).filter(id=>ids.includes(id));
 while(out.length<TOTAL){
   if(!deck.length)deck=shuffle(ids.filter(id=>!seen.has(id)));
   if(!deck.length)break;
   const id=deck.shift();
   if(seen.has(id))continue;
   seen.add(id);out.push(BANK.find(q=>q.id===id));
 }
 save(DECK_KEY,deck);
 return out;
}
function fishFor(answer){
 const tier=FISH[answer.points]||FISH[10];
 const seed=Array.from(answer.name).reduce((n,c)=>n*31+c.charCodeAt(0),7)>>>0;
 const weight=Math.round((tier.min+((seed%101)/100)*(tier.max-tier.min))*10)/10;
 return{...tier,points:answer.points,weight,answer};
}
function fishSvg(item){
 const isLegend=item.points===100,tone1=item.color1,tone2=item.color2;
 const rid='f'+item.points;
 return '<svg viewBox="0 0 360 205" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(local({name:item.en,sv:item.sv}))+'">'
 +'<defs><linearGradient id="'+rid+'" x1="0" y1="0" x2="0.75" y2="1"><stop stop-color="'+tone1+'"/><stop offset="1" stop-color="'+tone2+'"/></linearGradient></defs>'
 +(isLegend?'<path d="M140 82Q163 3 194 10Q201 43 226 73L212 104" fill="#3853d8" stroke="#d4c9ff" stroke-width="5"/>':'<path d="M130 80Q165 18 204 70L197 91" fill="'+tone2+'" stroke="'+tone1+'" stroke-width="3"/>')
 +'<path d="M78 106L14 39L33 106L14 173L78 122Z" fill="'+tone2+'" stroke="'+tone1+'" stroke-width="5"/>'
 +'<path d="M65 108Q115 42 231 68Q292 72 333 103Q280 158 189 151Q102 146 65 108Z" fill="url(#'+rid+')" stroke="#deffff" stroke-width="4"/>'
 +'<path d="M147 146Q184 183 216 151L171 133Z" fill="'+tone2+'" stroke="'+tone1+'" stroke-width="3"/>'
 +(isLegend?'<path d="M322 95L355 83L336 105L355 112L322 116Z" fill="#e1e5ff"/>':'')
 +'<path d="M104 90Q152 78 192 86M110 110Q170 118 220 108" stroke="#e9ffff" stroke-opacity=".5" stroke-width="5" fill="none" stroke-linecap="round"/>'
 +'<ellipse cx="290" cy="94" rx="11" ry="12" fill="#fffdf4"/><circle cx="294" cy="95" r="5" fill="#0a2542"/><circle cx="296" cy="92" r="2" fill="#fff"/>'
 +'<path d="M304 126q12 8 24-1" stroke="#0e2a53" stroke-width="4" fill="none" stroke-linecap="round"/></svg>';
}
function clearTimers(){if(interval){clearInterval(interval);interval=null}if(transition){clearTimeout(transition);transition=null}}
function clearScene(){document.body.classList.remove('casting','hooked','reeling','showing-fish','no-fish');$('caughtFish').style.setProperty('--scale','1')}
function setLang(v){
 if(v!=='en'&&v!=='sv')return;
 if(phase==='playing')typed=$('answer')?.value??typed;
 lang=v;try{localStorage.setItem(LANG_KEY,v)}catch{}
 refreshStatic();render();
 if(phase==='descending'&&latest?.fish)window.CQRareDive?.updateLanguage(diveCopy(latest.fish));
}
function refreshStatic(){
 document.documentElement.lang=lang;
 for(const b of document.querySelectorAll('[data-lang]'))b.setAttribute('aria-pressed',String(b.dataset.lang===lang));
 for(const [id,key] of [['allGames','navAll'],['soloLink','navSolo'],['hudTitle','hud'],['hudCatchLabel','fishCaught'],['hudWeightLabel','totalWeight'],['hudBestLabel','biggest'],['footnote','footer']]){
   $(id).textContent=val(key);
 }
 const labels=['rank10','rank40','rank60','rank80','rank100'];
 document.querySelectorAll('#rarityTrack span').forEach((sp,i)=>sp.textContent=val(labels[i]));
 document.title=(lang==='sv'?'Sällsynt fångst':'Rare Catch')+' · Country Quest';
 updateHUD();
}
function updateHUD(){
 $('fishCount').textContent=answers.filter(x=>x.fish).length+' / '+TOTAL;
 $('totalWeight').textContent=kg(totalWeight);
 $('bestFish').textContent=biggest?kg(biggest):'—';
}
function begin(){
 if(BANK.length<TOTAL){$('stage').textContent='Question bank unavailable.';return}
 clearTimers();window.CQRareDive?.reset();clearScene();
 questions=newQuestions();round=0;answers=[];points=0;totalWeight=0;biggest=0;sonar=2;sonarAnswer=null;latest=null;message='';typed='';
 refreshStatic();cast();
}
function cast(){
 clearTimers();window.CQRareDive?.reset();clearScene();phase='casting';document.body.dataset.phase=phase;sonarAnswer=null;message='';typed='';
 render();
 void document.body.offsetWidth;document.body.classList.add('casting');
 transition=setTimeout(()=>{
  if(phase==='casting')openQuestion();
 },920);
}
function openQuestion(){
 clearTimers();phase='playing';document.body.dataset.phase=phase;message='';deadline=Date.now()+LIMIT*1000;
 render();interval=setInterval(tick,100);tick();
}
function tick(){
 if(phase!=='playing')return;
 const t=Math.max(0,Math.ceil((deadline-Date.now())/1000));
 const el=$('clock');
 if(el){el.textContent=t+' s';el.classList.toggle('low',t<=7)}
 if(t<=0)finish(null);
}
function answerOf(raw){return lookup.get(questions[round].id)?.get(strip(raw))||null}
function submit(){
 if(phase!=='playing')return;
 const raw=String($('answer')?.value||'').trim();
 if(!raw){message=val('empty');showMessage();return}
 const found=answerOf(raw);
 if(!found){message=val('tryAgain');showMessage();return}
 finish(found);
}
function showMessage(){
 const target=$('notice');if(target)target.textContent=message;
 const input=$('answer');if(input){input.focus({preventScroll:true});input.select()}
}
function sonarHint(){
 if(phase!=='playing'||sonar<=0||sonarAnswer)return;
 const options=[...questions[round].answers].sort((a,b)=>a.points-b.points);
 if(!options.length)return;
 sonarAnswer=options[0];sonar--;
 const hint=$('sonarResult');
 if(hint){hint.hidden=false;hint.innerHTML='<b>'+esc(val('hintFound'))+'</b> '+esc(local(sonarAnswer))+' — '+esc(val('hintCaution'))}
 const btn=$('sonar');if(btn)btn.disabled=true;
}
function diveCopy(fish){
 const t=TEXT[lang];
 return {
  heading:t.diveHeading,
  description:t.diveLine,
  depth:t.diveDepth,
  target:t.diveTarget,
  rarity:t['rank'+fish.points]+' · '+fish.points+' '+t.points,
  fishFound:t.diveFishFound,
  bite:t.diveBite
 };
}
function startReeling(){
 if(phase!=='descending')return;
 phase='reeling';document.body.dataset.phase=phase;
 document.body.classList.add('hooked');
 render();
 transition=setTimeout(()=>{
  if(phase!=='reeling')return;
  document.body.classList.remove('hooked');
  document.body.classList.add('reeling');
  transition=setTimeout(()=>{
   if(phase!=='reeling')return;
   document.body.classList.remove('reeling');
   document.body.classList.add('showing-fish');
   phase='reveal';document.body.dataset.phase=phase;
   render();
  },1000);
 },520);
}
function finish(answer){
 if(phase!=='playing')return;
 clearTimers();
 const fish=answer?fishFor(answer):null;
 latest={question:questions[round],answer,fish,points:answer?answer.points:0};
 answers.push(latest);points+=latest.points;
 if(fish){totalWeight=Math.round((totalWeight+fish.weight)*10)/10;biggest=Math.max(biggest,fish.weight)}
 updateHUD();
 if(!fish){
  phase='reveal';document.body.dataset.phase=phase;
  document.body.classList.add('no-fish');render();return;
 }
 const fishNode=$('caughtFish'),fishBody=$('fishBody');
 fishBody.innerHTML=fishSvg(fish);
 const scale=fish.points===100?1.8:fish.points===80?1.55:fish.points===60?1.3:fish.points===40?1.05:fish.points===25?.85:.65;
 clearScene();fishNode.style.setProperty('--scale',scale);
 phase='descending';document.body.dataset.phase=phase;
 render();
 if(window.CQRareDive){
  window.CQRareDive.start(fish,fishSvg(fish),diveCopy(fish),startReeling);
 }else{
  startReeling();
 }
}
function next(){
 if(phase!=='reveal')return;
 if(round>=TOTAL-1){complete();return}
 round++;cast();
}
function complete(){
 clearTimers();window.CQRareDive?.reset();clearScene();phase='done';document.body.dataset.phase=phase;
 const best=Number(read('cq-rare-catch-best',0))||0;
 if(totalWeight>best)save('cq-rare-catch-best',totalWeight);
 render();
}
function cardHeader(extra){
 return '<div class="quiz-head"><span class="kicker">'+esc(extra)+'</span><span class="round-no">'+esc(val('round'))+' '+(round+1)+' / '+TOTAL+'</span></div>';
}
function render(){
 const t=TEXT[lang],stage=$('stage');
 stage.classList.remove('enter');
 document.body.dataset.phase=phase;
 let h='';
 if(phase==='intro'){
  h=(posterSrc?'<div class="poster-wrap"><img id="posterArt" src="'+posterSrc+'" alt="Rare Catch: yacht above a reef, fishing line and bigger fish at rarer levels" decoding="async"></div>':'')
   +'<span class="kicker">'+esc(t.kicker)+'</span><h1 class="hero-title">RARE <span>CATCH</span></h1>'
   +'<p class="lead">'+esc(t.intro)+'</p><p class="lead">'+esc(t.description)+'</p>'
   +'<div class="catch-facts">'+t.facts.map(x=>'<span>'+esc(x)+'</span>').join('')+'</div>'
   +'<p class="helper">'+esc(t.how)+'</p>'
   +'<div class="catch-size-guide"><span>🐟</span><span>🐠</span><span>🐡</span><span>🐟</span><span>🐬</span><strong>'+esc(t.note)+'</strong></div>'
   +'<div style="margin-top:20px"><button class="btn" id="start" type="button">🎣 '+esc(t.begin)+'</button></div>'
   +'<p class="disclaimer">'+esc(t.rareInfo)+'</p>';
 }
 else if(phase==='casting'){
   h=cardHeader(t.casting)+'<h2 class="headline">🎣 '+esc(t.casting)+'</h2><p class="lead">'+esc(t.castingLine)+'</p>'
    +'<div class="fish-showcase"><span class="catch-emoji">🌊</span><span>'+esc(t.note)+'</span></div>';
 }
 else if(phase==='playing'){
  const q=questions[round];
  h='<div class="quiz-head"><span class="kicker">'+esc(t.question)+' · '+esc(val('round'))+' '+(round+1)+' / '+TOTAL+'</span>'
    +'<span class="timer-pill" id="clock">'+LIMIT+' s</span></div>'
    +'<h2 class="question">'+esc(lang==='sv'?q.sv:q.en)+'</h2>'
    +'<form id="answerForm" autocomplete="off"><div class="answer-row">'
    +'<input id="answer" type="text" placeholder="'+esc(t.placeholder)+'" aria-label="'+esc(t.placeholder)+'" maxlength="90" required autocomplete="off" autocapitalize="words" spellcheck="false">'
    +'<button class="btn" type="submit">'+esc(t.send)+'</button></div></form>'
    +'<div class="notice" id="notice" role="status">'+esc(message)+'</div>'
    +'<div class="hint-row"><button type="button" class="hint-btn" id="sonar" '+(sonar<=0||sonarAnswer?'disabled':'')+'>'+esc(t.sonar)+' ('+sonar+')</button>'
    +'<span class="helper">'+esc(t.sonarGuide)+'</span></div>'
    +'<div class="sonar-result" id="sonarResult" '+(sonarAnswer?'':'hidden')+'>'
    +(sonarAnswer?'<b>'+esc(t.hintFound)+'</b> '+esc(local(sonarAnswer))+' — '+esc(t.hintCaution):'')+'</div>';
 }
 else if(phase==='descending'){
  h=cardHeader(t.diveGoing)+'<h2 class="headline">🪝 '+esc(t.diveGoing)+'</h2>'
   +'<p class="lead">'+esc(t.diveGoingLine)+'</p>';
 }
 else if(phase==='reeling'){
  h=cardHeader(t.reeling)+'<h2 class="headline">🎣 '+esc(t.reeling)+'</h2><p class="lead">'+esc(t.reelingLead)+'</p>'
   +'<div class="fish-showcase"><span class="catch-emoji" style="animation:fish-reward .7s infinite alternate">🐟</span><span>'+esc(t.note)+'</span></div>';
 }
 else if(phase==='reveal'){
  const catchResult=latest.fish;
  if(catchResult){
   h=cardHeader(t.catch)+'<span class="reveal-pill">★ '+esc(t['rank'+latest.points])+' · '+latest.points+' '+esc(t.points)+'</span>'
    +'<h2 class="headline">'+esc(t.catch)+'</h2>'
    +'<div class="fish-showcase"><div class="catch-emoji" aria-hidden="true">'+fishSvg(catchResult)+'</div><div class="fish-stats">'
    +'<small>'+esc(t.fishType)+'</small><div class="catch-name">'+esc(lang==='sv'?catchResult.sv:catchResult.en)+'</div>'
    +'<strong>'+kg(catchResult.weight)+'</strong><p>'+esc(t.result)+': '+esc(local(latest.answer))+'</p></div></div>'
    +'<div class="score-mini">'+esc(t.rarity)+': <strong>'+latest.points+' '+esc(t.points)+'</strong></div>';
  }else{
   h=cardHeader(t.noCatch)+'<h2 class="headline">🌊 '+esc(t.noCatch)+'</h2>'
    +'<p class="lead">'+esc(t.noCatchText)+'</p>';
  }
  h+='<div><button class="btn" type="button" id="next">'+esc(round===TOTAL-1?t.end:t.next)+'</button></div>';
 }
 else if(phase==='done'){
  const record=Math.max(totalWeight,Number(read('cq-rare-catch-best',0))||0);
  h='<span class="kicker">'+esc(t.summary)+'</span><h2 class="headline">🏆 '+esc(t.summary)+'</h2>'
   +'<p class="lead">'+esc(t.summaryText)+'</p>'
   +'<div class="catch-facts"><span>🎣 '+answers.filter(a=>a.fish).length+' / 7</span><span>⚖️ '+kg(totalWeight)+'</span><span>🏅 '+esc(t.best)+': '+kg(biggest)+'</span></div>'
   +'<div class="score-mini">'+esc(t.record)+': <strong>'+kg(record)+'</strong></div>'
   +'<div class="result-list">'+answers.map((a,i)=>'<div class="result-line"><span>'+(i+1)+'. '+esc(a.fish?(lang==='sv'?a.fish.sv:a.fish.en):t.noAnswer)+'</span>'
   +'<strong>'+esc(a.fish?kg(a.fish.weight):'—')+'</strong></div>').join('')+'</div>'
   +'<button class="btn" id="start" type="button">'+esc(t.replay)+'</button> '
   +'<button class="btn secondary" id="share" type="button">'+esc(t.copy)+'</button>'
   +'<p class="disclaimer">'+esc(t.rareInfo)+'</p>';
 }
 stage.innerHTML=h;void stage.offsetWidth;stage.classList.add('enter');
 if(phase==='playing'){$('answer').value=typed;tick()}
}
async function share(){
 const t=TEXT[lang];
 const msg='🎣 Rare Catch · Country Quest\n'+kg(totalWeight)+' · '+answers.filter(x=>x.fish).length+'/7 '+t.fishCaught.toLowerCase()+'\n'+answers.map((a,i)=>(i+1)+': '+(a.fish?kg(a.fish.weight):'—')).join(' · ')+'\nhttps://country-quest-online.onrender.com/rare-catch.html';
 try{await navigator.clipboard.writeText(msg);$('share').textContent=t.copied}catch{window.prompt(t.copy,msg)}
}
$('stage').addEventListener('click',e=>{
 const button=e.target.closest('button');
 if(!button)return;
 if(button.id==='start')begin();
 if(button.id==='next')next();
 if(button.id==='sonar')sonarHint();
 if(button.id==='share')share();
});
$('stage').addEventListener('submit',e=>{if(e.target.id!=='answerForm')return;e.preventDefault();submit()});
$('stage').addEventListener('input',e=>{if(e.target.id==='answer')typed=e.target.value});
for(const b of document.querySelectorAll('[data-lang]'))b.addEventListener('click',()=>setLang(b.dataset.lang));
refreshStatic();render();
/* Use only the original compact static yacht poster, no animated asset preloads. */
if(typeof fetch==='function'){
 fetch('/rare-catch-poster.avif.base64',{cache:'force-cache'})
 .then(r=>{if(!r.ok)throw Error('Poster unavailable');return r.text()})
 .then(b64=>{
  const encoded=b64.trim();
  if(!/^[A-Za-z0-9+/]+={0,2}$/.test(encoded))return;
  posterSrc='data:image/avif;base64,'+encoded;
  if(phase==='intro'){document.body.classList.add('poster-ready');render()}
 }).catch(()=>{});
}
})();
