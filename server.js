const http=require('http'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const PORT=Number(process.env.PORT)||3000;
const data=[
{name:"Sweden",clues:["This country has thousands of islands.","Its capital is built across 14 islands.","It is known for IKEA and ABBA.","Its flag is blue and yellow.","Its capital is Stockholm."],shape:"M132 12 L173 23 154 48 167 67 146 86 154 109 135 132 120 175 103 153 112 124 98 105 111 81 107 53 Z"},
{name:"Norway",clues:["This country has a long coastline.","It is famous for fjords.","Its capital hosted the 1952 Winter Olympics.","It shares a long border with Sweden.","Its capital is Oslo."],shape:"M160 10 L190 20 166 48 182 67 145 89 135 119 116 149 108 176 92 155 109 123 108 97 129 64 133 32 Z"},
{name:"Italy",clues:["This country has famous ancient ruins.","Its territory includes Sicily and Sardinia.","It is shaped like a boot.","It is famous for pizza and pasta.","Its capital is Rome."],shape:"M95 23 L145 20 171 43 153 66 181 85 207 95 198 111 177 105 160 88 162 135 192 149 216 165 197 174 172 155 145 129 139 93 119 78 104 92 89 61 Z M151 158 L171 154 184 166 166 177 Z"},
{name:"Japan",clues:["This country is an island nation.","It is known for bullet trains.","Mount Fuji is here.","Its flag has a red circle.","Its capital is Tokyo."],shape:"M170 13 L192 38 176 67 160 77 174 99 156 109 141 137 121 150 101 170 83 165 102 144 121 122 126 94 146 81 142 54 Z M75 160 L91 158 88 175 69 177 Z"},
{name:"Brazil",clues:["This country has a very large rainforest.","It is the biggest country in South America.","It has won the FIFA World Cup five times.","Portuguese is its official language.","Its capital is Brasília."],shape:"M74 25 L130 18 159 29 179 55 208 72 194 105 177 122 162 158 141 175 119 147 101 115 78 111 65 84 50 56 Z"},
{name:"Australia",clues:["This country is also a continent.","It has the Great Barrier Reef.","Kangaroos are native here.","Sydney Opera House is here.","Its capital is Canberra."],shape:"M37 92 L61 53 107 39 152 49 186 68 220 103 203 135 166 146 130 166 90 151 53 132 Z M203 163 L216 157 224 172 209 179 Z"},
{name:"France",clues:["This country is famous for its cuisine.","The Alps touch part of it.","The Eiffel Tower is here.","The Louvre is in its capital.","Its capital is Paris."],shape:"M82 33 L160 35 197 65 174 109 160 155 106 164 73 131 47 98 54 58 Z"},
{name:"India",clues:["This country is in South Asia.","The Himalayas form part of its northern boundary.","The Taj Mahal is here.","It has the world's largest population.","Its capital is New Delhi."],shape:"M50 24 L119 15 175 35 217 25 211 61 163 77 155 111 133 154 116 176 99 143 82 102 69 76 47 59 Z"},
{name:"Egypt",clues:["This country is in North Africa.","A famous river flows north through it.","The Sphinx is here.","The pyramids of Giza are here.","Its capital is Cairo."],shape:"M65 25 L187 25 184 145 82 148 73 105 63 75 Z M187 25 L214 45 198 66 Z"},
{name:"Canada",clues:["This country has extensive forests and lakes.","It is the second-largest country by area.","It has both French and English as official languages.","Its flag features a maple leaf.","Its capital is Ottawa."],shape:"M30 52 L59 28 82 51 108 19 142 43 165 21 197 37 218 68 190 102 168 95 145 133 118 108 91 119 70 93 40 105 Z"},
{name:"Spain",clues:["This country is on the Iberian Peninsula.","It borders Portugal.","Barcelona is one of its largest cities.","Flamenco is associated with this country.","Its capital is Madrid."],shape:"M48 53 L183 45 203 71 183 131 116 149 70 122 36 95 Z"},
{name:"Germany",clues:["This country is in central Europe.","It has sixteen federal states.","It is famous for Oktoberfest.","BMW and Volkswagen are from here.","Its capital is Berlin."],shape:"M105 17 L144 25 151 52 172 64 160 96 172 116 151 164 111 153 95 136 65 118 83 82 77 48 Z"},
{name:"Greece",clues:["This country has many islands.","It is in southeastern Europe.","The first ancient Olympic Games were held here.","The Acropolis is in its capital.","Its capital is Athens."],shape:"M95 26 L160 28 145 55 167 73 137 91 155 125 134 140 113 108 86 90 95 65 73 50 Z M160 148 L171 147 174 158 164 166 Z"},
{name:"United Kingdom",clues:["This country consists of four nations.","It is an island country in northwest Europe.","Big Ben is a famous landmark.","Its currency is the pound sterling.","Its capital is London."],shape:"M122 21 L149 40 139 67 162 76 149 101 155 128 129 153 104 149 87 132 101 111 95 91 110 78 104 51 Z"},
{name:"United States",clues:["This country stretches across multiple time zones.","It has fifty states.","The Grand Canyon is here.","The Statue of Liberty is here.","Its capital is Washington, D.C."],shape:"M25 38 L202 34 217 58 191 76 182 112 151 132 129 115 104 123 73 109 47 101 37 70 Z"},
{name:"Mexico",clues:["This country is in North America.","It has coastlines on two oceans.","Chichén Itzá is here.","Its cuisine includes tacos and tamales.","Its capital is Mexico City."],shape:"M35 40 L85 56 117 75 150 87 184 78 215 98 204 111 165 108 135 136 113 112 91 98 63 92 Z"}];
const years=[["The Berlin Wall fell",1989],["The first Moon landing",1969],["The Titanic sank",1912],["World War II ended",1945],["The first modern Olympic Games were held",1896],["The United Nations was founded",1945],["India gained independence",1947],["The World Wide Web became publicly available",1991],["The French Revolution began",1789],["The first iPhone was released",2007],["The euro entered circulation as physical money",2002],["The first FIFA World Cup was held",1930]];
const geographicOutlines=require('./public/outlines.js');
const MAX_PLAYERS=12,MIN_PLAYERS=2;
const rooms=new Map(),rand=n=>crypto.randomInt(n),shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){let j=rand(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
const norm=s=>String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
const competitiveQuestions=require('./competitive-questions.json');
const subjectBank=require('./competitive-trivia.json');
const timelineBank=require('./timeline-events.json');
const subjectCategories=new Set(subjectBank.categories);
function selectedSubjects(values){
 const v=Array.isArray(values)?values:[];
 const chosen=[...new Set(v.filter(x=>typeof x==='string'&&subjectCategories.has(x)))];
 return chosen.length?chosen:subjectBank.categories.slice();
}
function matchMode(mode){return mode==='timeline'?'timeline':'quiz'}

const allClueQuestions=[...data,...competitiveQuestions.clues.filter(c=>!data.some(d=>d.name===c.name))];
const competitiveTiers={"easy":{"clues":["Sweden","Italy","Japan","Brazil","Australia","France","Germany","Spain","Mexico","Egypt","Canada","India","United States"],"outlines":["Italy","Japan","Brazil","Australia","France","Germany","Spain","Sweden","United Kingdom","United States of America","India","Egypt","Mexico"]},"medium":{"clues":["Norway","Greece","United Kingdom","Mexico","Canada","India","Argentina","Iceland","Morocco","Portugal","Finland","Turkey","South Africa","Thailand","Kenya"],"outlines":["Norway","Greece","United Kingdom","Canada","Portugal","Argentina","Turkey","Finland","South Africa","Morocco","Thailand","Peru","China","Poland","Ukraine","Iceland"]},"hard":{"clues":["Nepal","Vietnam","Peru","Indonesia","Colombia","South Korea","Singapore","Chile","Ireland","New Zealand","Kenya","Morocco","Finland","Portugal","South Africa"],"outlines":["Nepal","Vietnam","Chile","Peru","Indonesia","Colombia","Croatia","Romania","Mongolia","Madagascar","Kenya","Iceland","Ireland","Saudi Arabia","Pakistan","Ukraine","Morocco"]}};

/* Hard matches draw from a much larger, less familiar pool. */
competitiveTiers.hard.clues=[...new Set([...competitiveTiers.hard.clues,...competitiveQuestions.clues.filter(q=>q.difficulty==='hard').map(q=>q.name)])];
competitiveTiers.hard.outlines=["Nepal","Vietnam","Chile","Peru","Indonesia","Colombia","Croatia","Romania","Mongolia","Madagascar","Kenya","Iceland","Ireland","Saudi Arabia","Pakistan","Ukraine","Morocco","Austria","Switzerland","Greece","Finland","Norway","Poland","Turkey","Nigeria","South Africa","Thailand","China","Portugal","Cuba","Egypt","Argentina","India","Sweden","Mexico"];
const availableDifficulties=['easy','medium','hard'];
const matchDifficulty=d=>availableDifficulties.includes(d)?d:'medium';
/* Draw shuffled question decks without repeats between consecutive matches,
   refreshing each difficulty/type deck only after its questions are used. */
const questionDecks=new Map();
function uniqueQuestion(items,seen,idOf,deckKey){
 const available=items.filter(item=>!seen.has(String(idOf(item))));
 if(!available.length)throw Error('Not enough questions for this difficulty');
 const identifiers=new Set(available.map(item=>String(idOf(item))));
 let deck=(questionDecks.get(deckKey)||[]).filter(id=>identifiers.has(id));
 if(!deck.length)deck=shuffle([...identifiers]);
 const id=deck.shift();
 questionDecks.set(deckKey,deck);
 seen.add(id);
 return available.find(item=>String(idOf(item))===id);
}
function makeQ(type,difficulty,seen,subjects){
 const chosenSubjects=selectedSubjects(subjects);
 if(type==='trivia'){
  const pool=subjectBank.questions.filter(q=>chosenSubjects.includes(q.category));
  const exact=pool.filter(q=>q.difficulty===matchDifficulty(difficulty)&&!seen.has(q.id));
  const candidates=exact.length?exact:pool.filter(q=>!seen.has(q.id));
  const picked=uniqueQuestion(candidates,seen,x=>x.id,'trivia:'+matchDifficulty(difficulty)+':'+chosenSubjects.slice().sort().join(','));
  const order=shuffle([0,1,2,3]);
  return{type:'trivia',prompt:picked.en,promptSv:picked.sv,category:picked.category,
   options:order.map((i,pos)=>({id:String(pos),en:picked.options[i].en,sv:picked.options[i].sv})),
   answer:String(order.indexOf(picked.correct))};
 }

 const d=matchDifficulty(difficulty),tier=competitiveTiers[d];
 if(type==='year'){
   const pool=competitiveQuestions.years.filter(q=>q.difficulty===d);
   const picked=uniqueQuestion(pool,seen,x=>x.prompt,d+':year');
   const answer=picked.answer, options=new Set([answer]);
   const offsets=d==='easy'?[-100,-75,-50,-35,35,50,75,100]:d==='medium'?[-40,-30,-20,-12,12,20,30,40]:[-15,-12,-10,-7,-5,-3,3,5,7,10,12,15];
   for(const delta of shuffle(offsets)){if(options.size===4)break;const candidate=answer+delta;if(candidate>=1&&candidate<=2026)options.add(candidate)}
   return{type,prompt:picked.prompt,promptSv:picked.promptSv||picked.prompt,answer,options:shuffle([...options])};
 }
 if(type==='outline'){
   const country=uniqueQuestion(tier.outlines,seen,x=>x,d+':outline');
   const shape=geographicOutlines[country];
   if(!shape)throw Error('Missing geographic border data');
   const others=shuffle(tier.outlines.filter(x=>x!==country)).slice(0,3);
   return{type,answer:country,shape:shape.path,viewBox:shape.viewBox,options:shuffle([country,...others])};
 }
 const pool=allClueQuestions.filter(c=>tier.clues.includes(c.name));
 const item=uniqueQuestion(pool,seen,x=>x.name,d+':clues');
 return{type,answer:item.name,clues:item.clues};
}
function makeMatchQuestions(difficulty,subjects){
 const seen={clues:new Set(),outline:new Set(),year:new Set(),trivia:new Set()};
 return shuffle(['trivia','trivia','trivia','trivia','trivia','clues','outline','year'])
   .map(type=>makeQ(type,difficulty,seen[type],subjects));
}
function makeTimelineQuestions(difficulty){
 const d=matchDifficulty(difficulty),from=d==='easy'?1900:d==='medium'?1750:0;
 const pool=timelineBank.events.filter(e=>e.year>=from);
 const seen=new Set();
 return Array.from({length:10},()=>uniqueQuestion(pool,seen,x=>x.id,'timeline:'+d));
}
function starterTimeline(){const a=timelineBank.anchor;return[{id:a.id,year:a.year,en:a.en,sv:a.sv,category:a.category}]}
function newPlayer(name){
 return{name:String(name||'Player').trim().slice(0,24)||'Player',
 token:crypto.randomBytes(24).toString('hex'),score:0,done:false,ready:false,
 clue:0,answer:null,correct:null,streak:0,timeline:starterTimeline()};
}
function state(r,p){
 const finished=r.started&&r.round===r.qs.length,
 q=r.started&&!finished?r.qs[r.round]:null,
 reveal=q&&r.players.every(x=>x.done);
 let question=null;
 if(q){
  if(r.mode==='timeline'){
   question={type:'timeline',en:q.en,sv:q.sv,prompt:q.en,promptSv:q.sv,category:q.category};
  }else if(q.type==='clues'){
   question={type:'clues',clue:p.clue,clues:q.clues.slice(0,p.clue+1)};
  }else if(q.type==='outline'){
   question={type:'outline',shape:q.shape,viewBox:q.viewBox,options:q.options};
  }else if(q.type==='trivia'){
   question={type:'trivia',prompt:q.prompt,promptSv:q.promptSv,category:q.category,options:q.options};
  }else{
   question={type:'year',prompt:q.prompt,options:q.options};
  }
 }
 const correctAnswer=!reveal?null:r.mode==='timeline'?q.year:
   q.type==='trivia'?q.options.find(x=>x.id===q.answer):q.answer;
 return{code:r.id,mode:r.mode,difficulty:r.difficulty,subjects:r.subjects,
  isHost:r.hostToken===p.token,maxPlayers:MAX_PLAYERS,minPlayers:MIN_PLAYERS,
  started:r.started,finished,round:r.round,total:r.mode==='timeline'?10:8,
  you:r.players.indexOf(p),players:r.players.map(x=>({name:x.name,score:x.score,
   done:x.done,ready:x.ready,timelineCount:x.timeline.length,streak:x.streak})),
  question,yourTimeline:r.mode==='timeline'?p.timeline.map(x=>({year:x.year,en:x.en,sv:x.sv})):null,
  yourDone:p.done,yourAnswer:p.answer,yourCorrect:p.correct,correctAnswer};
}
function api(route,b){
 if(route==='/api/create'){
  let id;do{id=crypto.randomBytes(4).toString('hex').slice(0,6).toUpperCase()}while(rooms.has(id));
  const mode=matchMode(b.mode),p=newPlayer(b.name);
  const r={id,players:[p],hostToken:p.token,mode,subjects:selectedSubjects(b.subjects),
   difficulty:matchDifficulty(b.difficulty),started:false,round:0,qs:[],last:Date.now()};
  rooms.set(id,r);return{token:p.token,...state(r,p)};
 }
 if(route==='/api/join'){
  const r=rooms.get(String(b.code||'').toUpperCase());
  if(!r)throw Error('Room not found');
  if(r.started)throw Error('The match has already started. Ask the host to create a new room.');
  if(r.players.length>=MAX_PLAYERS)throw Error('Room is full (maximum '+MAX_PLAYERS+' players)');
  if(matchMode(b.mode)!==r.mode)throw Error(r.mode==='timeline'?'This is a Timeline Duel room. Open the Timeline Duel page.':'This is a classic quiz room. Join on the Country Quest homepage.');
  const p=newPlayer(b.name);
  r.players.push(p);
  r.last=Date.now();
  return{token:p.token,...state(r,p)};
 }
 const r=rooms.get(String(b.code||'').toUpperCase());
 if(!r)throw Error('Room not found');
 const p=r.players.find(x=>x.token===b.token);
 if(!p)throw Error('Invalid player session');
 r.last=Date.now();
 if(route==='/api/state')return state(r,p);
 if(route==='/api/start'){
  if(r.hostToken!==p.token)throw Error('Only the room host can start the match');
  if(r.started)throw Error('The match has already started');
  if(r.players.length<MIN_PLAYERS)throw Error('At least '+MIN_PLAYERS+' players are required to start');
  r.qs=r.mode==='timeline'?makeTimelineQuestions(r.difficulty):makeMatchQuestions(r.difficulty,r.subjects);
  r.round=0;r.started=true;
  r.players.forEach(x=>Object.assign(x,{score:0,streak:0,timeline:starterTimeline(),done:false,ready:false,clue:0,answer:null,correct:null}));
  return state(r,p);
 }
 if(!r.started||r.round>=r.qs.length)throw Error('No active round');
 const q=r.qs[r.round];
 if(route==='/api/clue'){
  if(r.mode!=='quiz'||q.type!=='clues'||p.done)throw Error('Clues unavailable');
  p.clue=Math.min(4,p.clue+1);
 }else if(route==='/api/answer'){
  if(p.done)throw Error('Already answered');
  const answer=String(b.answer??'').slice(0,100);
  if(!answer.trim())throw Error('Enter an answer');
  if(r.mode==='timeline'){
   const slot=Number(answer);
   if(!Number.isInteger(slot)||slot<0||slot>p.timeline.length)throw Error('Choose a valid timeline position');
   const left=slot===0?-Infinity:p.timeline[slot-1].year;
   const right=slot===p.timeline.length?Infinity:p.timeline[slot].year;
   const correct=q.year>=left&&q.year<=right;
   p.correct=correct;p.answer=String(slot);p.done=true;
   if(correct){
    p.streak+=1;p.score+=100+Math.min(50,(p.streak-1)*10);
    p.timeline.splice(slot,0,{id:q.id,year:q.year,en:q.en,sv:q.sv,category:q.category});
   }else{p.streak=0}
  }else{
   if(q.type==='trivia'){
    if(!q.options.some(x=>x.id===answer))throw Error('Choose an option');
   }else if(q.type!=='clues'&&!q.options.some(x=>String(x)===answer)){
    throw Error('Choose an option');
   }
   p.answer=answer;p.done=true;p.correct=norm(answer)===norm(q.answer);
   if(p.correct)p.score+=q.type==='clues'?[100,80,60,40,20][p.clue]:100;
  }
 }else if(route==='/api/ready'){
  if(!r.players.every(x=>x.done))throw Error('Wait for everyone to answer');
  p.ready=true;
  if(r.players.every(x=>x.ready)){
   r.round++;
   r.players.forEach(x=>Object.assign(x,{done:false,ready:false,clue:0,answer:null,correct:null}));
  }
 }else throw Error('Unknown action');
 return state(r,p);
}
function respond(res,status,data){res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data))}
const root=path.join(__dirname,'public');
http.createServer(async(req,res)=>{let u;try{u=new URL(req.url,'http://localhost')}catch{return respond(res,400,{error:'Bad URL'})}if(u.pathname==='/health')return respond(res,200,{ok:true});if(u.pathname.startsWith('/api/')){if(req.method!=='POST')return respond(res,405,{error:'POST required'});let body='';for await(const chunk of req){body+=chunk;if(body.length>10000)return respond(res,413,{error:'Request too large'})}try{return respond(res,200,api(u.pathname,JSON.parse(body||'{}')))}catch(e){return respond(res,400,{error:e.message})}}let file=u.pathname==='/'?'index.html':u.pathname.slice(1),full=path.resolve(root,file);if(!full.startsWith(root+path.sep))return respond(res,403,{error:'Forbidden'});try{let bytes=await fs.promises.readFile(full);res.writeHead(200,{'Content-Type':full.endsWith('.html')?'text/html; charset=utf-8':full.endsWith('.css')?'text/css; charset=utf-8':full.endsWith('.svg')?'image/svg+xml':full.endsWith('.js')?'text/javascript; charset=utf-8':'application/octet-stream','Cache-Control':/\.(?:html|css|js)$/.test(full)?'no-store':'public, max-age=86400','X-Content-Type-Options':'nosniff'});res.end(bytes)}catch{return respond(res,404,{error:'Not found'})}}).listen(PORT,'0.0.0.0',()=>console.log('Country Quest listening on '+PORT));
setInterval(()=>{for(let[id,r]of rooms)if(Date.now()-r.last>10800000)rooms.delete(id)},1200000).unref();