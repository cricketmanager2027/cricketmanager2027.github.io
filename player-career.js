/* Player Career Mode - Cricket Manager 27 */
(function(){
'use strict';
const STATES=[
 {id:'NSW',name:'New South Wales',colour:'#4d9de0',ground:'Sydney Cricket Ground'},
 {id:'VIC',name:'Victoria',colour:'#244b9b',ground:'Melbourne Cricket Ground'},
 {id:'QLD',name:'Queensland',colour:'#7d263a',ground:'The Gabba'},
 {id:'SA',name:'South Australia',colour:'#d84040',ground:'Adelaide Oval'},
 {id:'WA',name:'Western Australia',colour:'#f0b52b',ground:'WACA Ground'},
 {id:'TAS',name:'Tasmania',colour:'#c5d5e8',ground:'Bellerive Oval'}
];
const COMP=[
 {id:'shield',name:'Sheffield Shield',format:'First-Class',overs:'Unlimited overs',desc:'Four-day red-ball cricket. Build long innings, bowl long spells and earn a place in the Test conversation.',colour:'#b84040'},
 {id:'oneDay',name:'Marsh One-Day Cup',format:'List A',overs:'50 overs per side',desc:'Australia’s domestic one-day competition. Score quickly, manage your innings and push for national selection.',colour:'#d7a52c'}
];
let career=null,game=null,raf=0,mouse={x:0,y:0,inside:false},keys={};
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function style(){if($('#pc-style'))return;const st=document.createElement('style');st.id='pc-style';st.textContent=`
.pc-wrap{max-width:1100px;margin:26px auto;padding:24px;color:#fff;background:rgba(14,18,32,.97);border:1px solid #343c50;border-radius:20px;box-shadow:0 22px 70px #0008}
.pc-kicker{color:#b6f23c;font-weight:800;letter-spacing:.15em;text-transform:uppercase;font-size:12px}
.pc-title{font-size:clamp(28px,5vw,44px);line-height:1.08;margin:8px 0 12px}.pc-muted{color:#aeb7ca;line-height:1.5}.pc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px;margin:22px 0}
.pc-option{display:block;text-align:left;width:100%;background:#20283a;border:1px solid #3a455d;border-radius:14px;padding:18px;color:#fff;cursor:pointer;min-height:142px}.pc-option:hover,.pc-option.selected{border-color:#b6f23c;box-shadow:0 0 0 1px #b6f23c inset}.pc-option h3{margin:0 0 7px;font-size:20px}.pc-option p{color:#b9c3d5;line-height:1.45;margin:0 0 10px}.pc-tag{display:inline-block;border-radius:30px;padding:4px 9px;background:#313c52;color:#dce5f5;font-size:11px;font-weight:800}
.pc-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:20px}.pc-actions button{border:0;border-radius:10px;padding:12px 18px;font-weight:800;cursor:pointer}.pc-primary{background:#b6f23c;color:#111}.pc-secondary{background:#2b3447;color:#fff}.pc-form{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;margin:18px 0}.pc-form label{display:flex;flex-direction:column;gap:7px;color:#c9d1e0;font-size:13px;font-weight:700}.pc-form input,.pc-form select{background:#111827;border:1px solid #46516a;color:#fff;border-radius:9px;padding:12px;font:inherit;min-width:0}
.pc-game-shell{position:fixed;inset:0;z-index:9999;background:#101725;color:#fff;display:flex;flex-direction:column}.pc-game-top{display:flex;align-items:center;gap:14px;justify-content:space-between;padding:10px 16px;background:#171f30;border-bottom:1px solid #354057}.pc-game-top strong{font-size:15px}.pc-hud{display:flex;gap:12px;align-items:center;flex-wrap:wrap;color:#dbe3f2;font-size:13px}.pc-game-canvas{width:100%;height:100%;display:block;touch-action:none;cursor:crosshair}.pc-game-help{padding:9px 14px;background:#171f30;color:#b8c2d6;font-size:12px;display:flex;gap:15px;justify-content:center;flex-wrap:wrap}.pc-game-help b{color:#b6f23c}
.pc-summary{position:absolute;inset:0;background:#0b101de8;display:grid;place-items:center;padding:20px}.pc-summary-card{max-width:500px;width:100%;background:#1b2436;border:1px solid #46516a;border-radius:18px;padding:25px}.pc-statrow{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #354057}.pc-back{color:#b6f23c;cursor:pointer;font-weight:800}
`;document.head.appendChild(st)}
function shell(content){style();$('#app').innerHTML='<div class="pc-wrap">'+content+'</div>'}
function home(){
 shell('<div class="pc-kicker">A new journey</div><h1 class="pc-title">Player Career</h1><p class="pc-muted">Start in Australian domestic cricket, play as your own cricketer in a live 2D top-down match, and work your way towards higher honours.</p><div class="pc-grid">'+COMP.map(c=>'<button class="pc-option" onclick="pcChooseComp(\''+c.id+'\')"><span class="pc-tag">'+c.format+'</span><h3>'+c.name+'</h3><p>'+c.desc+'</p><b style="color:'+c.colour+'">'+c.overs+'</b></button>').join('')+'</div><div class="pc-actions"><button class="pc-secondary" onclick="pcBackHome()">Back</button><button class="pc-secondary" onclick="pcResume()">Continue Player Career</button></div>');
}
function chooseComp(id){career=career||{};career.comp=id;const c=COMP.find(x=>x.id===id);shell('<div class="pc-kicker">Step 1 · Competition</div><h1 class="pc-title">'+c.name+'</h1><p class="pc-muted">Choose your state team. Your player will begin their career in the domestic setup.</p><div class="pc-grid">'+STATES.map(s=>'<button class="pc-option '+(career.state===s.id?'selected':'')+'" onclick="pcChooseState(\''+s.id+'\')"><h3><span style="color:'+s.colour+'">●</span> '+s.name+'</h3><p>Home ground: '+s.ground+'</p><span class="pc-tag">'+(s.id==='NSW'?'Sydney':s.id==='VIC'?'Melbourne':s.id==='QLD'?'Brisbane':s.id==='SA'?'Adelaide':s.id==='WA'?'Perth':'Hobart')+'</span></button>').join('')+'</div><div class="pc-actions"><button class="pc-secondary" onclick="pcHome()">Back</button><button class="pc-primary" onclick="pcCreate()">Create Player</button></div>')}
function create(){
 if(!career.comp)career.comp='shield';if(!career.state)career.state='NSW';
 shell('<div class="pc-kicker">Step 2 · Your cricketer</div><h1 class="pc-title">Create your player</h1><p class="pc-muted">Start as a young domestic player. Your first goal is to make the state XI and turn performances into selection opportunities.</p><div class="pc-form"><label>Player name<input id="pc-name" maxlength="28" placeholder="Your name" value="'+esc(career.name||'')+'"></label><label>Batting hand<select id="pc-hand"><option>Right-handed</option><option>Left-handed</option></select></label><label>Player role<select id="pc-role"><option value="Batter">Batter</option><option value="Bowling all-rounder">Bowling all-rounder</option><option value="Batting all-rounder">Batting all-rounder</option><option value="Wicketkeeper">Wicketkeeper</option><option value="Bowler">Bowler</option></select></label><label>Bowling style<select id="pc-bowl"><option>Right-arm fast</option><option>Left-arm fast</option><option>Right-arm medium</option><option>Left-arm orthodox</option><option>Leg-spin</option><option>Off-spin</option><option>Does not bowl</option></select></label></div><div class="pc-actions"><button class="pc-secondary" onclick="pcChooseComp(\''+career.comp+'\')">Back</button><button class="pc-primary" onclick="pcStartCareer()">Start Career</button></div>');
}
function startCareer(){
 const name=($('#pc-name')?.value||'New Player').trim().slice(0,28)||'New Player';
 career={...(career||{}),name,hand:$('#pc-hand')?.value||'Right-handed',role:$('#pc-role')?.value||'Batter',bowl:$('#pc-bowl')?.value||'Right-arm fast',runs:0,balls:0,wickets:0,matches:0,high:0,season:2026,ovr:55,selected:false,history:[]};
 save();lobby();
}
function save(){try{localStorage.setItem('cm27_player_career',JSON.stringify(career))}catch(e){}}
function resume(){try{const c=JSON.parse(localStorage.getItem('cm27_player_career')||'null');if(c){career=c;lobby();return}}catch(e){}alert('No saved player career yet.')}
function lobby(){
 if(!career)return home();const c=COMP.find(x=>x.id===career.comp)||COMP[0],s=STATES.find(x=>x.id===career.state)||STATES[0];
 shell('<div class="pc-kicker">Season '+career.season+' · '+c.name+'</div><h1 class="pc-title">'+esc(career.name)+' <span style="font-size:18px;color:#b6f23c">OVR '+career.ovr+'</span></h1><p class="pc-muted">'+s.name+' · '+career.role+' · '+career.hand+' · '+career.bowl+'</p><div class="pc-grid"><div class="pc-option"><span class="pc-tag">Career stats</span><h3>'+career.matches+' matches</h3><p>'+career.runs+' runs · high score '+career.high+' · '+career.wickets+' wickets</p></div><div class="pc-option"><span class="pc-tag">Next objective</span><h3>Earn your state cap</h3><p>Play a practice match, build your score and raise your rating through performances.</p></div><div class="pc-option"><span class="pc-tag">Competition</span><h3>'+c.name+'</h3><p>'+(career.comp==='shield'?'Red-ball practice match with a long-innings feel.':'50-over practice match with a limited-overs target.')+'</p></div></div><div class="pc-actions"><button class="pc-primary" onclick="pcPlay()">Play 2D Match</button><button class="pc-secondary" onclick="pcHome()">Change Competition</button><button class="pc-secondary" onclick="pcBackHome()">Main Menu</button></div>');
}
function play(){
 if(!career)return home();game={runs:0,balls:0,wickets:0,overs:career.comp==='shield'?null:50,ballX:0,ballY:0,ballVx:0,ballVy:0,phase:'ready',last:'Set yourself at the crease',target:career.comp==='shield'?null:171,fielders:[],scorePop:0,shot:null,batX:0,batY:0,started:Date.now()};
 const root=document.createElement('div');root.className='pc-game-shell';root.innerHTML='<div class="pc-game-top"><div><strong>'+esc(career.name)+' · '+esc(career.state)+' · '+(career.comp==='shield'?'Sheffield Shield':'Marsh One-Day Cup')+'</strong><div style="font-size:11px;color:#9eabc2;margin-top:3px">2D top-down match</div></div><div class="pc-hud"><b id="pc-score">0/0</b><span id="pc-overs">0.0 overs</span><span id="pc-last">Move your mouse to set your position</span><button class="pc-secondary" style="padding:8px 12px" onclick="pcQuit()">Exit Match</button></div></div><canvas class="pc-game-canvas" id="pc-canvas"></canvas><div class="pc-game-help"><span><b>Move</b> mouse position</span><span><b>Bat</b> click when the ball is close</span><span><b>Aim</b> move mouse to choose direction</span><span><b>Space</b> swing</span></div>';
 document.body.appendChild(root);game.root=root;game.canvas=$('#pc-canvas');game.ctx=game.canvas.getContext('2d');game.batX=0;game.batY=0;
 const resize=()=>{if(!game||!game.canvas)return;const r=game.canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);game.canvas.width=Math.round(r.width*dpr);game.canvas.height=Math.round(r.height*dpr);game.ctx.setTransform(dpr,0,0,dpr,0,0);game.w=r.width;game.h=r.height;game.batX=game.w/2;game.batY=game.h*.77;game.pitch={x:game.w*.28,y:game.h*.16,w:game.w*.44,h:game.h*.68};game.fielders=Array.from({length:9},(_,i)=>{const a=i*Math.PI*2/9;return{x:game.w/2+Math.cos(a)*game.w*.29,y:game.h*.49+Math.sin(a)*game.h*.30}});if(game.phase==='ready')spawnBall()};
 game.onResize=resize;window.addEventListener('resize',resize);
 game.canvas.addEventListener('pointermove',e=>{const r=game.canvas.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;mouse.inside=true;game.batX=Math.max(24,Math.min(game.w-24,mouse.x));game.batY=Math.max(game.h*.57,Math.min(game.h*.89,mouse.y))});
 game.canvas.addEventListener('pointerdown',()=>swing());
 window.addEventListener('keydown',game.keydown=e=>{if(e.code==='Space'){e.preventDefault();swing()}});
 resize();cancelAnimationFrame(raf);raf=requestAnimationFrame(frame);
}
function spawnBall(){if(!game)return;game.phase='bowling';game.ballX=game.w/2+(Math.random()-.5)*game.w*.025;game.ballY=game.h*.28;const dx=game.batX-game.ballX,dy=game.batY-game.ballY;const len=Math.hypot(dx,dy)||1;const speed=Math.max(3.2,Math.min(6.5,game.h*.008));game.ballVx=dx/len*speed+(Math.random()-.5)*.9;game.ballVy=dy/len*speed;game.last='Ball coming in — time your shot';updateHud()}
function swing(){
 if(!game)return;if(game.phase==='ready'){spawnBall();return}if(game.phase!=='bowling')return;
 const dist=Math.hypot(game.ballX-game.batX,game.ballY-game.batY);
 if(dist<game.h*.13){const aimX=mouse.x-game.batX,aimY=mouse.y-game.batY,ang=Math.atan2(aimY,aimX),quality=Math.max(0,1-dist/(game.h*.13)),power=(.6+Math.random()*.65)*quality;
 let runs=0;const roll=Math.random();if(roll<.08)runs=0;else if(roll<.43)runs=1;else if(roll<.68)runs=2;else if(roll<.88)runs=4;else runs=6;
 if(quality<.24&&Math.random()<.48){game.wickets++;game.phase='pause';game.last='Bowled! Wicket falls.';game.shot={x:game.ballX,y:game.ballY,ang,power:0,runs:0};}
 else{game.runs+=runs;game.balls++;game.phase='shot';game.last=runs===0?'Dot ball':runs===1?'1 run':runs+' runs';game.shot={x:game.ballX,y:game.ballY,ang,power:Math.max(.25,power),runs};}
 updateHud();setTimeout(()=>{if(!game)return;if(game.phase==='shot'||game.phase==='pause'){if(game.comp!=='shield'&&game.balls>=300||game.wickets>=10){finishMatch()}else{game.phase='ready';game.last='Next ball — move your mouse and click to play';updateHud()}}},900);
 }else{game.last='Too early or too far away — wait for the ball';updateHud()}
}
function updateHud(){if(!game)return;const a=$('#pc-score'),b=$('#pc-overs'),c=$('#pc-last');if(a)a.textContent=game.runs+'/'+game.wickets;if(b)b.textContent=game.balls===0?'0.0 overs':Math.floor(game.balls/6)+'.'+game.balls%6+' overs';if(c)c.textContent=game.last}
function frame(){
 if(!game||!game.ctx)return;const g=game,ctx=g.ctx,w=g.w,h=g.h;ctx.clearRect(0,0,w,h);
 // Outfield
 ctx.fillStyle='#2d794a';ctx.fillRect(0,0,w,h);ctx.fillStyle='#367f4d';for(let i=0;i<9;i++){ctx.fillRect(0,i*h/9,w,h/18)}
 ctx.strokeStyle='#d4e6cf';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(w/2,h*.5,w*.46,h*.44,0,0,Math.PI*2);ctx.stroke();
 // Inner ring and pitch
 ctx.strokeStyle='rgba(235,241,220,.65)';ctx.setLineDash([5,6]);ctx.beginPath();ctx.ellipse(w/2,h*.5,w*.27,h*.26,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
 ctx.fillStyle='#c8b18a';ctx.fillRect(w*.475,h*.17,w*.05,h*.66);ctx.fillStyle='#dfc9a1';ctx.fillRect(w*.485,h*.17,w*.03,h*.66);
 ctx.strokeStyle='#fff1d6';ctx.lineWidth=2;for(const y of [h*.2,h*.8]){ctx.beginPath();ctx.moveTo(w*.46,y);ctx.lineTo(w*.54,y);ctx.stroke();for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(w/2+i*6,y-6);ctx.lineTo(w/2+i*6,y+6);ctx.stroke()}}
 // fielders and keeper
 g.fielders.forEach((p,i)=>{ctx.fillStyle=i===0?'#e8d9a5':'#e9f0fa';ctx.beginPath();ctx.arc(p.x,p.y,Math.max(6,w*.007),0,Math.PI*2);ctx.fill();ctx.fillStyle='#182a43';ctx.beginPath();ctx.arc(p.x,p.y,Math.max(3,w*.0035),0,Math.PI*2);ctx.fill()});
 // Bowler
 ctx.fillStyle='#e9f0fa';ctx.beginPath();ctx.arc(w/2,h*.25,Math.max(8,w*.009),0,Math.PI*2);ctx.fill();
 // player: mouse-position movement inside batting crease area
 ctx.fillStyle='#f8f9ff';ctx.beginPath();ctx.arc(g.batX,g.batY,Math.max(10,w*.012),0,Math.PI*2);ctx.fill();ctx.fillStyle='#b6f23c';ctx.beginPath();ctx.arc(g.batX,g.batY,Math.max(6,w*.007),0,Math.PI*2);ctx.fill();
 // aim indicator
 if(mouse.inside){ctx.strokeStyle='rgba(182,242,60,.7)';ctx.lineWidth=2;ctx.setLineDash([4,5]);ctx.beginPath();ctx.moveTo(g.batX,g.batY);ctx.lineTo(mouse.x,mouse.y);ctx.stroke();ctx.setLineDash([])}
 if(g.phase==='bowling'){g.ballX+=g.ballVx;g.ballY+=g.ballVy;if(g.ballY>g.batY+30||g.ballX<0||g.ballX>w){g.phase='pause';g.balls++;g.last='Missed — dot ball';updateHud();setTimeout(()=>{if(game&&game.phase==='pause'){game.phase='ready';updateHud()}},550)}}
 if(g.phase==='bowling'||g.phase==='ready'){ctx.fillStyle='#d92f36';ctx.beginPath();ctx.arc(g.ballX,g.ballY,Math.max(4,w*.004),0,Math.PI*2);ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(g.ballX-2,g.ballY-3);ctx.lineTo(g.ballX+2,g.ballY+3);ctx.stroke()}
 if(g.phase==='shot'&&g.shot){const sh=g.shot;ctx.strokeStyle='#fff8d4';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(sh.x,sh.y);ctx.lineTo(sh.x+Math.cos(sh.ang)*w*(sh.runs===6?.36:sh.runs===4?.27:sh.runs===2?.16:.09),sh.y+Math.sin(sh.ang)*h*(sh.runs===6?.36:sh.runs===4?.27:sh.runs===2?.16:.09));ctx.stroke();ctx.fillStyle='#b6f23c';ctx.font='bold 24px sans-serif';ctx.fillText(sh.runs===0?'DOT':sh.runs===1?'1':sh.runs+'!',sh.x+12,sh.y-12)}
 if(g.phase==='ready'){ctx.fillStyle='rgba(10,18,27,.55)';ctx.fillRect(w/2-115,h*.42,230,34);ctx.fillStyle='#fff';ctx.font='bold 13px sans-serif';ctx.textAlign='center';ctx.fillText('CLICK TO START NEXT BALL',w/2,h*.42+22);ctx.textAlign='left'}
 raf=requestAnimationFrame(frame);
}
function finishMatch(){
 if(!game)return;career.matches++;career.runs+=game.runs;career.balls+=game.balls;career.wickets+=game.wickets;career.high=Math.max(career.high,game.runs);career.ovr=Math.min(99,career.ovr+(game.runs>=50?2:game.runs>=25?1:0));career.history.unshift({comp:career.comp,runs:game.runs,wickets:game.wickets,balls:game.balls});career.history=career.history.slice(0,20);save();
 const g=game;const summary=document.createElement('div');summary.className='pc-summary';summary.innerHTML='<div class="pc-summary-card"><div class="pc-kicker">Match complete</div><h2 class="pc-title">'+game.runs+'/'+game.wickets+'</h2><p class="pc-muted">You faced '+game.balls+' balls in your '+(career.comp==='shield'?'Sheffield Shield':'Marsh One-Day Cup')+' practice match.</p><div class="pc-statrow"><span>Runs</span><b>'+game.runs+'</b></div><div class="pc-statrow"><span>Balls faced</span><b>'+game.balls+'</b></div><div class="pc-statrow"><span>Wickets</span><b>'+game.wickets+'</b></div><div class="pc-statrow"><span>New overall rating</span><b>'+career.ovr+'</b></div><div class="pc-actions"><button class="pc-primary" onclick="pcCloseGame();pcLobby()">Career Hub</button><button class="pc-secondary" onclick="pcReplay()">Play Again</button></div></div>';g.root.appendChild(summary);game.phase='finished';
}
function quit(){if(!game)return;const g=game;cleanup();if(g.root)g.root.remove();game=null;lobby()}
function closeGame(){if(!game)return;const g=game;cleanup();g.root?.remove();game=null}
function cleanup(){cancelAnimationFrame(raf);if(game?.onResize)window.removeEventListener('resize',game.onResize);if(game?.keydown)window.removeEventListener('keydown',game.keydown)}
function backHome(){if(game){cleanup();game.root?.remove();game=null}if(window.__pcOriginalStart)window.__pcOriginalStart();else home()}
window.pcHome=home;window.pcChooseComp=chooseComp;window.pcChooseState=id=>{career=career||{};career.state=id;chooseComp(career.comp||'shield')};window.pcCreate=create;window.pcStartCareer=startCareer;window.pcLobby=lobby;window.pcPlay=play;window.pcQuit=quit;window.pcCloseGame=closeGame;window.pcReplay=()=>{closeGame();play()};window.pcResume=resume;window.pcBackHome=backHome;
window.__pcOriginalStart=window.start;
window.start=function(){style();const old=window.__pcOriginalStart;$('#app').innerHTML='<div class="ttlp"><div class="tmlogo"><span>CM</span></div><h1 class="tt">Cricket Manager 27</h1><div style="display:flex;flex-direction:column;gap:12px;width:min(100%,360px)"><button class="go" onclick="nameG()">Begin Manager Career</button><button class="go" onclick="pcHome()">Player Career</button>'+(typeof saves==='function'&&saves().length?'<button class="go" onclick="lsv()">Manage Saves</button>':'')+'</div></div>'};
})();