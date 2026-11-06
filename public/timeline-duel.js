/* Country Quest Timeline Duel — original two-player chronological challenge. */
(()=>{
'use strict';
const $=id=>document.getElementById(id),app=$('app');
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const translations={
en:{
home:'All games',other:'Classic competition',footer:'Original chronology challenge · Curated historical events',
tag:'LIVE MULTIPLAYER · TIMELINE DUEL',title1:'PUT HISTORY',title2:'IN ORDER.',lead:'Two players. Ten event cards. Place each new event before, between or after the events already on your timeline. No exact-year guessing needed.',
steps:['2 PLAYERS','10 EVENT ROUNDS','SPORT · SPACE · TECH · HISTORY'],create:'Create timeline room',join:'Join a friend',yourName:'Your name',nameHint:'Enter your name',roomCode:'Room code',roomHint:'ABC123',choose:'Choose difficulty',easy:'Easy',medium:'Medium',hard:'Hard',start:'Create a room',joinButton:'Join game',waiting:'Waiting for player two',invite:'Invite your friend with this link',copy:'Copy invitation link',copied:'Link copied!',you:'You',ready:'Ready',thinking:'Thinking…',completed:'Submitted',round:'ROUND',question:'WHEN DID THIS HAPPEN?',place:'Choose where this event belongs on your timeline',before:'Before everything',between:'Between these events',after:'After everything',submitted:'Your answer is locked in!',correct:'Correct! Your timeline grows.',wrong:'Not quite — your timeline stays as it is.',opponent:'Waiting for the other player to place the event…',year:'The actual year',continue:'Next event',waitingReady:'Waiting for friend…',finished:'THE FINAL TIMELINE',draw:'It’s a tie!',wins:'wins!',playAgain:'Play again',leave:'Leave match',back:'Back to games',timeline:'YOUR TIMELINE',locked:'Your timeline has',cards:'cards',score:'points',streak:'streak',error:'Something went wrong',retry:'Connection interrupted. Trying again…',category:'CATEGORY',instructions:'Tap a slot (+) to place the event. Correct positions stay on your timeline.',difficulty:'Difficulty',homeLabel:'A NEW WAY TO COMPETE',hint:'Your events are unique to your own timeline. Two players answer the same card at once.'
},
sv:{
home:'Alla spel',other:'Vanlig tävling',footer:'Eget kronologispel · Historiska händelser med kontrollerade årtal',
tag:'LIVE MULTIPLAYER · TIDSLINJEDUELL',title1:'SÄTT HISTORIEN',title2:'I ORDNING.',lead:'Två spelare. Tio händelser. Placera varje ny händelse före, mellan eller efter händelserna på din tidslinje. Du behöver inte kunna exakta årtal.',
steps:['2 SPELARE','10 OMGÅNGAR','SPORT · RYMDEN · TEKNIK · HISTORIA'],create:'Skapa tidslinjerum',join:'Spela med en vän',yourName:'Ditt namn',nameHint:'Skriv ditt namn',roomCode:'Rumskod',roomHint:'ABC123',choose:'Välj svårighetsgrad',easy:'Lätt',medium:'Medel',hard:'Svår',start:'Skapa rum',joinButton:'Gå med',waiting:'Väntar på spelare två',invite:'Bjud in din vän med länken',copy:'Kopiera inbjudningslänk',copied:'Länk kopierad!',you:'Du',ready:'Redo',thinking:'Funderar…',completed:'Svarat',round:'RUNDA',question:'NÄR HÄNDE DET HÄR?',place:'Välj var händelsen ska ligga på din tidslinje',before:'Före alla',between:'Mellan dessa händelser',after:'Efter alla',submitted:'Ditt svar är låst!',correct:'Rätt! Din tidslinje växer.',wrong:'Inte riktigt – din tidslinje är oförändrad.',opponent:'Väntar på att den andra spelaren ska placera händelsen…',year:'Det rätta årtalet',continue:'Nästa händelse',waitingReady:'Väntar på vännen…',finished:'SLUTRESULTAT',draw:'Oavgjort!',wins:'vinner!',playAgain:'Spela igen',leave:'Lämna matchen',back:'Tillbaka till spelen',timeline:'DIN TIDSLINJE',locked:'Din tidslinje har',cards:'kort',score:'poäng',streak:'svit',error:'Något gick fel',retry:'Anslutningen bröts. Försöker igen…',category:'KATEGORI',instructions:'Tryck på en plats (+) för att placera händelsen. Rätt placerade kort stannar kvar.',difficulty:'Svårighetsgrad',homeLabel:'ETT NYTT SÄTT ATT TÄVLA',hint:'Ni får samma händelse men bygger varsin tidslinje.'
}};
const names={
sports:{en:'Sports',sv:'Sport'},space:{en:'Space',sv:'Rymden'},technology:{en:'Technology',sv:'Teknik'},
science:{en:'Science',sv:'Vetenskap'},history:{en:'History',sv:'Historia'},arts:{en:'Culture',sv:'Kultur'},
culture:{en:'Culture',sv:'Kultur'}
};
let lang='en';try{lang=localStorage.getItem('cq-language')==='sv'?'sv':'en'}catch{}
const t=k=>translations[lang][k]||k;
const eventText=e=>lang==='sv'?e.sv||e.en:e.en||e.sv;
const category=c=>names[c]?.[lang]||c;
const SESSION_KEY='cq-timeline-duel-session';
let session=null,state=null,busy=false,lastError='';
function store(){try{localStorage.setItem(SESSION_KEY,JSON.stringify(session))}catch{}}
function remove(){try{localStorage.removeItem(SESSION_KEY)}catch{}}
async function api(action,extra={}){
 const res=await fetch('/api/'+action,{method:'POST',headers:{'Content-Type':'application/json'},
  body:JSON.stringify({...session,...extra,mode:'timeline'})});
 const data=await res.json();
 if(!res.ok)throw Error(data.error||'Network error');
 return data;
}
function updateLanguage(value){
 if(value!=='en'&&value!=='sv')return;
 lang=value;try{localStorage.setItem('cq-language',lang)}catch{}
 document.documentElement.lang=lang;
 document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===lang)));
 $('homeNav').textContent=t('home');$('otherNav').textContent=t('other');$('footerText').textContent=t('footer');
 document.title=(lang==='sv'?'Tidslinjeduell':'Timeline Duel')+' · Country Quest';
 render();
}
function abandon(){session=null;state=null;remove();lastError='';render()}
function heroArt(){return '<div class="hero-art" aria-hidden="true"><div class="time-ribbon"><span><em>⌛</em><b>1900</b></span><span><em>🚀</em><b>1969</b></span><span><em>💻</em><b>2000</b></span></div></div>'}
function landing(){
 const invite=new URLSearchParams(location.search).get('room')||'';
 app.innerHTML='<section class="hero"><div><span class="kicker">'+escape(t('tag'))+'</span>'
 +'<h1>'+escape(t('title1'))+'<br><span>'+escape(t('title2'))+'</span></h1>'
 +'<p class="lead">'+escape(t('lead'))+'</p>'
 +'<div class="info-chips">'+t('steps').map(x=>'<span>'+escape(x)+'</span>').join('')+'</div>'
 +'<p class="sub">'+escape(t('hint'))+'</p></div>'+heroArt()+'</section>'
 +'<section class="grid"><div class="panel"><h2>⏳ '+escape(t('create'))+'</h2>'
 +'<form id="createForm"><label for="createName">'+escape(t('yourName'))+'</label><input class="field" id="createName" name="name" maxlength="24" placeholder="'+escape(t('nameHint'))+'" required>'
 +'<label style="margin-top:17px">'+escape(t('choose'))+'</label><div class="level-grid">'
 +['easy','medium','hard'].map(x=>'<label><input type="radio" name="difficulty" value="'+x+'" '+(x==='medium'?'checked':'')+'><span>'+escape(t(x))+'</span></label>').join('')+'</div>'
 +'<button class="btn block" type="submit">'+escape(t('start'))+'</button></form></div>'
 +'<div class="panel"><h2>👥 '+escape(t('join'))+'</h2><form id="joinForm"><label for="joinName">'+escape(t('yourName'))+'</label>'
 +'<input class="field" id="joinName" name="name" maxlength="24" required placeholder="'+escape(t('nameHint'))+'">'
 +'<label style="margin-top:17px" for="roomCode">'+escape(t('roomCode'))+'</label>'
 +'<input class="field" id="roomCode" name="code" maxlength="6" required style="text-transform:uppercase" placeholder="'+escape(t('roomHint'))+'" value="'+escape(invite.toUpperCase())+'">'
 +'<button class="btn block" style="margin-top:24px" type="submit">'+escape(t('joinButton'))+'</button></form></div></section>'
 +'<p class="alert" id="error">'+escape(lastError)+'</p>';
 $('#createForm').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.currentTarget);await joinOrCreate('create',{name:f.get('name'),difficulty:f.get('difficulty')})};
 $('#joinForm').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.currentTarget);await joinOrCreate('join',{name:f.get('name'),code:String(f.get('code')||'').toUpperCase()})};
}
async function joinOrCreate(action,form){
 if(busy)return;busy=true;lastError='';
 try{
  state=await api(action,form);
  session={code:state.code,token:state.token};
  store();render();
 }catch(e){lastError=e.message;const err=$('error');if(err)err.textContent=lastError}
 finally{busy=false}
}
function scores(){
 if(!state)return'';
 return '<div class="scores">'+state.players.map((p,i)=>
 '<div class="score '+(i===state.you?'me':'')+'"><span class="name">'+escape(p.name)+(i===state.you?' · '+escape(t('you')):'')+'</span>'
 +'<strong>'+p.score+' <small>'+escape(t('score'))+'</small></strong>'
 +'<small>'+escape(t('timeline'))+': '+p.timelineCount+' · '+escape(t('streak'))+': '+p.streak+' · '
 +escape(p.done?t('completed'):t('thinking'))+'</small></div>').join('')+'</div>';
}
function displayTimeline(interactive){
 const line=state.yourTimeline||[];
 let h='<div class="timeline">';
 for(let pos=0;pos<=line.length;pos++){
  if(interactive)h+='<button class="time-slot" data-slot="'+pos+'" type="button">'
    +escape(pos===0?t('before'):pos===line.length?t('after'):t('between'))+'</button>';
  if(pos<line.length){
   const entry=line[pos];
   h+='<div class="time-card"><span class="year">'+escape(entry.year)+'</span>'
    +'<span class="event-text">'+escape(eventText(entry))+'</span></div>';
  }
 }
 return h+'</div>';
}
function inviteURL(){return location.origin+'/timeline-duel.html?room='+encodeURIComponent(state.code)}
function render(){
 if(!session){landing();return}
 if(!state)return;
 let h='';
 const diff=t(state.difficulty||'medium');
 if(!state.started){
  h='<div class="room-head"><div><span class="kicker">'+escape(t('tag'))+'</span><h1 class="big-title">'+escape(t('waiting'))+'</h1></div>'
   +'<span class="kicker">'+escape(t('difficulty'))+': '+escape(diff)+'</span></div>'
   +'<div class="panel"><span class="kicker">'+escape(t('roomCode'))+'</span><div class="code">'+escape(state.code)+'</div>'
   +'<p class="lead">'+escape(t('invite'))+'</p>'
   +'<button class="btn" id="copy" type="button">'+escape(t('copy'))+'</button> <button class="btn alt" id="leave" type="button">'+escape(t('leave'))+'</button>'
   +'<p class="sub" style="margin-top:15px">'+escape(inviteURL())+'</p></div>';
 }else if(state.finished){
  const [p1,p2]=state.players;
  const name=p1.score===p2.score?t('draw'):(p1.score>p2.score?p1.name:p2.name)+' '+t('wins');
  h='<span class="kicker">'+escape(t('tag'))+'</span><h1 class="big-title">🏆 '+escape(t('finished'))+'</h1>'
   +'<h2>'+escape(name)+'</h2>'+scores()
   +'<div class="panel"><p class="lead">'+escape(t('locked'))+' '+state.yourTimeline.length+' '+escape(t('cards'))+'.</p>'
   +displayTimeline(false)+'<button id="leave" class="btn" type="button">'+escape(t('playAgain'))+'</button></div>';
 }else{
  const q=state.question;
  h='<div class="room-head"><div><span class="kicker">'+escape(t('tag'))+'</span>'
   +'<h2>'+escape(t('round'))+' '+(state.round+1)+' / '+state.total+' · '+escape(t('difficulty'))+': '+escape(diff)+'</h2></div>'
   +'<span class="kicker">'+escape(t('category'))+': '+escape(category(q.category))+'</span></div>'
   +scores()+'<div class="panel"><div class="question-card"><span class="category">'+escape(category(q.category))+'</span>'
   +'<h2 class="event">'+escape(eventText(q))+'</h2><span class="sub">'+escape(t('question'))+'</span></div>';
  if(!state.yourDone){
   h+='<p class="sub">'+escape(t('instructions'))+'</p><h2>⏳ '+escape(t('timeline'))+'</h2>'
    +displayTimeline(true)
    +'<p class="alert" id="error">'+escape(lastError)+'</p>';
  }else{
   h+='<div class="reveal-status '+(state.yourCorrect?'good':'bad')+'">'+escape(t(state.yourCorrect?'correct':'wrong'))+'</div>';
   if(state.correctAnswer!==null){
    h+='<span class="kicker">'+escape(t('year'))+'</span><div class="year-reveal">'+escape(state.correctAnswer)+'</div>'
      +'<button id="ready" class="btn" type="button" '+(state.players[state.you].ready?'disabled':'')+'>'
      +escape(state.players[state.you].ready?t('waitingReady'):t('continue'))+'</button>';
   }else{
    h+='<div class="waiting">'+escape(t('opponent'))+'</div>';
   }
   h+='<h2 style="margin-top:24px">⏳ '+escape(t('timeline'))+'</h2>'+displayTimeline(false);
  }
  h+='</div><button class="btn alt" id="leave" type="button" style="margin-top:19px">'+escape(t('leave'))+'</button>';
 }
 app.innerHTML=h;
 app.querySelectorAll('[data-slot]').forEach(btn=>btn.onclick=()=>act('answer',{answer:btn.dataset.slot}));
 if($('ready'))$('ready').onclick=()=>act('ready');
 if($('leave'))$('leave').onclick=()=>{if(confirm(t('leave')+'?'))abandon()};
 if($('copy'))$('copy').onclick=async()=>{try{await navigator.clipboard.writeText(inviteURL());$('copy').textContent=t('copied')}catch{window.prompt(t('copy'),inviteURL())}};
}
async function act(action,body={}){
 if(busy)return;busy=true;lastError='';
 try{state=await api(action,body);render()}
 catch(e){lastError=e.message;if($('error'))$('error').textContent=lastError;else window.alert(lastError)}
 finally{busy=false}
}
async function poll(){
 if(!session||busy)return;
 try{
  const fresh=await api('state');
  if(JSON.stringify(fresh)!==JSON.stringify(state)){state=fresh;render()}
 }catch(e){
  if(/Room not found|Invalid player session/.test(e.message)){abandon();return}
  if($('error'))$('error').textContent=t('retry');
 }
}
document.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>updateLanguage(b.dataset.lang));
try{session=JSON.parse(localStorage.getItem(SESSION_KEY)||'null')}catch{}
updateLanguage(lang);
if(session)poll();
setInterval(poll,1300);
})();
