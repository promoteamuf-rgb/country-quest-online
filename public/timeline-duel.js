/* Country Quest Timeline Duel — original two-player chronological challenge. */
(()=>{
'use strict';
const $=id=>document.getElementById(id),app=$('app');
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const translations={
en:{
home:'All games',other:'Classic competition',footer:'Original chronology challenge · Curated historical events',
tag:'LIVE MULTIPLAYER · TIMELINE DUEL',title1:'PUT HISTORY',title2:'IN ORDER.',lead:'Two to twelve players. Ten event cards. Place each new event before, between or after the events already on your timeline. No exact-year guessing needed.',
steps:['2–12 PLAYERS','10 EVENT ROUNDS','SPORT · SPACE · TECH · HISTORY'],create:'Create timeline room',join:'Join a friend',yourName:'Your name',nameHint:'Enter your name',roomCode:'Room code',roomHint:'ABC123',choose:'Choose difficulty',easy:'Easy',medium:'Medium',hard:'Hard',start:'Create a room',joinButton:'Join game',waiting:'Waiting room',host:'Host',players:'Players',startMatch:'Start match',waitingHost:'Waiting for the host to start the match…',startHint:'Everyone joined? Start whenever you are ready. No one can join after the start.',needPlayers:'Invite at least one more player to enable Start.',previousRoom:'Previous room',resumeRoom:'Resume previous room',forgetRoom:'Forget previous room',newRoom:'Create a new room',roomExpired:'That previous room has expired. Create a new one or join another room.',resumingRoom:'Opening previous room…',waitingHelp:'Share the room link. Up to twelve players can join before the host starts the game.',creating:'Creating your room… The server may need a moment to wake up.',joining:'Joining the room…',connectionError:'Could not reach the game server. Please try again.',createRetry:'The server is starting. Trying again…',invalidResponse:'The server returned an invalid room. Please try again.',invite:'Invite your friend with this link',copy:'Copy invitation link',copied:'Link copied!',you:'You',ready:'Ready',thinking:'Thinking…',completed:'Submitted',round:'ROUND',question:'WHEN DID THIS HAPPEN?',place:'Choose where this event belongs on your timeline',before:'Before everything',between:'Between these events',after:'After everything',submitted:'Your answer is locked in!',correct:'Correct! Your timeline grows.',wrong:'Not quite — your timeline stays as it is.',opponent:'Waiting for everyone to place the event…',year:'The actual year',continue:'Next event',waitingReady:'Waiting for everyone…',finished:'THE FINAL TIMELINE',draw:'It’s a tie!',wins:'wins!',playAgain:'Play again',leave:'Leave match',back:'Back to games',timeline:'YOUR TIMELINE',locked:'Your timeline has',cards:'cards',score:'points',streak:'streak',error:'Something went wrong',retry:'Connection interrupted. Trying again…',category:'CATEGORY',instructions:'Tap a slot (+) to place the event. Correct positions stay on your timeline.',difficulty:'Difficulty',homeLabel:'A NEW WAY TO COMPETE',hint:'Everyone receives the same event, but builds their own timeline.'
},
sv:{
home:'Alla spel',other:'Vanlig tävling',footer:'Eget kronologispel · Historiska händelser med kontrollerade årtal',
tag:'LIVE MULTIPLAYER · TIDSLINJEDUELL',title1:'SÄTT HISTORIEN',title2:'I ORDNING.',lead:'Två till tolv spelare. Tio händelser. Placera varje ny händelse före, mellan eller efter händelserna på din tidslinje. Du behöver inte kunna exakta årtal.',
steps:['2–12 SPELARE','10 OMGÅNGAR','SPORT · RYMDEN · TEKNIK · HISTORIA'],create:'Skapa tidslinjerum',join:'Spela med en vän',yourName:'Ditt namn',nameHint:'Skriv ditt namn',roomCode:'Rumskod',roomHint:'ABC123',choose:'Välj svårighetsgrad',easy:'Lätt',medium:'Medel',hard:'Svår',start:'Skapa rum',joinButton:'Gå med',waiting:'Väntrum',host:'Värd',players:'Spelare',startMatch:'Starta matchen',waitingHost:'Väntar på att värden startar matchen…',startHint:'Är alla med? Starta när du vill. Ingen kan gå med efter start.',needPlayers:'Bjud in minst en spelare till för att kunna starta.',previousRoom:'Tidigare rum',resumeRoom:'Fortsätt i tidigare rum',forgetRoom:'Glöm tidigare rum',newRoom:'Skapa ett nytt rum',roomExpired:'Det tidigare rummet finns inte längre. Skapa ett nytt eller gå med i ett annat.',resumingRoom:'Öppnar tidigare rum…',waitingHelp:'Dela rumslänken. Upp till tolv spelare kan gå med innan värden startar matchen.',creating:'Skapar rum… Servern kan behöva en stund att vakna.',joining:'Ansluter till rummet…',connectionError:'Kunde inte nå spelservern. Försök igen.',createRetry:'Servern startar. Försöker igen…',invalidResponse:'Servern skickade ett ogiltigt rum. Försök igen.',invite:'Bjud in din vän med länken',copy:'Kopiera inbjudningslänk',copied:'Länk kopierad!',you:'Du',ready:'Redo',thinking:'Funderar…',completed:'Svarat',round:'RUNDA',question:'NÄR HÄNDE DET HÄR?',place:'Välj var händelsen ska ligga på din tidslinje',before:'Före alla',between:'Mellan dessa händelser',after:'Efter alla',submitted:'Ditt svar är låst!',correct:'Rätt! Din tidslinje växer.',wrong:'Inte riktigt – din tidslinje är oförändrad.',opponent:'Väntar på att alla spelare ska placera händelsen…',year:'Det rätta årtalet',continue:'Nästa händelse',waitingReady:'Väntar på alla…',finished:'SLUTRESULTAT',draw:'Oavgjort!',wins:'vinner!',playAgain:'Spela igen',leave:'Lämna matchen',back:'Tillbaka till spelen',timeline:'DIN TIDSLINJE',locked:'Din tidslinje har',cards:'kort',score:'poäng',streak:'svit',error:'Något gick fel',retry:'Anslutningen bröts. Försöker igen…',category:'KATEGORI',instructions:'Tryck på en plats (+) för att placera händelsen. Rätt placerade kort stannar kvar.',difficulty:'Svårighetsgrad',homeLabel:'ETT NYTT SÄTT ATT TÄVLA',hint:'Alla får samma händelse men bygger varsin tidslinje.'
}};
const names={
sports:{en:'Sports',sv:'Sport'},space:{en:'Space',sv:'Rymden'},technology:{en:'Technology',sv:'Teknik'},
science:{en:'Science',sv:'Vetenskap'},history:{en:'History',sv:'Historia'},arts:{en:'Culture',sv:'Kultur'},
culture:{en:'Culture',sv:'Kultur'}
};
let lang='en';try{lang=localStorage.getItem('cq-language')==='sv'?'sv':'en'}catch{}
const t=k=>translations[lang][k]||k;
const eventText=e=>lang==='sv'?(e.sv||e.promptSv||e.en||e.prompt||''):(e.en||e.prompt||e.sv||e.promptSv||'');
const category=c=>names[c]?.[lang]||c;
const SESSION_KEY='cq-timeline-duel-session';
let session=null,state=null,busy=false,lastError='',savedSession=null;
function store(){savedSession=session?{code:session.code,token:session.token}:null;try{localStorage.setItem(SESSION_KEY,JSON.stringify(savedSession))}catch{}}
function remove(){savedSession=null;try{localStorage.removeItem(SESSION_KEY)}catch{}}
async function api(action,extra={}){
 const body=JSON.stringify({...session,...extra,mode:'timeline'});
 let lastError;
 const attempts=action==='create'?2:1;
 for(let attempt=0;attempt<attempts;attempt++){
  let timeoutId=null;
  let controller=null;
  try{
   if(typeof AbortController!=='undefined'){
    controller=new AbortController();
    timeoutId=setTimeout(()=>controller.abort(),45000);
   }
   const res=await fetch('/api/'+action,{
    method:'POST',headers:{'Content-Type':'application/json'},
    body,cache:'no-store',...(controller?{signal:controller.signal}:{})
   });
   let data;
   try{data=await res.json()}catch{throw Error(t('connectionError'))}
   if(!res.ok)throw Error(data.error||t('connectionError'));
   return data;
  }catch(err){
   lastError=err;
   if(action!=='create'||attempt===attempts-1||!(/fetch|network|abort|reach|failed|connection/i.test(String(err.message||err))))break;
   const status=$('createStatus');
   if(status)status.textContent=t('createRetry');
  }finally{
   if(timeoutId!==null)clearTimeout(timeoutId);
  }
 }
 throw lastError||Error(t('connectionError'));
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
 +(savedSession?'<div class="resume-panel"><div><span class="kicker">'+escape(t('previousRoom'))+'</span><strong>'+escape(savedSession.code)+'</strong></div><div class="resume-buttons"><button class="btn alt" type="button" id="resumeRoom">'+escape(t('resumeRoom'))+'</button><button class="btn alt" type="button" id="forgetRoom">'+escape(t('forgetRoom'))+'</button></div></div>':'')
 +'<section class="grid"><div class="panel"><h2>⏳ '+escape(t('create'))+'</h2>'
 +'<form id="createForm"><label for="createName">'+escape(t('yourName'))+'</label><input class="field" id="createName" name="name" maxlength="24" placeholder="'+escape(t('nameHint'))+'">'
 +'<label style="margin-top:17px">'+escape(t('choose'))+'</label><div class="level-grid">'
 +['easy','medium','hard'].map(x=>'<label><input type="radio" name="difficulty" value="'+x+'" '+(x==='medium'?'checked':'')+'><span>'+escape(t(x))+'</span></label>').join('')+'</div>'
 +'<button class="btn block" id="createRoomBtn" type="submit">'+escape(t('start'))+'</button>'
 +'<p class="sub" id="createStatus" role="status" aria-live="polite"></p></form></div>'
 +'<div class="panel"><h2>👥 '+escape(t('join'))+'</h2><form id="joinForm"><label for="joinName">'+escape(t('yourName'))+'</label>'
 +'<input class="field" id="joinName" name="name" maxlength="24" required placeholder="'+escape(t('nameHint'))+'">'
 +'<label style="margin-top:17px" for="roomCode">'+escape(t('roomCode'))+'</label>'
 +'<input class="field" id="roomCode" name="code" maxlength="6" required style="text-transform:uppercase" placeholder="'+escape(t('roomHint'))+'" value="'+escape(invite.toUpperCase())+'">'
 +'<button class="btn block" style="margin-top:24px" type="submit">'+escape(t('joinButton'))+'</button></form></div></section>'
 +'<p class="alert" id="error">'+escape(lastError)+'</p>';
 if($('resumeRoom'))$('resumeRoom').onclick=resumeRoom;
 if($('forgetRoom'))$('forgetRoom').onclick=()=>{remove();lastError='';landing()};
 $('createForm').onsubmit=async e=>{
  e.preventDefault();
  const name=String($('createName')?.value||'').trim()||'Player';
  const choice=document.querySelector('input[name="difficulty"]:checked');
  await joinOrCreate('create',{name,difficulty:choice?.value||'medium'});
 };
 $('joinForm').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.currentTarget);await joinOrCreate('join',{name:f.get('name'),code:String(f.get('code')||'').toUpperCase()})};
}
async function resumeRoom(){
 if(busy||!savedSession)return;
 busy=true;lastError='';
 const button=$('resumeRoom');
 if(button){button.disabled=true;button.textContent=t('resumingRoom')}
 try{
  session={code:savedSession.code,token:savedSession.token};
  const restored=await api('state');
  if(!restored||restored.code!==session.code)throw Error(t('roomExpired'));
  state=restored;
  render();
 }catch(e){
  session=null;state=null;remove();lastError=t('roomExpired');render();
 }finally{busy=false}
}
async function joinOrCreate(action,form){
 if(busy)return;
 busy=true;lastError='';
 const button=$('createRoomBtn');
 const message=$('createStatus');
 if(button){button.disabled=true;button.textContent=t('creating')}
 if(message)message.textContent=t('creating');
 try{
  const created=await api(action,form);
  if(!created||!created.code||!created.token)throw Error(t('invalidResponse'));
  session={code:created.code,token:created.token};
  state=created;
  store();
  render();
 }catch(e){
  lastError=e?.message||t('connectionError');
  if(message)message.textContent=lastError;
  const err=$('error');if(err)err.textContent=lastError;
 }finally{
  busy=false;
  if(button&&button.isConnected){button.disabled=false;button.textContent=t('start')}
 }
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
  const count=state.players.length,canStart=count>=(state.minPlayers||2);
  const roster='<div class="lobby-players">'+state.players.map((p,i)=>
   '<div class="lobby-player"><span class="lobby-number">'+(i+1)+'</span><strong>'+escape(p.name)+'</strong>'
   +(i===0?'<small>★ '+escape(t('host'))+'</small>':'')
   +(i===state.you?'<small>'+escape(t('you'))+'</small>':'')+'</div>').join('')+'</div>';
  h='<div class="room-head"><div><span class="kicker">'+escape(t('tag'))+'</span><h1 class="big-title">'+escape(t('waiting'))+'</h1></div>'
   +'<span class="kicker">'+escape(t('difficulty'))+': '+escape(diff)+'</span></div>'
   +'<div class="panel"><span class="kicker">'+escape(t('roomCode'))+'</span><div class="code">'+escape(state.code)+'</div>'
   +'<p class="lead">'+escape(t('invite'))+'</p><p class="sub">'+escape(t('waitingHelp'))+'</p>'
   +'<h2>'+escape(t('players'))+' ('+count+' / '+(state.maxPlayers||12)+')</h2>'+roster
   +'<div class="lobby-actions"><button class="btn alt" id="copy" type="button">'+escape(t('copy'))+'</button>'
   +(state.isHost?'<button class="btn" id="startMatch" type="button" '+(canStart?'':'disabled')+'>'+escape(t('startMatch'))+' ('+count+')</button>':'')
   +'<button class="btn alt" id="newRoom" type="button">'+escape(t('newRoom'))+'</button></div>'
   +'<p class="sub">'+escape(state.isHost?(canStart?t('startHint'):t('needPlayers')):t('waitingHost'))+'</p>'
   +'<p class="sub" style="margin-top:15px">'+escape(inviteURL())+'</p></div>';
 }else if(state.finished){
  const maxScore=Math.max(...state.players.map(p=>p.score));
  const leaders=state.players.filter(p=>p.score===maxScore);
  const name=leaders.length===1?leaders[0].name+' '+t('wins'):leaders.map(p=>p.name).join(' & ')+' · '+t('draw');
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
  h+=' <button class="btn alt" id="newRoom" type="button" style="margin-top:19px">'+escape(t('newRoom'))+'</button>';
 }
 app.innerHTML=h;
 app.querySelectorAll('[data-slot]').forEach(btn=>btn.onclick=()=>act('answer',{answer:btn.dataset.slot}));
 if($('ready'))$('ready').onclick=()=>act('ready');
 if($('startMatch'))$('startMatch').onclick=()=>act('start');
 if($('leave'))$('leave').onclick=()=>{if(confirm(t('leave')+'?'))abandon()};
 if($('newRoom'))$('newRoom').onclick=()=>{if(!state.started||confirm(t('newRoom')+'?'))abandon()};
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
try{
 const old=JSON.parse(localStorage.getItem(SESSION_KEY)||'null');
 if(old&&typeof old.code==='string'&&/^[A-Z0-9]{6}$/.test(old.code)&&typeof old.token==='string'&&/^[a-f0-9]{48}$/.test(old.token))savedSession={code:old.code,token:old.token};
}catch{}
/* Always begin in the lobby. A previous session is only resumed by an explicit click. */
updateLanguage(lang);
setInterval(poll,1300);
})();
