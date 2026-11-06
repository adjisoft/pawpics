/* pro.js — PawPics v3, dimuat paling akhir:
   Kolase (Minimal/Freestyle/Posters/Puzzles + rasio, jarak, sudut, margin, latar pola),
   efek Ulangi (grid, scatter, field, radial, linear, sepanjang path) dan efek 3D (ekstrusi, miring, bayangan panjang, refleksi)
   untuk teks, foto, bentuk, dan vektor. Hook render: REP / D3 / bgPat dipanggil dari render() di app.js. */
(()=>{
const rnd=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w));c.height=Math.max(1,Math.round(h));return c};
const TM2=mk(4,4);

/* ---------- latar pola ---------- */
const PATK={dots:'Titik',stripe:'Garis',check:'Papan',grid:'Kotak',heart:'Hati',paw:'Cakar',star:'Bintang'};
function patTile(b){const key=b.k+b.c+b.c2;if(patTile.c&&patTile.c.k==key)return patTile.c.t;const t=mk(64,64),q=t.getContext('2d');q.fillStyle=q.strokeStyle=b.c2;q.lineWidth=4;
 if(b.k=='dots'){q.beginPath();q.arc(32,32,8,0,7);q.fill()}
 else if(b.k=='stripe'){q.beginPath();q.moveTo(-8,40);q.lineTo(40,-8);q.moveTo(24,72);q.lineTo(72,24);q.stroke()}
 else if(b.k=='check'){q.fillRect(0,0,32,32);q.fillRect(32,32,32,32)}
 else if(b.k=='grid'){q.lineWidth=2;q.strokeRect(0,0,64,64)}
 else if(b.k=='paw'){q.translate(14,14);q.scale(1.5,1.5);[[5,11,2.2],[9.2,6,2.4],[14.8,6,2.4],[19,11,2.2]].forEach(a=>{q.beginPath();q.arc(a[0],a[1],a[2],0,7);q.fill()});q.fill(new Path2D('M12 11.5c-3 0-6 3.6-6 6.2 0 1.6 1.5 2.5 3 2.1 1-.3 2-.5 3-.5s2 .2 3 .5c1.5.4 3-.5 3-2.1 0-2.6-3-6.2-6-6.2z'))}
 else{q.font='34px sans-serif';q.textAlign='center';q.textBaseline='middle';q.fillText(b.k=='heart'?'♥':'★',32,34)}
 patTile.c={k:key,t};return t}
window.bgPat=(x,b)=>{x.fillStyle=b.c;x.fillRect(0,0,D.w,D.h);const p=x.createPattern(patTile(b),'repeat');if(p){p.setTransform(new DOMMatrix().scale(b.s||1));x.fillStyle=p;x.fillRect(0,0,D.w,D.h)}};

/* ---------- ukur teks ---------- */
function tm(l){if(l.t!='text')return;const q=TM2.getContext('2d');q.font=`${l.it?'italic ':''}${l.b?'700 ':''}${l.s}px ${l.ff}`;q.letterSpacing=(l.ls||0)+'px';const ln=l.txt.split('\n');l.w=Math.max(10,...ln.map(s=>q.measureText(s).width));l.h=l.s*1.25*ln.length}

/* ---------- ULANGI ---------- */
function pathPts(l){const v=L.find(q=>q.uid&&q.uid==l.rp.pl&&q.t=='vec'),P=[];
 if(v){const c=Math.cos(v.r),s=Math.sin(v.r),n=v.nodes,m=n.length;for(let k=1;k<(v.closed?m+1:m);k++)for(let t=0;t<=1;t+=.025){const b=bz(n[k-1],n[k%m],t);P.push({x:v.x+b.x*c-b.y*s,y:v.y+b.x*s+b.y*c})}}
 else for(let i=0;i<=80;i++)P.push({x:D.w*.1+D.w*.8*i/80,y:D.h/2+Math.sin(i/80*Math.PI*2)*D.h*.12});
 const A=[0];for(let i=1;i<P.length;i++)A.push(A[i-1]+Math.hypot(P[i].x-P[i-1].x,P[i].y-P[i-1].y));
 const T=A[A.length-1]||1,o=[];for(let i=0;i<=200;i++){const d=T*i/200;let k=A.findIndex(z=>z>=d);if(k<1)k=1;const u=(d-A[k-1])/((A[k]-A[k-1])||1);o.push({x:P[k-1].x+(P[k].x-P[k-1].x)*u,y:P[k-1].y+(P[k].y-P[k-1].y)*u})}
 o.closed=v&&v.closed;return o}
function repInst(l){const r=l.rp,n=Math.max(1,Math.min(400,r.n|0)),R=rnd(r.sd||1),o=[],I=(x,y,a,s,p)=>o.push({x,y,a:a||0,s:s??1,p:p??1}),
 j=v=>(R()*2-1)*v,sj=()=>Math.max(.05,1+j((r.sj||0)/100)),rj=()=>j(r.rj||0),m=r.m;
 if(m=='grid'){const c=Math.max(1,r.c|0),dx=l.w*(1+r.g/100),dy=l.h*(1+r.g/100);for(let i=0;i<n;i++)for(let k=0;k<c;k++)I(l.x+(k-(c-1)/2)*dx+(r.st&&i%2?dx/2:0),l.y+(i-(n-1)/2)*dy,rj(),sj())}
 else if(m=='scatter')for(let i=0;i<n;i++){const a=R()*7,d=Math.sqrt(R())*r.rad;I(l.x+Math.cos(a)*d,l.y+Math.sin(a)*d,rj(),sj(),1-R()*(r.oj||0)/100)}
 else if(m=='field'){const c=Math.ceil(Math.sqrt(n*D.w/D.h)),rw=Math.ceil(n/c),cw=D.w/c,ch=D.h/rw,jt=(r.jt||0)/200;for(let i=0;i<n;i++)I((i%c+.5+j(jt))*cw,((i/c|0)+.5+j(jt))*ch,rj(),sj())}
 else if(m=='radial'){const g=Math.max(1,r.rg|0);for(let q=0;q<g;q++)for(let i=0;i<n;i++){const a=(r.a0||0)*Math.PI/180+i/n*Math.PI*2+q*.3,d=r.rad*(q+1)/g;I(l.x+Math.cos(a)*d,l.y+Math.sin(a)*d,r.ro?a*180/Math.PI+90:0,1)}}
 else if(m=='linear'){const a=(r.ag||0)*Math.PI/180;for(let i=0;i<n;i++)I(l.x+Math.cos(a)*r.dd*i,l.y+Math.sin(a)*r.dd*i,(r.rs||0)*i,Math.max(.05,1+(r.ss||0)/100*i),Math.max(0,1+(r.os||0)/100*i))}
 else if(m=='path'){const P=pathPts(l),dv=P.closed?n:Math.max(1,n-1);for(let i=0;i<n;i++){const t=i/dv*(P.length-1),k=Math.min(P.length-2,t|0),f=t-k,a=P[k],b=P[k+1];I(a.x+(b.x-a.x)*f,a.y+(b.y-a.y)*f,r.al?Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI:0,Math.max(.05,1+(r.ss||0)/100*i),1)}}
 return o}
window.REP=(DL,l,x)=>{tm(l);if(l.t=='img')adv(l);repInst(l).forEach(p=>{const c={...l,x:p.x,y:p.y,r:l.r+p.a*Math.PI/180,op:l.op*p.p,rp:null,_ri:1};
 if(l.t=='text')c.s=l.s*p.s;else if(l.t=='vec')c._vs=p.s;else{c.w=l.w*p.s;c.h=l.h*p.s}DL(c,x)})};

/* ---------- 3D ---------- */
function ps3(A,ry,rx,pf){const W=A.width,H=A.height,f=(W+H)*(2.4-2*pf/100),K=z=>Math.min(3,f/Math.max(f+z,f*.25)),B=mk(W,H);let q=B.getContext('2d'),a=ry*Math.PI/180,C=Math.cos(a),S=Math.sin(a);
 for(let i=0;i<W;i++){const X=i-W/2,k=K(X*S);q.drawImage(A,i,0,1,H,W/2+X*C*k,H/2-H*k/2,Math.max(1,C*k+.8),H*k)}
 const E=mk(W,H);q=E.getContext('2d');a=rx*Math.PI/180;C=Math.cos(a);S=Math.sin(a);
 for(let j=0;j<H;j++){const Y=j-H/2,k=K(-Y*S);q.drawImage(B,0,j,W,1,W/2-W*k/2,H/2+Y*C*k,W*k,Math.max(1,C*k+.8))}return E}
function exr(A,d){const W=A.width,H=A.height,O=mk(W,H),q=O.getContext('2d'),a=(d.da??45)*Math.PI/180,n=Math.min(90,Math.ceil(d.dp)),st=d.dp/n,s=mk(W,H),t=s.getContext('2d');
 t.drawImage(A,0,0);t.globalCompositeOperation='source-in';t.fillStyle=d.dc||'#4338ca';t.fillRect(0,0,W,H);
 for(let i=n;i>=1;i--){if(d.lg)q.globalAlpha=Math.max(0,1-i/n*.95);else q.filter=`brightness(${100-(d.sh??35)*i/n}%)`;q.drawImage(s,Math.cos(a)*st*i,Math.sin(a)*st*i)}
 q.filter='none';q.globalAlpha=1;q.drawImage(A,0,0);return O}
function rfl(S,k,H0){const W=S.width,H=S.height,O=mk(W,H*1.5),q=O.getContext('2d');q.drawImage(S,0,0);q.save();q.translate(0,H*2);q.scale(1,-1);q.drawImage(S,0,0);q.restore();
 q.globalCompositeOperation='destination-out';const g=q.createLinearGradient(0,H,0,H*1.5);g.addColorStop(0,`rgba(0,0,0,${1-k/100})`);g.addColorStop(1,'#000');q.fillStyle=g;q.fillRect(0,H,W,H*.5);return O}
window.D3=(DL,l,x)=>{const d=l.d3;tm(l);const e=l.e||E0,pad=Math.ceil((d.dp||0)*1.2+(e.sb||0)*2+(e.ow||0)+(l.sw||0)+40),W=Math.min(3000,Math.ceil(l.w+pad*2)),H=Math.min(3000,Math.ceil(l.h+pad*2)),A=mk(W,H);
 DL({...l,x:W/2,y:H/2,r:0,fh:0,fv:0,op:1,bm:'source-over',d3:null,_3d:1,rp:null,mk:null},A.getContext('2d'));
 let S=A;if(d.ry||d.rx)S=ps3(S,d.ry||0,d.rx||0,d.pf??50);if(d.dp>0)S=exr(S,d);if(d.rf)S=rfl(S,d.rf);
 x.save();x.globalAlpha=l.op;x.globalCompositeOperation=l.bm||'source-over';x.translate(l.x,l.y);x.rotate(l.r);if(l.fh||l.fv)x.scale(l.fh?-1:1,l.fv?-1:1);x.drawImage(S,-S.width/2,-H/2);x.restore()};

/* ---------- KOLASE ---------- */
const CO={cat:'min',ri:1,li:0,gap:16,rad:20,mg:40,bg:{t:'color',c:'#ffffff'},srcs:[],ord:[],ov:{},cp:-1};
const RT=[['1:1',1080,1080],['4:5',1080,1350],['3:4',1080,1440],['9:16',1080,1920],['16:9',1920,1080],['3:2',1620,1080]];
const GR=(c,r)=>{const o=[];for(let j=0;j<r;j++)for(let i=0;i<c;i++)o.push([i/c,j/r,1/c,1/r]);return o};
const LY={min:[GR(2,2),GR(1,2),GR(2,1),GR(3,1),GR(1,3),GR(3,3),[[0,0,1,.58],[0,.58,.5,.42],[.5,.58,.5,.42]],[[0,0,.62,1],[.62,0,.38,.5],[.62,.5,.38,.5]],[[0,0,.5,.62],[.5,0,.5,.38],[0,.62,.5,.38],[.5,.38,.5,.62]],[[0,0,1,.5],[0,.5,.34,.5],[.34,.5,.33,.5],[.67,.5,.33,.5]],[[0,0,.5,.5],[.5,0,.5,.5],[0,.5,1,.5]],[[0,0,.33,.5],[.33,0,.67,.5],[0,.5,.67,.5],[.67,.5,.33,.5]]],
 free:[[[.06,.08,.52,.4,-6],[.42,.2,.52,.4,5],[.1,.52,.52,.4,4],[.44,.6,.48,.34,-4]],[[.1,.06,.55,.42,-5],[.38,.34,.55,.42,4],[.1,.62,.5,.32,-3]],[[.04,.05,.46,.3,-5],[.5,.08,.46,.3,4],[.27,.36,.46,.3,-2],[.04,.68,.46,.28,3],[.5,.66,.46,.3,-4]],[[.15,.08,.7,.55,-3],[.1,.58,.4,.34,5],[.5,.62,.4,.3,-6]]],
 pos:[{c:[[0,0,1,.6],[0,.6,.34,.25],[.34,.6,.33,.25],[.67,.6,.33,.25]],t:[['MY MEMORIES',.5,.92,.1,'#18181b','Anton']]},{c:[[0,0,.5,.8],[.5,0,.5,.4],[.5,.4,.5,.4]],t:[['SUMMER',.5,.9,.12,'#be185d','Righteous']]},{c:[[0,.12,1,.5],[0,.62,.5,.26],[.5,.62,.5,.26]],t:[['Weekend Vibes',.5,.06,.08,'#111827','Pacifico'],['@namakamu',.5,.94,.04,'#6b7280','Poppins']]}],
 pol:[],puz:[[[0,.25,.5,.5,0,'circ'],[.5,.25,.5,.5,0,'circ']],[[.02,.12,.5,.5,0,'heart'],[.48,.38,.5,.5,0,'heart']],[[.25,.05,.5,.5,0,'star'],[0,.5,.5,.5,0,'star'],[.5,.5,.5,.5,0,'star']],[[.25,0,.5,.5,0,'circ'],[0,.5,.5,.5,0,'circ'],[.5,.5,.5,.5,0,'circ']],[[.25,0,.5,.5,0,'diamond'],[0,.25,.5,.5,0,'diamond'],[.5,.25,.5,.5,0,'diamond'],[.25,.5,.5,.5,0,'diamond']],[[0,.05,.5,.5,0,'hex'],[.5,.05,.5,.5,0,'hex'],[.25,.5,.5,.5,0,'hex']],[[.05,.1,.9,.9,0,'heart']]]};
window.COX={LY};const CLY=()=>LY[CO.cat].map(q=>Array.isArray(q)?{c:q}:q);
const PHC=['#fbcfe8','#bfdbfe','#bbf7d0','#fde68a','#ddd6fe','#fed7aa'];
function ph(i){const c=mk(600,600),q=c.getContext('2d'),g=q.createLinearGradient(0,0,600,600);g.addColorStop(0,PHC[i%6]);g.addColorStop(1,PHC[(i+2)%6]);q.fillStyle=g;q.fillRect(0,0,600,600);q.fillStyle='rgba(0,0,0,.25)';q.font='bold 200px system-ui';q.textAlign='center';q.textBaseline='middle';q.fillText('+',300,310);return c}
function bake(s,w,h,sh,rad,fr){const c=mk(w,h),q=c.getContext('2d');w=c.width;h=c.height;const b=fr?Math.round(Math.min(w,h)*.05):0,ix=b,iy=b,iw=w-2*b,ih=h-2*b-(fr?b*1.8:0);
 if(fr){q.fillStyle='#fff';q.beginPath();q.roundRect(0,0,w,h,Math.min(rad,10));q.fill()}
 if(sh){q.translate(w/2,h/2);q.clip(path(sh,w,h));q.translate(-w/2,-h/2)}else{q.beginPath();q.roundRect(ix,iy,iw,ih,Math.max(0,Math.min(rad,iw/2,ih/2)));q.clip()}
 const k=Math.max(iw/s.width,ih/s.height),sw=iw/k,sh2=ih/k;q.drawImage(s,(s.width-sw)/2,(s.height-sh2)/2,sw,sh2,ix,iy,iw,ih);return c}
function colApply(){const R=RT[CO.ri];D.w=R[1];D.h=R[2];D.t=1;D.bg={...CO.bg};L=L.filter(l=>!l.col);sel=-1;
 const q=CLY()[CO.li]||CLY()[0],free=CO.cat=='free'||CO.cat=='pol',n=CO.srcs.length,mg=CO.mg,gp=CO.gap,aw=D.w-2*mg+gp,ah=D.h-2*mg+gp;
 if(CO.ord.length!=n)CO.ord=[...Array(n).keys()];
 (q.f?q.f(D.w,D.h):q.c).forEach((u,i)=>{let x,y,w,h;if(free){x=(u[0]+u[2]/2)*D.w;y=(u[1]+u[3]/2)*D.h;w=u[2]*D.w;h=u[3]*D.h}else{x=mg-gp/2+(u[0]+u[2]/2)*aw;y=mg-gp/2+(u[1]+u[3]/2)*ah;w=u[2]*aw-gp;h=u[3]*ah-gp}
  if(u[5]){w=h=Math.min(w,h)}
  const s=CO.ov[i]||(n?CO.srcs[CO.ord[i%n]]:ph(i)),c=bake(s,w,h,u[5]||'',CO.rad,free);
  L.push({t:'img',cv:c,orig:c,x,y,w,h,f:{...DF},m:null,op:1,r:(u[4]||0)*Math.PI/180,col:1,ci:i,e:free?{...E0,sb:26,so:10,sc:'rgba(0,0,0,.35)'}:{...E0}})});
 (q.t||[]).forEach(t=>{T(t[0],t[1]*D.w,t[2]*D.h,t[3]*D.w,t[4],1,FK[t[5]]||FK.Poppins);Object.assign(L[L.length-1],{col:1,tx:1})});
 fit();ui();draw();loadF()}
const toCv=f=>new Promise((ok,no)=>{const u=URL.createObjectURL(f);li(u).then(i=>{const k=Math.min(1,2000/Math.max(i.width,i.height)),c=mk(i.width*k,i.height*k);c.getContext('2d').drawImage(i,0,0,c.width,c.height);ok(c)},no)});
const fo=$('#fi').onchange;$('#fi').onchange=e=>{if(fm!='col'&&fm!='colcell')return fo(e);const fs=[...e.target.files];e.target.value='';snap();
 Promise.all(fs.map(toCv)).then(cs=>{if(fm=='col')CO.srcs.push(...cs);else if(cs[0])CO.ov[CO.cp]=cs[0];colApply()}).catch(()=>toast('Gagal membaca foto'))};

/* ---------- aksi ---------- */
const M=()=>Math.min(D.w,D.h),mx=()=>Math.max(D.w,D.h);
const RD={grid:l=>({n:3,c:3,g:10,st:0,sj:0,rj:0}),scatter:l=>({n:24,rad:Math.round(M()*.4),sj:40,rj:60,oj:30,sd:1}),field:l=>({n:40,jt:60,sj:30,rj:30,sd:1}),radial:l=>({n:12,rg:1,rad:Math.round(M()*.3),a0:0,ro:1}),linear:l=>({n:8,dd:Math.round(l.w*.5),ag:0,ss:-6,rs:8,os:-6}),path:l=>{const v=L.find(q=>q.t=='vec');if(v&&!v.uid)v.uid=Math.random().toString(36).slice(2);return{n:12,pl:v?v.uid:'',al:1,ss:0}}};
const D3P={'Ekstrusi':{dp:40,da:45,dc:'#4338ca',sh:35},'Isometrik':{dp:50,da:90,ry:-30,rx:25,pf:30,dc:'#6366f1',sh:30},'Miring kiri':{ry:-40,pf:55},'Miring kanan':{ry:40,pf:55},'Rebah':{rx:55,pf:55,dp:20,da:90,dc:'#1e293b'},'Bayangan panjang':{dp:90,da:45,lg:1,dc:'#000000'},'Lantai':{rf:55},'Kartu 3D':{ry:-25,rx:10,pf:50,dp:14,da:60,dc:'#111827',rf:30}};
const sh0=()=>{const l=sl();return l&&l.t=='img'&&l.col?l:null};
Object.assign(XA,{
 co_cat:v=>{CO.cat=v;CO.li=0;CO.ov={};colApply()},co_lay:v=>{CO.li=+v;CO.ov={};colApply()},co_rt:v=>{CO.ri=+v;colApply()},
 co_bgc:v=>{CO.bg={t:'color',c:v};D.bg={...CO.bg}},co_pat:v=>{CO.bg={t:'pat',k:v,c:CO.bg.t=='color'?CO.bg.c:CO.bg.c||'#fff1f2',c2:CO.bg.c2||'#fbcfe8',s:1};D.bg={...CO.bg}},
 co_shuf:()=>{const o=CO.ord;for(let i=o.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[o[i],o[j]]=[o[j],o[i]]}colApply()},
 co_add:()=>pick('col'),co_clr:()=>{CO.srcs=[];CO.ov={};colApply()},
 co_use:()=>{const p=L.filter(l=>l.t=='img'&&!l.pt&&!l.col);if(!p.length){toast('Belum ada foto di kanvas');return}CO.srcs.push(...p.map(l=>l.orig));L=L.filter(l=>!p.includes(l));colApply()},
 co_rep:()=>{const l=sh0();if(l){CO.cp=l.ci;pick('colcell')}},
 rp_m:v=>{const l=sl();if(l)l.rp={m:v,...RD[v](l)}},rp_off:()=>{const l=sl();if(l)delete l.rp},rp_sd:()=>{const l=sl();if(l&&l.rp)l.rp.sd=1+Math.floor(Math.random()*9999)},
 d3_p:v=>{const l=sl();if(l)l.d3={m:1,dp:0,da:45,dc:'#4338ca',sh:35,ry:0,rx:0,pf:50,rf:0,lg:0,...D3P[v]}},d3_off:()=>{const l=sl();if(l)delete l.d3}});
let raf=0;P.addEventListener('pointerdown',e=>{if(e.target.dataset.q)snap()});
P.addEventListener('input',e=>{const t=e.target,q=t.dataset.q;if(!q)return;const[a,k]=q.split('.'),l=sl(),v=t.type=='checkbox'?(t.checked?1:0):['range','number'].includes(t.type)?+t.value:t.value;
 if(t.type=='range'){const b=t.parentNode.querySelector('b');if(b)b.textContent=Math.round(v*100)/100}
 if(a=='co'){if(k=='hue'){CO.bg={t:'color',c:`hsl(${v} 75% 86%)`};D.bg={...CO.bg};draw()}
  else if(k=='bgc'||k=='bgc2'||k=='ps'){if(CO.bg.t!='pat'&&k=='bgc2')return;CO.bg[k=='bgc'?'c':k=='bgc2'?'c2':'s']=v;D.bg={...CO.bg};draw()}
  else{CO[k]=v;cancelAnimationFrame(raf);raf=requestAnimationFrame(colApply)}}
 else if((a=='rp'||a=='d3')&&l&&l[a]){l[a][k]=v;draw()}});

/* ---------- panel ---------- */
const rq=(t,k,a,b,v,s=1)=>`<label class="rw"><span>${t}<b>${Math.round(v*100)/100}</b></span><input type="range" data-q="${k}" min="${a}" max="${b}" step="${s}" value="${v}"></label>`;
const cq=(t,k,v)=>`<label class="cl">${t}<input type="color" data-q="${k}" value="${/^#/.test(v)?v:'#ffffff'}"></label>`;
const kq=(t,k,v)=>`<label class="ck"><input type="checkbox" data-q="${k}" ${v?'checked':''}>${t}</label>`;
const thumb=q=>`<svg viewBox="0 0 100 100" width="54" height="54">${q.c.map(u=>{const x=u[0]*100,y=u[1]*100,w=u[2]*100,h=u[3]*100;return u[5]?`<ellipse cx="${x+w/2}" cy="${y+h/2}" rx="${w/2-1}" ry="${h/2-1}" fill="currentColor" opacity=".4"/>`:`<rect x="${x+1.5}" y="${y+1.5}" width="${w-3}" height="${h-3}" rx="3" fill="currentColor" opacity=".4" transform="rotate(${u[4]||0} ${x+w/2} ${y+h/2})"/>`}).join('')}</svg>`;
const patImg=k=>patTile({k,c:'#ffffff',c2:'#9ca3af'}).toDataURL();
function colUI(){const l=sh0(),C=CO,ls=CLY(),sw=['#ffffff','#f4f4f5','#18181b','#fde68a','#fecaca','#bfdbfe','#bbf7d0','#e9d5ff'];
 P.innerHTML=`<div class="seg">${[['min','Minimal'],['free','Freestyle'],['pol','Polaroid'],['pos','Posters'],['puz','Puzzles']].map(([k,n])=>`<button class="${C.cat==k?'on':''}" data-a="co_cat" data-v="${k}">${n}</button>`).join('')}</div>
<h3>Rasio</h3><div class="hs">${RT.map((r,i)=>`<button class="b${C.ri==i?' on':''}" data-a="co_rt" data-v="${i}">${r[0]}</button>`).join('')}</div>
<h3>Bingkai</h3><div class="hs">${ls.map((q,i)=>`<button class="th${C.li==i?' on':''}" data-a="co_lay" data-v="${i}" aria-label="Bingkai ${i+1}">${thumb(q)}</button>`).join('')}</div>
<div class="row">${bt('co_add','Tambah foto','plus')}${bt('co_use','Pakai foto kanvas','image')}${bt('co_shuf','Acak','spark')}${C.srcs.length?bt('co_clr','Kosongkan','trash'):''}</div>
<p class="mu">${C.srcs.length?C.srcs.length+' foto sumber. Kolase diisi berurutan, foto diulang jika sel lebih banyak.':'Belum ada foto: sel masih berisi placeholder.'}</p>${l?`<div class="row">${bt('co_rep','Ganti foto sel ini','image')}</div>`:''}
${C.cat=='puz'?'':rq('Jarak','co.gap',0,80,C.gap)}${rq('Sudut membulat','co.rad',0,160,C.rad)}${C.cat=='free'?'':rq('Margin','co.mg',0,160,C.mg)}
<h3>Latar</h3>${rq('Warna','co.hue',0,360,0)}<div class="sw">${sw.map(c=>`<button class="s" style="background:${c}" data-a="co_bgc" data-v="${c}" aria-label="${c}"></button>`).join('')}</div>
<div class="hs">${Object.entries(PATK).map(([k,n])=>`<button class="th${C.bg.k==k?' on':''}" data-a="co_pat" data-v="${k}" title="${n}" aria-label="${n}"><img src="${patImg(k)}" width="46" height="46" alt="${n}"></button>`).join('')}</div>
<div class="row">${cq('Warna latar','co.bgc',C.bg.c||'#ffffff')}${C.bg.t=='pat'?cq('Warna pola','co.bgc2',C.bg.c2):''}</div>${C.bg.t=='pat'?rq('Skala pola','co.ps',.5,4,C.bg.s||1,.1):''}`}
const RM=[['grid','Grid'],['scatter','Scatter'],['field','Field'],['radial','Radial'],['linear','Linear'],['path','Sepanjang path']];
const RS={grid:[['n','Baris',1,12],['c','Kolom',1,12],['g','Jarak %',-50,200],['sj','Variasi ukuran',0,80],['rj','Variasi rotasi',0,90]],scatter:[['n','Jumlah',1,200],['rad','Radius',10,mx()],['sj','Variasi ukuran',0,90],['rj','Variasi rotasi',0,180],['oj','Variasi transparansi',0,90]],field:[['n','Jumlah',1,300],['jt','Acak posisi',0,100],['sj','Variasi ukuran',0,90],['rj','Variasi rotasi',0,180]],radial:[['n','Jumlah',1,60],['rg','Cincin',1,6],['rad','Radius',10,mx()],['a0','Sudut awal',-180,180]],linear:[['n','Jumlah',1,60],['dd','Jarak',1,mx()],['ag','Arah',-180,180],['ss','Skala per langkah %',-20,20],['rs','Rotasi per langkah',-45,45],['os','Opasitas per langkah %',-10,10]],path:[['n','Jumlah',1,80],['ss','Skala per langkah %',-10,10]]};
const RC={grid:[['st','Selang-seling']],radial:[['ro','Hadap keluar']],path:[['al','Ikuti arah path']]};
function repUI(l){let h='<h3>Ulangi</h3>';if(!l)return P.innerHTML=h+hint('Pilih sebuah lapisan (teks, foto, bentuk, atau vektor) untuk diulang.');
 const r=l.rp||{};h+=`<div class="chips">${RM.map(([k,n])=>bt('rp_m',n,'',r.m==k,k)).join('')}${r.m?bt('rp_off','Matikan','trash'):''}</div>`;
 if(!r.m)return P.innerHTML=h+hint('Pilih pola. Lapisan asli menjadi pusat atau titik awal pola. Ukuran dan posisinya tetap bisa diubah.');
 if(r.m=='path'){L.forEach(v=>{if(v.t=='vec'&&!v.uid)v.uid=Math.random().toString(36).slice(2)});const vs=L.filter(v=>v.t=='vec');
  h+=`<label class="cl">Path<select data-q="rp.pl"><option value="">Gelombang bawaan</option>${vs.map((v,i)=>`<option value="${v.uid}"${r.pl==v.uid?' selected':''}>Vektor ${i+1}</option>`).join('')}</select></label>`+hint('Gambar garis dengan Pena atau Pensil di tab Gambar, lalu pilih di sini.')}
 h+=RS[r.m].map(([k,n,a,b])=>rq(n,'rp.'+k,a,b,r[k]??0)).join('')+(RC[r.m]||[]).map(([k,n])=>kq(n,'rp.'+k,r[k])).join('');
 if(['scatter','field'].includes(r.m))h+=`<div class="row">${bt('rp_sd','Acak ulang','spark')}</div>`;P.innerHTML=h}
function d3UI(l){let h='<h3>Efek 3D</h3>';if(!l)return P.innerHTML=h+hint('Pilih teks, foto, bentuk, atau vektor.');const d=l.d3||{};
 h+=`<div class="chips">${Object.keys(D3P).map(k=>bt('d3_p',k,'',0,k)).join('')}${d.m?bt('d3_off','Matikan','trash'):''}</div>`;
 if(!d.m)return P.innerHTML=h+hint('Pilih preset lalu atur detailnya. Berlaku untuk semua jenis lapisan.');
 P.innerHTML=h+`<h3>Ketebalan</h3>${rq('Kedalaman','d3.dp',0,150,d.dp)}${rq('Arah ketebalan','d3.da',-180,180,d.da)}${rq('Gelap sisi','d3.sh',0,80,d.sh)}<div class="row">${cq('Warna sisi','d3.dc',d.dc)}</div>${kq('Bayangan panjang (memudar)','d3.lg',d.lg)}
<h3>Perspektif</h3>${rq('Putar Y','d3.ry',-75,75,d.ry)}${rq('Putar X','d3.rx',-75,75,d.rx)}${rq('Kekuatan perspektif','d3.pf',0,100,d.pf)}<h3>Lantai</h3>${rq('Refleksi','d3.rf',0,100,d.rf)}`+hint('Efek 3D memakai bayangan dan garis tepi dari tab Efek.')}
const ui3=ui;ui=function(){ui3();const l=sl();if(tool=='col')colUI();else if(tool=='rep')repUI(l);else if(tool=='d3')d3UI(l)};

/* ---------- tab, ikon, tombol panel ---------- */
$('svg[aria-hidden]').insertAdjacentHTML('beforeend','<symbol id="i-grid" viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="10" rx="1"/><rect x="13" y="3" width="8" height="6" rx="1"/><rect x="13" y="11" width="8" height="10" rx="1"/><rect x="3" y="15" width="8" height="6" rx="1"/></symbol><symbol id="i-repeat" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1" opacity=".6"/><rect x="3" y="14" width="7" height="7" rx="1" opacity=".6"/><rect x="14" y="14" width="7" height="7" rx="1" opacity=".3"/></symbol><symbol id="i-cube" viewBox="0 0 24 24"><path d="m12 2 9 5v10l-9 5-9-5V7z"/><path d="m3 7 9 5 9-5M12 12v10"/></symbol>');
TOOLS.splice(1,0,['col','Kolase','grid']);const fx=TOOLS.findIndex(t=>t[0]=='fx')+1;TOOLS.splice(fx,0,['rep','Ulangi','repeat'],['d3','3D','cube']);
$('#rail').innerHTML=TOOLS.map(([id,n,i])=>`<button data-a="tool" data-v="${id}">${IC(i)}${n}</button>`).join('');
$('#thm').insertAdjacentHTML('beforebegin',`<button class="ib" id="pcb" title="Sembunyikan/tampilkan panel" aria-label="Panel">${IC('sliders')}</button>`);
$('#pcb').onclick=()=>{document.body.classList.toggle('pcol');setTimeout(()=>{fit();draw()},50)};
try{FEAT.push(['Kolase','Minimal, Freestyle, Posters, Puzzles dengan rasio, jarak, sudut, dan latar pola.'],['Ulangi','Grid, scatter, field, radial, linear, dan sepanjang path.'],['Efek 3D','Ekstrusi, perspektif miring, bayangan panjang, refleksi.']);GUIDE.push(['Kolase','Tab <b>Kolase</b>: pilih kategori, rasio, dan bingkai, tambah foto (atau <b>Pakai foto kanvas</b>), lalu atur jarak, sudut, margin, dan latar. Pilih sel di kanvas untuk <b>Ganti foto sel ini</b>.'],['Ulangi & 3D','Pilih lapisan, buka tab <b>Ulangi</b> untuk pola grid, scatter, field, radial, linear, atau sepanjang path. Tab <b>3D</b> memberi ketebalan, perspektif, dan refleksi.'])}catch(e){}
ui();draw();
})();
