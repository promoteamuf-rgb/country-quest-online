/* Country Quest Rare Depths — original open-answer geography mode. */
(()=>{
'use strict';
const QUESTION_COUNT=7,SECONDS=25,MAX_DEPTH=7000,LANG_KEY='cq-language',DECK_KEY='cq-rare-depths-deck';
const BANK=Array.isArray(window.CQ_RARE_BANK)?window.CQ_RARE_BANK:[];
const $=id=>document.getElementById(id);
const escapeHTML=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=x=>String(x??'').normalize('NFKD').toLocaleLowerCase().replace(/[\u0300-\u036f]/g,'').replace(/&/g,'and').replace(/[^a-z0-9]/g,'');
const fmt=n=>Number(n).toLocaleString(lang==='sv'?'sv-SE':'en-GB');
const shuffle=xs=>{let a=[...xs];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[j],a[i]]=[a[i],a[j]]}return a};
const COPY={
en:{
all:'All games',solo:'Solo games',eyebrow:'COUNTRY QUEST · A NEW EXPEDITION',
title:'Think rarer.',titleEm:'Go deeper.',intro:'Seven geography prompts. One answer each. The less obvious your correct answer, the deeper your voyage.',
fact1:'7 ROUNDS',fact2:'25 SECONDS',fact3:'RARE ANSWERS WIN',seaTitle:'THE DEEP BLUE',totalDepth:'TOTAL DEPTH',
footer:'Country Quest · Original rare-answer geography game · Unlimited practice',back:'Back to Country Quest',
introMeta:'READY TO EXPLORE?',introCount:'7 OPEN QUESTIONS',introTitle:'The obvious answer is just the beginning.',
introDesc:'You will see seven geography categories. Type one correct answer before the clock runs out. More unusual answers earn more points — and take you deeper into the ocean.',
rarityGuide:'SIX DEPTH TIERS',step1:'THINK FAST',step1Desc:'25 seconds per question',step2:'THINK DIFFERENT',step2Desc:'An uncommon correct answer wins',step3:'GO DEEP',step3Desc:'Up to 7,000 metres',
begin:'Begin your voyage ↓',
editorNote:'Answers and rarity scores are curated for Country Quest, not measured from other players. The accepted lists are extensive but not exhaustive.',
round:'ROUND',of:'OF',time:'TIME',questionMeta:'NAME ONE VALID ANSWER',placeholder:'Type a place name…',
submit:'Dive deeper ↓',hint:'Try a real country or capital that fits. Spelling variations and Swedish names are supported.',
empty:'Type an answer first.',unknown:'Not in our accepted list. Try another answer while the timer runs.',
accepted:'Correct answer!',invalid:'Time is up!',timeoutInfo:'No recognized answer before the clock ran out. There is always another question.',
rarity:'CURATED RARITY',added:'MORE METRES',resultNote:'Unusual correct answers earn more points. These tiers are editorial estimates, not live popularity statistics.',
also:'Some other rare accepted answers:',next:'Next question →',finish:'See your voyage →',
complete:'VOYAGE COMPLETE',doneTitle:'How deep did you go?',doneLead:'Seven stops on your geography expedition. Here is where your answers took you.',
depth:'DEPTH',score:'POINTS',best:'BEST DEPTH',roundList:'YOUR SEVEN ANSWERS',chart:'DEPTH EARNED IN EACH ROUND',
noAnswer:'No accepted answer',playAgain:'Dive again ↻',copy:'Copy my result',copied:'Result copied!',
clipboard:'Copy this result:',meters:'m',points:'pts',
fullscreenOn:'Full screen',fullscreenOff:'Exit full screen',rank10:'Common',rank25:'Familiar',rank40:'Less obvious',rank60:'Uncommon',rank80:'Rare find',rank100:'Deep discovery'
},
sv:{
all:'Alla spel',solo:'Spela själv',eyebrow:'COUNTRY QUEST · ETT NYTT ÄVENTYR',
title:'Tänk ovanligare.',titleEm:'Dyk djupare.',intro:'Sju geografifrågor. Ett svar på varje. Ju ovanligare ditt rätta svar är, desto djupare kommer du.',
fact1:'7 RUNDOR',fact2:'25 SEKUNDER',fact3:'OVANLIGA SVAR VINNER',seaTitle:'DET DJUPBLÅ HAVET',totalDepth:'TOTALT DJUP',
footer:'Country Quest · Eget geografispel med ovanliga svar · Obegränsat spelande',back:'Tillbaka till Country Quest',
introMeta:'REDO ATT UTFORSKA?',introCount:'7 ÖPPNA FRÅGOR',introTitle:'Det uppenbara svaret är bara början.',
introDesc:'Du får sju kategorier inom geografi. Skriv ett korrekt svar innan tiden tar slut. Ovanligare svar ger fler poäng och tar dig djupare ner i havet.',
rarityGuide:'SEX DJUPNIVÅER',step1:'TÄNK SNABBT',step1Desc:'25 sekunder per fråga',step2:'TÄNK ANNORLUNDA',step2Desc:'Ovanliga rätta svar ger mer',step3:'DYK DJUPT',step3Desc:'Nå upp till 7 000 meter',
begin:'Starta dyket ↓',
editorNote:'Svar och sällsynthetspoäng är utvalda av Country Quest, inte beräknade från andra spelares svar. Svarslistorna är omfattande men inte fullständiga.',
round:'RUNDA',of:'AV',time:'TID',questionMeta:'ANGE ETT KORREKT SVAR',placeholder:'Skriv ett land eller en huvudstad …',
submit:'Dyk djupare ↓',hint:'Skriv ett riktigt land eller en huvudstad som passar. Stavningsvarianter och svenska namn fungerar.',
empty:'Skriv ett svar först.',unknown:'Finns inte i vår godkända svarslista. Prova ett annat medan du har tid.',
accepted:'Rätt svar!',invalid:'Tiden är slut!',timeoutInfo:'Inget godkänt svar innan tiden tog slut. Det kommer fler frågor.',
rarity:'UPPSKATTAD SÄLLSYNTHET',added:'FLER METER',resultNote:'Ovanligare korrekta svar ger mer poäng. Nivåerna är uppskattningar, inte statistik över andra spelare.',
also:'Andra ovanliga rätta svar:',next:'Nästa fråga →',finish:'Se ditt resultat →',
complete:'DYKET ÄR KLART',doneTitle:'Hur djupt kom du?',doneLead:'Sju stationer på din geografiresa. Här ser du hur långt dina svar tog dig.',
depth:'DJUP',score:'POÄNG',best:'DJUPREKORD',roundList:'DINA SJU SVAR',chart:'DJUP PER RUNDA',
noAnswer:'Inget godkänt svar',playAgain:'Dyk igen ↻',copy:'Kopiera resultat',copied:'Resultatet kopierat!',
clipboard:'Kopiera detta resultat:',meters:'m',points:'p',
fullscreenOn:'Helskärm',fullscreenOff:'Avsluta helskärm',rank10:'Vanligt',rank25:'Välkänt',rank40:'Lite ovanligt',rank60:'Ovanligt',rank80:'Sällsynt',rank100:'Djupfynd'
}
};
let lang='en';
try{const saved=localStorage.getItem(LANG_KEY);if(saved==='en'||saved==='sv')lang=saved}catch{}
let phase='intro',questions=[],index=0,points=0,results=[],deadline=0,timer=null,currentResult=null,notice='',draft='';
const stage=$('stage');
const aliases=new Map();
for(const q of BANK){
  const indexMap=new Map();
  for(const answer of q.answers||[]){
    for(const alias of [answer.name,answer.sv,...(answer.aliases||[])]){
      const key=normalize(alias);if(!key)continue;
      // A duplicate alias in the same prompt must never score a different place.
      if(indexMap.has(key)&&indexMap.get(key)!==answer.name)continue;
      indexMap.set(key,answer.name);
    }
  }
  aliases.set(q.id,indexMap);
}
const label=answer=>!answer?null:(lang==='sv'?answer.sv:answer.name);
const dictionary=()=>COPY[lang];
const qNow=()=>questions[index];
function read(key,fallback){
  try{const value=JSON.parse(localStorage.getItem(key)||'null');return value??fallback}catch{return fallback}
}
function write(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch{}}
function selectQuestions(){
  const ids=BANK.map(q=>q.id);
  let deck=read(DECK_KEY,[]).filter(id=>ids.includes(id));
  let chosen=[];
  while(chosen.length<QUESTION_COUNT){
    if(!deck.length)deck=shuffle(ids.filter(id=>!chosen.includes(id)));
    if(!deck.length)break;
    const candidate=deck.shift();
    if(!chosen.includes(candidate))chosen.push(candidate);
  }
  write(DECK_KEY,deck);
  return chosen.map(id=>BANK.find(q=>q.id===id));
}
function setLanguage(value){
  if(value!=='en'&&value!=='sv')return;
  if(phase==='playing')draft=$('answerInput')?.value??draft;
  lang=value;try{localStorage.setItem(LANG_KEY,value)}catch{}
  updateStatic();render();
}
function updateFullscreenButton(){
  const button=$('fullscreenBtn');
  if(!button)return;
  const enabled=!!document.fullscreenElement;
  const text=enabled?dictionary().fullscreenOff:dictionary().fullscreenOn;
  button.setAttribute('aria-pressed',String(enabled));
  button.setAttribute('aria-label',text);
  button.title=text;
  const span=button.querySelector('.expand-label');
  if(span)span.textContent=text;
}
function updateStatic(){
  const t=dictionary();document.documentElement.lang=lang;
  for(const btn of document.querySelectorAll('[data-lang]'))btn.setAttribute('aria-pressed',String(btn.dataset.lang===lang));
  $('navAll').textContent=t.all;$('navSolo').textContent=t.solo;
  document.querySelector('.eyebrow').textContent=t.eyebrow;
  document.querySelector('.intro h1').innerHTML=escapeHTML(t.title)+'<br><em>'+escapeHTML(t.titleEm)+'</em>';
  $('introText').textContent=t.intro;
  $('heroFact1').textContent=t.fact1;$('heroFact2').textContent=t.fact2;$('heroFact3').textContent=t.fact3;
  $('seaTitle').textContent=t.seaTitle;$('depthTitle').textContent=t.totalDepth;
  $('footerText').textContent=t.footer;$('backFooter').textContent=t.back;
  updateFullscreenButton();
  updateDepth();
  window.CQDiveFX?.onLanguage();
}
function updateDepth(){
  const depth=Math.min(MAX_DEPTH,points*10),percent=depth/MAX_DEPTH*100;
  if(window.CQDiveFX){window.CQDiveFX.setDepth(depth);return}
  $('depthFill').style.height=percent+'%';
  $('submersible').style.top=percent+'%';
  $('depthValue').textContent=fmt(depth)+' m';
  $('seaRank').textContent=fmt(depth)+' / '+fmt(MAX_DEPTH)+' m';
}
function start(){
  if(BANK.length<QUESTION_COUNT){stage.textContent='Question bank unavailable.';return}
  questions=selectQuestions();index=0;points=0;results=[];currentResult=null;draft='';notice='';phase='playing';window.CQDiveFX?.reset();updateDepth();openRound();
}
function openRound(){
  clearInterval(timer);timer=null;phase='playing';draft='';notice='';
  deadline=Date.now()+SECONDS*1000;
  render();
  timer=setInterval(tick,100);
  tick();
}
function tick(){
 if(phase!=='playing')return;
 const seconds=Math.max(0,Math.ceil((deadline-Date.now())/1000));
 const el=$('clock');
 if(el){el.textContent=String(seconds).padStart(2,'0')+' s';el.classList.toggle('warn',seconds<=7)}
 window.CQDiveFX?.setTimer(Math.max(0,deadline-Date.now()),SECONDS*1000);
 if(seconds<=0){finishAnswer(null,true)}
}
function findAnswer(question,input){
 const key=normalize(input);
 const name=aliases.get(question.id)?.get(key);
 return question.answers.find(a=>a.name===name)||null;
}
function submitAnswer(value){
 if(phase!=='playing')return;
 const t=dictionary();
 const raw=String(value||'').trim();
 if(!raw){notice=t.empty;displayNotice();return}
 const answer=findAnswer(qNow(),raw);
 if(!answer){notice=t.unknown;displayNotice();window.CQDiveFX?.reject();return}
 finishAnswer(answer,false);
}
function displayNotice(){
 const el=$('notice');if(el)el.textContent=notice;
 const field=$('answerInput');if(field){field.focus({preventScroll:true});field.select()}
}
function finishAnswer(answer,timedOut){
 if(phase!=='playing')return;
 clearInterval(timer);timer=null;phase='reveal';
 const gained=answer?.points||0;points+=gained;
 currentResult={prompt:qNow().id,answer,earned:gained,expired:timedOut};
 results.push(currentResult);
 draft='';updateDepth();render();
}
function next(){
 if(phase!=='reveal')return;
 if(index===QUESTION_COUNT-1){finishGame();return}
 index++;openRound();
}
function finishGame(){
 clearInterval(timer);timer=null;phase='done';
 const depth=points*10,best=Number(read('cq-rare-best',0))||0;
 if(depth>best)write('cq-rare-best',depth);
 render();
}
function rarity(points){
 return COPY[lang]['rank'+points]||'Rare';
}
function chips(){
 const t=dictionary();
 return '<div class="meta"><span class="micro">'+escapeHTML(t.round)+' '+(index+1)+' '+escapeHTML(t.of)+' '+QUESTION_COUNT+'</span><span class="counter">'+(index+1)+' / '+QUESTION_COUNT+'</span></div>'
   +'<div class="progress" aria-label="Question progress"><span style="width:'+((index)/QUESTION_COUNT*100)+'%"></span></div>';
}
function render(){
 document.body.dataset.rarePhase=phase;
 const t=dictionary();
 if(phase==='intro'){
  stage.innerHTML='<div class="meta"><span class="micro">'+escapeHTML(t.introMeta)+'</span><span class="counter">'+escapeHTML(t.introCount)+'</span></div>'
    +'<h2 class="headline">'+escapeHTML(t.introTitle)+'</h2>'
    +'<p class="lead">'+escapeHTML(t.introDesc)+'</p>'
    +'<div class="how"><div><b>01</b><strong>'+escapeHTML(t.step1)+'</strong><div class="note">'+escapeHTML(t.step1Desc)+'</div></div>'
    +'<div><b>02</b><strong>'+escapeHTML(t.step2)+'</strong><div class="note">'+escapeHTML(t.step2Desc)+'</div></div>'
    +'<div><b>03</b><strong>'+escapeHTML(t.step3)+'</strong><div class="note">'+escapeHTML(t.step3Desc)+'</div></div></div>'
    +'<div class="tier-guide"><span class="micro">'+escapeHTML(t.rarityGuide)+'</span><div class="tier-steps">'+[10,25,40,60,80,100].map(value=>'<div class="tier-pill tier-'+value+'"><strong>'+value+' <small>'+escapeHTML(t.points)+'</small></strong><span>'+escapeHTML(rarity(value))+'</span></div>').join('')+'</div></div>'
    +'<button class="primary" id="startGame" type="button">'+escapeHTML(t.begin)+'</button>'
    +'<p class="disclaimer">'+escapeHTML(t.editorNote)+'</p>';
  window.CQDiveFX?.onScreen('intro',0,0);
  return;
 }
 if(phase==='playing'){
  const q=qNow();
  stage.innerHTML=chips()
    +'<div class="meta"><span class="prompt-category">'+escapeHTML(t.questionMeta)+'</span><div class="timer-widget" id="timerGauge"><svg class="timer-svg" viewBox="0 0 40 40" aria-hidden="true"><circle class="track" cx="20" cy="20" r="15"></circle><circle class="remaining" id="timerArc" cx="20" cy="20" r="15"></circle></svg><span class="clock" id="clock" aria-label="'+escapeHTML(t.time)+'">25 s</span></div></div>'
    +'<h2 class="question">'+escapeHTML(lang==='sv'?q.sv:q.en)+'</h2>'
    +'<form id="answerForm" autocomplete="off" novalidate><div class="answerbox">'
    +'<input id="answerInput" type="text" inputmode="text" maxlength="85" autocapitalize="words" spellcheck="false" autocomplete="off" placeholder="'+escapeHTML(t.placeholder)+'" aria-label="'+escapeHTML(t.placeholder)+'" required>'
    +'<button class="primary" type="submit">'+escapeHTML(t.submit)+'</button></div></form>'
    +'<div class="notice" id="notice" role="status">'+escapeHTML(notice)+'</div>'
    +'<p class="note">'+escapeHTML(t.hint)+'</p>';
  $('answerInput').value=draft;tick();window.CQDiveFX?.onScreen('playing',index,0);return;
 }
 if(phase==='reveal'){
  const r=currentResult,answer=r.answer,q=qNow(),rank=answer?rarity(answer.points):'—';
  const rareSuggestions=q.answers.filter(x=>x.points>=80&&(!answer||x.name!==answer.name)).slice(0,3).map(x=>escapeHTML(label(x))).join(' · ');
  stage.innerHTML=chips()
   +'<span class="rarity-badge">'+(answer?'✦ '+escapeHTML(rank.toUpperCase())+' · '+r.earned+' '+escapeHTML(t.points):'◌ 0 '+escapeHTML(t.points))+'</span>'
   +'<h2 class="headline">'+escapeHTML(answer?t.accepted:t.invalid)+'</h2>'
   +'<div class="feedback"><strong>'+escapeHTML(answer?label(answer):t.noAnswer)+'</strong><p>'
   +escapeHTML(answer?'+'+(r.earned*10)+' m · '+r.earned+' '+t.points:t.timeoutInfo)+'</p></div>'
   +(rareSuggestions?'<p class="note">'+escapeHTML(t.also)+' '+rareSuggestions+'</p>':'')
   +'<p class="disclaimer">'+escapeHTML(t.resultNote)+'</p>'
   +'<button class="primary" type="button" id="nextRound">'+escapeHTML(index===QUESTION_COUNT-1?t.finish:t.next)+'</button>';
  window.CQDiveFX?.onScreen('reveal',index,r.earned);
  return;
 }
 if(phase==='done'){
  const best=Math.max(points*10,Number(read('cq-rare-best',0))||0);
  stage.innerHTML='<div class="meta"><span class="micro">'+escapeHTML(t.complete)+'</span><span class="counter">7 / 7</span></div>'
   +'<h2 class="headline">'+escapeHTML(t.doneTitle)+'</h2><p class="lead">'+escapeHTML(t.doneLead)+'</p>'
   +'<div class="hud"><div class="stat"><small>'+escapeHTML(t.depth)+'</small><strong>'+fmt(points*10)+' m</strong></div>'
   +'<div class="stat"><small>'+escapeHTML(t.score)+'</small><strong>'+points+' / 700</strong></div>'
   +'<div class="stat"><small>'+escapeHTML(t.best)+'</small><strong>'+fmt(best)+' m</strong></div></div>'
   +'<h3 class="micro" style="margin-top:26px">'+escapeHTML(t.chart)+'</h3>'
   +'<div class="voyage-chart" role="img" aria-label="'+escapeHTML(t.chart)+'">'+results.map((r,i)=>'<div class="voyage-column"><div class="voyage-bar-area"><span class="voyage-bar '+(r.earned?'':'empty')+'" style="--height:'+Math.max(3,r.earned)+'%;--delay:'+(i*.06)+'s"></span></div><strong>'+r.earned+'</strong><small>'+(i+1)+' / 7</small></div>').join('')+'</div>'
   +'<h3 class="micro" style="margin-top:26px">'+escapeHTML(t.roundList)+'</h3>'
   +'<div class="recap">'+results.map((r,i)=>'<div><span>'+(i+1)+'. '+escapeHTML(lang==='sv'?questions[i].sv:questions[i].en)+'</span><strong>'+escapeHTML(r.answer?label(r.answer):t.noAnswer)+' · '+r.earned+' '+escapeHTML(t.points)+'</strong></div>').join('')+'</div>'
   +'<div style="display:flex;gap:9px;flex-wrap:wrap"><button class="primary" type="button" id="startGame">'+escapeHTML(t.playAgain)+'</button><button class="secondary" type="button" id="copyResult">'+escapeHTML(t.copy)+'</button></div>'
   +'<p class="disclaimer">'+escapeHTML(t.editorNote)+'</p>';
   window.CQDiveFX?.onScreen('done',index,points);
 }
}
function shareText(){
 const t=dictionary();
 return '🌊 Country Quest · Rare Depths\n'+fmt(points*10)+' m · '+points+'/700 '+t.points+'\n'+results.map((r,i)=>(i+1)+': '+r.earned+' '+t.points).join(' · ')+'\nhttps://country-quest-online.onrender.com/rare-depths.html';
}
async function copyResult(){
 try{if(!navigator.clipboard)throw Error('clipboard unavailable');await navigator.clipboard.writeText(shareText());const btn=$('copyResult');if(btn)btn.textContent=dictionary().copied}
 catch{window.prompt(dictionary().clipboard,shareText())}
}
stage.addEventListener('click',e=>{
 const target=e.target.closest('button');if(!target)return;
 if(target.id==='startGame')start();
 if(target.id==='nextRound')next();
 if(target.id==='copyResult')copyResult();
});
stage.addEventListener('submit',e=>{
 if(e.target.id!=='answerForm')return;
 e.preventDefault();submitAnswer($('answerInput')?.value);
});
stage.addEventListener('input',e=>{
 if(e.target.id==='answerInput')draft=e.target.value;
});
for(const b of document.querySelectorAll('[data-lang]'))b.addEventListener('click',()=>setLanguage(b.dataset.lang));
const fullscreenBtn=$('fullscreenBtn');
if(fullscreenBtn){
 if(!document.documentElement.requestFullscreen)fullscreenBtn.hidden=true;
 else fullscreenBtn.addEventListener('click',async()=>{
  try{
   if(document.fullscreenElement)await document.exitFullscreen();
   else await document.documentElement.requestFullscreen();
  }catch(err){fullscreenBtn.title=lang==='sv'?'Helskärm stöds inte här.':'Full screen is unavailable in this browser.'}
  updateFullscreenButton();
 });
}
document.addEventListener('fullscreenchange',updateFullscreenButton);
updateStatic();render();
})();
