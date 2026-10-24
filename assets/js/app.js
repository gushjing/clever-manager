
/* ================= Navigation ================= */
let current = 'splash';
let activePortal = 'con';
const navStack = [];
function updateStatusbarClock(){
  const now = new Date();
  const time = String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
  document.querySelectorAll('.statusbar > span:first-child').forEach(el=>{ el.textContent = time; });
  const greeting=document.querySelector('#org-home .g-t1');
  if(greeting){
    const hour=now.getHours();
    greeting.textContent=(hour>=5&&hour<12?'上午好':hour>=12&&hour<18?'下午好':'晚上好')+'，主办方';
  }
}
updateStatusbarClock();
setInterval(updateStatusbarClock, 15000);
function show(id, push=true){
  const cur = document.getElementById(current);
  const nxt = document.getElementById(id);
  if(!nxt) return;
  if(push && current !== id) navStack.push(current);
  if(cur) cur.classList.remove('active');
  nxt.classList.add('active');
  nxt.classList.remove('pop'); void nxt.offsetWidth;
  current = id;
  const sc = nxt.querySelector('.scroll'); if(sc) sc.scrollTop = 0;
  if(id==='g-notify') renderNotifyCenter();
  if(id==='con-map') renderHotStalls();
  if(id==='con-shops') renderShopList();
  if(id==='con-coupon') renderCouponList();
  if(id==='con-profile') renderConsumerProfile();
  if(id==='con-reviews') renderConsumerReviews();
  if(id==='ven-data') renderVendorData();
  if(id==='ven-home') renderVendorRating();
  if(id==='ven-home') renderVendorCardTodo();
  if(id==='ven-home') renderVendorHomeEvents();
  if(id==='ven-pick') renderVendorBoothChoices();
  if(id==='ven-events') renderVendorEvents();
  if(id==='ven-event-detail') renderVendorEventDetail();
  if(id==='org-fee') renderOrganizerPayments();
  if(id==='org-home') renderOrganizerPayments();
  if(id==='ven-pay'||id==='ven-voucher') renderVendorPayments();
  if(id==='ven-home') renderVendorPayments();
  if(id==='ven-card') renderVendorCard();
  if(id==='ven-search') renderVendorSearch();
  if(id==='g-pay-ok') renderPaymentConfirmation();
  if(id==='org-issue') renderOrganizerIssues();
  if(id==='org-ticket') renderOrganizerIncidentDetail();
  if(id==='ven-report') renderVendorIncidents();
  if(id==='evt-list') renderEvents();
  if(id==='evt-detail') renderConsumerEventDetail();
  if(id==='con-checkin') renderConsumerCheckin();
  if(id==='org-publish') renderOrganizerEvents();
  if(id==='org-home') renderOrganizerHomeEvents();
  if(id==='org-checkin') renderOrganizerCheckin();
}
function go(id){ show(id); }
function back(){
  const prev = navStack.pop();
  if(prev){ const cur=document.getElementById(current); cur.classList.remove('active');
    const nxt=document.getElementById(prev); nxt.classList.add('active'); current=prev; }
}
function backToRole(){ navStack.length=0; show('role', false); }
function enterPortal(p){
  activePortal = p==='org' ? 'org' : p==='ven' ? 'ven' : 'con';
  notificationFilter='全部';
  navStack.length=0;
  show(p==='org'?'org-home':p==='ven'?'ven-home':'evt-list', false);
  toast(p==='org'?'已进入管理者端口':p==='ven'?'已进入摊主端口':'已进入消费者端口');
}
/* iOS 边缘右滑返回 */
(function(){
  let sx=0, sy=0;
  const ph=document.getElementById('phone');
  ph.addEventListener('touchstart',e=>{ sx=e.touches[0].clientX; sy=e.touches[0].clientY; },{passive:true});
  ph.addEventListener('touchend',e=>{
    const dx=e.changedTouches[0].clientX-sx, dy=Math.abs(e.changedTouches[0].clientY-sy);
    if(sx<32 && dx>70 && dy<60 && current!=='splash') back();
  },{passive:true});
})();
/* splash auto-advance（节奏与原版一致） */
setTimeout(()=>{ if(current==='splash'){ show('role', false); } }, 3000);
document.getElementById('splash').addEventListener('click', ()=>{ if(current==='splash') show('role', false); });

/* ================= Toast ================= */
let toastTimer;
function toast(msg){
  const t = document.getElementById('toast');
  document.getElementById('toastText').textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'), 2200);
}

/* ================= 活动海报生成（集市帐篷 · 场地图片） ================= */
const POSTER_PALS = [
  {sky:['#BFE0FF','#EAF4FF'],tent:'#4C7DF0',ground:'#DCEBFB',accent:'#F2A93B'},
  {sky:['#FFD9C4','#FFF1E4'],tent:'#F2814A',ground:'#FDE8D8',accent:'#3E8EF0'},
  {sky:['#C9E8FF','#EFF8FF'],tent:'#38B6D9',ground:'#DCF2FB',accent:'#F25C7F'},
  {sky:['#E4DBFF','#F5F1FF'],tent:'#8B6FF0',ground:'#EBE4FD',accent:'#F2A93B'},
  {sky:['#C8EEDD','#EDFAF3'],tent:'#3EB97F',ground:'#DEF4E8',accent:'#F2814A'},
  {sky:['#FCD9E4','#FFF0F5'],tent:'#F25C7F',ground:'#FBE4EC',accent:'#8B6FF0'},
];
function drawPoster(el, idx){
  if(!el || el.dataset.done) return;
  el.dataset.done = '1';
  const p = POSTER_PALS[(idx-1+POSTER_PALS.length)%POSTER_PALS.length];
  const g = idx=>`url(#pg${idx})`;
  let s = `<svg viewBox="0 0 360 150" preserveAspectRatio="xMidYMid slice">
  <defs><linearGradient id="pg${idx}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${p.sky[0]}"/><stop offset="1" stop-color="${p.sky[1]}"/></linearGradient></defs>
  <rect width="360" height="150" fill="${g(idx)}"/>
  <circle cx="52" cy="38" r="20" fill="${p.accent}" opacity=".85"/>
  <circle cx="52" cy="38" r="26" fill="#fff" opacity=".25"/>
  <ellipse cx="150" cy="34" rx="34" ry="11" fill="#fff" opacity=".8"/>
  <ellipse cx="180" cy="30" rx="26" ry="9" fill="#fff" opacity=".65"/>
  <ellipse cx="288" cy="44" rx="30" ry="10" fill="#fff" opacity=".75"/>
  <rect y="108" width="360" height="42" fill="${p.ground}"/>`;
  // 三顶帐篷
  const tents=[[36,p.tent],[150,p.accent],[268,p.tent]];
  tents.forEach((t,i)=>{
    const x=t[0];
    s+=`<g>
      <line x1="${x+34}" y1="52" x2="${x+34}" y2="112" stroke="#5B6274" stroke-width="3"/>
      <line x1="${x-34}" y1="52" x2="${x-34}" y2="112" stroke="#5B6274" stroke-width="3"/>
      <path d="M${x-42} 58 L${x} 34 L${x+42} 58 Z" fill="#fff"/>
      <path d="M${x-42} 58 L${x} 34 L${x} 58 Z" fill="${t[1]}"/>
      <path d="M${x} 58 L${x} 34 L${x+42} 58 Z" fill="${t[1]}" opacity=".82"/>
      <rect x="${x-24}" y="70" width="48" height="34" rx="5" fill="#fff" opacity=".92"/>
      <rect x="${x-14}" y="82" width="12" height="14" rx="2" fill="${p.accent}" opacity=".85"/>
      <rect x="${x+4}" y="82" width="12" height="14" rx="2" fill="${t[1]}" opacity=".7"/>
    </g>`;
    s+=`<line x1="${x}" y1="34" x2="${x}" y2="18" stroke="#5B6274" stroke-width="1.6"/>
        <path d="M${x} 18 L${x+22} 23 L${x} 29 Z" fill="${p.accent}"/>`;
  });
  // 人群
  const ppl=[[90,118],[120,124],[210,120],[240,126],[320,122]];
  ppl.forEach(pp=>{
    s+=`<circle cx="${pp[0]}" cy="${pp[1]}" r="5" fill="#3A3F52"/>
        <path d="M${pp[0]-7} 138 q7 -12 14 0 z" fill="#3A3F52"/>`;
  });
  s+='</svg>';
  el.innerHTML = s;
}
document.querySelectorAll('[data-poster]').forEach(el=>{
  drawPoster(el, parseInt(el.dataset.poster)||1);
});

/* ================= 活动列表数据（广东省内集市） ================= */
const EVENTS = [
  {p:1, st:'on',  stText:'正在举办', stColor:'var(--green)', startDate:'2026-09-01', endDate:'2026-09-03', city:'广州', types:['文创市集','艺术市集'], distance:2.1, popularity:96, name:'星光文创市集 · 秋季场',
   time:'9.01 - 9.03 · 每天 10:00-21:30', loc:'广州市 · 滨河文化广场', org:'主办方：星光文旅运营有限公司',
   tags:[['文创市集','var(--sky-soft)','var(--sky2)'],['手作体验','var(--amber-soft)','var(--amber)'],['夜间灯市','var(--pink-soft)','var(--pink)']],
   foot:'86 摊位 · 128 商户 · 距你 2.1km', fav:true, idx:0},
  {p:2, st:'soon', stText:'10.01 开幕', stColor:'var(--amber)', startDate:'2026-10-01', endDate:'2026-10-05', city:'深圳', types:['美食市集','艺术市集'], distance:108, popularity:88, name:'深圳湾咖啡青年市集',
   time:'10.01 - 10.05 · 每天 11:00-22:00', loc:'深圳市 · 深圳湾万象城配套广场', org:'主办方：星光文旅运营有限公司',
   tags:[['咖啡主题','var(--orange-soft)','var(--orange)'],['青年共创','var(--sky-soft)','var(--sky2)'],['现场音乐','var(--purple-soft)','var(--purple)']],
   foot:'60 摊位 · 招商 64% · 距你 108km', fav:true, idx:1},
  {p:3, st:'soon', stText:'10.18 开幕', stColor:'var(--amber)', startDate:'2026-10-18', endDate:'2026-10-20', city:'珠海', types:['艺术市集','节庆快闪'], distance:128, popularity:77, name:'珠海情侣路滨海风车市集',
   time:'10.18 - 10.20 · 每天 14:00-22:00', loc:'珠海市 · 情侣中路城市阳台', org:'主办方：珠海滨海文旅',
   tags:[['滨海','var(--cyan-soft)','var(--cyan)'],['风车打卡','var(--pink-soft)','var(--pink)'],['夜间市集','var(--sky-soft)','var(--sky2)']],
   foot:'45 摊位 · 报名中 · 距你 128km', fav:false, idx:2},
  {p:4, st:'soon', stText:'11.07 开幕', stColor:'var(--amber)', startDate:'2026-11-07', endDate:'2026-11-09', city:'佛山', types:['文创市集','节庆快闪'], distance:62, popularity:82, name:'佛山岭南天地国潮文创周',
   time:'11.07 - 11.09 · 每天 10:00-21:00', loc:'佛山市 · 岭南天地', org:'主办方：岭南天地商业运营方',
   tags:[['国潮','var(--red-soft)','var(--red)'],['文创','var(--sky-soft)','var(--sky2)'],['非遗手作','var(--amber-soft)','var(--amber)']],
   foot:'48 摊位 · 筹备中 · 距你 62km', fav:false, idx:3},
  {p:5, st:'soon', stText:'10.24 开幕', stColor:'var(--amber)', startDate:'2026-10-24', endDate:'2026-10-25', city:'东莞', types:['艺术市集','节庆快闪'], distance:75, popularity:91, name:'东莞松山湖草地音乐集市',
   time:'10.24 - 10.25 · 每天 15:00-22:00', loc:'东莞市 · 松山湖中心公园', org:'主办方：松山湖文体局合作运营',
   tags:[['音乐','var(--purple-soft)','var(--purple)'],['草地野餐','var(--green-soft)','var(--green)'],['市集','var(--sky-soft)','var(--sky2)']],
   foot:'36 摊位 · 报名中 · 距你 75km', fav:false, idx:4},
  {p:6, st:'off', stText:'已结束', stColor:'#9AA3BC', startDate:'2026-08-16', endDate:'2026-08-17', city:'中山', types:['文创市集','美食市集'], distance:86, popularity:65, name:'中山假日广场夏日文创夜',
   time:'8.16 - 8.17 · 已顺利举办', loc:'中山市 · 假日广场', org:'主办方：中山城发文旅',
   tags:[['文创','var(--sky-soft)','var(--sky2)'],['夜市','var(--pink-soft)','var(--pink)']],
   foot:'40 摊位 · 复盘报告已生成', fav:false, idx:5},
  {p:7, st:'soon', stText:'10.31 开幕', stColor:'var(--amber)', startDate:'2026-10-31', endDate:'2026-11-02', city:'广州', types:['美食市集','节庆快闪'], distance:8.4, popularity:86, name:'广州天河秋日风味美食节',
   time:'10.31 - 11.02 · 每天 11:00-22:00', loc:'广州市 · 天河体育中心南广场', org:'主办方：天河文旅活动中心',
   tags:[['美食市集','var(--orange-soft)','var(--orange)'],['秋日限定','var(--amber-soft)','var(--amber)'],['亲子友好','var(--green-soft)','var(--green)']],
   foot:'52 摊位 · 报名中 · 距你 8.4km', fav:false, idx:6},
  {p:8, st:'soon', stText:'11.14 开幕', stColor:'var(--amber)', startDate:'2026-11-14', endDate:'2026-11-15', city:'深圳', types:['艺术市集','文创市集'], distance:112, popularity:79, name:'深圳南山原创艺术生活节',
   time:'11.14 - 11.15 · 每天 10:00-21:00', loc:'深圳市 · 南山区人才公园', org:'主办方：南山文化创意产业协会',
   tags:[['艺术市集','var(--purple-soft)','var(--purple)'],['原创设计','var(--sky-soft)','var(--sky2)'],['手作体验','var(--amber-soft)','var(--amber)']],
   foot:'44 摊位 · 筹备中 · 距你 112km', fav:false, idx:7},
  {p:9, st:'soon', stText:'11.21 开幕', stColor:'var(--amber)', startDate:'2026-11-21', endDate:'2026-11-22', city:'珠海', types:['节庆快闪','美食市集'], distance:132, popularity:74, name:'珠海海岸嘉年华快闪市集',
   time:'11.21 - 11.22 · 每天 14:00-22:00', loc:'珠海市 · 海滨泳场', org:'主办方：珠海滨海文旅',
   tags:[['节庆快闪','var(--pink-soft)','var(--pink)'],['滨海美食','var(--orange-soft)','var(--orange)'],['现场演出','var(--purple-soft)','var(--purple)']],
   foot:'38 摊位 · 报名中 · 距你 132km', fav:false, idx:8},
  {p:10, st:'soon', stText:'10.17 开幕', stColor:'var(--amber)', startDate:'2026-10-17', endDate:'2026-10-18', city:'东莞', types:['文创市集','美食市集'], distance:72, popularity:70, name:'东莞松山湖周末生活集',
   time:'10.17 - 10.18 · 每天 10:00-20:00', loc:'东莞市 · 松山湖生态景区', org:'主办方：松山湖文体局合作运营',
   tags:[['文创市集','var(--sky-soft)','var(--sky2)'],['本地风味','var(--orange-soft)','var(--orange)'],['周末限定','var(--green-soft)','var(--green)']],
   foot:'32 摊位 · 报名中 · 距你 72km', fav:false, idx:9},
  {p:11, st:'soon', stText:'11.07 开幕', stColor:'var(--amber)', startDate:'2026-11-07', endDate:'2026-11-09', city:'佛山', types:['美食市集','艺术市集'], distance:64, popularity:83, name:'佛山顺德寻味街巷市集',
   time:'11.07 - 11.09 · 每天 11:00-21:30', loc:'佛山市 · 顺德欢乐海岸', org:'主办方：顺德文旅发展中心',
   tags:[['美食市集','var(--orange-soft)','var(--orange)'],['岭南风味','var(--amber-soft)','var(--amber)'],['街头音乐','var(--purple-soft)','var(--purple)']],
   foot:'56 摊位 · 筹备中 · 距你 64km', fav:false, idx:10},
  {p:12, st:'soon', stText:'11.28 开幕', stColor:'var(--amber)', startDate:'2026-11-28', endDate:'2026-11-29', city:'中山', types:['节庆快闪','文创市集'], distance:89, popularity:68, name:'中山岐江冬日文创嘉年华',
   time:'11.28 - 11.29 · 每天 10:00-21:00', loc:'中山市 · 岐江公园', org:'主办方：中山城发文旅',
   tags:[['节庆快闪','var(--pink-soft)','var(--pink)'],['文创市集','var(--sky-soft)','var(--sky2)'],['亲子手作','var(--amber-soft)','var(--amber)']],
   foot:'41 摊位 · 筹备中 · 距你 89km', fav:false, idx:11},
];
const SHARED_EVENTS_KEY='market.demo.events.v1';
let organizerEventFilter='all';
let activeConsumerEventId=EVENTS[0].p;
function saveSharedEvents(){
  try{
    localStorage.setItem(SHARED_EVENTS_KEY,JSON.stringify(EVENTS));
  }catch(error){
    console.error('Unable to save shared activity directory.',error);
    toast('活动更新未能保存，请检查浏览器本地存储');
    return false;
  }
  renderEvents();
  renderVendorHomeEvents();
  renderVendorEvents();
  renderVendorEventDetail();
  renderOrganizerEvents();
  renderOrganizerHomeEvents();
  renderOrganizerCheckin();
  renderConsumerEventDetail();
  renderConsumerCheckin();
  return true;
}
function loadSharedEvents(){
  try{
    const saved=JSON.parse(localStorage.getItem(SHARED_EVENTS_KEY)||'null');
    if(!Array.isArray(saved)) return;
    const valid=saved.filter(event=>event&&Number.isInteger(event.p)&&typeof event.name==='string'
      &&typeof event.startDate==='string'&&!Number.isNaN(eventDate(event.startDate).getTime())
      &&typeof event.endDate==='string'&&!Number.isNaN(eventDate(event.endDate).getTime())
      &&typeof event.city==='string'&&typeof event.loc==='string'&&typeof event.foot==='string'
      &&Array.isArray(event.types)&&Array.isArray(event.tags));
    if(valid.length!==saved.length) throw new Error('Saved activity directory contains invalid records.');
    EVENTS.splice(0,EVENTS.length,...valid);
  }catch(error){
    console.error('Unable to load shared activity directory.',error);
    toast('活动目录读取失败，已保留内置活动样例');
  }
}
loadSharedEvents();
let evtCurFilter = 'all';
const defaultEventFilters = {status:'all',city:'不限',type:'全部',date:'不限',sort:'智能推荐'};
let activeEventFilters = {...defaultEventFilters};
function eventDate(value){
  const [year,month,day]=value.split('-').map(Number);
  return new Date(year,month-1,day);
}
function eventStatus(event){
  const today=new Date();
  today.setHours(0,0,0,0);
  const start=eventDate(event.startDate);
  const end=eventDate(event.endDate);
  if(today<start) return {key:'soon',text:`${start.getMonth()+1}.${String(start.getDate()).padStart(2,'0')} 开幕`,color:'var(--amber)'};
  if(today>end) return {key:'off',text:'已结束',color:'#9AA3BC'};
  return {key:'on',text:'正在举办',color:'var(--green)'};
}
function eventMatchesDate(event, value){
  if(value==='不限') return true;
  const today=new Date();
  today.setHours(0,0,0,0);
  const start=eventDate(event.startDate);
  const end=eventDate(event.endDate);
  if(value==='国庆档'){
    return start.getFullYear()===today.getFullYear() && start<=new Date(today.getFullYear(),9,7) && end>=new Date(today.getFullYear(),9,1);
  }
  if(value==='今天') return start<=today && end>=today;
  let rangeStart;
  let rangeEnd;
  if(value==='本周末'){
    rangeStart=new Date(today);
    rangeStart.setDate(today.getDate()+(6-today.getDay()+7)%7);
    rangeEnd=new Date(rangeStart);
    rangeEnd.setDate(rangeStart.getDate()+1);
  }else{
    rangeStart=today;
    rangeEnd=new Date(today);
    rangeEnd.setDate(today.getDate()+7);
  }
  return start<=rangeEnd && end>=rangeStart;
}
function getFilteredEvents(){
  const filtered=EVENTS.filter(event=>{
    const status=eventStatus(event).key;
    return (evtCurFilter==='all'||status===evtCurFilter)
      && (activeEventFilters.city==='不限'||event.city===activeEventFilters.city)
      && (activeEventFilters.type==='全部'||event.types.includes(activeEventFilters.type))
      && eventMatchesDate(event,activeEventFilters.date);
  });
  const sorters={
    '最近开始':(a,b)=>eventDate(a.startDate)-eventDate(b.startDate),
    '距离最近':(a,b)=>a.distance-b.distance,
    '人气最高':(a,b)=>b.popularity-a.popularity,
    '智能推荐':(a,b)=>b.popularity-a.popularity,
  };
  return filtered.sort(sorters[activeEventFilters.sort]||sorters['智能推荐']);
}
function renderEvents(){
  const box = document.getElementById('evtCards');
  if(!box) return;
  box.innerHTML = '';
  const events=getFilteredEvents();
  if(!events.length){
    box.innerHTML='<div class="statewrap"><div class="stateico" style="background:var(--sky-soft);color:var(--sky2)"><svg width="36" height="36"><use href="#i-search"/></svg></div><h4>没有找到符合条件的活动</h4><p>调整城市、类型或日期条件后再试试</p><button class="btn ghost" onclick="resetEventFilters()">清除筛选条件</button></div>';
    return;
  }
  events.forEach(e=>{
    const i=EVENTS.indexOf(e);
    const status=eventStatus(e);
    const d = document.createElement('div');
    d.className='evcard';
    d.onclick = ()=>openEvent(i);
    d.innerHTML = `<div class="poster" data-poster="${e.p}"></div>
      <span class="ev-status" style="background:${status.color}">${status.text}</span>
      <button class="ev-fav" onclick="event.stopPropagation(); this.querySelector('svg').setAttribute('href', this.querySelector('svg').getAttribute('href').endsWith('-f')?'#i-heart':'#i-heart-f'); toast(this.querySelector('svg').getAttribute('href').endsWith('-f')?'已收藏该活动':'已取消收藏')">
        <svg width="16" height="16" style="color:var(--pink)"><use href="#i-heart${e.fav?'-f':''}"/></svg></button>
      <div class="ev-body">
        <div class="ev-name">${e.name}</div>
        <div class="ev-meta">
          <div class="m"><svg width="13" height="13" style="color:var(--sky2)"><use href="#i-clock"/></svg>${e.time}</div>
          <div class="m"><svg width="13" height="13" style="color:var(--sky2)"><use href="#i-pin"/></svg>${e.loc}</div>
          <div class="m"><svg width="13" height="13" style="color:var(--sky2)"><use href="#i-shield"/></svg>${e.org}</div>
        </div>
        <div class="ev-tags">${e.tags.map(t=>`<span class="chip" style="background:${t[1]};color:${t[2]}">${t[0]}</span>`).join('')}</div>
        <div class="ev-foot"><span>${e.foot}</span><span>详情 →</span></div>
      </div>`;
    box.appendChild(d);
    drawPoster(d.querySelector('.poster'), e.p);
  });
}
function evtFilter(btn, key){
  document.querySelectorAll('#evtChips .fchip').forEach(c=>c.classList.remove('on'));
  btn.classList.add('on');
  evtCurFilter = key;
  activeEventFilters.status=key;
  syncEventStatusChip();
  renderEvents();
}
function syncEventStatusChip(){
  document.querySelectorAll('#evtChips .fchip').forEach(chip=>{
    const handler=chip.getAttribute('onclick')||'';
    const key=(handler.match(/evtFilter\(this,'([^']+)'\)/)||[])[1];
    if(key) chip.classList.toggle('on',key===evtCurFilter);
  });
  const statusOption={on:'正在举办',soon:'即将举办',off:'已结束'}[evtCurFilter]||'全部';
  document.querySelectorAll('#g-filter .field .tagrow')[0]?.querySelectorAll('.tagpick').forEach(button=>{
    const selected=button.textContent.trim()===statusOption;
    button.classList.toggle('on',selected);
    button.setAttribute('aria-pressed',selected?'true':'false');
  });
}
function resetEventFilters(){
  activeEventFilters={...defaultEventFilters};
  evtCurFilter='all';
  document.querySelectorAll('#g-filter .tagrow').forEach(row=>{
    row.querySelectorAll('.tagpick').forEach((button,index)=>{
      button.classList.toggle('on',index===0);
      button.setAttribute('aria-pressed',index===0?'true':'false');
    });
  });
  document.querySelectorAll('#g-filter .chk').forEach((option,index)=>option.classList.toggle('on',index===0));
  syncEventStatusChip();
  renderEvents();
}
function applyEventFilters(){
  const rows=[...document.querySelectorAll('#g-filter .field .tagrow')];
  const selected=rows.map(row=>row.querySelector('.tagpick.on')?.textContent.trim()||'');
  activeEventFilters={
    status:selected[0]==='正在举办'?'on':selected[0]==='即将举办'?'soon':selected[0]==='已结束'?'off':'all',
    city:selected[1]||'不限',
    type:selected[2]||'全部',
    date:selected[3]||'不限',
    sort:document.querySelector('#g-filter .chk.on .ck-t')?.textContent.trim()||'智能推荐',
  };
  evtCurFilter=activeEventFilters.status;
  syncEventStatusChip();
  renderEvents();
  back();
  toast(`已应用筛选：${activeEventFilters.city} · ${activeEventFilters.type} · ${activeEventFilters.sort}`);
}
function openEvent(i){
  const e = EVENTS[i];
  if(!e) return;
  activeConsumerEventId=e.p;
  renderConsumerEventDetail();
  go('evt-detail');
}
function renderConsumerEventDetail(){
  const e=EVENTS.find(event=>event.p===activeConsumerEventId);
  if(!e) return;
  const status=eventStatus(e);
  const statusEl=document.querySelector('#evt-detail .ev-status');
  if(statusEl){
    statusEl.textContent=status.text;
    statusEl.style.background=status.color;
  }
  const nameEl = document.querySelector('#evt-detail b[style*="font-size:19px"]');
  if(nameEl) nameEl.textContent = e.name;
  const description=document.getElementById('eventDescription');
  if(description) description.textContent=e.name+'，活动地点：'+e.loc+'。活动日期：'+organizerDateRange(e)+'。'+e.foot+'。报名和活动状态以平台活动目录为准。';
  const detailTags=document.querySelector('#evt-detail .ev-tags');
  if(detailTags) detailTags.innerHTML=e.tags.map(tag=>'<span class="chip" style="background:'+tag[1]+';color:'+tag[2]+'">'+escapeHTML(tag[0])+'</span>').join('');
  const metas = document.querySelectorAll('#evt-detail .ev-meta .row');
  if(metas.length>=3){
    metas[0].innerHTML = '<svg width="14" height="14" style="color:var(--sky2)"><use href="#i-clock"/></svg>'+e.time;
    metas[1].innerHTML = '<svg width="14" height="14" style="color:var(--sky2)"><use href="#i-pin"/></svg>'+e.loc+'<span style="color:var(--sky2);font-weight:600;margin-left:auto" onclick="go(\'con-map\')">地图</span>';
    metas[2].innerHTML = '<svg width="14" height="14" style="color:var(--sky2)"><use href="#i-shield"/></svg>'+e.org;
  }
  const pe = document.querySelector('#evt-detail [data-poster]');
  if(pe){ pe.dataset.poster = e.p; drawPoster(pe, e.p); }
  const liveStatus=document.getElementById('eventLiveStatus');
  if(liveStatus){
    const shared=loadSharedAttendance();
    if(attendanceLoadErrorReported) return;
    const record=shared.records.find(item=>item.eventId===e.p&&item.status==='success');
    const consumer=shared.consumers.find(item=>item.eventId===e.p&&item.consumerId===DEMO_CONSUMER_ID);
    liveStatus.textContent=(record
      ? '摊主签到：'+record.stallName+' · '+record.date+' '+sgFmtTime(record.signinAt)
      : '摊主签到：暂无记录')+'；'+(consumer
      ? '你已于 '+consumer.date+' '+sgFmtTime(consumer.checkedAt)+' 完成本场打卡。'
      : '消费者尚未完成本场打卡。');
  }
}
function organizerDateRange(event){
  const format=value=>{const date=eventDate(value);return (date.getMonth()+1)+'.'+String(date.getDate()).padStart(2,'0');};
  return format(event.startDate)+' - '+format(event.endDate);
}
function organizerEventRow(event){
  const status=eventStatus(event);
  const open=event.foot.includes('报名中');
  const card=document.createElement('div');
  card.className='evcard';
  const detail=event.loc||event.city;
  card.innerHTML='<div class="poster" data-poster="'+event.p+'"></div>'+
    '<span class="ev-status" style="background:'+status.color+'">'+status.text+'</span>'+
    '<div class="ev-body"><div class="ev-name">'+escapeHTML(event.name)+'</div><div class="ev-meta">'+
    '<div class="m">'+escapeHTML(event.time)+'</div>'+
    '<div class="m">'+escapeHTML(detail)+'</div><div class="m">'+escapeHTML(event.org)+'</div></div>'+
    '<div class="ev-foot"><span>'+escapeHTML(event.foot)+'</span><button class="chip" style="border:0;cursor:pointer;background:'+(open?'var(--amber-soft)':'var(--green-soft)')+';color:'+(open?'var(--amber)':'var(--green)')+'" onclick="event.stopPropagation();toggleOrganizerSignup('+event.p+')">'+(open?'关闭报名':'开启报名')+'</button></div></div>';
  card.addEventListener('click',()=>{activeConsumerEventId=event.p;renderConsumerEventDetail();toast('已选中该活动；消费者详情和摊主报名列表使用同一活动记录');});
  drawPoster(card.querySelector('.poster'),event.p);
  return card;
}
function renderOrganizerEvents(){
  const list=document.getElementById('orgEventList');
  if(!list) return;
  list.replaceChildren();
  const events=EVENTS.filter(event=>organizerEventFilter==='all'||eventStatus(event).key===organizerEventFilter);
  if(!events.length){list.innerHTML='<div class="empty">当前分类没有活动</div>';return;}
  events.forEach(event=>list.appendChild(organizerEventRow(event)));
}
function filterOrganizerEvents(button,status){
  organizerEventFilter=status;
  document.querySelectorAll('#orgEventFilters .fchip').forEach(item=>item.classList.toggle('on',item===button));
  renderOrganizerEvents();
}
function renderOrganizerHomeEvents(){
  const list=document.getElementById('orgHomeEvents');
  if(!list) return;
  list.replaceChildren();
  const events=EVENTS.slice().sort((a,b)=>eventDate(a.startDate)-eventDate(b.startDate)).slice(0,3);
  if(!events.length){list.innerHTML='<div class="empty">活动目录暂无活动</div>';return;}
  events.forEach(event=>{
    const status=eventStatus(event);
    const row=document.createElement('div');
    row.className='li';
    row.innerHTML='<div class="avatar" style="background:var(--sky-soft);color:var(--sky2)"><svg width="20" height="20"><use href="#i-tent"/></svg></div>'+
      '<div class="li-main"><div class="li-title">'+escapeHTML(event.name)+'</div><div class="li-sub">'+escapeHTML(status.text+' · '+event.loc+' · '+organizerDateRange(event))+'</div></div>'+
      '<span class="chip" style="background:'+(status.key==='on'?'var(--green-soft)':status.key==='soon'?'var(--amber-soft)':'var(--bg)')+';color:'+status.color+'">'+status.text+'</span>';
    row.addEventListener('click',()=>go('org-publish'));
    list.appendChild(row);
  });
}
function pickOrganizerCity(button){
  document.querySelectorAll('#orgEventCity .tagpick').forEach(item=>item.classList.toggle('on',item===button));
}
function publishOrganizerEvent(){
  const name=document.getElementById('orgEventName').value.trim();
  const startDate=document.getElementById('orgEventStart').value;
  const endDate=document.getElementById('orgEventEnd').value;
  const venue=document.getElementById('orgEventVenue').value.trim();
  const boothCount=Number(document.getElementById('orgEventBooths').value);
  const cityButton=document.querySelector('#orgEventCity .tagpick.on');
  const type=document.getElementById('orgEventType').value;
  if(!name||!startDate||!endDate||!venue||!Number.isInteger(boothCount)||boothCount<1){toast('请完整填写名称、日期、场地和有效摊位数量');return;}
  if(eventDate(endDate)<eventDate(startDate)){toast('结束日期不能早于开始日期');return;}
  const p=Math.max(0,...EVENTS.map(event=>event.p))+1;
  const event={
    p:p,st:'soon',stText:'筹备中',stColor:'var(--amber)',startDate:startDate,endDate:endDate,
    city:cityButton?cityButton.textContent.trim():'广州',types:[type],distance:0,popularity:0,
    name:name,time:organizerDateRange({startDate:startDate,endDate:endDate})+' · 每天 10:00-21:00',
    loc:venue,org:'主办方：星光文旅运营有限公司',
    tags:[[type,'var(--sky-soft)','var(--sky2)']],foot:boothCount+' 摊位 · 报名中 · 管理端发布',
    fav:false,idx:p-1
  };
  EVENTS.push(event);
  if(!saveSharedEvents()){EVENTS.pop();return;}
  document.getElementById('orgEventName').value='';
  document.getElementById('orgEventStart').value='';
  document.getElementById('orgEventEnd').value='';
  document.getElementById('orgEventVenue').value='';
  organizerEventFilter='all';
  document.querySelectorAll('#orgEventFilters .fchip').forEach((item,index)=>item.classList.toggle('on',index===0));
  renderOrganizerEvents();
  go('org-publish');
  toast('活动已发布并写入三端共享目录');
}
function toggleOrganizerSignup(id){
  const event=EVENTS.find(item=>item.p===id);
  if(!event) return;
  if(event.foot.includes('报名中')) event.foot=event.foot.replace('报名中','报名已关闭');
  else event.foot=event.foot.replace(/报名已关闭|筹备中|场地勘测完成|待排期/,'报名中');
  saveSharedEvents();
}
renderEvents();

/* ================= Booth map generator ================= */
const ZONES = {
  food:  {fill:'#FFD9A8', stroke:'#F2B26B', label:'餐饮区'},
  drink: {fill:'#CFE3FF', stroke:'#7FA8EC', label:'饮品区'},
  craft: {fill:'#E2D8FD', stroke:'#A98FF0', label:'文创区'},
  play:  {fill:'#CDEDD9', stroke:'#6CC794', label:'互动区'},
};
const BOOTHS = [];
for(let i=0;i<8;i++) BOOTHS.push({id:'A-'+String(i+1).padStart(2,'0'), zone:'food', x:18, y:34+i*26, w:44, h:21});
for(let i=0;i<8;i++) BOOTHS.push({id:'B-'+String(i+1).padStart(2,'0'), zone:'craft', x:96, y:34+i*26, w:44, h:21});
for(let i=0;i<8;i++) BOOTHS.push({id:'B-'+String(i+9).padStart(2,'0'), zone:'craft', x:148, y:34+i*26, w:44, h:21});
for(let i=0;i<6;i++) BOOTHS.push({id:'C-'+String(i+1).padStart(2,'0'), zone:'drink', x:238, y:34+i*26, w:44, h:21});
for(let i=0;i<4;i++) BOOTHS.push({id:'D-'+String(i+1).padStart(2,'0'), zone:'play', x:238, y:196, w:44, h:21, dy:i});
const VENDOR_BOOTH_INTENT_KEY='market.demo.vendor-booth-intent.v1';
const VENDOR_EVENT_APPLICATIONS_KEY='market.demo.vendor-event-applications.v1';
const ZONE_LABELS={food:'餐饮区',drink:'饮品区',craft:'文创区',play:'互动区'};
let selectedVendorBooth=null;
let activeVendorEventId=null;
let vendorBoothIntent=loadVendorBoothIntent();
selectedVendorBooth=vendorBoothIntent?vendorBoothIntent.boothId:null;
function loadVendorBoothIntent(){
  try{
    const value=JSON.parse(localStorage.getItem(VENDOR_BOOTH_INTENT_KEY)||'null');
    return value&&typeof value.boothId==='string'&&BOOTHS.some(item=>item.id===value.boothId)?value:null;
  }catch(error){
    console.error('Unable to load saved vendor booth choice.',error);
    toast('无法读取已保存的选位意向');
    return null;
  }
}
function loadVendorEventApplications(){
  try{
    const value=JSON.parse(localStorage.getItem(VENDOR_EVENT_APPLICATIONS_KEY)||'[]');
    if(!Array.isArray(value)) throw new Error('Saved vendor event applications are not a list.');
    return value.filter(item=>item&&typeof item.eventName==='string'&&typeof item.eventId==='number');
  }catch(error){
    console.error('Unable to load vendor event applications.',error);
    toast('无法读取活动报名记录');
    return [];
  }
}
function vendorRecommendedZone(){
  const category=vendorDataProfile()?.category||'drink';
  return {food:'food',drink:'drink',craft:'craft',play:'play'}[category];
}
function boothKnownMerchant(boothId){
  return MERCHANTS[boothId]||SHOP_CATALOG.find(shop=>shop.id===boothId)||null;
}
function boothRecommendationScore(booth,zone){
  const sameZone=booth.zone===zone;
  const fromEntry=booth.y<=86;
  const rowNumber=Number(booth.id.slice(-2));
  return (sameZone?100:0)+(fromEntry?12:0)+Math.max(0,12-rowNumber);
}
function renderVendorBoothChoices(){
  const recommended=document.getElementById('vendorRecommendedBooths');
  const all=document.getElementById('vendorAllBooths');
  if(!recommended||!all) return;
  const zone=vendorRecommendedZone();
  const zoneLabel=ZONE_LABELS[zone];
  const preferred=BOOTHS.filter(booth=>booth.zone===zone&&!boothKnownMerchant(booth.id))
    .sort((a,b)=>boothRecommendationScore(b,zone)-boothRecommendationScore(a,zone));
  const candidates=preferred.length?preferred:BOOTHS.filter(booth=>booth.zone===zone);
  recommended.replaceChildren();
  candidates.slice(0,3).forEach((booth,index)=>{
    const row=document.createElement('div');
    row.className='li';
    const avatar=document.createElement('div');
    avatar.className='avatar';
    avatar.style.cssText='background:var(--primary-soft);color:var(--primary)';
    avatar.textContent=booth.id.slice(-2);
    const main=document.createElement('div');
    main.className='li-main';
    const title=document.createElement('div');
    title.className='li-title';
    title.textContent=booth.id+' · '+zoneLabel+(index===0?' · 优先建议':'');
    const detail=document.createElement('div');
    detail.className='li-sub';
    detail.textContent=(boothKnownMerchant(booth.id)?'地图目录有商户标记':'地图目录未标记商户')+' · 仅供参考，需管理员核实空位';
    main.append(title,detail);
    const button=document.createElement('button');
    button.type='button';
    button.className='btn ghost';
    button.style.cssText='width:auto;height:38px;padding:0 12px;font-size:12px';
    button.textContent=selectedVendorBooth===booth.id?'已选择':'选择';
    button.addEventListener('click',()=>selectVendorBooth(booth.id));
    row.append(avatar,main,button);
    recommended.appendChild(row);
  });
  all.replaceChildren();
  BOOTHS.forEach(booth=>{
    const known=boothKnownMerchant(booth.id);
    const button=document.createElement('button');
    button.type='button';
    button.className='btn '+(selectedVendorBooth===booth.id?'':'ghost');
    button.style.cssText='height:auto;min-height:68px;padding:8px 4px;display:flex;flex-direction:column;gap:4px;font-size:12px';
    button.setAttribute('aria-pressed',selectedVendorBooth===booth.id?'true':'false');
    const id=document.createElement('b');
    id.textContent=booth.id;
    const zoneText=document.createElement('span');
    zoneText.style.cssText='font-size:10px;font-weight:500;opacity:.8';
    zoneText.textContent=ZONE_LABELS[booth.zone]+(booth.zone===zone?' · 匹配品类':'');
    const status=document.createElement('span');
    status.style.cssText='font-size:9px;font-weight:500;opacity:.78';
    status.textContent=known?'已有商户标记':'状态待管理员确认';
    button.append(id,zoneText,status);
    button.addEventListener('click',()=>selectVendorBooth(booth.id));
    all.appendChild(button);
  });
  const label=document.getElementById('vendorSelectedBoothLabel');
  if(label) label.textContent=selectedVendorBooth
    ?selectedVendorBooth+' · '+ZONE_LABELS[BOOTHS.find(booth=>booth.id===selectedVendorBooth).zone]
    :'尚未选择';
  const advice=document.getElementById('vendorBoothAdvice');
  if(advice) advice.textContent='当前主营更适合'+zoneLabel+'，推荐摊位仅供参考；你也可从全部 '+BOOTHS.length+' 个场地图位置中自行选择。选择为意向，地图未标记不等于已确认空位，最终由管理员核实并分配。';
}
function selectVendorBooth(boothId){
  if(!BOOTHS.some(booth=>booth.id===boothId)){toast('找不到该场地摊位');return;}
  selectedVendorBooth=boothId;
  renderVendorBoothChoices();
  toast('已选择 '+boothId+'，提交后作为选位意向');
}
function submitVendorBoothPreference(){
  if(activePortal!=='ven'){toast('请从摊主端提交选位意向');return;}
  if(!selectedVendorBooth){toast('请先从推荐或全部场地中选择一个摊位');return;}
  const booth=BOOTHS.find(item=>item.id===selectedVendorBooth);
  const intent={boothId:booth.id,zone:booth.zone,vendorName:vendorCardState.name,submittedAt:Date.now(),status:'pending_review'};
  try{
    localStorage.setItem(VENDOR_BOOTH_INTENT_KEY,JSON.stringify(intent));
  }catch(error){
    console.error('Unable to save vendor booth preference.',error);
    toast('选位意向提交失败，请检查浏览器存储空间');
    return;
  }
  vendorBoothIntent=intent;
  toast('已提交 '+booth.id+' 选位意向，等待管理者核实空位与分配');
}
function isVendorSignupOpen(event){
  const today=new Date();
  today.setHours(0,0,0,0);
  return event.foot.includes('报名中')&&eventDate(event.startDate)>today&&eventDate(event.endDate)>=today;
}
function vendorEventRelevance(event){
  const zone=vendorRecommendedZone();
  const matchingTypes={
    drink:['美食市集'],
    food:['美食市集'],
    craft:['文创市集','艺术市集'],
    play:['艺术市集','节庆快闪']
  }[zone]||[];
  return event.types.filter(type=>matchingTypes.includes(type)).length;
}
function eligibleVendorEvents(){
  return EVENTS.filter(isVendorSignupOpen).sort((a,b)=>
    vendorEventRelevance(b)-vendorEventRelevance(a)||eventDate(a.startDate)-eventDate(b.startDate)
  );
}
function vendorDateRange(event){
  const date=value=>{
    const parsed=eventDate(value);
    return (parsed.getMonth()+1)+'.'+String(parsed.getDate()).padStart(2,'0');
  };
  return date(event.startDate)===date(event.endDate)?date(event.startDate):date(event.startDate)+'-'+date(event.endDate);
}
function renderVendorEventRow(event){
  const row=document.createElement('div');
  row.className='li';
  row.style.cursor='pointer';
  const avatar=document.createElement('div');
  avatar.className='avatar';
  avatar.style.cssText='background:var(--sky-soft);color:var(--sky2)';
  avatar.innerHTML='<svg width="20" height="20"><use href="#i-tent"/></svg>';
  const main=document.createElement('div');
  main.className='li-main';
  const title=document.createElement('div');
  title.className='li-title';
  title.textContent=event.name;
  const detail=document.createElement('div');
  detail.className='li-sub';
  detail.textContent=vendorDateRange(event)+' · '+event.city+' · '+event.foot.split('·')[1].trim();
  main.append(title,detail);
  const status=document.createElement('span');
  status.className='chip';
  status.style.cssText='background:var(--green-soft);color:var(--green)';
  status.textContent='报名中';
  row.append(avatar,main,status);
  row.addEventListener('click',()=>openVendorEvent(event));
  return row;
}
function renderVendorHomeEvents(){
  const list=document.getElementById('vendorHomeEvents');
  if(!list) return;
  const events=eligibleVendorEvents().slice(0,2);
  list.replaceChildren();
  if(!events.length){
    const empty=document.createElement('div');
    empty.className='empty';
    empty.textContent='当前没有日期未结束且明确开放报名的活动';
    list.appendChild(empty);
    return;
  }
  events.forEach(event=>list.appendChild(renderVendorEventRow(event)));
}
function renderVendorEvents(){
  const list=document.getElementById('vendorEventList');
  if(!list) return;
  const events=eligibleVendorEvents();
  const applications=loadVendorEventApplications();
  list.replaceChildren();
  if(!events.length){
    const empty=document.createElement('div');
    empty.className='empty';
    empty.textContent='当前活动目录中没有明确开放报名且尚未结束的活动，请稍后查看主办方更新';
    list.appendChild(empty);
    return;
  }
  events.forEach(event=>{
    const row=renderVendorEventRow(event);
    const applied=applications.some(item=>item.eventId===event.p);
    if(applied){
      const tag=document.createElement('span');
      tag.className='chip';
      tag.style.cssText='background:var(--primary-soft);color:var(--primary)';
      tag.textContent='已提交意向';
      row.replaceChild(tag,row.lastElementChild);
    }
    list.appendChild(row);
  });
}
function openVendorEvent(event){
  activeVendorEventId=event.p;
  show('ven-event-detail');
}
function renderVendorEventDetail(){
  const content=document.getElementById('vendorEventDetail');
  if(!content) return;
  const event=eligibleVendorEvents().find(item=>item.p===activeVendorEventId);
  if(!event){
    content.innerHTML='<div class="empty">该活动已结束或当前未开放报名，请返回列表查看仍可报名的活动</div>';
    return;
  }
  const applied=loadVendorEventApplications().some(item=>item.eventId===event.p);
  content.innerHTML=
    '<div class="card"><div class="row" style="justify-content:space-between"><b style="font-size:16px">'+escapeHTML(event.name)+'</b><span class="chip" style="background:var(--green-soft);color:var(--green)">报名中</span></div>'+
    '<div style="font-size:12px;color:var(--sub);line-height:1.9;margin-top:10px">'+escapeHTML(vendorDateRange(event)+' · '+event.time)+'<br>'+escapeHTML(event.loc)+'<br>'+escapeHTML(event.org)+'<br>'+escapeHTML(event.foot)+'</div>'+
    '<div class="ev-tags" style="margin-top:10px">'+event.tags.map(tag=>'<span class="chip" style="background:'+tag[1]+';color:'+tag[2]+'">'+escapeHTML(tag[0])+'</span>').join('')+'</div></div>'+
    '<div class="card" style="margin-top:12px;font-size:12px;color:var(--sub);line-height:1.8">活动资料来自当前平台活动目录。摊位名额、费用和审核结果以主办方发布的信息及最终确认为准；此处提交仅记录本地演示报名意向。</div>'+
    '<button class="btn" style="margin-top:14px" '+(applied?'disabled':'onclick="submitVendorEventApplication()"')+'>'+ (applied?'已提交报名意向':'提交报名意向')+'</button>';
}
function submitVendorEventApplication(){
  if(activePortal!=='ven'){toast('请从摊主端提交活动报名');return;}
  const event=eligibleVendorEvents().find(item=>item.p===activeVendorEventId);
  if(!event){toast('该活动已结束或报名已关闭');renderVendorEventDetail();return;}
  const applications=loadVendorEventApplications();
  if(applications.some(item=>item.eventId===event.p)){toast('已提交过该活动的报名意向');return;}
  applications.push({eventId:event.p,eventName:event.name,vendorName:vendorCardState.name,submittedAt:Date.now(),status:'pending_review'});
  try{
    localStorage.setItem(VENDOR_EVENT_APPLICATIONS_KEY,JSON.stringify(applications));
  }catch(error){
    console.error('Unable to save vendor event application.',error);
    toast('报名意向提交失败，请检查浏览器存储空间');
    return;
  }
  renderVendorEventDetail();
  renderVendorEvents();
  toast('已提交「'+event.name+'」报名意向，等待主办方确认');
}
const HOT = ['A-02','C-03','A-11','D-02','B-04'];
const MERCHANTS = {
  'A-02':{name:'炭火研究所',zone:'餐饮区',desc:'烤物 · 招牌炭烤牛肋条 · 需水电明火 · 信用 A 级 4.9 分',hot:true},
  'C-03':{name:'山野咖啡',zone:'饮品区',desc:'手冲咖啡 · 满 30 减 5 · 评分 4.8 · 距入口 80m',hot:true},
  'A-11':{name:'花屿甜品',zone:'餐饮区',desc:'烘焙甜品 · 季节限定桂花巴斯克 · 评分 4.7',hot:true},
  'B-04':{name:'拾光手作',zone:'文创区',desc:'皮具 DIY · 现场刻字定制 · 可预约体验',hot:true},
  'D-02':{name:'陶然居',zone:'互动区',desc:'陶艺体验 · 亲子友好 · 现场教学',hot:true},
};
const SHOP_CATALOG = [
  {id:'A-02',name:'炭火研究所',zone:'food',initial:'炭',avatar:'var(--orange-soft)',color:'var(--orange)',kind:'烤物',description:'招牌炭烤牛肋条 · 明火现烤',rating:4.9,distance:45,popularity:98,hot:true,couponId:null,products:[['炭烤牛肋条','¥38','招牌热销'],['烤物拼盘','¥58','人气套餐']]},
  {id:'C-03',name:'山野咖啡',zone:'drink',initial:'山',avatar:'var(--green-soft)',color:'var(--green)',kind:'手冲咖啡',description:'冷萃特调 · 云南庄园直供豆',rating:4.8,distance:80,popularity:92,hot:true,couponId:'coffee-5',products:[['冷萃特调','¥22','已售 300+'],['挂耳礼盒 10 包装','¥68','伴手礼']]},
  {id:'A-11',name:'花屿甜品',zone:'food',initial:'花',avatar:'var(--pink-soft)',color:'var(--pink)',kind:'烘焙甜品',description:'季节限定桂花巴斯克',rating:4.7,distance:120,popularity:85,hot:true,couponId:'dessert-85',products:[['桂花巴斯克','¥28','季节限定'],['甜品分享盒','¥48','今日推荐']]},
  {id:'B-04',name:'拾光手作',zone:'craft',initial:'拾',avatar:'var(--purple-soft)',color:'var(--purple)',kind:'皮具手作',description:'现场刻字定制 · 可体验 DIY',rating:4.6,distance:60,popularity:78,hot:true,couponId:'craft-10',products:[['皮具 DIY','¥68','现场体验'],['刻字定制','¥20','可预约']]},
  {id:'B-07',name:'墨白文创',zone:'craft',initial:'墨',avatar:'var(--primary-soft)',color:'var(--primary)',kind:'插画文创',description:'城市限定明信片 · 原创插画周边',rating:4.6,distance:110,popularity:72,hot:false,couponId:null,products:[['城市明信片','¥12','原创设计'],['插画周边','¥38','限量发售']]},
  {id:'C-01',name:'半颗柠檬',zone:'drink',initial:'柠',avatar:'var(--cyan-soft)',color:'var(--cyan)',kind:'果饮',description:'鲜果现榨 · 第二杯半价',rating:4.5,distance:100,popularity:68,hot:false,couponId:null,products:[['鲜果茶','¥16','鲜果现制'],['第二杯','5 折','活动优惠']]},
  {id:'D-02',name:'陶然居',zone:'play',initial:'陶',avatar:'var(--green-soft)',color:'var(--green)',kind:'陶艺体验',description:'亲子友好 · 现场教学',rating:4.5,distance:150,popularity:64,hot:false,couponId:null,products:[['陶艺体验','¥58','亲子友好'],['手作陶杯','¥88','含烧制']]}
];
const COUPONS = [
  {id:'coffee-5',shopId:'C-03',amount:'¥5',condition:'满 30 可用',title:'山野咖啡 · 全场通用',description:'摊位 C-03 · 限本场活动使用 · 仅剩 42 张',gradient:'linear-gradient(160deg,#F2814A,#F2A93B)'},
  {id:'dessert-85',shopId:'A-11',amount:'8.5',condition:'折',title:'花屿甜品 · 烘焙专享',description:'摊位 A-11 · 每人限领 1 张 · 今日有效',gradient:'linear-gradient(160deg,#F25C7F,#F2814A)'},
  {id:'craft-10',shopId:'B-04',amount:'¥10',condition:'满 60 可用',title:'拾光手作 · 皮具定制',description:'摊位 B-04 · 现场刻字服务同享',gradient:'linear-gradient(160deg,#8B6FF0,#4C7DF0)'}
];
const CONSUMER_PROFILE_KEY='market.consumer.demo-profile.v1';
const consumerState=loadConsumerState();
let activeConsumerShopId='C-03';
let shopSortKey='recommended';
let couponView='available';
function defaultConsumerState(){
  return {favorites:['C-03','B-04'],visited:[],preferredZones:[],ratings:{},reviews:[],coupons:[],usedCoupons:[]};
}
function loadConsumerState(){
  const initial=defaultConsumerState();
  try{
    const raw=localStorage.getItem(CONSUMER_PROFILE_KEY);
    if(!raw) return initial;
    const stored=JSON.parse(raw);
    return {
      favorites:Array.isArray(stored.favorites)?stored.favorites:initial.favorites,
      visited:Array.isArray(stored.visited)?stored.visited:[],
      preferredZones:Array.isArray(stored.preferredZones)?stored.preferredZones:[],
      ratings:stored.ratings&&typeof stored.ratings==='object'?stored.ratings:{},
      reviews:Array.isArray(stored.reviews)?stored.reviews.filter(review=>
        review&&typeof review.id==='string'&&typeof review.shopId==='string'
        &&Number.isInteger(review.rating)&&review.rating>=1&&review.rating<=5
        &&typeof review.comment==='string'
      ):[],
      coupons:Array.isArray(stored.coupons)?stored.coupons:[],
      usedCoupons:Array.isArray(stored.usedCoupons)?stored.usedCoupons:[]
    };
  }catch(error){
    console.error('Unable to load saved consumer preferences.',error);
    toast('无法读取已保存的个性化数据，已使用本地默认偏好');
    return initial;
  }
}
function saveConsumerState(){
  try{
    localStorage.setItem(CONSUMER_PROFILE_KEY,JSON.stringify(consumerState));
  }catch(error){
    console.error('Unable to save consumer preferences.',error);
    toast('个性化数据保存失败，请检查浏览器存储权限');
  }
}
function couponForShop(shopId){
  return COUPONS.find(coupon=>coupon.shopId===shopId&&consumerState.coupons.includes(coupon.id)&&!consumerState.usedCoupons.includes(coupon.id));
}
function personalizedScore(shop){
  const rating=getShopRating(shop);
  const sameZoneFavorites=SHOP_CATALOG.filter(item=>item.zone===shop.zone&&consumerState.favorites.includes(item.id)).length;
  return shop.popularity*0.35
    +(consumerState.favorites.includes(shop.id)?32:0)
    +(consumerState.visited.includes(shop.id)?14:0)
    +(consumerState.preferredZones.includes(shop.zone)?12:0)
    +sameZoneFavorites*5
    +rating*2
    +(couponForShop(shop.id)?4:0);
}
function getShopReviews(shopId){
  return consumerState.reviews.filter(review=>review.shopId===shopId);
}
function getShopRating(shop){
  const reviews=getShopReviews(shop.id);
  if(!reviews.length) return shop.rating;
  const historicalWeight=8;
  const reviewTotal=reviews.reduce((sum,review)=>sum+review.rating,0);
  return (shop.rating*historicalWeight+reviewTotal)/(historicalWeight+reviews.length);
}
function hotShopScore(shop){
  return shop.popularity
    +(consumerState.favorites.includes(shop.id)?8:0)
    +(consumerState.visited.includes(shop.id)?4:0)
    +(consumerState.preferredZones.includes(shop.zone)?2:0);
}
function openConsumerShop(shopId){
  const shop=SHOP_CATALOG.find(item=>item.id===shopId);
  if(!shop) return;
  activeConsumerShopId=shopId;
  if(!consumerState.visited.includes(shopId)) consumerState.visited.push(shopId);
  if(!consumerState.preferredZones.includes(shop.zone)) consumerState.preferredZones.push(shop.zone);
  saveConsumerState();
  renderConsumerProfile();
  renderConsumerStall(shop);
  go('con-stall');
}
function renderConsumerStall(shop){
  const zoneNames={food:'餐饮区',drink:'饮品区',craft:'文创区',play:'互动区'};
  document.getElementById('stallZone').textContent=zoneNames[shop.zone]+' · '+shop.id;
  document.getElementById('stallName').textContent=shop.name;
  document.getElementById('stallDescription').textContent=shop.description;
  const contact=document.getElementById('stallContact');
  if(contact){
    contact.textContent=shop.id==='C-03'&&vendorCardState.phone?'联系电话：'+vendorCardState.phone:'';
    contact.hidden=!contact.textContent;
  }
  const offer=document.getElementById('stallOffer');
  if(offer&&shop.id==='C-03'){
    offer.textContent=vendorCardState.offer||'暂无优惠';
    offer.style.display=vendorCardState.offer?'inline-flex':'none';
  }
  document.getElementById('stallRating').innerHTML='<svg width="11" height="11"><use href="#i-star-f"/></svg>'+getShopRating(shop).toFixed(1)+' · 消费者评分';
  document.getElementById('stallDistance').innerHTML='<svg width="11" height="11"><use href="#i-pin"/></svg>距你 '+shop.distance+'m';
  const favButton=document.getElementById('favBtn');
  const isFavorite=consumerState.favorites.includes(shop.id);
  favButton.innerHTML='<svg width="18" height="18" style="color:'+(isFavorite?'var(--pink)':'var(--ink)')+'"><use href="#i-heart'+(isFavorite?'-f':'')+'"/></svg>';
  const couponButton=document.querySelector('#con-stall .row button[onclick*=\"con-coupon\"]');
  if(couponButton) couponButton.innerHTML='<svg width=\"17\" height=\"17\"><use href=\"#i-ticket\"/></svg>'+(couponForShop(shop.id)?'查看我的券':'领券');
  const products=shop.products||[[shop.kind,'现场体验','主打商品'],[shop.description,'到摊咨询','特色服务']];
  const productCards=document.querySelectorAll('#con-stall .sec-title + div .card');
  productCards.forEach((card,index)=>{
    const item=products[index]||products[0];
    const name=card.querySelector('b');
    const details=card.querySelector('.row');
    if(name) name.textContent=item[0];
    if(details){
      const labels=details.querySelectorAll('b,span');
      if(labels[0]) labels[0].textContent=item[1];
      if(labels[1]) labels[1].textContent=item[2];
    }
  });
}
function renderConsumerProfile(){
  const count=document.getElementById('consumerFavoriteCount');
  const couponCount=document.getElementById('consumerCouponCount');
  const reviewCount=document.getElementById('consumerReviewCount');
  const summary=document.getElementById('consumerProfileSummary');
  const list=document.getElementById('consumerFavorites');
  if(count) count.textContent=consumerState.favorites.length;
  if(couponCount) couponCount.textContent=consumerState.coupons.filter(id=>!consumerState.usedCoupons.includes(id)).length;
  if(reviewCount) reviewCount.textContent=consumerState.reviews.length;
  if(summary) summary.textContent='已打卡 3 场市集 · 收藏 '+consumerState.favorites.length+' 个摊位';
  if(list){
    list.replaceChildren();
    consumerState.favorites.forEach(id=>{
      const shop=SHOP_CATALOG.find(item=>item.id===id);
      if(shop) list.appendChild(createShopRow(shop,'已收藏'));
    });
  }
}
function createEmptyReviews(message){
  const empty=document.createElement('div');
  empty.className='card';
  empty.style.cssText='text-align:center;color:var(--sub);font-size:12px';
  empty.textContent=message;
  return empty;
}
function createReviewCard(review,editable){
  const shop=SHOP_CATALOG.find(item=>item.id===review.shopId);
  const card=document.createElement('div');
  card.className='card';
  if(editable){
    card.style.cursor='pointer';
    card.setAttribute('role','button');
    card.tabIndex=0;
    const edit=()=>openReviewForm(review.shopId);
    card.addEventListener('click',edit);
    card.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();edit();}});
  }
  const head=document.createElement('div');
  head.className='row';
  head.style.justifyContent='space-between';
  const title=document.createElement('b');
  title.textContent=(shop?shop.name+' · '+shop.id:review.shopId)+' · '+review.rating+' 星';
  const date=document.createElement('span');
  date.className='chip';
  date.style.cssText='background:var(--amber-soft);color:var(--amber)';
  date.textContent=review.date||'已评价';
  head.append(title,date);
  card.appendChild(head);
  const comment=document.createElement('div');
  comment.style.cssText='font-size:12px;color:var(--sub);line-height:1.7;margin-top:8px;white-space:pre-wrap';
  comment.textContent=review.comment||'未填写文字评价';
  card.appendChild(comment);
  const tags=Array.isArray(review.tags)?review.tags.flat().filter(tag=>typeof tag==='string'):[];
  if(tags.length){
    const chips=document.createElement('div');
    chips.className='ev-tags';
    chips.style.marginTop='8px';
    tags.forEach(tag=>{
      const chip=document.createElement('span');
      chip.className='chip';
      chip.style.cssText='background:var(--sky-soft);color:var(--sky2)';
      chip.textContent=tag;
      chips.appendChild(chip);
    });
    card.appendChild(chips);
  }
  if(editable){
    const action=document.createElement('div');
    action.style.cssText='font-size:11px;color:var(--sky2);font-weight:700;margin-top:8px';
    action.textContent='点击修改评价 →';
    card.appendChild(action);
  }
  return card;
}
function renderConsumerReviews(){
  const list=document.getElementById('consumerReviewList');
  if(!list) return;
  list.replaceChildren();
  const reviews=consumerState.reviews.slice().reverse();
  if(!reviews.length){
    list.appendChild(createEmptyReviews('你还没有发表评价。可以从摊位详情进入评价页面。'));
    return;
  }
  reviews.forEach(review=>list.appendChild(createReviewCard(review,true)));
}
function renderVendorRating(){
  const shop=SHOP_CATALOG.find(item=>item.id==='C-03');
  if(!shop) return;
  const score=getShopRating(shop);
  const scoreText=score.toFixed(1);
  const homeRating=document.getElementById('venHomeRating');
  if(homeRating) homeRating.textContent=scoreText;
}
let vendorDataPeriod='current';
const VENDOR_DATA_PERIODS={
  current:{label:'本场评分',multiplier:1,ratingDelta:{drink:-0.2,food:0.1,craft:0,play:-0.1}},
  recent:{label:'近3场均分',multiplier:2.45,ratingDelta:{drink:0.1,food:-0.1,craft:0.2,play:0.1}},
  history:{label:'历史均分',multiplier:5.2,ratingDelta:{drink:-0.1,food:0.2,craft:-0.1,play:0.2}}
};
function vendorDataProfile(){
  const shop=SHOP_CATALOG.find(item=>item.id==='C-03');
  if(!shop) return null;
  const businessText=vendorCardState.products+' '+shop.kind+' '+vendorCardState.description;
  const category=/咖啡|饮品|果饮|茶|冷萃/i.test(businessText)?'drink':
    /甜品|烘焙|餐饮|烧烤|小吃/i.test(businessText)?'food':
      /文创|手作|皮具|定制|插画|明信片/i.test(businessText)?'craft':
        /陶艺|亲子|互动/i.test(businessText)?'play':'craft';
  const identity='C-03|'+vendorCardState.name+'|'+vendorCardState.products+'|'+vendorCardState.description;
  let fingerprint=0;
  for(let i=0;i<identity.length;i++) fingerprint=(fingerprint*31+identity.charCodeAt(i))>>>0;
  return {shop,category,fingerprint};
}
function vendorActivityRatings(profile,baseRating){
  const vendorShift=((profile.fingerprint%3)-1)*0.1;
  const ratings={};
  const used=new Set();
  Object.entries(VENDOR_DATA_PERIODS).forEach(([period,config])=>{
    const initial=baseRating+config.ratingDelta[profile.category]+vendorShift;
    let score=Math.max(1,Math.min(5,Math.round(initial*10)/10));
    if(used.has(score)){
      for(const adjustment of [0.1,-0.1,0.2,-0.2,0.3,-0.3,0.4,-0.4]){
        const candidate=Math.max(1,Math.min(5,Math.round((initial+adjustment)*10)/10));
        if(!used.has(candidate)){score=candidate;break;}
      }
    }
    ratings[period]=score;
    used.add(score);
  });
  return ratings;
}
function vendorActivityMetrics(period=vendorDataPeriod){
  const profile=vendorDataProfile();
  if(!profile) return null;
  const {shop,category,fingerprint}=profile;
  const periodConfig=VENDOR_DATA_PERIODS[period]||VENDOR_DATA_PERIODS.current;
  const viewsBase=({drink:1180,food:1420,craft:760,play:920})[category]+fingerprint%540;
  const viewRate=({drink:0.24,food:0.2,craft:0.16,play:0.19})[category]+(fingerprint%4)*0.01;
  const favoriteRate=({drink:0.22,food:0.2,craft:0.27,play:0.24})[category];
  const couponRate=vendorCardState.offer?({drink:0.34,food:0.29,craft:0.22,play:0.26})[category]:0;
  const multiplier=periodConfig.multiplier;
  const views=Math.round(viewsBase*multiplier);
  const cards=Math.round(views*viewRate);
  const favorites=Math.round(views*favoriteRate);
  const coupons=Math.round(favorites*couponRate);
  const exposure=Math.round(views*(2.05+(fingerprint%5)*0.08));
  const baseRating=getShopRating(shop);
  const rating=vendorActivityRatings(profile,baseRating)[period];
  return {profile,views,cards,favorites,coupons,exposure,rating};
}
function setVendorDataPeriod(button,period){
  if(!VENDOR_DATA_PERIODS[period]) return;
  vendorDataPeriod=period;
  document.querySelectorAll('#vendorDataPeriods .fchip').forEach(item=>item.classList.toggle('on',item===button));
  renderVendorData();
}
function renderVendorAdvice(metrics){
  const list=document.getElementById('vendorPlatformAdvice');
  if(!list||!metrics) return;
  const {category}=metrics.profile;
  const products=vendorCardState.products.split(/[·,，、]/).map(value=>value.trim()).filter(Boolean);
  const hero=products[0]||vendorCardState.name;
  const peak=({drink:'17:00-19:00',food:'11:30-13:30',craft:'15:00-17:00',play:'14:00-16:00'})[category];
  const advice=category==='drink'
    ? ['突出「'+hero+'」作为引流招牌','饮品高峰在 '+peak+'，可准备快捷取餐和组合加购']
    : category==='food'
      ? ['围绕「'+hero+'」设置高峰备货量','餐饮客流高峰约 '+peak+'，建议主推出餐快的套餐']
      : category==='play'
        ? ['把「'+hero+'」体验时长和适龄人群写进摊位介绍','亲子体验高峰约 '+peak+'，可设置预约场次避免排队']
        : ['将「'+hero+'」制作过程做成现场体验展示','文创停留高峰约 '+peak+'，可突出定制服务和成品案例'];
  if(!vendorCardState.offer) advice.unshift('名片尚未设置优惠，可为「'+hero+'」配置新客体验优惠');
  else if(metrics.coupons>0) advice.unshift('当前优惠「'+vendorCardState.offer+'」已有约 '+metrics.coupons.toLocaleString('zh-CN')+' 次领券，可对比核销表现调整门槛');
  if(metrics.rating<4.3) advice.push('当前范围评分 '+metrics.rating.toFixed(1)+'，建议优先跟进低分评价中的具体问题');
  list.replaceChildren();
  advice.slice(0,3).forEach((text,index)=>{
    const row=document.createElement('div');
    row.className='li';
    const avatar=document.createElement('div');
    avatar.className='avatar';
    avatar.style.cssText='background:var(--primary-soft);color:var(--primary)';
    avatar.innerHTML='<svg width="20" height="20"><use href="#i-spark"/></svg>';
    const main=document.createElement('div');
    main.className='li-main';
    const title=document.createElement('div');
    title.className='li-title';
    title.textContent=index===0?'针对 '+vendorCardState.name+' 的建议':'经营建议';
    const detail=document.createElement('div');
    detail.className='li-sub';
    detail.textContent=text;
    main.append(title,detail);
    row.append(avatar,main);
    list.appendChild(row);
  });
}
function renderVendorData(){
  const metrics=vendorActivityMetrics();
  if(!metrics) return;
  const labels={current:'本场活动',recent:'近 3 场',history:'全部历史'};
  const periodLabel=document.getElementById('vendorRatingPeriodLabel');
  if(periodLabel) periodLabel.textContent=VENDOR_DATA_PERIODS[vendorDataPeriod].label;
  document.querySelectorAll('#vendorDataPeriods .fchip').forEach(button=>button.classList.toggle('on',button.dataset.period===vendorDataPeriod));
  const shopLabel=document.getElementById('venDataShopLabel');
  if(shopLabel) shopLabel.textContent=vendorCardState.name+' · C-03 · '+labels[vendorDataPeriod];
  const values={vendorMetricViews:metrics.views,vendorMetricCards:metrics.cards,vendorMetricFavorites:metrics.favorites,vendorMetricCoupons:metrics.coupons};
  Object.entries(values).forEach(([id,value])=>{const el=document.getElementById(id);if(el) el.textContent=value.toLocaleString('zh-CN');});
  const funnel=[
    ['Exposure',metrics.exposure,100],
    ['Views',metrics.views,metrics.views/metrics.exposure*100],
    ['Favorites',metrics.favorites,metrics.favorites/metrics.exposure*100],
    ['Coupons',metrics.coupons,metrics.coupons/metrics.exposure*100]
  ];
  funnel.forEach(([key,value,width])=>{
    const id=String(key);
    const text=document.getElementById('vendorFunnel'+id);
    const bar=document.getElementById('vendorFunnel'+id+'Bar');
    if(text) text.textContent=Number(value).toLocaleString('zh-CN');
    if(bar) bar.style.width=Math.max(key==='Exposure'?100:4,Math.min(100,Number(width)))+'%';
  });
  renderVendorAdvice(metrics);
  renderVendorReviews();
}
function renderVendorReviews(){
  const shop=SHOP_CATALOG.find(item=>item.id==='C-03');
  const list=document.getElementById('venReviewList');
  if(!shop||!list) return;
  const reviews=getShopReviews(shop.id).slice().reverse();
  const count=document.getElementById('venReviewCount');
  const score=document.getElementById('venDataRating');
  const donut=document.getElementById('venRatingDonut');
  const sentiment=document.getElementById('venReviewSentiment');
  const activity=vendorActivityMetrics();
  const rating=activity?activity.rating:getShopRating(shop);
  if(count) count.textContent=reviews.length;
  if(score) score.textContent=rating.toFixed(1);
  if(donut) donut.style.background=`conic-gradient(var(--amber) 0 ${rating/5*100}%,var(--line) ${rating/5*100}% 100%)`;
  if(sentiment) sentiment.textContent=reviews.length?(rating>=4.5?'评价积极':rating>=3.5?'整体良好':'建议重点改进'):'期待你的评价';
  list.replaceChildren();
  if(!reviews.length){
    list.appendChild(createEmptyReviews('还没有消费者评价，收到的评价会显示在这里'));
    return;
  }
  reviews.forEach(review=>list.appendChild(createReviewCard(review,false)));
}
function createShopRow(shop,rankLabel){
  const row=document.createElement('div');
  row.className='li';
  row.style.cursor='pointer';
  row.setAttribute('role','button');
  row.tabIndex=0;
  const avatar=document.createElement('div');
  avatar.className='avatar';
  avatar.style.background=shop.avatar;
  avatar.style.color=shop.color;
  avatar.textContent=shop.initial;
  const main=document.createElement('div'); main.className='li-main';
  const title=document.createElement('div'); title.className='li-title'; title.textContent=shop.name+' · '+shop.id;
  const detail=document.createElement('div'); detail.className='li-sub';
  const coupon=couponForShop(shop.id);
  detail.textContent=shop.kind+' · '+shop.description+' · 距你 '+shop.distance+'m'+(coupon?' · 已有券':'');
  main.append(title,detail);
  const chip=document.createElement('span');
  chip.className='chip';
  chip.style.background=coupon?'var(--pink-soft)':'var(--amber-soft)';
  chip.style.color=coupon?'var(--pink)':'var(--amber)';
  chip.textContent=rankLabel||('★ '+getShopRating(shop).toFixed(1));
  row.append(avatar,main,chip);
  const activate=()=>openConsumerShop(shop.id);
  row.addEventListener('click',activate);
  row.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();activate();}});
  return row;
}
function renderHotStalls(){
  const box=document.getElementById('hotStalls');
  if(!box) return;
  box.replaceChildren();
  SHOP_CATALOG.filter(shop=>shop.hot)
    .sort((a,b)=>hotShopScore(b)-hotShopScore(a))
    .slice(0,3)
    .forEach((shop,index)=>box.appendChild(createShopRow(shop,index===0?'热门 · '+getShopRating(shop).toFixed(1):'★ '+getShopRating(shop).toFixed(1))));
}
function renderShopList(){
  const box=document.getElementById('shopList');
  if(!box) return;
  let shops=SHOP_CATALOG.slice();
  if(shopSortKey==='coupon') shops=shops.filter(shop=>couponForShop(shop.id));
  if(shopSortKey==='rating') shops.sort((a,b)=>getShopRating(b)-getShopRating(a)||personalizedScore(b)-personalizedScore(a));
  else if(shopSortKey==='distance') shops.sort((a,b)=>a.distance-b.distance||personalizedScore(b)-personalizedScore(a));
  else shops.sort((a,b)=>personalizedScore(b)-personalizedScore(a));
  box.replaceChildren();
  if(!shops.length){
    const empty=document.createElement('div');
    empty.className='empty';
    empty.innerHTML='<h4>还没有可用优惠券</h4><p>先去优惠券页面领取，拥有的券对应摊位才会出现在这里</p>';
    box.appendChild(empty);
    return;
  }
  shops.forEach((shop,index)=>{
    const label=shopSortKey==='recommended'?'为你推荐 · '+(index+1):shopSortKey==='coupon'?'我的券 · '+getShopRating(shop).toFixed(1):'★ '+getShopRating(shop).toFixed(1);
    box.appendChild(createShopRow(shop,label));
  });
}
function shopSort(btn,key){
  shopSortKey=key;
  document.querySelectorAll('#shopSort .fchip').forEach(chip=>chip.classList.toggle('on',chip===btn));
  renderShopList();
}
function couponTab(btn,key){
  couponView=key;
  document.querySelectorAll('#couponTabs .fchip').forEach(chip=>chip.classList.toggle('on',chip===btn));
  renderCouponList();
}
function renderCouponList(){
  const box=document.getElementById('couponList');
  if(!box) return;
  const owned=COUPONS.filter(coupon=>consumerState.coupons.includes(coupon.id)&&!consumerState.usedCoupons.includes(coupon.id));
  const available=COUPONS.filter(coupon=>!consumerState.coupons.includes(coupon.id)&&!consumerState.usedCoupons.includes(coupon.id));
  const used=COUPONS.filter(coupon=>consumerState.usedCoupons.includes(coupon.id));
  const tabs=document.querySelectorAll('#couponTabs .fchip');
  tabs[0].textContent='可领取 '+available.length;
  tabs[1].textContent='我的卡包 '+owned.length;
  tabs[2].textContent='已使用 '+used.length;
  const coupons=couponView==='wallet'?owned:couponView==='used'?used:available;
  box.replaceChildren();
  if(!coupons.length){
    const empty=document.createElement('div');
    empty.className='empty';
    empty.innerHTML=couponView==='wallet'
      ?'<h4>卡包里还没有优惠券</h4><p>领取优惠券后，有券的摊位才会出现在「有券」推荐中</p>'
      :couponView==='used'?'<h4>还没有使用过的优惠券</h4><p>使用过的优惠券会显示在这里</p>'
      :'<h4>当前没有可领取的优惠券</h4><p>新优惠券上架后会显示在这里</p>';
    box.appendChild(empty);
    return;
  }
  coupons.forEach(coupon=>{
    const card=document.createElement('div'); card.className='coupon';
    const left=document.createElement('div'); left.className='c-left'; left.style.background=coupon.gradient;
    const amount=document.createElement('b'); amount.textContent=coupon.amount;
    const condition=document.createElement('span'); condition.textContent=coupon.condition;
    left.append(amount,condition);
    const right=document.createElement('div'); right.className='c-right';
    const title=document.createElement('h4'); title.textContent=coupon.title;
    const desc=document.createElement('p'); desc.textContent=coupon.description;
    const button=document.createElement('button'); button.className='c-get';
    if(couponView==='wallet'){
      button.textContent='前往摊位';
      button.onclick=()=>openConsumerShop(coupon.shopId);
      const redeem=document.createElement('button');
      redeem.className='c-get';
      redeem.style.marginTop='6px';
      redeem.style.background='var(--green)';
      redeem.textContent='模拟核销';
      redeem.onclick=()=>useCoupon(coupon.id);
      right.append(title,desc,button,redeem);
    }else if(couponView==='used'){
      button.textContent='已使用';
      button.disabled=true;
      right.append(title,desc,button);
    }else{
      button.textContent='立即领取';
      button.onclick=()=>getCoupon(coupon.id);
      right.append(title,desc,button);
    }
    card.append(left,right); box.appendChild(card);
  });
}
function useCoupon(couponId){
  if(!consumerState.coupons.includes(couponId)||consumerState.usedCoupons.includes(couponId)) return;
  consumerState.usedCoupons.push(couponId);
  saveConsumerState();
  renderCouponList();
  renderShopList();
  renderHotStalls();
  renderConsumerProfile();
  toast('优惠券已核销，有券推荐已同步更新');
}

function mapBase(svg){
  const NS='http://www.w3.org/2000/svg';
  const el=(t,a)=>{const n=document.createElementNS(NS,t);for(const k in a)n.setAttribute(k,a[k]);return n;};
  svg.appendChild(el('rect',{x:4,y:4,width:352,height:260,rx:16,fill:'#F1F4FB'}));
  svg.appendChild(el('rect',{x:66,y:24,width:26,height:230,rx:8,fill:'#E3E9F6'}));
  svg.appendChild(el('rect',{x:196,y:24,width:38,height:230,rx:8,fill:'#E3E9F6'}));
  const t1=el('text',{x:79,y:140,'text-anchor':'middle','font-size':9,fill:'#9AA3BC',transform:'rotate(-90 79 140)'});
  t1.textContent='主 通 道'; svg.appendChild(t1);
  const t2=el('text',{x:215,y:140,'text-anchor':'middle','font-size':9,fill:'#9AA3BC',transform:'rotate(-90 215 140)'});
  t2.textContent='次 通 道'; svg.appendChild(t2);
  svg.appendChild(el('rect',{x:96,y:8,width:96,height:18,rx:7,fill:'#FBD3DD'}));
  const st=el('text',{x:144,y:20.5,'text-anchor':'middle','font-size':9.5,fill:'#E05A7E','font-weight':700});
  st.textContent='舞台 · 主视觉区'; svg.appendChild(st);
  svg.appendChild(el('rect',{x:290,y:196,width:62,height:58,rx:10,fill:'#E4EAF7'}));
  const rt=el('text',{x:321,y:228,'text-anchor':'middle','font-size':9.5,fill:'#7C86A3','font-weight':600});
  rt.textContent='休息区'; svg.appendChild(rt);
  svg.appendChild(el('rect',{x:96,y:246,width:44,height:14,rx:6,fill:'#4C7DF0'}));
  const en=el('text',{x:118,y:256,'text-anchor':'middle','font-size':9,fill:'#fff','font-weight':700}); en.textContent='入口'; svg.appendChild(en);
  svg.appendChild(el('rect',{x:148,y:246,width:44,height:14,rx:6,fill:'#9AA3BC'}));
  const ex=el('text',{x:170,y:256,'text-anchor':'middle','font-size':9,fill:'#fff','font-weight':700}); ex.textContent='出口'; svg.appendChild(ex);
  return el;
}
function renderMap(svgId, interactive){
  const svg = document.getElementById(svgId);
  if(!svg) return;
  const NS = 'http://www.w3.org/2000/svg';
  const el = mapBase(svg);
  BOOTHS.forEach(b=>{
    const z = ZONES[b.zone];
    const y = b.zone==='play' ? 196 + (parseInt(b.id.slice(2))-1)*26 : b.y;
    const g = el('g',{cursor:'pointer'});
    const r = el('rect',{x:b.x,y:y,width:b.w,height:b.h,rx:6,fill:z.fill,stroke:z.stroke,'stroke-width':1.2});
    g.appendChild(r);
    const tx = el('text',{x:b.x+b.w/2,y:y+14,'text-anchor':'middle','font-size':9,fill:'#4A4F63','font-weight':700});
    tx.textContent = b.id; g.appendChild(tx);
    if(HOT.includes(b.id)){
      const c = el('circle',{cx:b.x+b.w-4,cy:y+4,r:3.4,fill:'#F25C7F'});
      g.appendChild(c);
    }
    g.addEventListener('click',()=>openBooth(b, interactive));
    svg.appendChild(g);
  });
  const utils=[
    {x:66,y:40,t:'drop',c:'#38B6D9'},{x:66,y:200,t:'drop',c:'#38B6D9'},{x:196,y:70,t:'drop',c:'#38B6D9'},
    {x:66,y:100,t:'bolt',c:'#F2A93B'},{x:196,y:150,t:'bolt',c:'#F2A93B'},{x:290,y:34,t:'bolt',c:'#F2A93B'},
    {x:300,y:120,t:'shield',c:'#E85454'},{x:66,y:240,t:'shield',c:'#E85454'},
  ];
  utils.forEach(u=>{
    const g=el('g',{});
    g.appendChild(el('circle',{cx:u.x+13,cy:u.y,r:8,fill:'#fff',stroke:u.c,'stroke-width':1.4}));
    const use=el('use',{href:'#i-'+u.t});
    use.setAttribute('x',u.x+7.2); use.setAttribute('y',u.y-5.8);
    use.setAttribute('width',11.5); use.setAttribute('height',11.5);
    use.setAttribute('style','color:'+u.c);
    g.appendChild(use); svg.appendChild(g);
  });
}
renderMap('mapOrg', false);
renderMap('mapCon', true);
renderMap('mapEvt', false);

/* ================= 摊主视图地图：高亮我的摊位 C-03 + 到达路线 ================= */
(function(){
  const svg = document.getElementById('mapVen');
  if(!svg) return;
  const NS='http://www.w3.org/2000/svg';
  const el=(t,a)=>{const n=document.createElementNS(NS,t);for(const k in a)n.setAttribute(k,a[k]);return n;};
  mapBase(svg);
  BOOTHS.forEach(b=>{
    const z=ZONES[b.zone];
    const y = b.zone==='play' ? 196 + (parseInt(b.id.slice(2))-1)*26 : b.y;
    const mine = b.id==='C-03';
    const g = el('g',{});
    g.appendChild(el('rect',{x:b.x,y:y,width:b.w,height:b.h,rx:6,
      fill: mine?'#3EB97F':z.fill, stroke: mine?'#2E9E6C':z.stroke,'stroke-width': mine?2:1.2}));
    const t=el('text',{x:b.x+b.w/2,y:y+14,'text-anchor':'middle','font-size':9,
      fill: mine?'#fff':'#4A4F63','font-weight':700});
    t.textContent=b.id; g.appendChild(t);
    svg.appendChild(g);
  });
  // 到达路线：入口 → 主通道 → C-03
  const c3y = 34+2*26;
  svg.appendChild(el('path',{d:`M118 253 L118 ${c3y+10} L238 ${c3y+10} L255 ${c3y+10}`,
    fill:'none',stroke:'#3EB97F','stroke-width':3.6,'stroke-linecap':'round','stroke-dasharray':'1 7'}));
  const mk=el('g',{});
  mk.appendChild(el('circle',{cx:238+22,cy:c3y+10,r:9,fill:'#fff',stroke:'#3EB97F','stroke-width':2}));
  const u=el('use',{href:'#i-pin'}); u.setAttribute('x',238+17);u.setAttribute('y',c3y+5);u.setAttribute('width',10);u.setAttribute('height',10);u.setAttribute('style','color:#3EB97F');
  mk.appendChild(u); svg.appendChild(mk);
  const lb=el('text',{x:255,y:c3y-2,'font-size':8.5,fill:'#2E9E6C','font-weight':800});
  lb.textContent='我的摊位'; svg.appendChild(lb);
})();

/* ================= 消费者路线地图（同一场地 · 规划视图） ================= */
const ROUTES = {
  'A-02':{
    name:'炭火研究所',distance:55,minutes:1,approach:'沿主通道西侧前往',
    landmark:'经过餐饮区导览牌',turn:'向西进入 A 区餐饮摊位',
    sign:'沿橙色 A 区标识前行',altDistance:78,altMinutes:2,
    alternative:'舒适路线 · 经餐饮区外侧',altLandmark:'从入口外侧通道绕行',
    mainPath:'M118 253 L118 238 L80 238 L80 70 L40 70',
    alternativePath:'M118 253 L118 238 L96 238 L96 86 L40 70',
  },
  'C-03':{
    name:'山野咖啡',distance:80,minutes:2,approach:'经次通道前往饮品区',
    landmark:'经过文创区与次通道交会处',turn:'右转进入饮品区 C 列',
    sign:'沿蓝色 C 区标识前行',altDistance:108,altMinutes:3,
    alternative:'舒适路线 · 经东侧通道',altLandmark:'沿场地东侧通道避开交会点',
    mainPath:'M118 253 L118 238 L215 238 L215 96 L260 96',
    alternativePath:'M118 253 L118 238 L230 238 L230 96 L260 96',
  },
  'A-11':{
    name:'花屿甜品',distance:92,minutes:2,approach:'沿入口西侧通道前往甜品区',
    landmark:'经过餐饮区南侧导览牌',turn:'向西进入 A 区甜品摊位',
    sign:'沿橙色 A 区标识前行',altDistance:120,altMinutes:3,
    alternative:'舒适路线 · 经南侧通道',altLandmark:'从场地南侧通道绕行',
    target:{x:18,y:240,width:44,height:18},
    mainPath:'M118 253 L118 238 L40 238 L40 249',
    alternativePath:'M118 253 L118 238 L62 238 L62 249 L40 249',
  },
  'B-04':{
    name:'拾光手作',distance:70,minutes:2,approach:'沿主通道前往文创区',
    landmark:'经过主通道与文创区交会处',turn:'向西进入 B 区手作摊位',
    sign:'沿紫色 B 区标识前行',altDistance:96,altMinutes:3,
    alternative:'舒适路线 · 经文创区西侧',altLandmark:'沿文创区西侧步行通道前往',
    mainPath:'M118 253 L118 238 L215 238 L215 122 L192 122 L170 122',
    alternativePath:'M118 253 L118 238 L80 238 L80 122 L170 122',
  },
  'B-07':{
    name:'墨白文创',distance:88,minutes:2,approach:'沿次通道前往文创区',
    landmark:'经过文创区体验点',turn:'向西进入 B 区文创摊位',
    sign:'沿紫色 B 区标识前行',altDistance:112,altMinutes:3,
    alternative:'舒适路线 · 经文创区西侧',altLandmark:'沿文创区西侧步行通道前往',
    mainPath:'M118 253 L118 238 L196 238 L196 200 L170 200',
    alternativePath:'M118 253 L118 238 L80 238 L80 210 L170 200',
  },
  'C-01':{
    name:'半颗柠檬',distance:66,minutes:2,approach:'沿场地东侧通道前往饮品区',
    landmark:'经过舞台区东侧通道',turn:'向东进入 C 区饮品摊位',
    sign:'沿蓝色 C 区标识前行',altDistance:94,altMinutes:3,
    alternative:'舒适路线 · 经次通道',altLandmark:'从次通道东侧进入饮品区',
    mainPath:'M118 253 L118 238 L215 238 L215 44 L260 44',
    alternativePath:'M118 253 L118 238 L234 238 L234 44 L260 44',
  },
  'D-02':{
    name:'陶然居',distance:120,minutes:3,approach:'沿次通道前往互动区',
    landmark:'经过休息区外侧通道',turn:'向北进入 D 区互动摊位',
    sign:'沿绿色 D 区标识前行',altDistance:145,altMinutes:4,
    alternative:'舒适路线 · 经场地东侧',altLandmark:'沿东侧通道绕开休息区',
    mainPath:'M118 253 L118 238 L204 238 L204 232 L260 232',
    alternativePath:'M118 253 L118 238 L230 238 L230 232 L260 232',
  },
};
let activeRouteId='C-03';
let activeRouteVariant='main';
function drawRouteMap(bid,variant=activeRouteVariant){
  const svg = document.getElementById('mapRoute');
  if(!svg) return;
  svg.innerHTML='';
  const NS='http://www.w3.org/2000/svg';
  const el=(t,a)=>{const n=document.createElementNS(NS,t);for(const k in a)n.setAttribute(k,a[k]);return n;};
  mapBase(svg);
  const route=ROUTES[bid];
  const booth=BOOTHS.find(item=>item.id===bid);
  const target=route.target||(booth?{
    ...booth,
    y:booth.zone==='play'?196+(parseInt(booth.id.slice(2))-1)*26:booth.y,
  }:null);
  if(!target) return;
  const targetWidth=target.width||target.w;
  const targetHeight=target.height||target.h;
  const targetX=target.x+targetWidth/2;
  const targetY=target.y+targetHeight/2;
  BOOTHS.forEach(b=>{
    const z=ZONES[b.zone];
    const y = b.zone==='play' ? 196 + (parseInt(b.id.slice(2))-1)*26 : b.y;
    const isT = b.id===bid;
    const g=el('g',{});
    g.appendChild(el('rect',{x:b.x,y:y,width:b.w,height:b.h,rx:6,
      fill: isT?'#F25C7F':z.fill, stroke: isT?'#D6456C':z.stroke,'stroke-width': isT?2:1.2}));
    const t=el('text',{x:b.x+b.w/2,y:y+14,'text-anchor':'middle','font-size':9,fill: isT?'#fff':'#4A4F63','font-weight':700});
    t.textContent=b.id; g.appendChild(t);
    svg.appendChild(g);
  });
  if(route.target){
    svg.appendChild(el('rect',{x:route.target.x,y:route.target.y,width:targetWidth,height:targetHeight,rx:6,fill:'#F25C7F',stroke:'#D6456C','stroke-width':2}));
    const targetLabel=el('text',{x:targetX,y:targetY+3,'text-anchor':'middle','font-size':8.5,fill:'#fff','font-weight':700});
    targetLabel.textContent=bid; svg.appendChild(targetLabel);
  }
  const routeColor=variant==='main'?'#4C7DF0':'#38B6D9';
  svg.appendChild(el('path',{d:variant==='main'?route.mainPath:route.alternativePath,
    fill:'none',stroke:routeColor,'stroke-width':4,'stroke-linecap':'round','stroke-linejoin':'round','stroke-dasharray':'1 8'}));
  // 起点终点标记
  svg.appendChild(el('circle',{cx:118,cy:253,r:7,fill:'#4C7DF0',stroke:'#fff','stroke-width':2.4}));
  svg.appendChild(el('circle',{cx:targetX,cy:targetY,r:7,fill:'#F25C7F',stroke:'#fff','stroke-width':2.4}));
  const labelX=targetX>280?targetX-10:targetX+10;
  const lb=el('text',{x:labelX,y:targetY+3,'text-anchor':targetX>280?'end':'start','font-size':8.5,fill:'#D6456C','font-weight':800});
  lb.textContent=route.name; svg.appendChild(lb);
}
function renderRouteTargets(){
  const segment=document.getElementById('routeSeg');
  if(!segment) return;
  segment.replaceChildren();
  SHOP_CATALOG.forEach(shop=>{
    const button=document.createElement('button');
    button.type='button';
    button.textContent=shop.id+' '+shop.name;
    button.classList.toggle('on',shop.id===activeRouteId);
    button.addEventListener('click',()=>pickRoute(button,shop.id,shop.name));
    segment.appendChild(button);
  });
}
function renderRouteDetails(){
  const route=ROUTES[activeRouteId];
  const isMain=activeRouteVariant==='main';
  document.getElementById('routeMain').textContent=isMain?'推荐 · '+route.approach:route.alternative;
  document.getElementById('routeSub').textContent=(isMain?route.distance:route.altDistance)+' 米 · 约 '+(isMain?route.minutes:route.altMinutes)+' 分钟 · '+(isMain?route.landmark:route.altLandmark);
  document.getElementById('alternativeRouteMain').textContent=route.alternative;
  document.getElementById('alternativeRouteSub').textContent=route.altDistance+' 米 · 约 '+route.altMinutes+' 分钟 · '+route.altLandmark;
  document.getElementById('recommendedRoute').classList.toggle('route-selected',isMain);
  document.getElementById('alternativeRoute').classList.toggle('route-selected',!isMain);
  document.getElementById('routeLegendLine').style.background=isMain?'var(--primary)':'var(--cyan)';
  const titles=document.querySelectorAll('#routeSteps .tl-item .tl-t');
  const subs=document.querySelectorAll('#routeSteps .tl-item .tl-s');
  if(titles[1]) titles[1].textContent=isMain?route.approach:route.alternative;
  if(subs[1]) subs[1].textContent=isMain?route.landmark:route.altLandmark;
  if(titles[2]) titles[2].textContent=isMain?route.turn:'沿绕行通道继续前进';
  if(subs[2]) subs[2].textContent=route.sign;
  if(subs[3]) subs[3].textContent=activeRouteId+' · '+route.name;
  drawRouteMap(activeRouteId);
}
function pickRoute(btn,bid,mname){
  if(!ROUTES[bid]){toast('暂未收录该摊位的路线信息');return;}
  activeRouteId=bid;
  activeRouteVariant='main';
  document.querySelectorAll('#routeSeg button').forEach(button=>button.classList.toggle('on',button===btn));
  renderRouteDetails();
  toast('已切换目标摊位：'+bid+' · '+mname+'，路线已重新规划');
}
function selectRouteVariant(variant){
  if(variant!=='main'&&variant!=='alternative') return;
  activeRouteVariant=variant;
  renderRouteDetails();
  toast(variant==='main'?'已切换至推荐路线':'已切换至舒适路线');
}
function startConsumerNavigation(){
  const route=ROUTES[activeRouteId];
  const minutes=activeRouteVariant==='main'?route.minutes:route.altMinutes;
  toast('导航已开始 · 步行约 '+minutes+' 分钟前往'+route.name+' · 到达后将提醒你打卡');
}
function openConsumerRoute(shopId=activeConsumerShopId){
  if(!ROUTES[shopId]){toast('暂未收录该摊位的路线信息');return;}
  show('con-route');
  const button=document.querySelector('#routeSeg button:nth-child('+(SHOP_CATALOG.findIndex(shop=>shop.id===shopId)+1)+')');
  pickRoute(button,shopId,ROUTES[shopId].name);
}
renderRouteTargets();
renderRouteDetails();

/* ================= 分配地图（待分配高亮） ================= */
(function(){
  const svg = document.getElementById('mapAssign');
  if(!svg) return;
  const NS='http://www.w3.org/2000/svg';
  const el=(t,a)=>{const n=document.createElementNS(NS,t);for(const k in a)n.setAttribute(k,a[k]);return n;};
  mapBase(svg);
  const pending = {'A-02':'炭火研究所','C-01':'半颗柠檬','A-11':'花屿甜品','D-02':'陶然居'};
  BOOTHS.forEach(b=>{
    const z=ZONES[b.zone];
    const y = b.zone==='play' ? 196 + (parseInt(b.id.slice(2))-1)*26 : b.y;
    const isP = pending[b.id];
    const g=el('g',{});
    g.appendChild(el('rect',{x:b.x,y:y,width:b.w,height:b.h,rx:6,
      fill: isP?'#fff':z.fill, stroke: isP?'#F25C7F':z.stroke,'stroke-width': isP?1.8:1.2,'stroke-dasharray':isP?'4 3':'none'}));
    const t=el('text',{x:b.x+b.w/2,y:y+14,'text-anchor':'middle','font-size':9,fill: isP?'#D6456C':'#4A4F63','font-weight':700});
    t.textContent=b.id; g.appendChild(t);
    if(isP){
      const c=el('circle',{cx:b.x+6,cy:y+5,r:3.2,fill:'#F25C7F'});
      c.innerHTML='<animate attributeName="opacity" values="1;.3;1" dur="1.4s" repeatCount="indefinite"/>';
      g.appendChild(c);
    }
    svg.appendChild(g);
  });
})();

/* ================= Booth sheet ================= */
function openBooth(b, consumerMode){
  if(consumerMode) activeConsumerShopId=b.id;
  const m = MERCHANTS[b.id] || {name:'待招商摊位', zone:ZONES[b.zone].label, desc:'3m × 3m 标准摊位 · 水电条件以现场为准 · 可向主办方咨询'};
  document.getElementById('bsName').textContent = b.id + ' · ' + m.name;
  const zc = document.getElementById('bsZone'); zc.textContent = m.zone;
  document.getElementById('bsInfo').textContent = m.desc;
  const tags = document.getElementById('bsTags'); tags.innerHTML='';
  const tagList = m.hot ? ['高热摊位','通水通电','主通道沿线'] : ['标准摊位'];
  tagList.forEach(t=>{
    const s=document.createElement('span'); s.className='chip';
    s.style.background='var(--bg)'; s.style.color='#565C73'; s.textContent=t; tags.appendChild(s);
  });
  const btn = document.getElementById('bsBtn');
  if(consumerMode){ btn.textContent='查看商户详情'; btn.onclick=()=>{closeSheet(); go('con-stall');}; }
  else { btn.textContent='查看摊位档案'; btn.onclick=()=>{closeSheet(); toast('摊位档案：编号/商户/水电/费用一屏总览');}; }
  document.getElementById('sheetMask').classList.add('show');
  document.getElementById('boothSheet').classList.add('show');
}
function closeSheet(){
  document.getElementById('sheetMask').classList.remove('show');
  document.getElementById('boothSheet').classList.remove('show');
  document.getElementById('paySheet').classList.remove('show');
}

/* ================= Scheme switch ================= */
const SCHEMES = {
  safe:  {name:'安全优先型方案', risk:'拥堵风险 · 低',  rc:'var(--green)',  rb:'var(--green-soft)',  desc:'主通道加宽至 4 米，高热餐饮摊位分散布局，消防通道全程留空，应急点覆盖全场。'},
  profit:{name:'收益优先型方案', risk:'收益预估 · 高',  rc:'var(--amber)',  rb:'var(--amber-soft)',  desc:'高热业态集中于主通道两侧黄金位，餐饮区靠近入口引流，坪效预估提升 22%。'},
  exp:   {name:'体验优先型方案', risk:'体验评分 · 优',  rc:'var(--purple)', rb:'var(--purple-soft)', desc:'以舞台为场地核心，摊位沿环游动线加密布置，并设置多处打卡点，减少折返、延长逛集体验。'},
};
function pickScheme(btn){
  document.querySelectorAll('.fchip[data-scheme]').forEach(c=>c.classList.remove('on'));
  btn.classList.add('on');
  const s = SCHEMES[btn.dataset.scheme];
  document.getElementById('schemeName').textContent = s.name;
  const r = document.getElementById('schemeRisk'); r.textContent = s.risk;
  r.style.color = s.rc; r.style.background = s.rb;
  document.getElementById('schemeDesc').textContent = s.desc;
  renderOrgMap(btn.dataset.scheme);
  toast('已切换至「'+s.name+'」，布局图与推演结果已更新');
}

/* ================= Org scheme maps ================= */
const HOTSET = {
  safe: HOT,
  profit: ['A-04','A-05','C-04','C-05','C-06','C-11','C-12','B-07'],
  exp: ['A-03','B-03','C-02'],
};
function renderOrgMap(key){
  const svg = document.getElementById('mapOrg'); if(!svg) return;
  svg.innerHTML = '';
  if(key === 'safe'){ renderMap('mapOrg', false); return; }
  const NS = 'http://www.w3.org/2000/svg';
  const el = (t,a)=>{const n=document.createElementNS(NS,t);for(const k in a)n.setAttribute(k,a[k]);return n;};
  const txt = (x,y,s,size,fill,anchor,weight)=>{
    const t = el('text',{x,y,'text-anchor':anchor||'middle','font-size':size,fill,'font-weight':weight||700});
    t.textContent = s; svg.appendChild(t); return t;
  };
  const booth = (id,zone,x,y,w,h)=>{
    const z = ZONES[zone];
    const g = el('g',{});
    g.appendChild(el('rect',{x,y,width:w,height:h,rx:6,fill:z.fill,stroke:z.stroke,'stroke-width':1.2}));
    const t = el('text',{x:x+w/2,y:y+h/2+3.4,'text-anchor':'middle','font-size':8.6,fill:'#4A4F63','font-weight':700});
    t.textContent = id; g.appendChild(t);
    if(HOTSET[key].includes(id)) g.appendChild(el('circle',{cx:x+w-4,cy:y+4,r:3.4,fill:'#F25C7F'}));
    svg.appendChild(g);
  };
  const util = (x,y,t,c)=>{
    const g = el('g',{});
    g.appendChild(el('circle',{cx:x,cy:y,r:8,fill:'#fff',stroke:c,'stroke-width':1.4}));
    const u = el('use',{href:'#i-'+t});
    u.setAttribute('x',x-5.8); u.setAttribute('y',y-5.8);
    u.setAttribute('width',11.5); u.setAttribute('height',11.5);
    u.setAttribute('style','color:'+c);
    g.appendChild(u); svg.appendChild(g);
  };
  svg.appendChild(el('rect',{x:4,y:4,width:352,height:260,rx:16,fill:'#F1F4FB'}));

  if(key === 'profit'){
    svg.appendChild(el('rect',{x:272,y:8,width:80,height:16,rx:7,fill:'#FBD3DD'}));
    txt(312,19.5,'舞台',9,'#E05A7E');
    svg.appendChild(el('rect',{x:150,y:246,width:60,height:14,rx:6,fill:'#4C7DF0'})); txt(180,256,'入口',9,'#fff');
    svg.appendChild(el('rect',{x:96,y:246,width:44,height:14,rx:6,fill:'#9AA3BC'})); txt(118,256,'出口',9,'#fff');
    svg.appendChild(el('rect',{x:118,y:24,width:16,height:218,rx:6,fill:'#E3E9F6'}));
    const mt = txt(126,140,'主通道·黄金位',8.5,'#9AA3BC'); mt.setAttribute('transform','rotate(-90 126 140)');
    svg.appendChild(el('rect',{x:254,y:24,width:12,height:218,rx:6,fill:'#E3E9F6'}));
    svg.appendChild(el('rect',{x:8,y:150,width:344,height:14,rx:6,fill:'#E3E9F6'}));
    txt(180,160,'次 通 道',8.5,'#9AA3BC');
    txt(14,26,'餐饮区',8.5,'#C78A4B','start');
    for(let i=0;i<5;i++){
      booth('A-'+String(i+1).padStart(2,'0'),'food',14,32+i*23,44,19);
      booth('A-'+String(i+6).padStart(2,'0'),'food',64,32+i*23,44,19);
    }
    txt(14,176,'文创区',8.5,'#8F77D8','start');
    for(let i=0;i<3;i++){
      booth('B-'+String(i+1).padStart(2,'0'),'craft',14,182+i*21,44,18);
      booth('B-'+String(i+4).padStart(2,'0'),'craft',64,182+i*21,44,18);
    }
    txt(142,26,'饮品区 · 黄金位',8.5,'#5B84D6','start');
    for(let i=0;i<5;i++){
      booth('C-'+String(i+1).padStart(2,'0'),'drink',142,32+i*23,46,19);
      booth('C-'+String(i+6).padStart(2,'0'),'drink',196,32+i*23,46,19);
    }
    txt(142,176,'文创区',8.5,'#8F77D8','start');
    for(let i=0;i<3;i++){
      booth('B-'+String(i+7).padStart(2,'0'),'craft',142,182+i*21,46,18);
      booth('B-'+String(i+10).padStart(2,'0'),'craft',196,182+i*21,46,18);
    }
    txt(272,26,'互动区',8.5,'#4FA673','start');
    for(let i=0;i<4;i++) booth('D-'+String(i+1).padStart(2,'0'),'play',272,32+i*25,76,20);
    txt(272,176,'入口黄金摊位',8.5,'#D6456C','start');
    for(let i=0;i<3;i++) booth('C-'+(11+i),'drink',272,182+i*21,76,18);
    util(126,32,'bolt','#F2A93B'); util(126,236,'drop','#38B6D9');
    util(260,60,'drop','#38B6D9'); util(260,196,'bolt','#F2A93B');
    util(330,256,'shield','#E85454'); util(30,256,'shield','#E85454');
  } else {
    svg.appendChild(el('rect',{x:130,y:10,width:100,height:18,rx:7,fill:'#FBD3DD'}));
    txt(180,23,'舞台 · 主视觉区',9,'#E05A7E');
    svg.appendChild(el('ellipse',{cx:180,cy:142,rx:118,ry:86,fill:'none',stroke:'#DFE6F4','stroke-width':14}));
    svg.appendChild(el('ellipse',{cx:180,cy:142,rx:118,ry:86,fill:'none',stroke:'#fff','stroke-width':1.6,'stroke-dasharray':'5 9'}));
    [[180,56,0],[298,142,90],[180,228,180],[62,142,270]].forEach(a=>{
      svg.appendChild(el('polygon',{points:'0,-5 9,0 0,5',fill:'#8FA3CF',transform:'translate('+a[0]+' '+a[1]+') rotate('+a[2]+')'}));
    });
    svg.appendChild(el('circle',{cx:180,cy:142,r:52,fill:'#E4EAF7'}));
    txt(180,137,'舞台',10.5,'#5B6B8C');
    txt(180,151,'休息 · 打卡 · 演出',8.5,'#8B91A7','middle',600);
    [[110,102],[250,102],[180,196]].forEach(s=>{
      const g = el('g',{});
      g.appendChild(el('circle',{cx:s[0],cy:s[1],r:9,fill:'#fff',stroke:'#F2A93B','stroke-width':1.6}));
      const u = el('use',{href:'#i-star-f'});
      u.setAttribute('x',s[0]-6); u.setAttribute('y',s[1]-6);
      u.setAttribute('width',12); u.setAttribute('height',12);
      u.setAttribute('style','color:#F2A93B');
      g.appendChild(u); svg.appendChild(g);
    });
    svg.appendChild(el('rect',{x:286,y:240,width:60,height:14,rx:6,fill:'#4C7DF0'})); txt(316,250,'入口',9,'#fff');
    svg.appendChild(el('rect',{x:14,y:240,width:44,height:14,rx:6,fill:'#9AA3BC'})); txt(36,250,'出口',9,'#fff');
    txt(180,262,'单向环游动线 · 减少折返',8,'#9AA3BC','middle',600);
    txt(40,30,'文创区',8.5,'#8F77D8','start');
    for(let i=0;i<7;i++) booth('B-'+String(i+1).padStart(2,'0'),'craft',40+i*40,36,34,15);
    txt(308,62,'饮品区',8.5,'#5B84D6','start');
    for(let i=0;i<6;i++) booth('C-'+String(i+1).padStart(2,'0'),'drink',312,70+i*26,36,20);
    txt(180,230,'餐饮区',8.5,'#C78A4B');
    for(let i=0;i<7;i++) booth('A-'+String(i+1).padStart(2,'0'),'food',60+i*32,234,29,16);
    txt(12,68,'互动区',8.5,'#4FA673','start');
    for(let i=0;i<4;i++) booth('D-'+String(i+1).padStart(2,'0'),'play',12,78+i*40,36,24);
    util(26,212,'drop','#38B6D9'); util(340,48,'bolt','#F2A93B'); util(340,212,'shield','#E85454');
  }
}

/* ================= Consumer zone map ================= */
const ZONE_INFO = {
  food:  {name:'餐饮区 · A 区', desc:'烤物 / 烘焙 / 轻食 · 明火摊位集中管理'},
  drink: {name:'饮品区 · C 区', desc:'咖啡 / 果饮 / 特调 · 第二杯半价专场'},
  craft: {name:'文创区 · B 区', desc:'手作 / 插画 / 皮具 · 可现场体验'},
  play:  {name:'互动区 · D 区', desc:'陶艺 / 游戏 / 打卡 · 亲子友好'},
};
let curZone = 'food';
function goZone(z){ curZone = z; go('con-zone'); renderZone(); }
function switchZone(btn){ curZone = btn.dataset.zone; renderZone(); }
function renderZone(){
  document.querySelectorAll('#zoneChips .fchip').forEach(c=>c.classList.toggle('on', c.dataset.zone===curZone));
  const list = BOOTHS.filter(b=>b.zone===curZone);
  const info = ZONE_INFO[curZone];
  document.getElementById('zoneName').textContent = info.name;
  document.getElementById('zoneDesc').textContent = info.desc;
  document.getElementById('zoneCount').textContent = list.length;
  renderZoneMap(list);
  renderZoneList(list);
}
function renderZoneMap(list){
  const svg = document.getElementById('mapZone'); if(!svg) return;
  svg.innerHTML = '';
  const NS = 'http://www.w3.org/2000/svg';
  const el = (t,a)=>{const n=document.createElementNS(NS,t);for(const k in a)n.setAttribute(k,a[k]);return n;};
  const z = ZONES[curZone];
  const cols = list.length > 9 ? 4 : 3;
  const bw = cols === 4 ? 74 : 96, bh = cols === 4 ? 40 : 46;
  const gx = cols === 4 ? 80 : 112, gy = cols === 4 ? 50 : 62;
  const x0 = cols === 4 ? 22 : 26;
  const rows = Math.ceil(list.length/cols);
  const mapH = 34 + (rows-1)*gy + bh;
  svg.appendChild(el('rect',{x:4,y:4,width:352,height:312,rx:16,fill:'#F1F4FB'}));
  svg.appendChild(el('rect',{x:14,y:14,width:332,height:Math.max(mapH+18,120),rx:14,fill:z.fill,opacity:.26}));
  for(let c=1;c<cols;c++){
    svg.appendChild(el('line',{x1:x0+c*gx-gx+bw+(gx-bw)/2,y1:22,x2:x0+c*gx-gx+bw+(gx-bw)/2,y2:mapH+8,stroke:'#B9C6E8','stroke-width':1.4,'stroke-dasharray':'4 6'}));
  }
  list.forEach((b,i)=>{
    const col = i%cols, row = Math.floor(i/cols);
    const x = x0+col*gx, y = 34+row*gy;
    const g = el('g',{cursor:'pointer'});
    g.appendChild(el('rect',{x,y,width:bw,height:bh,rx:10,fill:z.fill,stroke:z.stroke,'stroke-width':1.6}));
    const t1 = el('text',{x:x+bw/2,y:y+bh/2-2,'text-anchor':'middle','font-size':cols===4?9.5:11,fill:'#3A3F52','font-weight':800});
    t1.textContent = b.id; g.appendChild(t1);
    const m = MERCHANTS[b.id];
    const t2 = el('text',{x:x+bw/2,y:y+bh/2+12,'text-anchor':'middle','font-size':cols===4?7.5:8.5,fill:'#6B7288','font-weight':600});
    t2.textContent = m ? m.name : '待招商'; g.appendChild(t2);
    if(HOT.includes(b.id)) g.appendChild(el('circle',{cx:x+bw-8,cy:y+8,r:4,fill:'#F25C7F'}));
    g.addEventListener('click',()=>openBooth(b,true));
    svg.appendChild(g);
  });
  svg.appendChild(el('rect',{x:140,y:288,width:80,height:16,rx:7,fill:'#4C7DF0'}));
  const en = el('text',{x:180,y:299.5,'text-anchor':'middle','font-size':9,fill:'#fff','font-weight':700});
  en.textContent = '区域入口'; svg.appendChild(en);
}
function renderZoneList(list){
  const box = document.getElementById('zoneList'); box.innerHTML = '';
  list.forEach(b=>{
    const m = MERCHANTS[b.id];
    const z = ZONES[b.zone];
    const hot = HOT.includes(b.id);
    const d = document.createElement('div');
    d.className = 'li';
    d.onclick = ()=>SHOP_CATALOG.some(shop=>shop.id===b.id) ? openConsumerShop(b.id) : go('con-stall');
    d.innerHTML = '<div class="avatar" style="background:'+z.fill+';color:#4A4F63">'+b.id.split('-')[0]+'</div>'
      + '<div class="li-main"><div class="li-title">'+(m ? m.name+' · '+b.id : b.id+' · 待招商摊位')+'</div>'
      + '<div class="li-sub">'+(m ? m.desc : '3m × 3m 标准摊位 · 可向主办方咨询')+'</div></div>'
      + '<span class="chip" style="background:'+(hot?'var(--red-soft)':'var(--bg)')+';color:'+(hot?'var(--red)':'#8B91A7')+'">'+(hot?'高热':'可逛')+'</span>';
    box.appendChild(d);
  });
}

/* ================= Consumer scan ================= */
let scanTimer;
function openScan(){
  go('con-scan');
  clearTimeout(scanTimer);
  scanTimer = setTimeout(scanOk, 3400);
}
function scanOk(){
  clearTimeout(scanTimer);
  if(current !== 'con-scan') return;
  toast('识别成功：山野咖啡 · C-03');
  setTimeout(()=>{ if(current==='con-scan') go('con-stall'); }, 650);
}

/* ================= Vendor voucher / pay flow ================= */
const PAYMENT_RECORDS_KEY='market.demo.payment-records.v1';
function loadPaymentRecords(){
  const raw=localStorage.getItem(PAYMENT_RECORDS_KEY);
  if(!raw) return [];
  const records=JSON.parse(raw);
  if(!Array.isArray(records)||records.some(record=>
    !record||typeof record.id!=='string'||record.boothId!=='C-03'
    ||!Number.isFinite(record.amount)||record.amount<=0
    ||!['pending','approved','rejected'].includes(record.status)
  )) throw new Error('Saved payment records are invalid.');
  return records;
}
function savePaymentRecords(records){
  try{
    localStorage.setItem(PAYMENT_RECORDS_KEY,JSON.stringify(records));
  }catch(error){
    console.error('Unable to save payment records.',error);
    toast('付款凭证保存失败，请检查浏览器存储权限');
    return false;
  }
  return true;
}
function latestVendorPayment(records=loadPaymentRecords()){
  return records.filter(record=>record.boothId==='C-03').sort((a,b)=>b.createdAt-a.createdAt)[0]||null;
}
function syncPaymentNotifications(records){
  const reviewedAtStatus=(record,role)=>{
    const current=NOTICE_FEEDS[role].find(notice=>notice.paymentRecordId===record.id);
    if(current&&current.paymentStatus===record.status) return current;
    const approved=record.status==='approved';
    const rejected=record.status==='rejected';
    return {
      paymentRecordId:record.id,
      paymentStatus:record.status,
      category:role==='org'?'财务':'费用',
      title:role==='org'
        ?`${record.vendorName} · ${record.boothId} 水电费待核验`
        :approved?'水电费缴费已核验':rejected?'水电费凭证已退回':'水电费付款凭证已提交',
      detail:role==='org'
        ?`${record.method} · ¥${record.amount.toFixed(2)} · 摊主已提交付款凭证`
        :`${record.method} · ¥${record.amount.toFixed(2)} · ${paymentStatusLabel(record.status)}`,
      icon:'i-wallet',
      color:role==='org'||record.status==='pending'?'var(--amber)':approved?'var(--green)':'var(--red)',
      bg:role==='org'||record.status==='pending'?'var(--amber-soft)':approved?'var(--green-soft)':'var(--red-soft)',
      destination:role==='org'?'org-fee':'ven-voucher',
      unread:true
    };
  };
  const pendingIds=new Set(records.filter(record=>record.status==='pending').map(record=>record.id));
  const allIds=new Set(records.map(record=>record.id));
  const hasPaymentHistory=records.length>0;
  NOTICE_FEEDS.org=NOTICE_FEEDS.org.filter(notice=>!notice.paymentRecordId||pendingIds.has(notice.paymentRecordId));
  NOTICE_FEEDS.ven=NOTICE_FEEDS.ven.filter(notice=>
    (!hasPaymentHistory||notice.title!=='水电费 ¥40 待缴纳')
    &&(!notice.paymentRecordId||allIds.has(notice.paymentRecordId))
  );
  records.forEach(record=>{
    if(record.status==='pending'){
      const existing=reviewedAtStatus(record,'org');
      NOTICE_FEEDS.org.unshift(existing);
    }
    NOTICE_FEEDS.ven.unshift(reviewedAtStatus(record,'ven'));
  });
  for(const role of ['org','ven']){
    const seen=new Set();
    NOTICE_FEEDS[role]=NOTICE_FEEDS[role].filter(notice=>{
      if(!notice.paymentRecordId) return true;
      if(seen.has(notice.paymentRecordId)) return false;
      seen.add(notice.paymentRecordId);
      return true;
    });
  }
  updateNotificationBadges();
}
function paymentStatusLabel(status){
  return status==='approved'?'已核验通过':status==='rejected'?'已退回，需重新提交':'待管理者核验';
}
function paymentStatusStyle(status){
  return status==='approved'?['var(--green-soft)','var(--green)']
    :status==='rejected'?['var(--red-soft)','var(--red)']
    :['var(--amber-soft)','var(--amber)'];
}
function selectedPaymentMethod(){
  const selected=document.querySelector('#ven-pay .field .tagrow .tagpick.on');
  return selected?selected.textContent.trim():'微信支付';
}
function submitVendorPayment(){
  let records;
  try{records=loadPaymentRecords();}
  catch(error){
    console.error('Unable to read payment records.',error);
    toast('无法读取缴费记录，请刷新页面后重试');
    return null;
  }
  const latest=latestVendorPayment(records);
  if(latest&&latest.status==='pending'){
    toast('该笔付款已提交，请等待管理者核验');
    return latest;
  }
  if(latest&&latest.status==='approved'){
    toast('该笔水电费已核验缴清');
    return latest;
  }
  const amountValue=Number(document.getElementById('vendorPaymentAmount')?.value);
  if(!Number.isFinite(amountValue)||amountValue<=0){
    toast('请输入有效的缴费金额');
    return null;
  }
  if(Math.round(amountValue*100)!==4000){
    toast('当前水电费应付金额为 ¥40.00，请核对后提交');
    return null;
  }
  const now=Date.now();
  const record={
    id:'PAY-C03-'+now,
    boothId:'C-03',
    vendorName:'山野咖啡',
    item:'水电费',
    amount:Math.round(amountValue*100)/100,
    method:selectedPaymentMethod(),
    createdAt:now,
    status:'pending',
    remark:''
  };
  records.push(record);
  if(!savePaymentRecords(records)) return null;
  renderVendorPayments();
  renderOrganizerPayments();
  return record;
}
function renderPaymentConfirmation(){
  const detail=document.getElementById('paymentResultDetail');
  if(!detail) return;
  const payment=latestVendorPayment();
  if(!payment) return;
  detail.innerHTML=`水电费（摊位 C-03）<br>${payment.method} · ¥${payment.amount.toFixed(2)}<br>${paymentStatusLabel(payment.status)}`;
}
function createPaymentRow(record,organizer){
  const [background,color]=paymentStatusStyle(record.status);
  const row=document.createElement('div');
  row.className='card';
  row.style.padding='14px';
  const head=document.createElement('div');
  head.className='row';
  head.style.justifyContent='space-between';
  const title=document.createElement('b');
  title.style.fontSize='13px';
  title.textContent=`${record.vendorName} · ${record.item} ¥${record.amount.toFixed(2)}`;
  const status=document.createElement('span');
  status.className='chip';
  status.style.background=background;
  status.style.color=color;
  status.textContent=paymentStatusLabel(record.status);
  head.append(title,status);
  const meta=document.createElement('div');
  meta.style.cssText='font-size:11px;color:var(--sub);margin-top:7px';
  meta.textContent=`摊位 ${record.boothId} · ${record.method} · ${new Date(record.createdAt).toLocaleString('zh-CN')}`;
  row.append(head,meta);
  if(record.remark){
    const remark=document.createElement('div');
    remark.style.cssText='font-size:11px;color:var(--red);margin-top:6px';
    remark.textContent=record.remark;
    row.appendChild(remark);
  }
  if(organizer&&record.status==='pending'){
    const actions=document.createElement('div');
    actions.className='row';
    actions.style.cssText='gap:8px;margin-top:12px';
    const approve=document.createElement('button');
    approve.className='btn';
    approve.style.cssText='height:38px;font-size:12px';
    approve.textContent='核验通过';
    approve.addEventListener('click',()=>reviewVendorPayment(record.id,'approved'));
    const reject=document.createElement('button');
    reject.className='btn ghost';
    reject.style.cssText='height:38px;font-size:12px';
    reject.textContent='退回补充';
    reject.addEventListener('click',()=>reviewVendorPayment(record.id,'rejected'));
    actions.append(approve,reject);
    row.appendChild(actions);
  }
  return row;
}
function renderOrganizerPayments(){
  const list=document.getElementById('orgPaymentList');
  if(!list) return;
  let records;
  try{records=loadPaymentRecords().filter(record=>record.boothId==='C-03').sort((a,b)=>b.createdAt-a.createdAt);}
  catch(error){
    console.error('Unable to load organizer payment records.',error);
    list.replaceChildren(createPaymentEmpty('无法读取付款凭证，请刷新页面后重试'));
    return;
  }
  const pending=records.filter(record=>record.status==='pending').length;
  syncPaymentNotifications(records);
  const count=document.getElementById('orgPendingPaymentCount');
  if(count) count.textContent=`${pending} 笔待处理`;
  const homeCount=document.getElementById('orgHomePaymentPendingCount');
  if(homeCount) homeCount.textContent=pending;
  list.replaceChildren();
  if(!records.length){
    list.appendChild(createPaymentEmpty('目前没有摊主提交的付款凭证'));
    return;
  }
  records.forEach(record=>list.appendChild(createPaymentRow(record,true)));
}
function renderVendorPayments(){
  let records;
  try{records=loadPaymentRecords().filter(record=>record.boothId==='C-03').sort((a,b)=>b.createdAt-a.createdAt);}
  catch(error){
    console.error('Unable to load vendor payment records.',error);
    toast('无法读取缴费状态，请刷新页面后重试');
    return;
  }
  const latest=latestVendorPayment(records);
  syncPaymentNotifications(records);
  const statusText=latest?paymentStatusLabel(latest.status):'尚未缴纳';
  const summary=document.getElementById('vendorPaymentStatusSummary');
  if(summary) summary.textContent=`水电费 ¥40 · ${statusText}`;
  document.querySelectorAll('#vendorUtilityPaymentStatus,#vendorHomeUtilityPaymentStatus').forEach(status=>{
    const [background,color]=paymentStatusStyle(latest?latest.status:'pending');
    status.style.background=background;
    status.style.color=color;
    status.textContent=statusText;
  });
  const feeSummary=document.getElementById('vendorPendingFeeSummary');
  if(feeSummary){
    const settled=latest&&latest.status==='approved';
    feeSummary.textContent=settled?'0 项待缴':'1 项待缴';
    feeSummary.style.background=settled?'var(--green-soft)':'var(--amber-soft)';
    feeSummary.style.color=settled?'var(--green)':'var(--amber)';
  }
  const counts={
    pending:records.filter(record=>record.status==='pending').length,
    approved:records.filter(record=>record.status==='approved').length,
    rejected:records.filter(record=>record.status==='rejected').length
  };
  for(const [key,id] of Object.entries({pending:'vendorPendingPaymentCount',approved:'vendorApprovedPaymentCount',rejected:'vendorRejectedPaymentCount'})){
    const target=document.getElementById(id);
    if(target) target.textContent=counts[key];
  }
  const history=document.getElementById('vendorPaymentHistory');
  if(history){
    history.replaceChildren();
    if(!records.length) history.appendChild(createPaymentEmpty('提交水电费付款凭证后，核验进度会显示在这里'));
    records.forEach(record=>history.appendChild(createPaymentRow(record,false)));
  }
  const latestRecord=records[0];
  const voucherResult=document.getElementById('vouResult');
  if(voucherResult&&latestRecord){
    const [background,color]=paymentStatusStyle(latestRecord.status);
    const badge=document.getElementById('vouStatus');
    if(badge){badge.style.background=background;badge.style.color=color;badge.textContent=paymentStatusLabel(latestRecord.status);}
    document.getElementById('vouAmount').textContent=`¥${latestRecord.amount.toFixed(2)}`;
    document.getElementById('vouMethod').textContent=latestRecord.method;
    document.getElementById('vouDate').textContent=new Date(latestRecord.createdAt).toLocaleString('zh-CN');
    const result=document.getElementById('vouReviewResult');
    if(result) result.textContent=latestRecord.remark||paymentStatusLabel(latestRecord.status);
    voucherResult.style.display='block';
  }else if(voucherResult){
    voucherResult.style.display='none';
  }
}
function createPaymentEmpty(message){
  const empty=document.createElement('div');
  empty.className='card';
  empty.style.cssText='text-align:center;color:var(--sub);font-size:12px';
  empty.textContent=message;
  return empty;
}
function reviewVendorPayment(paymentId,status){
  if(activePortal!=='org'){
    toast('只有管理者可以核验商户付款');
    return;
  }
  if(!['approved','rejected'].includes(status)){
    toast('无效的核验结果');
    return;
  }
  let records;
  try{records=loadPaymentRecords();}
  catch(error){
    console.error('Unable to load payment records for review.',error);
    toast('无法读取待核验凭证，请刷新页面后重试');
    return;
  }
  const record=records.find(item=>item.id===paymentId);
  if(!record||record.status!=='pending'){
    toast('该凭证已处理或不存在，请刷新列表');
    renderOrganizerPayments();
    return;
  }
  record.status=status;
  record.reviewedAt=Date.now();
  record.remark=status==='rejected'?'请核对付款信息后重新提交':'';
  if(!savePaymentRecords(records)) return;
  renderOrganizerPayments();
  renderVendorPayments();
  toast(status==='approved'?'核验通过，摊主缴费状态已更新':'已退回凭证，摊主可修改后重新提交');
}
window.addEventListener('storage',event=>{
  if(event.key===PAYMENT_RECORDS_KEY){
    if(current==='g-notify'){
      try{syncPaymentNotifications(loadPaymentRecords());}
      catch(error){
        console.error('Unable to synchronize payment notifications.',error);
        toast('付款核验通知同步失败，请刷新页面重试');
      }
      renderNotifyCenter();
    }
    if(current==='org-fee'||current==='org-home') renderOrganizerPayments();
    if(current==='ven-pay'||current==='ven-voucher'||current==='ven-home') renderVendorPayments();
    if(current==='g-pay-ok') renderPaymentConfirmation();
    return;
  }
  if(event.key!==INCIDENT_RECORDS_KEY) return;
  try{
    const incidents=loadIncidentReports();
    syncIncidentViews();
    syncIncidentNotifications(incidents,JSON.parse(event.oldValue||'[]'));
  }
  catch(error){
    console.error('Unable to synchronize incident updates.',error);
    toast('异常处理消息同步失败，请刷新页面重试');
  }
});

/* ================= 摊主异常上报 / 管理者工单 ================= */
const INCIDENT_RECORDS_KEY='market.demo.incident-records.v1';
let selectedIncidentId=null;
let organizerIncidentFilter='pending';
const INCIDENT_STATUS={
  pending:{label:'待处理',color:'var(--red)',background:'var(--red-soft)'},
  processing:{label:'处理中',color:'var(--primary)',background:'var(--primary-soft)'},
  resolved:{label:'已完成',color:'var(--green)',background:'var(--green-soft)'}
};
function loadIncidentReports(){
  const raw=localStorage.getItem(INCIDENT_RECORDS_KEY);
  if(!raw) return [];
  const reports=JSON.parse(raw);
  if(!Array.isArray(reports)) throw new Error('Saved incident reports are not a list.');
  return reports.filter(report=>report&&typeof report.id==='string'&&INCIDENT_STATUS[report.status]&&Array.isArray(report.updates));
}
function saveIncidentReports(reports){
  try{
    localStorage.setItem(INCIDENT_RECORDS_KEY,JSON.stringify(reports));
    return true;
  }catch(error){
    console.error('Unable to save incident reports.',error);
    toast('异常记录保存失败，请检查浏览器存储权限');
    return false;
  }
}
function incidentDate(value){
  const date=new Date(value);
  if(Number.isNaN(date.getTime())) return '时间未知';
  return date.toLocaleString('zh-CN',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false});
}
function incidentStatusChip(status){
  const info=INCIDENT_STATUS[status];
  return '<span class="chip" style="background:'+info.background+';color:'+info.color+'">'+info.label+'</span>';
}
function renderOrganizerIssues(){
  const list=document.getElementById('orgIssueList');
  if(!list) return;
  let incidents;
  try{incidents=loadIncidentReports();}
  catch(error){
    console.error('Unable to load organizer incident list.',error);
    list.innerHTML='<div class="empty">异常记录读取失败，请刷新页面重试</div>';
    return;
  }
  document.querySelectorAll('#orgIssueFilters .fchip').forEach(button=>{
    const status=button.dataset.status;
    button.textContent=(INCIDENT_STATUS[status].label)+' '+incidents.filter(item=>item.status===status).length;
    button.classList.toggle('on',status===organizerIncidentFilter);
  });
  const filtered=incidents.filter(item=>item.status===organizerIncidentFilter).sort((a,b)=>b.createdAt-a.createdAt);
  if(!filtered.length){
    list.innerHTML='<div class="empty">当前没有'+INCIDENT_STATUS[organizerIncidentFilter].label+'工单</div>';
    return;
  }
  list.replaceChildren();
  filtered.forEach(incident=>{
    const row=document.createElement('div');
    row.className='li';
    row.style.cursor='pointer';
    const avatar=document.createElement('div');
    avatar.className='avatar';
    avatar.style.cssText='background:var(--red-soft);color:var(--red)';
    avatar.innerHTML='<svg width="20" height="20"><use href="#i-alert"/></svg>';
    const main=document.createElement('div');
    main.className='li-main';
    const title=document.createElement('div');
    title.className='li-title';
    title.textContent=incident.type+' · '+incident.description;
    const detail=document.createElement('div');
    detail.className='li-sub';
    detail.textContent=(incident.vendorName||'摊主')+' · '+(incident.booth||'C-03')+' · '+incidentDate(incident.createdAt);
    main.append(title,detail);
    const status=document.createElement('span');
    status.className='chip';
    status.style.cssText='background:'+INCIDENT_STATUS[incident.status].background+';color:'+INCIDENT_STATUS[incident.status].color;
    status.textContent=INCIDENT_STATUS[incident.status].label;
    row.append(avatar,main,status);
    row.addEventListener('click',()=>openOrganizerIncident(incident.id));
    list.appendChild(row);
  });
}
function filterOrganizerIssues(button,status){
  organizerIncidentFilter=status;
  document.querySelectorAll('#orgIssueFilters .fchip').forEach(item=>item.classList.toggle('on',item===button));
  renderOrganizerIssues();
}
function openOrganizerIncident(id){
  selectedIncidentId=id;
  show('org-ticket');
}
function renderOrganizerIncidentDetail(){
  const content=document.getElementById('orgTicketContent');
  if(!content) return;
  let incident;
  try{incident=loadIncidentReports().find(item=>item.id===selectedIncidentId);}
  catch(error){
    console.error('Unable to load incident detail.',error);
    content.innerHTML='<div class="empty">工单读取失败，请返回列表重试</div>';
    return;
  }
  if(!incident){
    content.innerHTML='<div class="empty">找不到该异常工单，请返回列表刷新</div>';
    return;
  }
  const status=INCIDENT_STATUS[incident.status];
  const timeline=incident.updates.map((update,index)=>
    '<div class="tl-item'+(index<incident.updates.length?' done':'')+'"><div class="tl-t">'+escapeHTML(update.title||status.label)+'</div><div class="tl-s">'+incidentDate(update.createdAt)+' · '+escapeHTML(update.message||'状态已更新')+'</div></div>'
  ).join('');
  const nextAction=incident.status==='pending'
    ? '<button class="btn" onclick="transitionIncident(\'processing\')"><svg width="16" height="16"><use href="#i-clock"/></svg>接单并开始处理</button>'
    : incident.status==='processing'
      ? '<button class="btn" onclick="transitionIncident(\'resolved\')"><svg width="16" height="16"><use href="#i-check"/></svg>标记处理完成</button>'
      : '<div class="empty">工单已完成，商户端已同步处理结果</div>';
  content.innerHTML=
    '<div class="card"><div class="row" style="justify-content:space-between"><div><b style="font-size:16px">'+escapeHTML(incident.type+' · '+incident.description)+'</b><div style="font-size:11.5px;color:var(--sub);margin-top:4px">工单号 '+escapeHTML(incident.id)+'</div></div>'+incidentStatusChip(incident.status)+'</div>'+
    '<div class="row" style="margin-top:12px;gap:8px;flex-wrap:wrap"><span class="chip" style="background:var(--bg);color:#565C73">上报人：'+escapeHTML(incident.vendorName||'摊主')+' · '+escapeHTML(incident.booth||'C-03')+'</span><span class="chip" style="background:var(--bg);color:#565C73">上报时间：'+incidentDate(incident.createdAt)+'</span></div></div>'+
    '<div class="sec-title">处理时间线</div><div class="card"><div class="timeline">'+timeline+'</div></div>'+
    (incident.status==='resolved'?'':'<div class="field"><label for="incidentUpdateNote">处理进展（将同步给摊主）</label><textarea id="incidentUpdateNote" class="input" maxlength="240" placeholder="填写当前处理情况或完成说明"></textarea></div>')+
    '<div class="row" style="gap:10px">'+nextAction+'</div>';
}
function renderVendorIncidents(){
  const list=document.getElementById('vendorIncidentList');
  if(!list) return;
  let incidents;
  try{incidents=loadIncidentReports().sort((a,b)=>b.createdAt-a.createdAt);}
  catch(error){
    console.error('Unable to load vendor incident history.',error);
    list.innerHTML='<div class="empty">上报记录读取失败，请刷新页面重试</div>';
    return;
  }
  const own=incidents.filter(item=>item.booth==='C-03');
  if(!own.length){
    list.innerHTML='<div class="empty">暂无上报记录，提交后可在此跟踪处理进度</div>';
    return;
  }
  list.innerHTML=own.map(incident=>{
    const latest=incident.updates[incident.updates.length-1];
    return '<div class="li" style="align-items:flex-start"><div class="avatar" style="background:'+INCIDENT_STATUS[incident.status].background+';color:'+INCIDENT_STATUS[incident.status].color+'"><svg width="20" height="20"><use href="#i-alert"/></svg></div><div class="li-main"><div class="li-title">'+escapeHTML(incident.type+' · '+incident.description)+'</div><div class="li-sub">'+incidentDate(incident.createdAt)+' · '+escapeHTML(latest&&latest.message||'等待主办方响应')+'</div></div>'+incidentStatusChip(incident.status)+'</div>';
  }).join('');
}
function syncIncidentViews(){
  if(current==='org-issue') renderOrganizerIssues();
  if(current==='org-ticket') renderOrganizerIncidentDetail();
  if(current==='ven-report') renderVendorIncidents();
}
function publishIncidentNotice(role,incident,status){
  const feed=NOTICE_FEEDS[role];
  if(!feed) return;
  const statusInfo=INCIDENT_STATUS[status];
  const latest=incident.updates[incident.updates.length-1];
  const notice={
    category:'工单',
    title:role==='org'?'摊主上报异常：'+incident.type:'异常工单'+statusInfo.label,
    detail:(incident.booth||'C-03')+' · '+incident.description+(latest&&latest.message?' · '+latest.message:''),
    icon:'i-alert',color:statusInfo.color,bg:statusInfo.background,
    destination:role==='org'?'org-issue':'ven-report',unread:true,incidentId:incident.id
  };
  const existing=feed.findIndex(item=>item.incidentId===incident.id);
  if(existing>=0) feed.splice(existing,1);
  feed.unshift(notice);
  if(activePortal===role&&current==='g-notify') renderNotifyCenter();
  updateNotificationBadges();
}
function syncIncidentNotifications(incidents,previous){
  const oldById=new Map(previous.map(item=>[item.id,item]));
  incidents.forEach(incident=>{
    const old=oldById.get(incident.id);
    if(!old) publishIncidentNotice('org',incident,'pending');
    else if(old.status!==incident.status&&incident.status!=='pending') publishIncidentNotice('ven',incident,incident.status);
  });
}
function submitVendorIncident(){
  if(activePortal!=='ven'){toast('请从摊主端提交异常');return;}
  const type=document.querySelector('#ven-report .tagrow .tagpick.on')?.textContent.trim();
  const input=document.getElementById('vendorIncidentDescription');
  const description=input.value.trim();
  if(!type){toast('请选择异常类型');return;}
  if(!description){input.focus();toast('请填写问题说明后再提交');return;}
  let incidents;
  try{incidents=loadIncidentReports();}
  catch(error){
    console.error('Unable to load existing incident reports.',error);
    toast('无法读取异常记录，请刷新页面后重试');
    return;
  }
  const now=Date.now();
  const incident={
    id:'GD-'+new Date(now).toISOString().replace(/\D/g,'').slice(0,14)+'-'+Math.random().toString(36).slice(2,6).toUpperCase(),
    type,description,vendorName:vendorCardState.name,booth:'C-03',createdAt:now,status:'pending',
    updates:[{title:'摊主提交上报',createdAt:now,message:'已提交，等待主办方响应'}]
  };
  incidents.unshift(incident);
  if(!saveIncidentReports(incidents)) return;
  input.value='';
  publishIncidentNotice('org',incident,'pending');
  renderVendorIncidents();
  toast('异常已提交，主办方已收到并可立即处理');
}
function transitionIncident(status){
  if(activePortal!=='org'){toast('仅管理者可以更新异常工单');return;}
  if(status!=='processing'&&status!=='resolved'){toast('无效的工单状态');return;}
  let incidents;
  try{incidents=loadIncidentReports();}
  catch(error){
    console.error('Unable to load incident before transition.',error);
    toast('无法读取异常工单，请刷新列表重试');
    return;
  }
  const incident=incidents.find(item=>item.id===selectedIncidentId);
  if(!incident||!((incident.status==='pending'&&status==='processing')||(incident.status==='processing'&&status==='resolved'))){
    toast('工单状态已变化，请返回列表刷新');
    renderOrganizerIncidentDetail();
    return;
  }
  const note=document.getElementById('incidentUpdateNote')?.value.trim();
  const message=note||(status==='processing'?'主办方已接单，正在协调现场人员处理':'问题已处理完成，请摊主确认现场情况');
  incident.status=status;
  incident.updatedAt=Date.now();
  incident.updates.push({title:INCIDENT_STATUS[status].label,createdAt:incident.updatedAt,message});
  if(!saveIncidentReports(incidents)) return;
  publishIncidentNotice('ven',incident,status);
  renderOrganizerIncidentDetail();
  renderOrganizerIssues();
  toast(status==='processing'?'已接单，处理进度已同步至摊主端':'工单已完成，处理结果已同步至摊主端');
}
function submitVoucher(){
  const payment=submitVendorPayment();
  if(!payment) return;
  go('ven-voucher');
  toast(payment.status==='pending'?'付款凭证已发送至管理者端，等待核验':paymentStatusLabel(payment.status));
}
function revealVoucherResult(){
  submitVoucher();
}
function openPaySheet(){
  let latest;
  try{latest=latestVendorPayment();}
  catch(error){
    console.error('Unable to read payment records.',error);
    toast('无法读取缴费状态，请刷新页面后重试');
    return;
  }
  if(latest&&latest.status!=='rejected'){
    toast(latest.status==='pending'?'付款凭证已提交，等待管理者核验':'水电费已核验缴清');
    return;
  }
  document.getElementById('sheetMask').classList.add('show');
  document.getElementById('paySheet').classList.add('show');
}
function payConfirm(ok){
  closeSheet();
  if(ok){
    const payment=submitVendorPayment();
    if(payment) setTimeout(()=>{ show('g-pay-ok'); },500);
  }
  else { setTimeout(()=>{ show('g-pay-fail'); }, 400); }
}

/* ================= Consumer interactions ================= */
function getCoupon(couponId){
  if(!couponId||consumerState.coupons.includes(couponId)) return;
  consumerState.coupons.push(couponId);
  saveConsumerState();
  renderCouponList();
  renderShopList();
  renderHotStalls();
  renderConsumerProfile();
  toast('领取成功，已放入卡包；推荐列表已更新');
}
let starN = 0;
function setStar(n){
  starN = n;
  const texts=['','非常不满意','不太满意','一般般','比较满意','非常满意'];
  document.querySelectorAll('#starBox button svg').forEach((s,i)=>{
    s.style.color = i<n ? '#F2A93B' : '#E4E8F2';
  });
  const label=document.getElementById('starText');
  if(label) label.textContent = texts[n]||'';
}
function openReviewForm(shopId=activeConsumerShopId){
  const shop=SHOP_CATALOG.find(item=>item.id===shopId);
  if(!shop){toast('找不到要评价的摊位');return;}
  activeConsumerShopId=shopId;
  const review=getShopReviews(shopId)[0];
  document.getElementById('reviewShopTitle').textContent=shop.name+' · '+shop.id;
  document.getElementById('reviewFormHint').textContent=review?'修改后将更新你已发布的评价':'你的评价将进入商户信用档案';
  document.getElementById('reviewSubmitButton').textContent=review?'保存修改':'提交评价';
  document.getElementById('reviewComment').value=review?review.comment:'';
  document.querySelectorAll('#con-rate .field .tagrow').forEach((row,index)=>{
    const selected=review&&Array.isArray(review.tags)?review.tags[index]:null;
    row.querySelectorAll('.tagpick').forEach((button,buttonIndex)=>{
      const isSelected=selected?selected.includes(button.textContent.trim()):buttonIndex===0;
      button.classList.toggle('on',isSelected);
      button.setAttribute('aria-pressed',isSelected?'true':'false');
    });
  });
  starN=0;
  setStar(review?review.rating:0);
  go('con-rate');
}
function submitConsumerReview(){
  if(!starN){toast('请先选择 1 至 5 星评分');return;}
  const shop=SHOP_CATALOG.find(item=>item.id===activeConsumerShopId);
  if(!shop){toast('找不到要评价的摊位');return;}
  const existing=getShopReviews(shop.id)[0];
  const comment=document.getElementById('reviewComment').value.trim();
  const tags=[...document.querySelectorAll('#con-rate .field .tagrow')].map(row=>
    [...row.querySelectorAll('.tagpick.on')].map(button=>button.textContent.trim())
  );
  const review={
    id:existing?existing.id:'review-'+shop.id+'-'+Date.now(),
    shopId:shop.id,
    rating:starN,
    comment,
    tags,
    date:new Date().toLocaleDateString('zh-CN')
  };
  if(existing){
    consumerState.reviews=consumerState.reviews.map(item=>item.id===existing.id?review:item);
  }else{
    consumerState.reviews.push(review);
  }
  consumerState.ratings[shop.id]=starN;
  saveConsumerState();
  renderConsumerProfile();
  renderConsumerReviews();
  renderVendorRating();
  renderVendorReviews();
  renderShopList();
  renderHotStalls();
  renderConsumerStall(shop);
  starN=0;
  go('con-reviews');
  toast(existing?'评价修改已保存，摊位评分已更新':'评价已提交，摊主端和摊位评分已更新');
}
function toggleFav(){
  const index=consumerState.favorites.indexOf(activeConsumerShopId);
  const favorited=index<0;
  if(favorited) consumerState.favorites.push(activeConsumerShopId);
  else consumerState.favorites.splice(index,1);
  const shop=SHOP_CATALOG.find(item=>item.id===activeConsumerShopId);
  if(shop&&favorited&&!consumerState.preferredZones.includes(shop.zone)) consumerState.preferredZones.push(shop.zone);
  saveConsumerState();
  const b = document.getElementById('favBtn');
  b.innerHTML = '<svg width="18" height="18" style="color:'+(favorited?'var(--pink)':'var(--ink)')+'"><use href="#i-heart'+(favorited?'-f':'')+'"/></svg>';
  renderConsumerProfile();
  renderShopList();
  renderHotStalls();
  toast(favorited?'已收藏，后续推荐会优先展示相似摊位':'已取消收藏，已更新你的个性化推荐');
}

/* ================= 报名管理 / 分配 / 风险 ================= */
function enrollAct(btn, act){
  const card = btn.closest('.card');
  const chip = card.querySelector('.chip');
  chip.textContent = act==='通过' ? '已通过' : '已候补';
  chip.style.background = act==='通过' ? 'var(--green-soft)' : 'var(--primary-soft)';
  chip.style.color = act==='通过' ? 'var(--green)' : 'var(--primary)';
  card.querySelectorAll('.row button').forEach(b=>{ b.disabled=true; b.style.opacity=.45; b.style.cursor='default'; });
  toast(act==='通过' ? '已通过报名，摊位分配建议已生成' : '已列入候补队列，如有空位自动递补');
}
function assignBooth(btn){
  const li = btn.closest('.li');
  btn.textContent = '已分配 ✓';
  btn.style.background = 'var(--green-soft)';
  btn.style.color = 'var(--green)';
  btn.disabled = true;
  const sub = li.querySelector('.li-sub');
  toast('已分配 '+sub.textContent.match(/[A-D]-\d{2}/)[0]+'，结果已同步至商户端');
}
function chkToggle(el){
  el.classList.toggle('on');
  if(el.closest('#org-risk')) riskProgress();
}
function riskProgress(){
  const chks = document.querySelectorAll('#org-risk .chk');
  const on = document.querySelectorAll('#org-risk .chk.on').length;
  const pct = Math.round(on/chks.length*100);
  const d = document.getElementById('riskDonut');
  d.style.background = 'conic-gradient('+(pct===100?'var(--green)':'var(--amber)')+' 0 '+pct+'%,var(--line) '+pct+'% 100%)';
  d.querySelector('b').textContent = pct+'%';
  d.querySelector('span').textContent = '检查完成';
}
function riskSubmit(){
  const total = document.querySelectorAll('#org-risk .chk').length;
  const on = document.querySelectorAll('#org-risk .chk.on').length;
  if(on < total){ toast('还有 '+(total-on)+' 项未勾选，高风险项未闭环前不可提交'); }
  else { toast('检查清单已全部闭环，报告已归档至复盘中心'); }
}
function delSubmit(){
  const ok = document.querySelectorAll('#g-delete .chk.on').length === 3;
  toast(ok ? '注销申请已提交 · 7 天冷静期 · 可随时登录撤销' : '请先勾选全部注销确认项');
}

/* ================= 全局搜索 ================= */
const VENDOR_CARD_KEY='market.demo.vendor-card.v1';
const DEFAULT_VENDOR_CARD={
  name:'山野咖啡',
  products:'手冲咖啡 · 冷萃特调 · 挂耳礼盒',
  description:'云南保山庄园直供豆 · 现场冲煮体验',
  offer:'满 30 减 5',
  phone:'',
  productImages:[]
};
function loadVendorCard(){
  try{
    const raw=localStorage.getItem(VENDOR_CARD_KEY);
    if(!raw) return {...DEFAULT_VENDOR_CARD,productImages:[]};
    const stored=JSON.parse(raw);
    const card={...DEFAULT_VENDOR_CARD};
    Object.keys(DEFAULT_VENDOR_CARD).forEach(key=>{
      if(key==='productImages') return;
      if(typeof stored[key]==='string') card[key]=stored[key];
    });
    card.productImages=Array.isArray(stored.productImages)
      ?stored.productImages.filter(image=>typeof image==='string'&&/^data:image\/jpeg;base64,/.test(image)).slice(0,3)
      :[];
    return card;
  }catch(error){
    console.error('Unable to load vendor card.',error);
    toast('无法读取已保存的名片资料');
    return {...DEFAULT_VENDOR_CARD,productImages:[]};
  }
}
let vendorCardState=loadVendorCard();
let vendorCardQrVisible=false;
let draftVendorProductImages=[];
function vendorCardPayload(){
  return JSON.stringify({
    type:'market_vendor_card',
    booth:'C-03',
    name:vendorCardState.name,
    phone:vendorCardState.phone
  });
}
function renderVendorCard(){
  const name=document.getElementById('vendorCardName');
  if(!name) return;
  name.textContent=vendorCardState.name;
  document.getElementById('vendorCardDescription').innerHTML=
    '主营：'+escapeHTML(vendorCardState.products)+'<br>'+escapeHTML(vendorCardState.description);
  renderVendorProductGallery('vendorCardProductGallery',vendorCardState.productImages,false);
  const offer=document.getElementById('vendorCardOffer');
  offer.textContent=vendorCardState.offer||'暂无优惠';
  offer.style.display=vendorCardState.offer?'inline-flex':'none';
  const contact=document.getElementById('vendorCardContact');
  contact.textContent=vendorCardState.phone?'联系电话：'+vendorCardState.phone:'';
  contact.style.display=vendorCardState.phone?'inline-flex':'none';
  document.getElementById('vendorCardQrTitle').textContent=vendorCardState.name+' · C-03 名片码';
  const shop=SHOP_CATALOG.find(item=>item.id==='C-03');
  if(shop){
    shop.name=vendorCardState.name;
    shop.kind=vendorCardState.products.split(/[·,，]/)[0].trim()||shop.kind;
    shop.description=vendorCardState.products+' · '+vendorCardState.description;
  }
  if(vendorCardQrVisible) renderVendorCardQr();
  renderVendorCardTodo();
}
renderVendorCard();
function escapeHTML(value){
  return value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
function toggleVendorCardEditor(){
  const editor=document.getElementById('vendorCardEditor');
  const opening=editor.style.display==='none';
  editor.style.display=opening?'block':'none';
  if(opening){
    draftVendorProductImages=vendorCardState.productImages.slice();
    document.getElementById('vendorCardNameInput').value=vendorCardState.name;
    document.getElementById('vendorCardProductsInput').value=vendorCardState.products;
    document.getElementById('vendorCardDescriptionInput').value=vendorCardState.description;
    document.getElementById('vendorCardOfferInput').value=vendorCardState.offer;
    document.getElementById('vendorCardPhoneInput').value=vendorCardState.phone;
    document.getElementById('vendorCardProductImageInput').value='';
    renderVendorProductGallery('vendorCardProductImagePreview',draftVendorProductImages,true);
    editor.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
}
function openVendorCardImageEditor(){
  show('ven-card');
  const editor=document.getElementById('vendorCardEditor');
  if(editor.style.display==='none') toggleVendorCardEditor();
  document.getElementById('vendorCardProductImageInput').click();
}
function renderVendorCardTodo(){
  const title=document.getElementById('vendorCardTodoTitle');
  if(!title) return;
  const complete=vendorCardState.productImages.length>0;
  title.textContent=complete?'电子名片已完善':'电子名片可完善';
  document.getElementById('vendorCardTodoDetail').textContent=complete
    ?'已添加 '+vendorCardState.productImages.length+' 张主打商品图，点击可继续编辑'
    :'补充主打产品图，预计提升 30% 访问';
  const action=document.getElementById('vendorCardTodoAction');
  action.textContent=complete?'继续编辑':'去完善';
  action.style.background=complete?'var(--green-soft)':'var(--primary-soft)';
  action.style.color=complete?'var(--green)':'var(--primary)';
}
function renderVendorProductGallery(containerId,images,editable){
  const gallery=document.getElementById(containerId);
  if(!gallery) return;
  gallery.replaceChildren();
  gallery.style.display=images.length?'grid':'none';
  images.forEach((src,index)=>{
    const frame=document.createElement('div');
    frame.style.cssText='position:relative;aspect-ratio:1;border-radius:12px;overflow:hidden;background:var(--bg)';
    const image=document.createElement('img');
    image.src=src;
    image.alt=vendorCardState.name+' 商品图 '+(index+1);
    image.loading='lazy';
    image.style.cssText='width:100%;height:100%;object-fit:cover;display:block';
    frame.appendChild(image);
    if(editable){
      const remove=document.createElement('button');
      remove.type='button';
      remove.className='iconbtn';
      remove.setAttribute('aria-label','移除第 '+(index+1)+' 张商品图');
      remove.style.cssText='position:absolute;right:4px;top:4px;width:28px;height:28px;border-radius:50%;background:rgba(26,32,48,.72);color:#fff';
      remove.innerHTML='<svg width="15" height="15"><use href="#i-x"/></svg>';
      remove.addEventListener('click',()=>removeVendorProductImage(index));
      frame.appendChild(remove);
    }
    gallery.appendChild(frame);
  });
}
function resizeVendorProductImage(file){
  return new Promise((resolve,reject)=>{
    const url=URL.createObjectURL(file);
    const image=new Image();
    image.onload=()=>{
      URL.revokeObjectURL(url);
      try{
        const scale=Math.min(1,1200/Math.max(image.naturalWidth,image.naturalHeight));
        const canvas=document.createElement('canvas');
        canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));
        canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
        const context=canvas.getContext('2d');
        if(!context){reject(new Error('Canvas is unavailable for image compression.'));return;}
        context.drawImage(image,0,0,canvas.width,canvas.height);
        let quality=0.82;
        let result=canvas.toDataURL('image/jpeg',quality);
        while(result.length>460000&&quality>0.5){
          quality-=0.08;
          result=canvas.toDataURL('image/jpeg',quality);
        }
        if(result.length>460000){reject(new Error('Compressed image exceeds the storage size limit.'));return;}
        resolve(result);
      }catch(error){
        reject(error);
      }
    };
    image.onerror=()=>{
      URL.revokeObjectURL(url);
      reject(new Error('Image could not be decoded.'));
    };
    image.src=url;
  });
}
async function handleVendorProductImages(files){
  const input=document.getElementById('vendorCardProductImageInput');
  const selected=Array.from(files||[]);
  input.value='';
  if(!selected.length) return;
  const remaining=3-draftVendorProductImages.length;
  if(remaining<=0){toast('最多添加 3 张商品图，请先移除已有图片');return;}
  if(selected.length>remaining){toast('最多还可添加 '+remaining+' 张商品图');}
  let added=0;
  for(const file of selected.slice(0,remaining)){
    if(!['image/jpeg','image/png','image/webp','image/gif'].includes(file.type)){
      toast('仅支持 JPG、PNG、WebP 或 GIF 图片');
      continue;
    }
    if(file.size>8*1024*1024){
      toast('单张商品图不能超过 8 MB');
      continue;
    }
    try{
      draftVendorProductImages.push(await resizeVendorProductImage(file));
      added++;
    }catch(error){
      console.error('Unable to prepare vendor product image.',error);
      toast('有图片无法读取或压缩，请更换图片后重试');
    }
  }
  renderVendorProductGallery('vendorCardProductImagePreview',draftVendorProductImages,true);
  if(added) toast('已添加 '+added+' 张商品图，保存名片后生效');
}
function removeVendorProductImage(index){
  draftVendorProductImages.splice(index,1);
  renderVendorProductGallery('vendorCardProductImagePreview',draftVendorProductImages,true);
}
function cancelVendorCardEdit(){
  draftVendorProductImages=vendorCardState.productImages.slice();
  document.getElementById('vendorCardEditor').style.display='none';
  toast('已取消编辑，名片保持原样');
}
function saveVendorCard(){
  const next={
    name:document.getElementById('vendorCardNameInput').value.trim(),
    products:document.getElementById('vendorCardProductsInput').value.trim(),
    description:document.getElementById('vendorCardDescriptionInput').value.trim(),
    offer:document.getElementById('vendorCardOfferInput').value.trim(),
    phone:document.getElementById('vendorCardPhoneInput').value.trim(),
    productImages:draftVendorProductImages.slice()
  };
  if(!next.name||!next.products||!next.description){
    toast('商户名称、主营商品和商户介绍不能为空');
    return;
  }
  if(next.phone&&!/^[+\d()\-\s]{6,20}$/.test(next.phone)){
    toast('请输入有效的联系电话');
    return;
  }
  try{
    localStorage.setItem(VENDOR_CARD_KEY,JSON.stringify(next));
  }catch(error){
    console.error('Unable to save vendor card.',error);
    toast('名片保存失败，请检查浏览器存储权限');
    return;
  }
  vendorCardState=next;
  renderVendorCard();
  document.getElementById('vendorCardEditor').style.display='none';
  toast('电子名片已保存');
}
function toggleVendorCardQr(){
  vendorCardQrVisible=!vendorCardQrVisible;
  const panel=document.getElementById('vendorCardQrPanel');
  const button=document.getElementById('vendorCardQrToggle');
  panel.style.display=vendorCardQrVisible?'block':'none';
  button.lastChild.textContent=vendorCardQrVisible?'隐藏名片码':'显示名片码';
  if(vendorCardQrVisible){
    try{
      renderVendorCardQr();
      panel.scrollIntoView({behavior:'smooth',block:'nearest'});
    }catch(error){
      vendorCardQrVisible=false;
      panel.style.display='none';
      console.error('Unable to generate vendor card QR.',error);
      toast('名片码生成失败，请减少名片信息长度后重试');
    }
  }
}
function renderVendorCardQr(){
  const payload=vendorCardPayload();
  document.getElementById('vendorCardQr').innerHTML=sgQrSvg(payload,220);
  document.getElementById('vendorCardQrPayload').textContent=payload;
}
function downloadVendorCardQr(){
  try{
    const svg=sgQrSvg(vendorCardPayload(),640).replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" ');
    const blob=new Blob([svg],{type:'image/svg+xml;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const link=document.createElement('a');
    link.href=url;
    link.download=vendorCardState.name+'-C03-名片码.svg';
    link.click();
    URL.revokeObjectURL(url);
    toast('名片码已保存为 SVG 文件');
  }catch(error){
    console.error('Unable to download vendor card QR.',error);
    toast('名片码保存失败，请重试');
  }
}
async function shareVendorCard(){
  const text=vendorCardPayload();
  try{
    if(navigator.share){
      await navigator.share({title:vendorCardState.name+' · C-03',text});
      return;
    }
    if(navigator.clipboard&&navigator.clipboard.writeText){
      await navigator.clipboard.writeText(text);
      toast('名片信息已复制，可粘贴分享');
      return;
    }
    toggleVendorCardQr();
    toast('请扫描已生成的名片码分享商户资料');
  }catch(error){
    if(error.name==='AbortError') return;
    console.error('Unable to share vendor card.',error);
    toast('分享失败，请使用名片码保存后分享');
  }
}
const VENDOR_SEARCH_ITEMS=[
  {name:'费用与凭证',sub:'查看摊位费、水电费及付款状态',keywords:'缴费 费用 水电 水电费 待缴 付款 支付',icon:'i-wallet',destination:'ven-pay'},
  {name:'付款核验记录',sub:'查看已提交凭证、管理者审核结果',keywords:'凭证 核验 核验凭证 付款凭证 缴费凭证 账单 已支付 退回 审核',icon:'i-doc',destination:'ven-voucher'},
  {name:'电子名片',sub:'查看商户资料并展示名片码',keywords:'名片 商户资料 二维码 分享',icon:'i-card',destination:'ven-card'},
  {name:'编辑名片',sub:'修改商户名称、主营商品和联系方式',keywords:'编辑名片 名片编辑 修改资料 联系方式',icon:'i-edit',destination:'ven-card',edit:true},
  {name:'经营数据与评价',sub:'查看消费者评价及摊位评分',keywords:'经营 数据 评价 评论 评分 消费者',icon:'i-chart',destination:'ven-data'},
  {name:'摊位签到码',sub:'生成、保存或放大 C-03 专属签到码',keywords:'签到 二维码 扫码 入场 签到码',icon:'i-qr',destination:'ven-signqr'},
  {name:'异常上报',sub:'提交水电、设备或现场问题工单',keywords:'工单 异常 故障 上报 维修 问题',icon:'i-alert',destination:'ven-report'},
  {name:'场内摊位地图',sub:'查看 C-03 位置和场地导览',keywords:'地图 位置 摊位 导览 C03 C-03',icon:'i-pin',destination:'ven-boothmap'},
  {name:'活动与报名',sub:'查看仍开放报名的集市活动',keywords:'活动 报名 招商 集市',icon:'i-tent',destination:'ven-events'},
  {name:'智能选位',sub:'根据经营品类查找推荐摊位',keywords:'选位 摊位 推荐 位置',icon:'i-spark',destination:'ven-pick'},
  {name:'入场须知',sub:'查看签到和现场经营规则',keywords:'规则 入场 安全 须知',icon:'i-shield',destination:'g-rule'}
];
function renderVendorSearch(keyword=''){
  const body=document.getElementById('vendorSearchBody');
  if(!body) return;
  const query=keyword.trim().toLowerCase();
  const matches=query?VENDOR_SEARCH_ITEMS.filter(item=>
    (item.name+item.sub+item.keywords).toLowerCase().includes(query)
  ):VENDOR_SEARCH_ITEMS;
  body.replaceChildren();
  const heading=document.createElement('div');
  heading.className='sec-title';
  heading.textContent=query?`管理功能 · ${matches.length} 项`:'常用经营工具';
  body.appendChild(heading);
  if(!query){
    const tags=document.createElement('div');
    tags.className='tagrow';
    ['待核验凭证','摊位签到码','我的评价','编辑名片','异常工单'].forEach(term=>{
      const button=document.createElement('button');
      button.className='tagpick';
      button.textContent=term;
      button.addEventListener('click',()=>vendorQuickSearch(term));
      tags.appendChild(button);
    });
    body.appendChild(tags);
  }
  if(!matches.length){
    const empty=document.createElement('div');
    empty.className='empty';
    empty.innerHTML='<h4>未找到相关经营功能</h4><p>试试搜索“缴费”“签到”“评价”或“名片”</p>';
    body.appendChild(empty);
    return;
  }
  const list=document.createElement('div');
  list.style.cssText='display:flex;flex-direction:column;gap:10px;margin-top:12px';
  matches.forEach(item=>{
    const row=document.createElement('button');
    row.className='li';
    row.style.cssText='width:100%;text-align:left;border:0;font:inherit;cursor:pointer';
    const avatar=document.createElement('span');
    avatar.className='avatar';
    avatar.style.cssText='background:var(--orange-soft);color:var(--orange)';
    avatar.innerHTML=`<svg width="20" height="20"><use href="#${item.icon}"/></svg>`;
    const content=document.createElement('span');
    content.className='li-main';
    const title=document.createElement('span');
    title.className='li-title';
    title.textContent=item.name;
    const detail=document.createElement('span');
    detail.className='li-sub';
    detail.textContent=item.sub;
    content.append(title,detail);
    const arrow=document.createElement('span');
    arrow.className='chip';
    arrow.style.cssText='background:var(--orange-soft);color:var(--orange)';
    arrow.textContent='打开';
    row.append(avatar,content,arrow);
    row.addEventListener('click',()=>{
      if(item.destination==='ven-card') closeVendorCardEditor();
      go(item.destination);
      if(item.edit) toggleVendorCardEditor();
    });
    list.appendChild(row);
  });
  body.appendChild(list);
}
function vendorSearch(keyword){renderVendorSearch(keyword);}
function vendorQuickSearch(keyword){
  document.getElementById('vendorSearchInput').value=keyword;
  renderVendorSearch(keyword);
}
function clearVendorSearch(){
  document.getElementById('vendorSearchInput').value='';
  renderVendorSearch();
}
function closeVendorCardEditor(){
  document.getElementById('vendorCardEditor').style.display='none';
}
const SEARCH_DB = [
  {t:'event', name:'星光文创市集 · 秋季场', sub:'进行中 · 广州 · 滨河文化广场', chip:'活动', cb:'go(\'evt-detail\')', k:'星光 文创 秋季 市集 广州'},
  {t:'event', name:'深圳湾咖啡青年市集', sub:'10.01 开幕 · 深圳 · 招商中', chip:'活动', cb:'go(\'evt-detail\')', k:'深圳 咖啡 青年 市集'},
  {t:'stall', name:'山野咖啡 · C-03', sub:'饮品区 · 手冲咖啡 · 4.8 分 · 有券', chip:'摊位', cb:'go(\'con-stall\')', k:'咖啡 c03 c-03 山野 饮品'},
  {t:'stall', name:'炭火研究所 · A-02', sub:'餐饮区 · 烤物 · 4.9 分 · 排队约 10 分钟', chip:'摊位', cb:'go(\'con-stall\')', k:'烤物 炭火 a02 a-02 牛肋条'},
  {t:'stall', name:'拾光手作 · B-04', sub:'文创区 · 皮具 DIY · 4.6 分', chip:'摊位', cb:'go(\'con-stall\')', k:'皮具 文创 手作 b04 b-04 拾光'},
  {t:'page', name:'优惠券中心', sub:'3 张可领取 · 1 张已抢完', chip:'功能', cb:'go(\'con-coupon\')', k:'券 优惠 领券 卡包'},
  {t:'page', name:'路线规划', sub:'选择目标摊位 · 智能场内导航', chip:'功能', cb:'go(\'con-route\')', k:'导航 路线 地图 规划'},
];
const searchDefaultHTML = document.getElementById('searchBody').innerHTML;
function gSearchRender(kw){
  const body = document.getElementById('searchBody');
  if(!kw){ body.innerHTML = searchDefaultHTML; return; }
  const hits = SEARCH_DB.filter(x=> (x.name+x.sub+x.k).toLowerCase().includes(kw.toLowerCase()));
  body.innerHTML = '<div class="sec-title" style="margin-top:4px">搜索结果 · '+hits.length+' 条</div>' +
    (hits.length ? hits.map(h=>
      '<div class="li" onclick="'+h.cb+'"><div class="avatar" style="background:var(--sky-soft);color:var(--sky2)"><svg width="18" height="18"><use href="#'+(h.t==='event'?'i-tent':h.t==='stall'?'i-store':'i-spark')+'"/></svg></div>'
      +'<div class="li-main"><div class="li-title">'+h.name+'</div><div class="li-sub">'+h.sub+'</div></div>'
      +'<span class="chip" style="background:var(--primary-soft);color:var(--primary)">'+h.chip+'</span></div>'
    ).join('') :
    '<div class="statewrap"><div class="stateico" style="background:var(--sky-soft);color:var(--sky2)"><svg width="36" height="36"><use href="#i-search"/></svg></div>'
    +'<h4>未找到「'+kw+'」相关内容</h4><p>试试「咖啡」「文创」或摊位编号「C-03」</p></div>');
}
function gSearch(v){ gSearchRender(v); }
function gQuick(kw){ document.getElementById('gSearchInput').value=kw; gSearchRender(kw); }
function doGlobalSearch(){
  const v = document.getElementById('gSearchInput').value.trim();
  if(v){ gSearchRender(v); } else { toast('请输入关键词，如「咖啡」或「C-03」'); }
}

/* ================= 筛选 / 分段控件 ================= */
function filterReset(){
  resetEventFilters();
  toast('已重置全部筛选条件');
}
function filterSort(el){
  const box = el.closest('.card');
  box.querySelectorAll('.chk').forEach(c=>c.classList.remove('on'));
  el.classList.add('on');
}
function selectButtonOption(btn, multiple){
  const isFilter = btn.classList.contains('fchip');
  const group = btn.closest(isFilter ? '.fchips' : '.tagrow');
  if(!group) return;
  const selector = isFilter ? '.fchip' : '.tagpick';
  const active = multiple ? !btn.classList.contains('on') : true;
  if(!multiple){
    group.querySelectorAll(selector).forEach(option=>{
      option.classList.remove('on');
      option.setAttribute('aria-pressed', 'false');
    });
  }
  btn.classList.toggle('on', active);
  btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  if(!multiple && group.id==='notifyTemplates') applyNotifyTemplate(btn.textContent.trim());
}
document.addEventListener('click', function(e){
  const btn = e.target.closest('button');
  if(!btn || btn.hasAttribute('onclick') || typeof btn.onclick === 'function') return;
  if(btn.classList.contains('fchip')){
    selectButtonOption(btn, false);
    return;
  }
  if(btn.classList.contains('tagpick')){
    selectButtonOption(btn, !!btn.closest('#con-rate'));
    return;
  }
  if(btn.classList.contains('tab') && btn.classList.contains('on')){
    const screen = btn.closest('.screen');
    if(screen) go(screen.id);
  }
});
const NOTICE_TEMPLATES = {
  '入场提醒':'【星光文创市集】各位摊主：明日 08:00 起可凭摊位二维码入场签到，10:30 后未签到摊位将按规则补位。餐饮区请提前检查水电接口，注意用火安全。',
  '缴费提醒':'【星光文创市集】请尚未缴费的商户于今日 20:00 前完成摊位及水电费用支付，并在商户端确认到账状态。',
  '撤场要求':'【星光文创市集】活动结束后请按现场指引有序撤场，清理摊位及周边垃圾，勿遗留设备或物品。',
  '天气预警':'【星光文创市集】预计活动时段有降雨，请各摊位做好防雨与用电安全检查，遇强风天气服从现场工作人员指引。'
};
const NOTICE_FEEDS = {
  org:[
    {category:'审核',title:'12 家商户报名待审核',detail:'其中 3 家餐饮商户需今天 18:00 前完成审核',icon:'i-users',color:'var(--amber)',bg:'var(--amber-soft)',destination:'org-audit',unread:true},
    {category:'工单',title:'A 区电箱跳闸工单待处理',detail:'炭火研究所 · A-02 · 现场电工已接单',icon:'i-bolt',color:'var(--red)',bg:'var(--red-soft)',destination:'org-ticket',unread:true},
    {category:'系统',title:'今日场地巡检报告已生成',detail:'消防通道与临时用电检查结果可查看',icon:'i-doc',color:'var(--primary)',bg:'var(--primary-soft)',destination:'org-risk',unread:false}
  ],
  ven:[
    {category:'活动',title:'主办方入场提醒',detail:'明日 08:00 开放入场，请携带摊位二维码签到',icon:'i-mega',color:'var(--sky2)',bg:'var(--sky-soft)',destination:'g-rule',unread:true},
    {category:'费用',title:'水电费 ¥40 待缴纳',detail:'请于今天 20:00 前完成支付并上传凭证',icon:'i-wallet',color:'var(--amber)',bg:'var(--amber-soft)',destination:'ven-pay',unread:true},
    {category:'工单',title:'现场工单 GD-018 进度更新',detail:'A 区电工已到场维修，请留意处理结果',icon:'i-alert',color:'var(--red)',bg:'var(--red-soft)',destination:'ven-report',unread:false},
    {category:'系统',title:'摊位签到服务可用',detail:'请在活动开放时间通过扫码或定位完成签到',icon:'i-qr',color:'var(--green)',bg:'var(--green-soft)',destination:'ven-signin',unread:false}
  ],
  con:[
    {category:'活动',title:'你收藏的星光文创市集今晚有灯市专场',detail:'活动提醒 · 今晚 19:30 舞台区点灯',icon:'i-tent',color:'var(--sky2)',bg:'var(--sky-soft)',destination:'evt-detail',unread:true},
    {category:'优惠',title:'山野咖啡为你准备了专属优惠券',detail:'满 ¥30 减 ¥5 · 今日活动期间可用',icon:'i-ticket',color:'var(--pink)',bg:'var(--pink-soft)',destination:'con-coupon',unread:true},
    {category:'互动',title:'你关注的饮品区摊位正在营业',detail:'山野咖啡 · C-03 · 距离你约 80 米',icon:'i-map',color:'var(--green)',bg:'var(--green-soft)',destination:'con-map',unread:false},
    {category:'系统',title:'智集优管 v2.4.0 已发布',detail:'新增摊位地图与活动服务功能',icon:'i-refresh',color:'var(--purple)',bg:'var(--purple-soft)',destination:'g-version',unread:false}
  ]
};
const CHECKIN_REMINDERS_KEY='market.demo.checkin-reminders.v1';
let notificationFilter = '全部';
let checkinReminderLoadFailed=false;
function loadCheckinReminders(){
  try{
    const reminders=JSON.parse(localStorage.getItem(CHECKIN_REMINDERS_KEY)||'[]');
    if(!Array.isArray(reminders)) throw new Error('Saved check-in reminders are invalid.');
    checkinReminderLoadFailed=false;
    return reminders;
  }catch(error){
    console.error('Unable to load check-in reminders.',error);
    if(!checkinReminderLoadFailed) toast('无法读取签到提醒记录');
    checkinReminderLoadFailed=true;
    return [];
  }
}
function saveCheckinReminders(reminders){
  if(checkinReminderLoadFailed) return false;
  try{
    localStorage.setItem(CHECKIN_REMINDERS_KEY,JSON.stringify(reminders));
    return true;
  }catch(error){
    console.error('Unable to save check-in reminders.',error);
    toast('签到提醒发送失败，请检查浏览器本地存储');
    return false;
  }
}
function currentNotifications(){
  if(activePortal==='ven'){
    const reminders=loadCheckinReminders().map(item=>({
      category:'活动',title:item.title,detail:item.detail,icon:'i-qr',color:'var(--amber)',bg:'var(--amber-soft)',
      destination:'ven-signin',unread:item.unread,reminderId:item.id
    }));
    return reminders.concat(NOTICE_FEEDS.ven);
  }
  return NOTICE_FEEDS[activePortal] || NOTICE_FEEDS.con;
}
function updateNotificationBadges(){
  [['org','#org-home .bdot'],['ven','#ven-home .bdot'],['con','#evt-list .bdot']].forEach(([role,selector])=>{
    const badge=document.querySelector(selector);
    if(!badge) return;
    const unread=role==='ven'
      ? NOTICE_FEEDS.ven.filter(notice=>notice.unread).length+loadCheckinReminders().filter(notice=>notice.unread).length
      : NOTICE_FEEDS[role].filter(notice=>notice.unread).length;
    badge.textContent=unread;
    badge.hidden=unread===0;
  });
}
function notificationCategories(){
  if(activePortal==='org') return ['全部','审核','工单','财务','通知','系统'];
  if(activePortal==='ven') return ['全部','活动','费用','工单','系统'];
  return ['全部','活动','优惠','互动','系统'];
}
function renderNotifyCenter(){
  const feed = document.getElementById('notifyFeed');
  if(!feed) return;
  const role = activePortal in NOTICE_FEEDS ? activePortal : 'con';
  const heading = role==='org' ? '主办方通知中心' : role==='ven' ? '商户通知中心' : '通知中心';
  document.querySelector('#g-notify .appbar h2').textContent = heading;
  const action = document.getElementById('notifyHeaderAction');
  action.textContent = role==='org' ? '发送通知' : '全部已读';
  action.onclick = role==='org' ? ()=>go('org-notify') : markAllNotificationsRead;
  updateNotificationBadges();
  const categories = notificationCategories();
  if(!categories.includes(notificationFilter)) notificationFilter='全部';
  const categoryBar = document.getElementById('notifyCategories');
  let buttons = Array.from(categoryBar.querySelectorAll('button'));
  while(buttons.length<categories.length){
    const b=document.createElement('button');
    b.addEventListener('click',function(){ notifySeg(this,this.dataset.category); });
    categoryBar.appendChild(b); buttons.push(b);
  }
  buttons.forEach((b,i)=>{
    const category=categories[i];
    b.hidden=!category;
    if(!category) return;
    b.textContent=category;
    b.dataset.category=category;
    b.classList.toggle('on',category===notificationFilter);
    b.setAttribute('aria-pressed',category===notificationFilter?'true':'false');
    b.onclick=function(){ notifySeg(this,category); };
  });
  feed.replaceChildren();
  const notices=currentNotifications().filter(n=>notificationFilter==='全部'||n.category===notificationFilter);
  if(!notices.length){
    const empty=document.createElement('div');
    empty.className='empty';
    empty.textContent='暂无此类通知';
    feed.appendChild(empty);
    return;
  }
  notices.forEach(notice=>{
    const row=document.createElement('div');
    row.className='li';
    row.style.alignItems='flex-start';
    row.style.cursor='pointer';
    row.setAttribute('role','button');
    row.tabIndex=0;
    const avatar=document.createElement('div');
    avatar.className='avatar';
    avatar.style.background=notice.bg;
    avatar.style.color=notice.color;
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('width','18'); svg.setAttribute('height','18');
    const use=document.createElementNS('http://www.w3.org/2000/svg','use');
    use.setAttribute('href','#'+notice.icon); svg.appendChild(use); avatar.appendChild(svg);
    const main=document.createElement('div'); main.className='li-main';
    const title=document.createElement('div'); title.className='li-title'; title.textContent=notice.title;
    const detail=document.createElement('div'); detail.className='li-sub'; detail.textContent=notice.detail;
    main.append(title,detail);
    row.append(avatar,main);
    if(notice.unread){
      const dot=document.createElement('i');
      dot.style.cssText='width:8px;height:8px;border-radius:99px;background:var(--pink);flex:none;margin-top:6px';
      dot.setAttribute('aria-label','未读');
      row.appendChild(dot);
    }
    const activate=function(){
      notice.unread=false;
      if(notice.reminderId){
        const reminders=loadCheckinReminders();
        const reminder=reminders.find(item=>item.id===notice.reminderId);
        if(reminder){reminder.unread=false;saveCheckinReminders(reminders);}
      }
      if(notice.message) toast(notice.message);
      else if(notice.destination) go(notice.destination);
      renderNotifyCenter();
    };
    row.addEventListener('click',activate);
    row.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); activate(); } });
    feed.appendChild(row);
  });
}
function notifySeg(btn, cat){
  notificationFilter=cat;
  btn.parentElement.querySelectorAll('button').forEach(b=>{
    const selected=b===btn;
    b.classList.toggle('on',selected);
    b.setAttribute('aria-pressed',selected?'true':'false');
  });
  renderNotifyCenter();
}
function markAllNotificationsRead(){
  currentNotifications().forEach(notice=>{ notice.unread=false; });
  if(activePortal==='ven'){
    const reminders=loadCheckinReminders().map(item=>Object.assign({},item,{unread:false}));
    saveCheckinReminders(reminders);
  }
  renderNotifyCenter();
  toast('已全部标记为已读');
}
function applyNotifyTemplate(template){
  const content=document.getElementById('orgNoticeContent');
  if(content && NOTICE_TEMPLATES[template]) content.value=NOTICE_TEMPLATES[template];
}
function sendOrgNotification(){
  if(activePortal!=='org'){ toast('仅管理员可以发送通知'); return; }
  const audience=document.querySelector('#notifyAudience .tagpick.on');
  const template=document.querySelector('#notifyTemplates .tagpick.on');
  const content=document.getElementById('orgNoticeContent');
  const message=content.value.trim();
  if(!audience || !template){ toast('请选择发送对象和通知模板'); return; }
  if(!message){ content.focus(); toast('请填写通知内容'); return; }
  const audienceName=audience.textContent.trim();
  const templateName=template.textContent.trim();
  const time=new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit',hour12:false});
  NOTICE_FEEDS.org.unshift({
    category:'通知',
    title:'已发送通知：'+templateName,
    detail:audienceName+' · '+time+' · '+message,
    icon:'i-mega',color:'var(--primary)',bg:'var(--primary-soft)',destination:'org-notify',message:message,unread:false
  });
  const reachesVendor=audienceName!=='餐饮区';
  if(reachesVendor){
    NOTICE_FEEDS.ven.unshift({
      category:templateName==='缴费提醒'?'费用':templateName==='天气预警'?'系统':'活动',
      title:'主办方通知：'+templateName,
      detail:audienceName+' · '+time+' · '+message,
      icon:'i-mega',color:'var(--sky2)',bg:'var(--sky-soft)',destination:'ven-home',message:message,unread:true
    });
  }
  const audienceCount={'全部商户':96,'餐饮区':35,'未缴费':21,'未签到':24}[audienceName]||0;
  updateNotificationBadges();
  toast('通知已发送至 '+audienceCount+' 家商户'+(reachesVendor?'，并同步至摊主通知中心':''));
}
updateNotificationBadges();
function stateSeg(btn, key){
  btn.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on');
  ['empty','loading','error','offline'].forEach(k=>{
    document.getElementById('state'+k[0].toUpperCase()+k.slice(1)).style.display = k===key ? 'block' : 'none';
  });
}
function subSeg(btn, key){
  btn.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on');
  document.getElementById('subSub').style.display = key==='sub'?'block':'none';
  document.getElementById('subOrder').style.display = key==='order'?'block':'none';
  document.getElementById('subInv').style.display = key==='inv'?'block':'none';
  document.getElementById('subCon').style.display = key==='con'?'block':'none';
}
function tgl(btn, name){
  btn.classList.toggle('on');
  toast((btn.classList.contains('on')?'已开启':'已关闭')+'「'+name+'」');
}
/* 方案对比 */
let cmpChoice = '安全优先型';
function cmpPick(el, name){
  el.parentElement.querySelectorAll('.chk').forEach(c=>c.classList.remove('on'));
  el.classList.add('on');
  cmpChoice = name;
  document.querySelectorAll('#cmpTable tr').forEach(tr=>tr.classList.remove('hl'));
  const colMap = {'安全优先型':2,'收益优先型':3,'体验优先型':4};
  const ci = colMap[name];
  document.querySelectorAll('#cmpTable tr').forEach(tr=>{
    if(tr.children[ci]) tr.children[ci].parentElement.classList.add('hl');
  });
  toast('已选择「'+name+'」');
}
function renderConsumerCheckin(){
  const event=EVENTS.find(item=>item.p===activeConsumerEventId);
  const eventName=document.getElementById('consumerCheckinEventName');
  const button=document.getElementById('ckBtn');
  const done=document.getElementById('ckDone');
  const status=document.getElementById('ckStatusText');
  const list=document.getElementById('consumerCheckinRecords');
  if(!event||!eventName||!button||!done||!status||!list) return;
  eventName.textContent=event.name+' · 逛集打卡码';
  const shared=loadSharedAttendance();
  if(attendanceLoadErrorReported) return;
  const records=shared.consumers.filter(item=>item.consumerId===DEMO_CONSUMER_ID)
    .sort((a,b)=>b.checkedAt-a.checkedAt);
  const checked=records.find(item=>item.eventId===event.p);
  done.style.display=checked?'block':'none';
  button.disabled=!!checked;
  button.innerHTML=checked?'<svg width="17" height="17"><use href="#i-check"/></svg>本场已打卡':'<svg width="17" height="17"><use href="#i-check"/></svg>模拟扫码打卡';
  if(checked) status.textContent=checked.date+' '+sgFmtTime(checked.checkedAt)+' · 已同步至管理者端';
  list.innerHTML=records.length?records.map(item=>{
    const recordEvent=EVENTS.find(candidate=>candidate.p===item.eventId);
    return '<div class="li" role="button" tabindex="0" onclick="openConsumerCheckinEvent('+item.eventId+')"><div class="avatar" style="background:var(--sky-soft);color:var(--sky2)"><svg width="18" height="18"><use href="#i-tent"/></svg></div>'+
      '<div class="li-main"><div class="li-title">'+escapeHTML(item.eventName)+'</div><div class="li-sub">'+escapeHTML(item.date+' '+sgFmtTime(item.checkedAt)+' 打卡 · '+(recordEvent?eventStatus(recordEvent).text:'活动信息已更新'))+'</div></div>'+
      '<span class="chip" style="background:var(--green-soft);color:var(--green)">已打卡</span></div>';
  }).join(''):'<div class="empty">暂无打卡记录</div>';
}
function openConsumerCheckinEvent(id){
  const event=EVENTS.find(item=>item.p===id);
  if(!event){toast('该活动已从目录移除');return;}
  activeConsumerEventId=event.p;
  go('evt-detail');
}
function doCheckin(){
  const event=EVENTS.find(item=>item.p===activeConsumerEventId);
  if(!event){toast('当前活动已不存在，无法打卡');return;}
  const shared=loadSharedAttendance();
  if(attendanceLoadErrorReported) return;
  if(shared.consumers.some(item=>item.eventId===event.p&&item.consumerId===DEMO_CONSUMER_ID)){
    toast('本场已打卡，无需重复操作');
    renderConsumerCheckin();
    return;
  }
  const now=Date.now();
  const record={id:'CK'+now,eventId:event.p,eventName:event.name,consumerId:DEMO_CONSUMER_ID,consumerName:'当前消费者',checkedAt:now,date:sgFmtDate(new Date(now))};
  try{
    localStorage.setItem(SHARED_ATTENDANCE_KEY,JSON.stringify({today:shared.today,records:shared.records,consumers:[record,...shared.consumers]}));
  }catch(error){
    console.error('Unable to save consumer check-in record.',error);
    toast('打卡记录无法保存，请检查浏览器存储空间');
    return;
  }
  renderConsumerCheckin();
  renderOrganizerCheckin();
  renderConsumerEventDetail();
  toast('打卡成功 · 记录已同步至管理者端');
}

/* ================================================================================
   摊主签到模块
   1) 内置 QR 编码器（字节模式 · 纠错等级 M · 版本 1~10）——已与 python qrcode 逐模块比对通过
   2) MockAPI：模拟 300~800ms 网络延迟与各类失败分支，替换为真实 fetch 即可对接后端
   3) 定位签到：权限检查 → 授权说明 → 定位 → Haversine 距离校验
   4) 扫码签到：真实摄像头优先，失败自动降级模拟扫码；调试面板可切换 5 种结果
   ================================================================================ */

/* ---------- 1. QR 编码器 ---------- */
const SGEXP = new Array(512), SGLOG = new Array(256);
(function(){ let x = 1; for(let i=0;i<255;i++){ SGEXP[i]=x; SGLOG[x]=i; x<<=1; if(x & 0x100) x ^= 0x11D; } for(let i=255;i<512;i++) SGEXP[i]=SGEXP[i-255]; })();
function sgGmul(a,b){ return (a===0||b===0)?0:SGEXP[SGLOG[a]+SGLOG[b]]; }
function sgGenPoly(deg){ let poly=[1]; for(let i=0;i<deg;i++){ const nx=new Array(poly.length+1).fill(0); for(let j=0;j<poly.length;j++){ nx[j]^=poly[j]; nx[j+1]^=sgGmul(poly[j],SGEXP[i]); } poly=nx; } return poly; }
/* RS 纠错码：GF(256)，生成多项式 0x11D */
function sgEcc(data, eccLen){ const gen=sgGenPoly(eccLen); const res=new Array(data.length+eccLen).fill(0); for(let i=0;i<data.length;i++) res[i]=data[i];
  for(let i=0;i<data.length;i++){ const c=res[i]; if(c!==0){ for(let j=0;j<gen.length;j++) res[i+j]^=sgGmul(gen[j],c); } } return res.slice(data.length); }
/* 版本 1~10 / 等级 M 的分块表：{t:总码字, e:每块纠错码字, b:[[块数,每块数据码字]]} */
const SG_QRC = [null,
 {t:26,e:10,b:[[1,16]]},{t:44,e:16,b:[[1,28]]},{t:70,e:26,b:[[1,44]]},
 {t:100,e:18,b:[[2,32]]},{t:134,e:24,b:[[2,43]]},{t:172,e:16,b:[[4,27]]},
 {t:196,e:18,b:[[4,31]]},{t:242,e:22,b:[[2,38],[2,39]]},{t:292,e:22,b:[[3,36],[2,37]]},
 {t:346,e:26,b:[[4,43],[1,44]]}];
const SG_ALIGN = {1:[],2:[6,18],3:[6,22],4:[6,26],5:[6,30],6:[6,34],7:[6,22,38],8:[6,24,42],9:[6,26,46],10:[6,28,50]};
const SG_MASKS = [
 (i,j)=>(i+j)%2===0, (i,j)=>i%2===0, (i,j)=>j%3===0, (i,j)=>(i+j)%3===0,
 (i,j)=>(Math.floor(i/2)+Math.floor(j/3))%2===0,
 (i,j)=>((i*j)%2+(i*j)%3)===0,
 (i,j)=>((i*j)%2+(i*j)%3)%2===0,
 (i,j)=>((i*j)%3+(i+j)%2)%2===0];
function sgPickVer(byteLen){ for(let v=1;v<=10;v++){ const cap=SG_QRC[v].b.reduce((s,[n,d])=>s+n*d,0)*8; if(cap >= 4 + (v<10?8:16) + byteLen*8) return v; } return 0; }
function sgBuildCW(bytes, version){
  const cfg=SG_QRC[version], dataLen=cfg.b.reduce((s,[n,d])=>s+n*d,0), bits=[];
  const push=(val,len)=>{ for(let i=len-1;i>=0;i--) bits.push((val>>i)&1); };
  push(4,4); push(bytes.length, version<10?8:16);
  for(const b of bytes) push(b,8);
  const cap=dataLen*8;
  for(let i=0;i<Math.min(4, cap-bits.length);i++) bits.push(0);
  while(bits.length%8) bits.push(0);
  const cw=[]; for(let i=0;i<bits.length;i+=8){ let v=0; for(let j=0;j<8;j++) v=(v<<1)|bits[i+j]; cw.push(v); }
  let pad=0xEC; while(cw.length<dataLen){ cw.push(pad); pad = pad===0xEC?0x11:0xEC; }
  return cw;
}
function sgInterleave(cw, version){
  const cfg=SG_QRC[version], blocks=[]; let off=0;
  cfg.b.forEach(([cnt,dl])=>{ for(let i=0;i<cnt;i++){ const d=cw.slice(off,off+dl); off+=dl; blocks.push({d:d, e:sgEcc(d,cfg.e)}); } });
  const maxD=Math.max.apply(null, blocks.map(b=>b.d.length)), out=[];
  for(let i=0;i<maxD;i++) blocks.forEach(b=>{ if(i<b.d.length) out.push(b.d[i]); });
  for(let i=0;i<cfg.e;i++) blocks.forEach(b=>out.push(b.e[i]));
  return out;
}
function sgBchDigit(n){ let d=0; while(n){ d++; n>>>=1; } return d; }
function sgBchTypeInfo(data){ let d=data<<10; while(sgBchDigit(d)-sgBchDigit(0x537)>=0) d^=(0x537<<(sgBchDigit(d)-sgBchDigit(0x537))); return ((data<<10)|d)^0x5412; }
function sgBchTypeNum(data){ let d=data<<12; while(sgBchDigit(d)-sgBchDigit(0x1F25)>=0) d^=(0x1F25<<(sgBchDigit(d)-sgBchDigit(0x1F25))); return (data<<12)|d; }
function sgFrame(version, withVersion){
  const size=version*4+17;
  const m=Array.from({length:size},()=>new Array(size).fill(null));
  const res=Array.from({length:size},()=>new Array(size).fill(false));
  const put=(r,c,v)=>{ if(r<0||c<0||r>=size||c>=size) return; m[r][c]=v; res[r][c]=true; };
  const finder=(r0,c0)=>{ for(let i=-1;i<=7;i++) for(let j=-1;j<=7;j++){
      const r=r0+i, c=c0+j; if(r<0||c<0||r>=size||c>=size) continue;
      let v=0;
      if(i>=0&&i<=6&&j>=0&&j<=6){
        const ring=(i===0||i===6||j===0||j===6), core=(i>=2&&i<=4&&j>=2&&j<=4);
        v=(ring||core)?1:0;
      }
      put(r,c,v);
    } };
  finder(0,0); finder(0,size-7); finder(size-7,0);
  for(let i=8;i<size-8;i++){ put(6,i, i%2===0?1:0); put(i,6, i%2===0?1:0); }
  const pos=SG_ALIGN[version];
  for(const r of pos) for(const c of pos){
    if((r===6&&c===6)||(r===6&&c===size-7)||(r===size-7&&c===6)) continue;
    for(let i=-2;i<=2;i++) for(let j=-2;j<=2;j++) put(r+i,c+j, (Math.abs(i)===2||Math.abs(j)===2||(i===0&&j===0))?1:0);
  }
  put(size-8,8,1);
  for(let i=0;i<=8;i++){ if(!res[8][i] && i!==6) put(8,i,0); if(!res[i][8] && i!==6) put(i,8,0); }
  for(let i=1;i<=7;i++) put(size-i,8,0);
  for(let i=1;i<=8;i++) put(8,size-i,0);
  if(version>=7){ const vb = withVersion ? sgBchTypeNum(version) : 0;
    for(let i=0;i<18;i++){ const bit=((vb>>i)&1)===1?1:0; put(Math.floor(i/3), size-11+(i%3), bit); put(size-11+(i%3), Math.floor(i/3), bit); } }
  return {size:size, m:m, res:res};
}
function sgPlace(fr, codewords, mask){
  const size=fr.size, m=fr.m, res=fr.res;
  let inc=-1, row=size-1, bitIndex=7, byteIndex=0;
  for(let col=size-1;col>0;col-=2){
    if(col===6) col--;
    for(;;){
      for(let c=0;c<2;c++){
        if(!res[row][col-c]){
          let dark=false;
          if(byteIndex<codewords.length) dark=(((codewords[byteIndex]>>>bitIndex)&1)===1);
          if(SG_MASKS[mask](row, col-c)) dark=!dark;
          m[row][col-c]=dark?1:0;
          bitIndex--; if(bitIndex===-1){ byteIndex++; bitIndex=7; }
        }
      }
      row+=inc;
      if(row<0||size<=row){ row-=inc; inc=-inc; break; }
    }
  }
  return m;
}
function sgPutFormat(m, ecBits, mask){
  const size=m.length, fmt=sgBchTypeInfo((ecBits<<3)|mask);
  for(let i=0;i<15;i++){
    const v=((fmt>>i)&1)===1?1:0;
    if(i<6) m[i][8]=v; else if(i<8) m[i+1][8]=v; else m[size-15+i][8]=v;
    if(i<8) m[8][size-i-1]=v; else if(i<9) m[8][15-i-1+1]=v; else m[8][15-i-1]=v;
  }
  m[size-8][8]=1;
  return m;
}
/* 掩模评分（ISO/IEC 18004 四条规则） */
function sgLostPoint(m){
  const n=m.length; let lp=0;
  const container=new Array(n+1).fill(0);
  for(let row=0;row<n;row++){ let prev=m[row][0], len=0;
    for(let col=0;col<n;col++){ if(m[row][col]===prev) len++; else { if(len>=5) container[len]++; len=1; prev=m[row][col]; } }
    if(len>=5) container[len]++; }
  for(let col=0;col<n;col++){ let prev=m[0][col], len=0;
    for(let row=0;row<n;row++){ if(m[row][col]===prev) len++; else { if(len>=5) container[len]++; len=1; prev=m[row][col]; } }
    if(len>=5) container[len]++; }
  for(let L=5;L<=n;L++) lp+=container[L]*(L-2);
  for(let row=0;row<n-1;row++) for(let col=0;col<n-1;col++){
    const tr=m[row][col+1];
    if(tr!==m[row+1][col+1]) continue;
    if(tr!==m[row][col]) continue;
    if(tr!==m[row+1][col]) continue;
    lp+=3;
  }
  const sh=n-10;
  for(let row=0;row<n;row++) for(let col=0;col<sh;col++){
    const r=m[row];
    if(!r[col+1]&&r[col+4]&&!r[col+5]&&r[col+6]&&!r[col+9]&&(
      (r[col]&&r[col+2]&&r[col+3]&&!r[col+7]&&!r[col+8]&&!r[col+10])||
      (!r[col]&&!r[col+2]&&!r[col+3]&&r[col+7]&&r[col+8]&&r[col+10]))) lp+=40;
    if(r[col+10]) col++;
  }
  for(let col=0;col<n;col++) for(let row=0;row<sh;row++){
    const g=r=>m[r][col];
    if(!g(row+1)&&g(row+4)&&!g(row+5)&&g(row+6)&&!g(row+9)&&(
      (g(row)&&g(row+2)&&g(row+3)&&!g(row+7)&&!g(row+8)&&!g(row+10))||
      (!g(row)&&!g(row+2)&&!g(row+3)&&g(row+7)&&g(row+8)&&g(row+10)))) lp+=40;
    if(g(row+10)) row++;
  }
  let dark=0; for(let r=0;r<n;r++) for(let c=0;c<n;c++) dark+=m[r][c];
  lp += Math.floor(Math.abs(dark/(n*n)*100-50)/5)*10;
  return lp;
}
function sgQrEncode(text){
  const bytes=Array.from(new TextEncoder().encode(text));
  const version=sgPickVer(bytes.length);
  if(!version) throw new Error('内容过长，超出版本 10 容量');
  const codewords=sgInterleave(sgBuildCW(bytes,version), version);
  let best=null, bestScore=Infinity, bestMask=0;
  for(let mask=0;mask<8;mask++){
    const fr=sgFrame(version, false);
    const m=sgPlace(fr, codewords, mask);
    m[fr.size-8][8]=0;                     // 评估阶段不写入格式位与固定黑模块（与参考实现一致）
    const s=sgLostPoint(m);
    if(s<bestScore){ bestScore=s; best=m; bestMask=mask; }
  }
  if(version>=7){ const vb=sgBchTypeNum(version), size=best.length;
    for(let i=0;i<18;i++){ const v=((vb>>i)&1)===1?1:0; best[Math.floor(i/3)][size-11+(i%3)]=v; best[size-11+(i%3)][Math.floor(i/3)]=v; } }
  sgPutFormat(best, 0, bestMask);
  return best;
}
function sgQrSvg(text, px){
  const m=sgQrEncode(text), n=m.length, q=4, total=n+q*2;
  let r='';
  for(let i=0;i<n;i++) for(let j=0;j<n;j++) if(m[i][j]) r += '<rect x="'+(j+q)+'" y="'+(i+q)+'" width="1" height="1"/>';
  return '<svg viewBox="0 0 '+total+' '+total+'" width="'+px+'" height="'+px+'" shape-rendering="crispEdges" style="border-radius:12px">'
       + '<rect width="'+total+'" height="'+total+'" fill="#fff"/><g fill="#171A26">'+r+'</g></svg>';
}

/* ---------- 2. 基础工具 ---------- */
function sgPad(n){ return n<10 ? '0'+n : ''+n; }
function sgFmtDate(d){ return d.getFullYear()+'-'+sgPad(d.getMonth()+1)+'-'+sgPad(d.getDate()); }
function sgFmtTime(ts){ const d=new Date(ts); return sgPad(d.getHours())+':'+sgPad(d.getMinutes()); }
/* Haversine：两点球面距离，返回整数米 */
function sgHaversine(lat1,lng1,lat2,lng2){
  const R=6371000, toRad=Math.PI/180;
  const dLat=(lat2-lat1)*toRad, dLng=(lng2-lng1)*toRad;
  const a=Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(lat1*toRad)*Math.cos(lat2*toRad)*Math.sin(dLng/2)*Math.sin(dLng/2);
  return Math.round(2*R*Math.asin(Math.sqrt(a)));
}
function sgRandToken(len){
  const s='abcdefghijklmnopqrstuvwxyz0123456789'; let t='';
  for(let i=0;i<(len||16);i++) t += s.charAt(Math.floor(Math.random()*s.length));
  return t;
}
function sgEndOfToday(){ const d=new Date(); d.setHours(23,59,59,999); return d.getTime(); }
/* 统一提示：成功绿 / 失败红，不使用原生 alert */
let sgToastTimer;
function sgToast(msg, type){
  const el=document.getElementById('toast'), tx=document.getElementById('toastText');
  tx.textContent=msg;
  el.className = 'show ' + (type==='ok'?'ok':type==='err'?'err':'');
  clearTimeout(sgToastTimer);
  sgToastTimer=setTimeout(()=>{ el.className=''; }, 2200);
}

/* ---------- 3. 数据与 Mock 服务层 ---------- */
const SG_STALL = {stallId:'C-03', stallName:'山野咖啡', market:'星光文创市集（广州滨河）', lat:23.106600, lng:113.324500, addr:'广州滨河市集 · 饮品区 C-03 附近'};
const SG_CFG = {radius:200, timeout:10000};
const SHARED_ATTENDANCE_KEY='market.demo.attendance.v1';
const DEMO_CONSUMER_ID='consumer-demo';
const SGStore = {
  today: null,        // 今日签到记录（SigninRecord）
  records: [],        // 签到记录列表
  qr: null,           // 摊位当日签到码（StallQrCode）
  scenario: 'ok',     // 模拟扫码场景
  busy: false         // 防抖：定位/扫码进行中
};
let attendanceLoadErrorReported=false;
function loadSharedAttendance(){
  try{
    const saved=JSON.parse(localStorage.getItem(SHARED_ATTENDANCE_KEY)||'null');
    if(!saved){attendanceLoadErrorReported=false;return {today:null,records:[],consumers:[]};}
    if(!Array.isArray(saved.records)||!Array.isArray(saved.consumers||[])) throw new Error('Saved attendance data is invalid.');
    attendanceLoadErrorReported=false;
    return {today:saved.today||null,records:saved.records,consumers:saved.consumers||[]};
  }catch(error){
    console.error('Unable to load shared attendance records.',error);
    if(!attendanceLoadErrorReported){toast('无法读取签到记录，请检查浏览器本地存储');attendanceLoadErrorReported=true;}
    return {today:null,records:[],consumers:[]};
  }
}
function persistAttendanceRecord(record){
  const records=[record,...SGStore.records.filter(item=>item.id!==record.id)];
  try{
    const shared=loadSharedAttendance();
    if(attendanceLoadErrorReported) return false;
    localStorage.setItem(SHARED_ATTENDANCE_KEY,JSON.stringify({today:record,records:records,consumers:shared.consumers}));
    SGStore.today=record;
    SGStore.records=records;
    return true;
  }catch(error){
    console.error('Unable to save shared attendance record.',error);
    return false;
  }
}
function refreshSharedAttendance(){
  const saved=loadSharedAttendance();
  if(attendanceLoadErrorReported) return;
  SGStore.records=saved.records;
  SGStore.today=saved.today&&saved.today.date===sgFmtDate(new Date())?saved.today:null;
}
let organizerCheckinEventId=EVENTS[0]?EVENTS[0].p:1;
function renderOrganizerCheckin(){
  const summary=document.getElementById('orgCheckinSummary');
  const timeline=document.getElementById('orgCheckinTimeline');
  if(!summary||!timeline) return;
  const event=EVENTS.find(item=>item.p===organizerCheckinEventId);
  const records=SGStore.records.filter(item=>item.eventId===organizerCheckinEventId&&item.status==='success')
    .sort((a,b)=>b.signinAt-a.signinAt);
  const todayCount=records.filter(item=>item.date===sgFmtDate(new Date())).length;
  summary.innerHTML='<div class="card row" style="gap:20px"><div class="donut" style="background:conic-gradient(var(--primary) '+(todayCount?'100':'0')+'%,var(--line) 0 100%)"><div class="d-in"><b>'+todayCount+'</b><span>今日签到</span></div></div>'+
    '<div style="flex:1"><div style="font-size:13px;font-weight:700">'+escapeHTML(event?event.name:'未选择活动')+'</div>'+
    '<div style="font-size:11.5px;color:var(--sub);margin-top:6px;line-height:1.7">当前演示摊主：'+escapeHTML(SG_STALL.stallName+' · '+SG_STALL.stallId)+'<br>签到方式：二维码 / 定位校验</div>'+
    '<span class="chip" style="background:'+(todayCount?'var(--green-soft)':'var(--amber-soft)')+';color:'+(todayCount?'var(--green)':'var(--amber)')+';margin-top:8px">'+(todayCount?'已签到':'待签到')+'</span></div>'+
    '<select class="input" aria-label="选择活动查看签到" onchange="selectOrganizerCheckinEvent(this.value)" style="max-width:145px">'+EVENTS.map(item=>'<option value="'+item.p+'" '+(item.p===organizerCheckinEventId?'selected':'')+'>'+escapeHTML(item.name)+'</option>').join('')+'</select></div>';
  const action=document.getElementById('orgVendorCheckinAction');
  if(action){action.textContent=todayCount?'当前演示摊主已签到':'提醒摊主完成签到';action.disabled=!!todayCount;}
  if(!records.length){
    timeline.innerHTML='<div class="card" style="font-size:12px;color:var(--sub)">本活动暂无来自摊主端的签到记录。</div>';
  }else{
    timeline.innerHTML='<div class="card"><div class="timeline">'+records.slice(0,10).map(record=>
      '<div class="tl-item done"><div class="tl-t">'+escapeHTML(record.stallName||record.stallId)+' · '+escapeHTML(record.stallId)+'</div>'+
      '<div class="tl-s">'+escapeHTML(record.date+' '+sgFmtTime(record.signinAt)+' · '+(record.method==='location'?'定位签到':'扫码签到')+' · 校验通过')+'</div></div>'
    ).join('')+'</div></div>';
  }
  const consumerSummary=document.getElementById('orgConsumerCheckinSummary');
  const consumerTimeline=document.getElementById('orgConsumerCheckinTimeline');
  if(consumerSummary&&consumerTimeline){
    const consumerRecords=loadSharedAttendance().consumers.filter(item=>item.eventId===organizerCheckinEventId)
      .sort((a,b)=>b.checkedAt-a.checkedAt);
    const people=new Set(consumerRecords.map(item=>item.consumerId));
    consumerSummary.innerHTML='<div class="card" style="font-size:13px;font-weight:700">本活动已打卡 '+people.size+' 位消费者</div>';
    consumerTimeline.innerHTML=consumerRecords.length
      ? '<div class="card"><div class="timeline">'+consumerRecords.slice(0,10).map(item=>'<div class="tl-item done"><div class="tl-t">'+escapeHTML(item.consumerName||'消费者')+' · '+escapeHTML(item.eventName)+'</div><div class="tl-s">'+escapeHTML(item.date+' '+sgFmtTime(item.checkedAt)+' · 消费者活动打卡')+'</div></div>').join('')+'</div></div>'
      : '<div class="card" style="font-size:12px;color:var(--sub)">本活动暂无消费者打卡记录。</div>';
  }
}
function selectOrganizerCheckinEvent(id){
  organizerCheckinEventId=Number(id);
  renderOrganizerCheckin();
}
function notifyVendorCheckin(){
  if(activePortal!=='org'){toast('仅管理者可以提醒摊主签到');return;}
  refreshSharedAttendance();
  if(SGStore.today&&SGStore.today.eventId===organizerCheckinEventId){toast('当前演示摊主已签到，无需提醒');renderOrganizerCheckin();return;}
  const event=EVENTS.find(item=>item.p===organizerCheckinEventId);
  const reminders=loadCheckinReminders();
  if(checkinReminderLoadFailed) return;
  reminders.unshift({
    id:'CR'+Date.now(),eventId:organizerCheckinEventId,eventName:event?event.name:'当前活动',
    title:'主办方签到提醒',detail:(event?event.name+' · ':'')+'请山野咖啡（C-03）尽快完成现场签到。',
    createdAt:Date.now(),unread:true
  });
  if(!saveCheckinReminders(reminders)) return;
  updateNotificationBadges();
  toast('签到提醒已同步至当前浏览器的摊主通知中心');
}
function sgMakeRecord(method, extra){
  const rec = {id:'SG'+Date.now(), stallId:SG_STALL.stallId, stallName:SG_STALL.stallName, eventId:1, eventName:EVENTS.find(event=>event.p===1)?.name||SG_STALL.market, method:method, signinAt:Date.now(), date:sgFmtDate(new Date()), status:'success'};
  if(method==='location') rec.location = {lat:extra.lat, lng:extra.lng, distance:extra.distance, address:SG_STALL.addr};
  else rec.scanCode = {token:extra.token, raw:extra.raw};
  return rec;
}
/* MockAPI：接口与后端约定一致，替换为本文件外的 fetch 即可 */
const MockAPI = {
  _delay(){ return 300 + Math.round(Math.random()*500); },          // 模拟 300~800ms 网络延迟
  call(fn){ const self=this; return new Promise(function(res){ setTimeout(function(){ res(fn()); }, self._delay()); }); },
  /* GET /api/stall/signin/today */
  getToday(){ return this.call(function(){ return SGStore.today; }); },
  /* GET /api/stall/signin/qrcode */
  getQrcode(refresh){
    return this.call(function(){
      const date = sgFmtDate(new Date());
      if(refresh || !SGStore.qr || SGStore.qr.date!==date){
        const token = sgRandToken(16);
        SGStore.qr = {stallId:SG_STALL.stallId, stallName:SG_STALL.stallName, token:token, date:date, expireAt:sgEndOfToday(), content:''};
        SGStore.qr.content = JSON.stringify({type:'stall_signin', stallId:SG_STALL.stallId, token:token, date:date, expireAt:SGStore.qr.expireAt});
      }
      return SGStore.qr;
    });
  },
  /* POST /api/stall/signin/location */
  postLocation(p){
    return this.call(function(){
      const distance = sgHaversine(p.lat, p.lng, SG_STALL.lat, SG_STALL.lng);
      refreshSharedAttendance();
      if(SGStore.today) return {success:false, duplicate:true, message:'您今日已签到'};
      if(distance <= SG_CFG.radius){
        const rec = sgMakeRecord('location', {lat:p.lat, lng:p.lng, distance:distance});
        if(!persistAttendanceRecord(rec)) return {success:false,message:'签到已校验，但记录无法保存并同步至管理者端，请检查浏览器存储'};
        return {success:true, distance:distance, message:'签到成功', record:rec};
      }
      return {success:false, distance:distance, message:'您距离摊位约 '+distance+' 米，暂不在签到范围内（需在 '+SG_CFG.radius+' 米内）'};
    });
  },
  /* POST /api/stall/signin/qrcode —— 四层校验：类型 / 摊位 / 有效期 / token */
  postQrcode(raw, force){
    return this.call(function(){
      refreshSharedAttendance();
      let data = null;
      try{ data = JSON.parse(raw); }catch(e){ return {success:false, message:'不是有效的签到码'}; }
      if(!data || data.type !== 'stall_signin') return {success:false, message:'不是有效的签到码'};
      if(data.stallId !== SG_STALL.stallId) return {success:false, message:'这不是您摊位的签到码'};
      if(!data.expireAt || data.expireAt < Date.now()) return {success:false, message:'签到码已过期，请让摊位管理员刷新'};
      if(!SGStore.qr || data.token !== SGStore.qr.token) return {success:false, message:'签到码无效'};
      if(force==='duplicate' || SGStore.today) return {success:false, duplicate:true, message:'您今日已签到'};
      const rec = sgMakeRecord('qrcode', {token:data.token, raw:raw});
      if(!persistAttendanceRecord(rec)) return {success:false,message:'签到已校验，但记录无法保存并同步至管理者端，请检查浏览器存储'};
      return {success:true, message:'签到成功', record:rec};
    });
  },
  /* GET /api/stall/signin/records */
  getRecords(){ return this.call(function(){ return SGStore.records; }); }
};

/* ---------- 4. 签到入口页 ---------- */
function sgGoSignin(){ sgRenderState(); go('ven-signin'); }
function sgRenderState(){
  const box=document.getElementById('sgStateCard');
  const bLoc=document.getElementById('sgBtnLoc'), bScan=document.getElementById('sgBtnScan');
  const r=SGStore.today;
  if(r){
    const way = r.method==='location' ? '定位签到' : '扫码签到';
    const place = r.location ? (r.location.address + ' · 偏差 ' + r.location.distance + ' 米') : '摊位立牌二维码';
    box.innerHTML =
      '<div class="row" style="justify-content:space-between">' +
        '<div class="row" style="gap:12px">' +
          '<div style="width:44px;height:44px;border-radius:16px;background:var(--green-soft);color:var(--green);display:flex;align-items:center;justify-content:center"><svg width="22" height="22"><use href="#i-check"/></svg></div>' +
          '<div><b style="font-size:15px">今日已签到</b><div style="font-size:11.5px;color:var(--sub);margin-top:3px">' + sgFmtTime(r.signinAt) + ' · ' + way + '</div></div>' +
        '</div>' +
        '<span class="chip" style="background:var(--green-soft);color:var(--green)">正常</span>' +
      '</div>' +
      '<div class="sig-meta">' +
        '<div class="m"><span>签到方式</span><b>' + way + '</b></div>' +
        '<div class="m"><span>签到时间</span><b>' + sgFmtTime(r.signinAt) + '</b></div>' +
        '<div class="m" style="grid-column:1/3"><span>签到地点</span><b>' + place + '</b></div>' +
      '</div>';
    bLoc.className='btn ghost'; document.getElementById('sgLocLabel').textContent='今日已签到';
    bScan.className='btn ghost';
  }else{
    box.innerHTML =
      '<div class="row" style="justify-content:space-between">' +
        '<div class="row" style="gap:12px">' +
          '<div style="width:44px;height:44px;border-radius:16px;background:var(--amber-soft);color:var(--amber);display:flex;align-items:center;justify-content:center"><svg width="22" height="22"><use href="#i-clock"/></svg></div>' +
          '<div><b style="font-size:15px">今日未签到</b><div style="font-size:11.5px;color:var(--sub);margin-top:3px">请在 10:30 前完成签到</div></div>' +
        '</div>' +
        '<span class="chip" style="background:var(--amber-soft);color:var(--amber)">待签到</span>' +
      '</div>' +
      '<div class="sig-meta">' +
        '<div class="m"><span>签到方式</span><b>定位 / 扫码</b></div>' +
        '<div class="m"><span>截止时间</span><b>今日 10:30</b></div>' +
      '</div>';
    bLoc.className='btn'; document.getElementById('sgLocLabel').textContent='定位签到';
    bScan.className='btn ghost';
  }
  const hs=document.getElementById('venHomeStatus');
  if(hs) hs.textContent = r ? '已签到' : '未签到';
}
/* 签到成功后统一刷新各端状态 */
function sgApplyRecord(rec){
  SGStore.today = rec;
  sgRenderState();
  renderOrganizerCheckin();
  renderConsumerEventDetail();
  renderConsumerCheckin();
}

/* ---------- 5. 定位签到：权限流程 + 距离校验 ---------- */
function sgSetLocLoading(on){
  const b=document.getElementById('sgBtnLoc');
  if(on){ b.classList.add('loading'); document.getElementById('sgLocLabel').textContent='正在定位…'; }
  else { b.classList.remove('loading'); document.getElementById('sgLocLabel').textContent = SGStore.today ? '今日已签到' : '定位签到'; }
}
async function sgLocationSignin(){
  if(SGStore.busy) return;                                    // 防抖：重复点击直接忽略
  if(SGStore.today){ sgToast('您今日已签到','err'); return; }    // 重复签到拦截
  if(!navigator.geolocation){ sgToast('当前环境不支持定位，请使用扫码签到','err'); return; }
  SGStore.busy = true;
  let perm='prompt';
  if(navigator.permissions && navigator.permissions.query){
    try{ perm = (await navigator.permissions.query({name:'geolocation'})).state; }catch(e){ perm='prompt'; }
  }
  if(perm==='denied'){ SGStore.busy=false; sgShowPermDenied(); return; }
  if(perm==='prompt'){
    const ok = await sgConfirm({
      icon:'<svg width="24" height="24"><use href="#i-pin"/></svg>', iconBg:'var(--primary-soft)', iconColor:'var(--primary)',
      title:'需要获取位置权限',
      text:'签到需要获取您的位置，用于确认您已到达摊位现场。位置信息仅用于签到校验，不会用于其他用途。'
    });
    if(!ok){ SGStore.busy=false; sgToast('未授权定位，无法完成定位签到','err'); return; }
  }
  sgDoLocate();
}
function sgDoLocate(){
  sgSetLocLoading(true);
  let settled=false;
  const done=function(){ if(!settled){ settled=true; SGStore.busy=false; sgSetLocLoading(false); } };
  navigator.geolocation.getCurrentPosition(function(pos){
    done(); sgFinishLoc(pos.coords.latitude, pos.coords.longitude);
  }, function(err){
    done();
    if(err.code===1) sgShowPermDenied();                                   // 用户拒绝
    else if(err.code===3) sgToast('定位超时，请到空旷处重试','err');          // 超时（10s）
    else sgToast('定位失败，请检查网络或 GPS','err');
  }, {enableHighAccuracy:true, timeout:SG_CFG.timeout, maximumAge:0});
}
async function sgFinishLoc(lat, lng){
  const res = await MockAPI.postLocation({lat:lat, lng:lng});
  if(res.success){ sgApplyRecord(res.record); sgToast('签到成功 · 距离摊位 '+res.distance+' 米','ok'); }
  else if(res.duplicate){ sgToast(res.message,'err'); sgRenderState(); }
  else if(typeof res.distance==='number') sgShowOutRange(res.distance);
  else sgToast(res.message||'签到失败，请稍后重试','err');
}
/* 演示：模拟定位结果（覆盖 成功 / 超范围 / 超时 / 拒绝） */
function sgMockLoc(kind){
  if(SGStore.busy) return;
  if(SGStore.today){ sgToast('您今日已签到','err'); return; }
  if(kind==='timeout'){ sgToast('定位超时，请到空旷处重试','err'); return; }
  if(kind==='deny'){ sgShowPermDenied(); return; }
  SGStore.busy=true; sgSetLocLoading(true);
  setTimeout(function(){
    SGStore.busy=false; sgSetLocLoading(false);
    const near = (kind==='inner');
    sgFinishLoc(SG_STALL.lat + (near?0.00042:0.01580), SG_STALL.lng + (near?0.00035:0.00180));
  }, 700);
}
function sgShowOutRange(distance){
  sgDialog({
    icon:'<svg width="24" height="24"><use href="#i-pin"/></svg>', iconBg:'var(--red-soft)', iconColor:'var(--red)',
    title:'不在签到范围内',
    text:'您距离摊位约 '+distance+' 米，暂不在签到范围内（需在 '+SG_CFG.radius+' 米内）。请到摊位现场后重试。',
    actions:[
      {text:'改用扫码签到', fn:function(){ setTimeout(sgOpenScan, 250); }},
      {text:'重新定位', primary:true, fn:function(){ sgLocationSignin(); }}
    ]
  });
}
function sgShowPermDenied(){
  sgDialog({
    icon:'<svg width="24" height="24"><use href="#i-shield"/></svg>', iconBg:'var(--amber-soft)', iconColor:'var(--amber)',
    title:'定位权限已被关闭',
    text:'系统定位权限为「拒绝」状态，无法完成定位签到。请按以下步骤开启：',
    extra:'<div class="steps">1. 打开手机「设置 → 应用 → 浏览器 / App」<br>2. 进入「权限管理 → 位置信息」<br>3. 选择「仅在使用中允许」<br>4. 返回本页面点击「重新定位」</div>',
    actions:[
      {text:'改用扫码签到', fn:function(){ setTimeout(sgOpenScan, 250); }},
      {text:'重新定位', primary:true, fn:function(){ sgLocationSignin(); }}
    ]
  });
}
/* 通用弹窗（不使用原生 alert） */
function sgDialog(opt){
  const m=document.getElementById('sgMask'), d=document.getElementById('sgDlg');
  const ic=document.getElementById('sgDlgIcon');
  ic.innerHTML = opt.icon || ''; ic.style.background = opt.iconBg || 'var(--primary-soft)'; ic.style.color = opt.iconColor || 'var(--primary)';
  document.getElementById('sgDlgTitle').textContent = opt.title || '';
  const tx=document.getElementById('sgDlgText'); tx.textContent = opt.text || ''; tx.style.display = opt.text ? 'block' : 'none';
  document.getElementById('sgDlgExtra').innerHTML = opt.extra || '';
  const acts=document.getElementById('sgDlgActs'); acts.innerHTML='';
  (opt.actions||[]).forEach(function(a){
    const b=document.createElement('button');
    b.className = a.primary ? 'p' : 's';
    b.textContent = a.text;
    b.onclick = function(){ sgCloseDialog(); if(a.fn) a.fn(); };
    acts.appendChild(b);
  });
  m.classList.add('show'); d.classList.add('show');
}
function sgCloseDialog(){
  document.getElementById('sgMask').classList.remove('show');
  document.getElementById('sgDlg').classList.remove('show');
}
function sgConfirm(opt){
  return new Promise(function(res){
    sgDialog({
      icon:opt.icon, iconBg:opt.iconBg, iconColor:opt.iconColor, title:opt.title, text:opt.text,
      actions:[{text:'暂不允许', fn:function(){ res(false); }},{text:'允许', primary:true, fn:function(){ res(true); }}]
    });
  });
}

/* ---------- 6. 扫码签到页 ---------- */
let sgCamStream=null, sgMode='mock', sgScanBusy=false;
function sgOpenScan(){
  SGStore.busy=false;
  go('ven-signscan');
  sgUpdateModeTag();
  sgTryCamera();          // 优先真实摄像头，失败自动降级模拟扫码
}
function sgTryCamera(){
  const v=document.getElementById('sgVideo');
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){ sgSetMode('mock', true); return; }
  navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}}).then(function(s){
    sgCamStream=s; v.srcObject=s;
    const p=v.play(); if(p && p.catch) p.catch(function(){});
    sgSetMode('real', false);
  }).catch(function(){ sgSetMode('mock', true); });
}
function sgSetMode(mode, silent){
  sgMode = mode;
  document.getElementById('sgView').classList.toggle('real', mode==='real');
  sgUpdateModeTag();
  if(mode==='mock' && !silent) sgToast('已切换为模拟扫码模式');
  if(mode==='mock' && silent) sgToast('未获取到摄像头，已自动切换为模拟扫码模式');
}
function sgStopCamera(){
  if(sgCamStream){ sgCamStream.getTracks().forEach(function(t){ t.stop(); }); sgCamStream=null; }
  const v=document.getElementById('sgVideo'); if(v) v.srcObject=null;
}
function sgUpdateModeTag(){
  const t=document.getElementById('sgModeTag');
  if(t) t.textContent = sgMode==='real' ? '真实模式' : '模拟模式';
}
function sgToggleMode(){
  if(sgMode==='real'){ sgStopCamera(); sgSetMode('mock', false); return; }
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){ sgToast('当前环境无摄像头，保持模拟模式'); return; }
  navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}}).then(function(s){
    sgCamStream=s; document.getElementById('sgVideo').srcObject=s;
    const p=document.getElementById('sgVideo').play(); if(p && p.catch) p.catch(function(){});
    sgSetMode('real', false); sgToast('已切换为真实摄像头扫码');
  }).catch(function(){ sgToast('摄像头不可用，保持模拟模式'); });
}
function sgScanClose(){
  document.getElementById('sgDebug').classList.remove('show');
  sgStopCamera();
  back();
}
function sgTorch(){
  const btn=document.getElementById('sgTorch'); btn.classList.toggle('on');
  const on=btn.classList.contains('on');
  if(sgCamStream){
    const tr=sgCamStream.getVideoTracks()[0];
    if(tr && tr.applyConstraints){ try{ tr.applyConstraints({advanced:[{torch:on}]}); }catch(e){} }
  }
  sgToast(on ? '手电筒已开启' : '手电筒已关闭');
}
function sgToggleDebug(force){
  const d=document.getElementById('sgDebug');
  if(force===true) d.classList.add('show');
  else if(force===false) d.classList.remove('show');
  else d.classList.toggle('show');
}
function sgPickScenario(el){
  document.querySelectorAll('#sgDebug .sg-opt').forEach(function(o){ o.classList.remove('on'); });
  el.classList.add('on');
  SGStore.scenario = el.dataset.k;
  sgToast('已选择：' + el.querySelector('.ot').textContent.split('：')[0]);
}
/* 按场景生成二维码原文 */
function sgScenarioRaw(kind){
  const base = SGStore.qr || {stallId:SG_STALL.stallId, token:sgRandToken(16), date:sgFmtDate(new Date())};
  if(kind==='ok')         return JSON.stringify({type:'stall_signin', stallId:SG_STALL.stallId, token:base.token, date:base.date, expireAt:sgEndOfToday()});
  if(kind==='expired')    return JSON.stringify({type:'stall_signin', stallId:SG_STALL.stallId, token:base.token, date:base.date, expireAt:Date.now()-3600000});
  if(kind==='other')      return JSON.stringify({type:'stall_signin', stallId:'B-09', token:base.token, date:base.date, expireAt:sgEndOfToday()});
  if(kind==='invalid')    return JSON.stringify({type:'stall_signin', stallId:SG_STALL.stallId, token:'zzzzzzzzzzzzzzzz', date:base.date, expireAt:sgEndOfToday()});
  if(kind==='duplicate')  return JSON.stringify({type:'stall_signin', stallId:SG_STALL.stallId, token:base.token, date:base.date, expireAt:sgEndOfToday()});
  return JSON.stringify({type:'other_code', stallId:SG_STALL.stallId});
}
function sgMockScan(){
  if(sgScanBusy) return;
  sgScanBusy = true;
  const view=document.getElementById('sgView');
  view.classList.add('fast');                       // 扫描线加速 + 轻微震动
  if(navigator.vibrate) { try{ navigator.vibrate(30); }catch(e){} }
  setTimeout(function(){
    view.classList.remove('fast');
    sgScanBusy = false;
    sgSubmitRaw(sgScenarioRaw(SGStore.scenario), SGStore.scenario);
  }, 1000);
}
function sgPickAlbum(){ document.getElementById('sgFile').click(); }
document.getElementById('sgFile').addEventListener('change', function(){
  sgToast('已从相册识别（模拟）');
  setTimeout(sgMockScan, 600);
});
function sgManualInput(){
  sgDialog({
    icon:'<svg width="24" height="24"><use href="#i-edit"/></svg>', iconBg:'var(--purple-soft)', iconColor:'var(--purple)',
    title:'手动输入签到码',
    text:'粘贴二维码内容后提交，将走同一套校验逻辑。',
    extra:'<textarea id="sgRawInput" placeholder=\'{"type":"stall_signin","stallId":"C-03","token":"...","date":"'+sgFmtDate(new Date())+'","expireAt":'+sgEndOfToday()+'}\'></textarea>',
    actions:[
      {text:'取消'},
      {text:'提交签到', primary:true, fn:function(){
        const raw=(document.getElementById('sgRawInput')||{}).value || '';
        if(!raw.trim()){ sgToast('请输入签到码内容','err'); return; }
        setTimeout(function(){ sgSubmitRaw(raw.trim()); }, 200);
      }}
    ]
  });
}
async function sgSubmitRaw(raw, force){
  if(SGStore.today && force!=='duplicate'){ sgToast('您今日已签到','err'); return; }
  const res = await MockAPI.postQrcode(raw, force);
  sgScanClose();
  if(res.success){ go('ven-signin'); sgApplyRecord(res.record); sgToast('签到成功 · 扫码校验通过','ok'); }
  else { go('ven-signin'); sgToast(res.message,'err'); }
}

/* ---------- 7. 摊位专属签到码 ---------- */
function sgRenderQr(){
  const qr=SGStore.qr;
  document.getElementById('sgQrBox').innerHTML = sgQrSvg(qr.content, 186);
  document.getElementById('sgQrToken').textContent = 'token：' + qr.token + ' · ' + qr.date;
  document.getElementById('sgQrExpire').textContent = '今日 23:59 前有效（' + qr.date + '）';
}
async function sgEnsureQr(refresh){
  const qr = await MockAPI.getQrcode(refresh);
  sgRenderQr();
  return qr;
}
function sgRefreshQr(){
  sgEnsureQr(true).then(function(){ sgToast('签到码已刷新，旧码立即失效','ok'); });
}
function sgSaveQr(){ sgToast('已保存到相册（演示）','ok'); }
function sgZoomQr(){
  if(!SGStore.qr){ sgEnsureQr(false).then(sgZoomQr); return; }
  document.getElementById('sgZoomBox').innerHTML = sgQrSvg(SGStore.qr.content, 268);
  document.getElementById('sgZoom').classList.add('show');
}
function sgCloseZoom(){ document.getElementById('sgZoom').classList.remove('show'); }

/* ---------- 8. 签到记录 ---------- */
function sgOpenRecords(){
  go('ven-signrec');
  MockAPI.getRecords().then(sgRenderRecords);
}
function sgRenderRecords(list){
  const box=document.getElementById('sgRecBody');
  if(!list.length){
    box.innerHTML = '<div class="statewrap"><div class="stateico" style="background:var(--bg);color:#B7BDCF"><svg width="40" height="40"><use href="#i-history"/></svg></div>'
      + '<h4>暂无签到记录</h4><p>完成首次签到后，这里会显示时间、方式与位置偏差</p></div>';
    return;
  }
  box.innerHTML = list.map(function(r){
    const ok=r.status==='success';
    const way = r.method==='location' ? '定位签到' : '扫码签到';
    const sub = ok
      ? (r.location ? '位置偏差 '+r.location.distance+' 米 · '+r.location.address : 'token '+(r.scanCode?r.scanCode.token.slice(0,8):'')+'…')
      : (r.failReason || '签到失败');
    return '<div class="li" style="margin-bottom:10px">'
      + '<div class="avatar" style="background:'+(ok?'var(--green-soft)':'var(--red-soft)')+';color:'+(ok?'var(--green)':'var(--red)')+'">'
      + '<svg width="20" height="20"><use href="#'+(ok?'i-check':'i-alert')+'"/></svg></div>'
      + '<div class="li-main"><div class="li-title">'+r.date+' '+sgFmtTime(r.signinAt)+' · '+way+'</div>'
      + '<div class="li-sub">'+sub+'</div></div>'
      + '<span class="chip" style="background:'+(ok?'var(--green-soft)':'var(--red-soft)')+';color:'+(ok?'var(--green)':'var(--red)')+'">'+(ok?'成功':'失败')+'</span></div>';
  }).join('');
}

/* ---------- 9. 初始化 / 边界处理 ---------- */
(function sgInit(){
  const d=new Date();
  const wd=['周日','周一','周二','周三','周四','周五','周六'][d.getDay()];
  const el=document.getElementById('sgTodayDate');
  if(el) el.textContent = sgFmtDate(d) + ' ' + wd;
  /* 预置历史记录：两条成功 + 一条失败，便于查看记录页 */
  const savedAttendance=loadSharedAttendance();
  SGStore.records=savedAttendance.records;
  SGStore.today=savedAttendance.today&&savedAttendance.today.date===sgFmtDate(new Date())?savedAttendance.today:null;
  let hasSavedAttendance=false;
  try{hasSavedAttendance=!!localStorage.getItem(SHARED_ATTENDANCE_KEY);}
  catch(error){console.error('Unable to check saved attendance state.',error);sgToast('无法检查签到记录存储状态','err');}
  if(!hasSavedAttendance){
    const y1=Date.now()-86400000, y2=Date.now()-172800000;
    SGStore.records = [
      {id:'SG-2', stallId:SG_STALL.stallId, method:'qrcode', signinAt:y1, date:sgFmtDate(new Date(y1)), status:'success', scanCode:{token:sgRandToken(16), raw:'{...}'}},
      {id:'SG-3', stallId:SG_STALL.stallId, method:'location', signinAt:y2, date:sgFmtDate(new Date(y2)), status:'success', location:{lat:SG_STALL.lat+0.0003, lng:SG_STALL.lng+0.0002, distance:38, address:SG_STALL.addr}},
      {id:'SG-4', stallId:SG_STALL.stallId, method:'location', signinAt:y2-3600000, date:sgFmtDate(new Date(y2)), status:'failed', failReason:'定位超时，请到空旷处重试'}
    ];
  }
  sgRenderState();
  renderOrganizerCheckin();
  sgEnsureQr(false);                    // 预生成当日摊位签到码
})();
/* 页面切到后台再回来：重置定位进行中状态，避免按钮卡在 loading */
document.addEventListener('visibilitychange', function(){
  if(document.hidden){ SGStore.busy=false; sgSetLocLoading(false); sgScanBusy=false; }
});
window.addEventListener('storage',function(event){
  if(event.key===SHARED_EVENTS_KEY){
    loadSharedEvents();
    renderEvents();
    renderVendorHomeEvents();
    renderVendorEvents();
    renderVendorEventDetail();
    renderOrganizerEvents();
    renderOrganizerHomeEvents();
    renderOrganizerCheckin();
    renderConsumerEventDetail();
    renderConsumerCheckin();
  }
  if(event.key===SHARED_ATTENDANCE_KEY){
    const saved=loadSharedAttendance();
    SGStore.records=saved.records;
    SGStore.today=saved.today&&saved.today.date===sgFmtDate(new Date())?saved.today:null;
    sgRenderState();
    renderOrganizerCheckin();
    renderConsumerEventDetail();
    renderConsumerCheckin();
  }
  if(event.key===CHECKIN_REMINDERS_KEY){
    updateNotificationBadges();
    if(activePortal==='ven'&&current==='g-notify') renderNotifyCenter();
  }
});
/* 模式标签：短按切换真实/模拟，长按 600ms 打开调试面板；取景框长按同样可打开 */
(function(){
  const bind=function(el){
    if(!el) return;
    let timer=null, long=false;
    el.addEventListener('pointerdown', function(){ long=false; timer=setTimeout(function(){ long=true; sgToggleDebug(true); }, 600); });
    el.addEventListener('pointerup', function(){ clearTimeout(timer); if(!long && el.id==='sgModeTag') sgToggleMode(); });
    el.addEventListener('pointerleave', function(){ clearTimeout(timer); });
  };
  bind(document.getElementById('sgModeTag'));
  bind(document.getElementById('sgView'));
})();
