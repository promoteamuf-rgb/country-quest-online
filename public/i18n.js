/* Country Quest — shared Swedish/English interface translations.
   Every player chooses language locally; game scoring uses canonical country names. */
(function(){
'use strict';
const KEY='cq-language';
const countrySv={
  'Argentina':'Argentina','Australia':'Australien','Austria':'Österrike',
  'Brazil':'Brasilien','Canada':'Kanada','Chile':'Chile','China':'Kina',
  'Colombia':'Colombia','Croatia':'Kroatien','Cuba':'Kuba',
  'Egypt':'Egypten','Finland':'Finland','France':'Frankrike',
  'Germany':'Tyskland','Greece':'Grekland','Iceland':'Island',
  'India':'Indien','Indonesia':'Indonesien','Ireland':'Irland',
  'Italy':'Italien','Japan':'Japan','Kenya':'Kenya','Madagascar':'Madagaskar',
  'Mexico':'Mexiko','Mongolia':'Mongoliet','Morocco':'Marocko',
  'Nepal':'Nepal','New Zealand':'Nya Zeeland','Nigeria':'Nigeria',
  'Norway':'Norge','Pakistan':'Pakistan','Peru':'Peru','Poland':'Polen',
  'Portugal':'Portugal','Romania':'Rumänien','Saudi Arabia':'Saudiarabien',
  'Singapore':'Singapore','South Africa':'Sydafrika','South Korea':'Sydkorea',
  'Spain':'Spanien','Sweden':'Sverige','Switzerland':'Schweiz',
  'Thailand':'Thailand','Turkey':'Turkiet','Ukraine':'Ukraina',
  'United Kingdom':'Storbritannien',
  'United States':'USA','United States of America':'USA',
  'Vietnam':'Vietnam'
};
const normalize=x=>String(x??'').toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
const reverse=new Map();
for(const [en,sv] of Object.entries(countrySv)){reverse.set(normalize(sv),en)}
reverse.set('usa','United States');
reverse.set('storbritannien','United Kingdom');
reverse.set('sydkorea','South Korea');
reverse.set('tyskland','Germany');
reverse.set('england','United Kingdom');
reverse.set('amerikasforentastater','United States');
const dict={
  'Explore':'Utforska','Solo games':'Spela själv','Play online':'Spela online',
  'THE WORLD IS YOURS':'VÄRLDEN ÄR DIN','THE ULTIMATE GEOGRAPHY CHALLENGE':'DEN STORA GEOGRAFIUTMANINGEN',
  "There's a whole":"Det finns en hel",'world to discover.':'värld att upptäcka.',
  'From faraway landmarks to familiar borders. Test what you know, discover what you don’t.':'Från avlägsna sevärdheter till välkända gränser. Testa vad du kan och upptäck mer.',
  "From faraway landmarks to familiar borders. Test what you know, discover what you don't.":'Från avlägsna sevärdheter till välkända gränser. Testa vad du kan och upptäck mer.',
  'Start exploring':'Börja utforska','Play with a friend':'Spela med en vän',
  'THE WORLD AWAITS   ✳   COUNTRY QUEST':'VÄRLDEN VÄNTAR   ✳   COUNTRY QUEST',
  'Pick a challenge':'Välj en utmaning','Explore the clues':'Utforska ledtrådarna','Earn your score':'Samla poäng',
  'YOUR NEXT ADVENTURE':'DITT NÄSTA ÄVENTYR','Where to next':'Vart bär det av','?':'?',
  'Four ways to travel the world.':'Fyra sätt att upptäcka världen.','Every round is a new discovery.':'Varje runda bjuder på något nytt.',
  'Country Clues':'Landsledtrådar','Country Outlines':'Landskonturer','Guess the Year':'Gissa året',
  'Online Multiplayer':'Onlinemultiplayer','Single Player':'Enspelarläge','Pass & Play':'Turas om att spela',
  'Five hints. One destination. Guess early to score big.':'Fem ledtrådar. Ett land. Gissa tidigt för fler poäng.',
  'No names. Just real borders. Do you know the shape?':'Inga namn, bara riktiga landsgränser. Känner du igen formen?',
  'How well do you remember moments that shaped history?':'Hur bra minns du händelser som förändrade historien?',
  'Challenge a friend anywhere in the world. One winner.':'Utmana en vän, var som helst i världen. Bara en vinnare.',
  'Explore clues':'Utforska ledtrådar','Explore maps':'Utforska kartor','Travel through time':'Res genom tiden',
  'Create a room':'Skapa ett rum','Create room':'Skapa rum','Join a room':'Gå med i ett rum',
  'Create a room':'Skapa ett rum','Join room':'Gå med i ett rum','Join match':'Gå med i matchen',
  'Create room':'Skapa rum','Online multiplayer':'Onlinemultiplayer',
  'Your passport to everywhere.':'Ditt pass till hela världen.',
  'Pick up and play. Real country outlines, clever clues and a little healthy competition.':'Börja spela direkt med riktiga landskonturer, kluriga ledtrådar och lite vänskaplig tävling.',
  'All solo games':'Alla solospel','Your name':'Ditt namn','Room code':'Rumskod',
  'Room created.':'Rummet är skapat.','Invite a friend.':'Bjud in en vän.',
  'Share this room code:':'Dela den här rumskoden:',
  'Copy invitation link':'Kopiera inbjudningslänk','Link copied!':'Länken har kopierats!',
  'Waiting for player 2...':'Väntar på spelare 2 …','Waiting for your friend to finish...':'Väntar på att din vän ska bli klar …',
  'Waiting for your friend to answer…':'Väntar på din väns svar …',
  'Leave':'Lämna','Leave match':'Lämna matchen','Play again':'Spela igen',
  'Answer submitted ✓':'Svar inskickat ✓','Your answer:':'Ditt svar:','Correct answer:':'Rätt svar:',
  'Next round →':'Nästa runda →','Guess':'Gissa','Next clue →':'Nästa ledtråd →',
  'Skip':'Hoppa över','What country is this?':'Vilket land är det här?',
  'What country is this outline?':'Vilket land är det här?',
  'Guess the year':'Gissa året','GUESS THE YEAR':'GISSA ÅRET','COUNTRY CLUES':'LANDSLEDTRÅDAR',
  'COUNTRY OUTLINE':'LANDSKONTUR','COUNTRY OUTLINES':'LANDSKONTURER',
  'Invite your friend with this code:':'Bjud in din vän med den här koden:',
  'Waiting for another player to join…':'Väntar på en annan spelare …',
  'New match':'Ny match','Thinking…':'Funderar …','✓ Answered':'✓ Svarat',
  'Follow the clues':'Följ ledtrådarna','Answer:':'Svar:',
  'Wrong answer':'Fel svar','Correct!':'Rätt!',
  'Connection lost. Retrying...':'Anslutningen försvann. Försöker igen …',
  'Waiting for friend…':'Väntar på vännen …',
  'Leave room':'Lämna rummet','Join game':'Gå med i spelet',
  'Player 1':'Spelare 1','Player 2':'Spelare 2','Round':'Runda','Turn':'Tur',
  'Close':'Stäng','Score:':'Poäng:','Progress:':'Framsteg:',
  'COUNTRY QUEST':'COUNTRY QUEST','SOLO':'SOLO','MULTIPLAYER':'MULTIPLAYER',
  'YOUR SOLO EXPEDITION':'DITT SOLOÄVENTYR',
  'Go beyond':'Upptäck mer än','the familiar.':'det välkända.',
  'Explore five-round challenges. Discover new places. Beat your personal best.':'Spela femrondersutmaningar. Upptäck nya platser. Slå ditt personbästa.',
  'SOLO EXPLORER':'SOLOUTFORSKARE','PICK YOUR CHALLENGE':'VÄLJ DIN UTMANING',
  'Choose your route':'Välj din väg','Difficulty':'Svårighetsgrad',
  'Mixed':'Blandad','Easy':'Lätt','Medium':'Medel','Hard':'Svår',
  'Five clues. One country. Every hint counts.':'Fem ledtrådar. Ett land. Varje ledtråd räknas.',
  'Recognize the real shapes of our world.':'Känn igen världens verkliga landsformer.',
  'Every year has a story. Know the moment?':'Varje år har sin historia. Minns du händelsen?',
  'Two players. One device. Six rounds.':'Två spelare. En enhet. Sex rundor.',
  'Start challenge ↗':'Starta utmaningen ↗',
  'Best':'Rekord','Streak':'Svit','points':'poäng','pts':'p',
  '← Modes':'← Spellägen','⚔️ COMPETITIVE':'⚔️ TÄVLING','🧩 COUNTRY CLUES':'🧩 LANDSLEDTRÅDAR',
  '🗺️ COUNTRY OUTLINES':'🗺️ LANDSKONTURER','📅 GUESS THE YEAR':'📅 GISSA ÅRET',
  'ROUND':'RUNDA','CLUE':'LEDTRÅD','POINTS':'POÄNG','OF':'AV',
  'Pass the device to Player':'Ge enheten till spelare','I’m ready →':'Jag är redo →',"I'm ready →":'Jag är redo →',
  'Which country is this?':'Vilket land är det här?','In what year did this happen?':'Vilket år hände detta?',
  'Type a country...':'Skriv ett land …','Country guess':'Gissa ett land',
  'Skip country':'Hoppa över landet','Not quite. Try again or reveal the next clue.':'Inte riktigt. Försök igen eller visa nästa ledtråd.',
  'Not this time.':'Tyvärr inte den här gången.','Skipped.':'Överhoppat.',
  'See results →':'Se resultat →','Game complete!':'Spelet är klart!',
  'It’s a tie!':'Oavgjort!',"It's a tie!":'Oavgjort!',
  'All modes':'Alla spellägen','RESULTS':'RESULTAT',
  'games played':'spelade omgångar','correct guesses':'rätta gissningar',
  'rounds finished':'avslutade rundor','rounds played':'spelade rundor',
  '✦ NEW DISCOVERIES':'✦ NYA UPPTÄCKTER','🗺️ REAL BORDERS':'🗺️ RIKTIGA GRÄNSER',
  '🧩 5-CLUE QUIZZES':'🧩 5 LEDTRÅDAR',
  'Explore clues, recognize borders and discover world history.':'Utforska ledtrådar, känn igen landsgränser och upptäck världshistoria.',
  'Solo Explorer':'Soloutforskare',
  'Play from different PCs using the same link. Private matches have 6 rounds. Room data is temporary. Geographic boundaries from Natural Earth.':
   'Spela från olika datorer med samma länk. Privata matcher har sex rundor. Rummen är tillfälliga. Landsgränserna kommer från Natural Earth.',
  'Geographic outlines: Natural Earth · Country Quest':'Landskonturer: Natural Earth · Country Quest',
  'Real photo credits':'Bildkällor','Photos via Unsplash':'Bilder från Unsplash',
  'COUNTRY QUEST · WORLD EDITION':'COUNTRY QUEST · VÄRLDSUTGÅVAN',
  'THE WORLD IS YOUR PLAYGROUND':'HELA VÄRLDEN ÄR DIN SPELPLAN',
  'GEOGRAPHY CHALLENGES':'GEOGRAFIUTMANINGAR',
  '01 / SOLO':'01 / SOLO','02 / SOLO':'02 / SOLO','03 / SOLO':'03 / SOLO','04 / MULTIPLAYER':'04 / MULTIPLAYER',
  '04 / LOCAL':'04 / LOKALT','LIVE MATCH':'LIVEMATCH',
  'You':'Du','(you)':'(du)','(You)':'(du)',
  'Waiting for your friend to finish...':'Väntar på att din vän ska bli klar …'
};
let language='en';
try{
  const stored=localStorage.getItem(KEY);
  if(stored==='sv'||stored==='en')language=stored;
  else if((new URLSearchParams(location.search)).get('lang')==='sv')language='sv';
}catch(e){}
const originalText=new WeakMap(), originalAttr=new WeakMap();
const serverClues={};
const serverYears={};
let soloLoaded=false;
function loadContent(countries,years){
  if(soloLoaded)return;
  soloLoaded=true;
  const x=window.CQ_SV_CONTENT||{};
  for(const country of countries||[]){
    const clues=x.soloClues?.[country.name];
    if(!clues)continue;
    for(let i=0;i<country.clues.length;i++)if(clues[i])dict[country.clues[i]]=clues[i];
  }
  if(x.soloYears&&years)years.forEach((row,i)=>{if(x.soloYears[i])dict[row[0]]=x.soloYears[i]});
  translate(document.body);
}
function normalizeCountry(input){const value=normalize(input);return reverse.get(value)||input}
function countryLabel(s){return countrySv[s]||s}
function localize(src){
 if(language!=='sv')return src;
 const trimmed=String(src).trim();
 if(!trimmed)return src;
 let out=dict[trimmed]||serverClues[trimmed]||serverYears[trimmed]||countrySv[trimmed]||null;
 if(!out){
   let m;
   if((m=/^(\d+) games played$/.exec(trimmed)))out=m[1]+' spelade omgångar';
   else if((m=/^(\d+) correct guesses$/.exec(trimmed)))out=m[1]+' rätta gissningar';
   else if((m=/^(\d+) rounds finished$/.exec(trimmed)))out=m[1]+' avslutade rundor';
   else if((m=/^(\d+) rounds played$/.exec(trimmed)))out=m[1]+' spelade rundor';
   else if((m=/^Player (\d+)'s turn$/.exec(trimmed)))out='Spelare '+m[1]+':s tur';
   else if((m=/^Player (\d+)$/.exec(trimmed)))out='Spelare '+m[1];
   else if((m=/^Player (.+) wins!$/.exec(trimmed)))out='Spelare '+m[1]+' vinner!';
   else if((m=/^(.+) wins!$/.exec(trimmed)))out=m[1]+' vinner!';
   else if((m=/^CLUE (\d+) OF (\d+) · (\d+) POINTS$/.exec(trimmed)))out='LEDTRÅD '+m[1]+' AV '+m[2]+' · '+m[3]+' POÄNG';
   else if((m=/^CLUE (\d+) \/ (\d+) · (\d+) POINTS$/.exec(trimmed)))out='LEDTRÅD '+m[1]+' / '+m[2]+' · '+m[3]+' POÄNG';
   else if((m=/^ROUND (\d+) \/ (\d+)(.*)$/.exec(trimmed)))out='RUNDA '+m[1]+' / '+m[2]+m[3].replace('COUNTRY CLUES','LANDSLEDTRÅDAR').replace('COUNTRY OUTLINE','LANDSKONTUR').replace('GUESS THE YEAR','GISSA ÅRET');
   else if((m=/^Round (\d+) \/ (\d+)$/.exec(trimmed)))out='Runda '+m[1]+' / '+m[2];
   else if((m=/^Turn (\d+) \/ (\d+)$/.exec(trimmed)))out='Tur '+m[1]+' / '+m[2];
   else if((m=/^(\d+) pts$/.exec(trimmed)))out=m[1]+' poäng';
   else if((m=/^(\d+) points$/.exec(trimmed)))out=m[1]+' poäng';
   else if((m=/^✅ Correct! \+(\d+) points$/.exec(trimmed)))out='✅ Rätt! +'+m[1]+' poäng';
   else if((m=/^✅ Correct! \+(\d+) points$/.exec(trimmed)))out='✅ Rätt! +'+m[1]+' poäng';
   else if((m=/^Correct! \+(\d+) points$/.exec(trimmed)))out='Rätt! +'+m[1]+' poäng';
   else if((m=/^(Not this time\.|Skipped\.) Answer: (.+)$/.exec(trimmed)))out=(m[1]==='Skipped.'?'Hoppade över.':'Tyvärr fel.')+' Rätt svar: '+countryLabel(m[2]);
   else if((m=/^Answer: (.+)$/.exec(trimmed)))out='Svar: '+countryLabel(m[1]);
   else if((m=/^Player (\d+) wins!$/.exec(trimmed)))out='Spelare '+m[1]+' vinner!';
   else if((m=/^(\d+) rounds played$/.exec(trimmed)))out=m[1]+' rundor spelade';
   else if((m=/^(\d+) \/ (\d+) · (.+)$/.exec(trimmed)))out=m[1]+' / '+m[2]+' · '+(dict[m[3]]||m[3]);
   else if((m=/^(.*)\((you|You)\)$/.exec(trimmed)))out=m[1]+'(du)';
 }
 if(!out)return src;
 const start=src.match(/^\s*/)?.[0]||'';
 const end=src.match(/\s*$/)?.[0]||'';
 return start+out+end;
}
function translate(root){
 if(!root)return;
 document.documentElement.lang=language==='sv'?'sv':'en';
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 const nodes=[];
 while(walker.nextNode())nodes.push(walker.currentNode);
 for(const node of nodes){
   if(node.parentElement?.closest('script,style,code,pre,textarea'))continue;
   let current=node.nodeValue;
   let rec=originalText.get(node);
   if(!rec||current!==rec.applied){rec={base:current,applied:current}}
   const translated=language==='sv'?localize(rec.base):rec.base;
   if(current!==translated)node.nodeValue=translated;
   rec.applied=translated;originalText.set(node,rec);
 }
 const elements=root.querySelectorAll?.('[placeholder],[aria-label],[title]')||[];
 for(const el of elements){
   let vals=originalAttr.get(el)||{};
   for(const attr of ['placeholder','aria-label','title']){
     if(!el.hasAttribute(attr))continue;
     const cur=el.getAttribute(attr);
     if(!vals[attr]||cur!==vals[attr].applied)vals[attr]={base:cur,applied:cur};
     const next=language==='sv'?localize(vals[attr].base):vals[attr].base;
     if(cur!==next)el.setAttribute(attr,next);
     vals[attr].applied=next;
   }
   originalAttr.set(el,vals);
 }
 for(const button of document.querySelectorAll('[data-language]')){
   const active=button.getAttribute('data-language')===language;
   button.setAttribute('aria-pressed',String(active));
   button.classList.toggle('active',active);
 }
}
let translating=false;
function apply(){
 if(translating)return;
 translating=true;
 try{translate(document.body)}finally{translating=false}
}
function setLanguage(code){
 if(code!=='en'&&code!=='sv')return;
 language=code;
 try{localStorage.setItem(KEY,code)}catch(e){}
 apply();
}
function init(){
 document.querySelectorAll('[data-language]').forEach(btn=>btn.addEventListener('click',()=>setLanguage(btn.dataset.language)));
 apply();
 const observer=new MutationObserver(muts=>{
   if(muts.some(m=>m.type==='childList'||m.type==='characterData'))apply();
 });
 observer.observe(document.body,{childList:true,subtree:true,characterData:true});
}
const content=window.CQ_SV_CONTENT||{};
Object.assign(serverClues,content.onlineClues||{});
Object.assign(serverYears,content.onlineYears||{});
window.CQI18N={setLanguage,language:()=>language,translate:apply,loadSolo:loadContent,canonicalCountry:normalizeCountry,countryLabel,translateText:localize,register:obj=>{Object.assign(dict,obj);apply()}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
else init();
})();