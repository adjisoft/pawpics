/* app.js — Logika inti PawPics: lapisan, render kanvas, kuas raster, pena vektor, hapus latar, filter, efek, ekspor. Fitur tambahan ada di extra.js. */

const $=s=>document.querySelector(s),cv=$('#cv'),X=cv.getContext('2d'),P=$('#panel');
let D={w:1080,h:1350,bg:{t:'color',c:'#ffffff'}},L=[],sel=-1,H=[],R=[],tool='layers',mode='move',dr=null,sc=1,tol=30,zm=1,PG={},PP={},MKB={on:0},bs=50,glob=false,fm='',ch=1,ft=1,isl=true,ref=-1,snapOn=true,gd=[],nsel=-1,pn=[],bk={c:'#18181b',s:24,o:1,sf:0,fc:'#5b5bf0',sc:'#18181b',sw:6,fl:true},SC=document.createElement('canvas');
const DF={br:100,ct:100,sa:100,bl:0,hu:0,gr:0,se:0,iv:0},sl=()=>L[sel];
const PRE={Asli:{},Cerah:{br:108,ct:108,sa:130},Hangat:{se:30,sa:120,br:104},Dingin:{hu:-25,sa:110,ct:105},Pudar:{ct:85,br:110,sa:80},Mono:{gr:100,ct:115},Retro:{se:60,ct:90,hu:-10},Drama:{ct:140,sa:80,br:95},Sinema:{ct:115,sa:90,hu:-12,se:15},Noir:{gr:100,ct:150,br:90},Pastel:{br:115,sa:70,ct:90},Matte:{ct:80,br:108,sa:90},Sunset:{se:40,sa:150,hu:-18,br:105},Neon:{sa:200,ct:125,hu:20},Cyber:{hu:140,sa:160,ct:120},Vintage:{se:50,ct:90,br:105,sa:85},Fajar:{se:20,hu:-8,br:110,sa:115},Tajam:{ct:125,sa:110},Lembut:{bl:1.5,br:108,ct:92},Negatif:{iv:100}};
const E0={sb:0,so:0,sc:'#000000',ow:0,oc:'#ffffff',vg:0,gn:0,tn:0,tc:'#ff5a8a',px:0};
const FXP={Tanpa:{},Bayangan:{sb:30,so:14},Neon:{sb:40,so:0,sc:'#22d3ee'},Stiker:{ow:14,oc:'#ffffff',sb:16,so:6},Film:{vg:55,gn:35},Pixel:{px:14},Duoton:{tn:45,tc:'#ff5a8a'},Vinyet:{vg:70}};
const cn=n=>n.map(q=>({...q,i:[...q.i],o:[...q.o]}));
/* vektor: path, bbox, bezier, node edit */
function vp(n,c){const p=new Path2D;if(!n.length)return p;p.moveTo(n[0].x,n[0].y);const m=n.length;for(let k=1;k<(c?m+1:m);k++){const a=n[k-1],b=n[k%m];p.bezierCurveTo(a.x+a.o[0],a.y+a.o[1],b.x+b.i[0],b.y+b.i[1],b.x,b.y)}if(c)p.closePath();return p}
function bz(a,b,t){const s=1-t;return{x:s*s*s*a.x+3*s*s*t*(a.x+a.o[0])+3*s*t*t*(b.x+b.i[0])+t*t*t*b.x,y:s*s*s*a.y+3*s*s*t*(a.y+a.o[1])+3*s*t*t*(b.y+b.i[1])+t*t*t*b.y}}
function bb(n,c){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;const u=q=>{x0=Math.min(x0,q.x);x1=Math.max(x1,q.x);y0=Math.min(y0,q.y);y1=Math.max(y1,q.y)},m=n.length;n.forEach(u);
 for(let k=1;k<(c?m+1:m);k++)for(let t=.05;t<1;t+=.05)u(bz(n[k-1],n[k%m],t));return{x0,y0,x1,y1}}
function mkVec(n,closed){const b=bb(n,closed),cx=(b.x0+b.x1)/2,cy=(b.y0+b.y1)/2;
 L.push({t:'vec',nodes:n.map(q=>({...q,x:q.x-cx,y:q.y-cy})),closed,fill:closed&&bk.fl,fc:bk.fc,sc:bk.sc,sw:closed?bk.sw:Math.max(bk.sw,3),x:cx,y:cy,w:Math.max(10,b.x1-b.x0),h:Math.max(10,b.y1-b.y0),r:0,op:1});sel=L.length-1;nsel=-1}
function nz(l){const b=bb(l.nodes,l.closed),cx=(b.x0+b.x1)/2,cy=(b.y0+b.y1)/2,c=Math.cos(l.r),s=Math.sin(l.r);l.nodes.forEach(q=>{q.x-=cx;q.y-=cy});l.x+=cx*c-cy*s;l.y+=cx*s+cy*c;l.w=Math.max(10,b.x1-b.x0);l.h=Math.max(10,b.y1-b.y0)}
function nodeHit(l,q,u){const r=14*u,n=l.nodes;
 if(nsel>=0&&n[nsel]){const a=n[nsel];for(const h of['i','o'])if((a[h][0]||a[h][1])&&Math.hypot(q.x-a.x-a[h][0],q.y-a.y-a[h][1])<r)return{k:nsel,h}}
 for(let k=n.length-1;k>=0;k--)if(Math.hypot(q.x-n[k].x,q.y-n[k].y)<r)return{k,h:'a'};return null}
function segHit(l,q,u){const n=l.nodes,m=n.length;let b=null;for(let k=1;k<(l.closed?m+1:m);k++)for(let t=0;t<=1;t+=.04){const s=bz(n[k-1],n[k%m],t),d=Math.hypot(s.x-q.x,s.y-q.y);if(d<12*u&&(!b||d<b.d))b={d,k,t}}return b}
function split(l,k,t){const n=l.nodes,a=n[k-1],b=n[k%n.length],P=[[a.x,a.y],[a.x+a.o[0],a.y+a.o[1]],[b.x+b.i[0],b.y+b.i[1]],[b.x,b.y]],lp=(p,q)=>[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t],
 A=lp(P[0],P[1]),B=lp(P[1],P[2]),C=lp(P[2],P[3]),AB=lp(A,B),BC=lp(B,C),M=lp(AB,BC);
 a.o=[A[0]-a.x,A[1]-a.y];b.i=[C[0]-b.x,C[1]-b.y];n.splice(k,0,{x:M[0],y:M[1],i:[AB[0]-M[0],AB[1]-M[1]],o:[BC[0]-M[0],BC[1]-M[1]],sm:1});return k}
function nodeDown(l,p){const q=lc(l,p),u=1/sc,h=nodeHit(l,q,u);
 if(h){snap();nsel=h.k;const n=l.nodes[h.k];dr={k:'nd',l,h:h.h,ox:q.x-n.x,oy:q.y-n.y};ui();draw();return true}
 const s=segHit(l,q,u);if(s){snap();nsel=split(l,s.k,s.t);dr={k:'nd',l,h:'a',ox:0,oy:0};ui();draw();return true}
 if(nsel>=0){nsel=-1;ui();draw()}return false}
function nodeOv(x,l){x.save();x.translate(l.x,l.y);x.rotate(l.r);const u=1/sc;x.lineWidth=1.5*u;x.strokeStyle='#5b5bf0';x.stroke(vp(l.nodes,l.closed));
 l.nodes.forEach((n,k)=>{if(k==nsel)[n.i,n.o].forEach(h=>{if(h[0]||h[1]){x.beginPath();x.moveTo(n.x,n.y);x.lineTo(n.x+h[0],n.y+h[1]);x.stroke();x.beginPath();x.arc(n.x+h[0],n.y+h[1],5*u,0,7);x.fillStyle='#fff';x.fill();x.stroke()}});
  x.fillStyle=k==nsel?'#5b5bf0':'#fff';x.fillRect(n.x-5*u,n.y-5*u,10*u,10*u);x.strokeRect(n.x-5*u,n.y-5*u,10*u,10*u)});x.restore()}
function shNodes(k,w,h){const a=w/2,b=h/2,N=(x,y,i,o)=>({x,y,i:i||[0,0],o:o||[0,0],sm:i?1:0});
 if(k=='circ'){const c=.5523;return[N(0,-b,[-a*c,0],[a*c,0]),N(a,0,[0,-b*c],[0,b*c]),N(0,b,[a*c,0],[-a*c,0]),N(-a,0,[0,b*c],[0,-b*c])]}
 if(k=='heart')return[N(0,b,[1.3*a,-.8*b],[-1.3*a,-.8*b]),N(0,-.45*b,[-.9*a,-.55*b],[.9*a,-.55*b])];
 let P;if(PP[k])P=PP[k](a,b);else if(k=='tri')P=[[0,-b],[a,b],[-a,b]];else if(k=='star'||k=='hex'){const s=k=='star',n=s?10:6;P=[...Array(n)].map((_,i)=>{const r=s&&i%2?.45:1,t=Math.PI*2*i/n-Math.PI/2;return[Math.cos(t)*a*r,Math.sin(t)*b*r]})}else P=[[-a,-b],[a,-b],[a,b],[-a,b]];
 return P.map(q=>N(q[0],q[1]))}
/* pensil & pena */
function rdp(p,e){if(p.length<3)return p;const a=p[0],b=p[p.length-1],dx=b.x-a.x,dy=b.y-a.y,ln=Math.hypot(dx,dy);let mx=0,ix=0;
 for(let k=1;k<p.length-1;k++){const d=ln>1e-6?Math.abs(dy*(p[k].x-a.x)-dx*(p[k].y-a.y))/ln:Math.hypot(p[k].x-a.x,p[k].y-a.y);if(d>mx){mx=d;ix=k}}
 if(mx>e){const l=rdp(p.slice(0,ix+1),e),r=rdp(p.slice(ix),e);return l.slice(0,-1).concat(r)}return[a,b]}
function fitC(P){return P.map((q,k)=>{const a=P[Math.max(0,k-1)],b=P[Math.min(P.length-1,k+1)],tx=(b.x-a.x)/6,ty=(b.y-a.y)/6;return{x:q.x,y:q.y,i:[-tx,-ty],o:[tx,ty],sm:1}})}
function penDown(p){if(pn.length>1&&Math.hypot(p.x-pn[0].x,p.y-pn[0].y)<14/sc){penEnd(true);return}pn.push({x:p.x,y:p.y,i:[0,0],o:[0,0],sm:0});dr={k:'pen'};draw()}
function penEnd(c){if(pn.length>1){snap();mkVec(pn,c)}pn=[];ui();draw()}
/* kuas raster */
function brushDown(p){let l=sl();snap();if(!(l&&l.pt)){const c=document.createElement('canvas');c.width=D.w;c.height=D.h;L.push({t:'img',pt:1,cv:c,orig:c,x:D.w/2,y:D.h/2,w:D.w,h:D.h,f:{...DF},m:null,op:1,r:0});sel=L.length-1;l=sl();ui()}
 SC.width=l.cv.width;SC.height=l.cv.height;dr={k:'bd',l,pts:[]};bpt(l,p);bdraw(l)}
function bpt(l,p){const q=lc(l,p),k=l.cv.width/l.w;dr.pts.push({x:(q.x+l.w/2)*k,y:(q.y+l.h/2)*k})}
function bdraw(l){const k=l.cv.width/l.w,x=SC.getContext('2d'),P=dr.pts;x.clearRect(0,0,SC.width,SC.height);x.lineCap=x.lineJoin='round';x.strokeStyle=x.fillStyle=bk.c;x.lineWidth=bk.s*k;x.shadowColor=bk.c;x.shadowBlur=bk.sf*k;
 if(P.length<2){x.beginPath();x.arc(P[0].x,P[0].y,bk.s*k/2,0,7);x.fill()}else{x.beginPath();x.moveTo(P[0].x,P[0].y);for(let i=1;i<P.length-1;i++)x.quadraticCurveTo(P[i].x,P[i].y,(P[i].x+P[i+1].x)/2,(P[i].y+P[i+1].y)/2);x.lineTo(P[P.length-1].x,P[P.length-1].y);x.stroke()}}
function bfin(d){const l=d.l;l.cv=cl(l.cv);const x=l.cv.getContext('2d');x.globalAlpha=bk.o;x.drawImage(SC,0,0)}
const TMP=document.createElement('canvas');let NZ;
function noise(){if(!NZ){NZ=document.createElement('canvas');NZ.width=NZ.height=128;const q=NZ.getContext('2d'),d=q.createImageData(128,128);for(let i=0;i<d.data.length;i+=4){d.data[i]=d.data[i+1]=d.data[i+2]=Math.random()*255;d.data[i+3]=255}q.putImageData(d,0,0)}return NZ}
function sil(l,c){const s=l._s;if(s&&s.cv===l.cv&&s.c===c)return s.n;const n=cl(l.cv),q=n.getContext('2d');q.globalCompositeOperation='source-in';q.fillStyle=c;q.fillRect(0,0,n.width,n.height);l._s={cv:l.cv,c,n};return n}
/* posisi relatif + magnet */
const ext=l=>{const c=Math.abs(Math.cos(l.r)),s=Math.abs(Math.sin(l.r));return{hx:(l.w*c+l.h*s)/2,hy:(l.w*s+l.h*c)/2}};
function sn(c,hf,Tc,Te){let b=null;const t=(g,o)=>{const d=g-(c+o);if(Math.abs(d)<9/sc&&(!b||Math.abs(d)<Math.abs(b.d)))b={d,g}};Tc.forEach(g=>t(g,0));Te.forEach(g=>[0,-hf,hf].forEach(o=>t(g,o)));return b}
function snapMv(l){gd=[];if(!snapOn)return;const{hx,hy}=ext(l),TX=[0,D.w],TY=[0,D.h];
 L.forEach(q=>{if(q===l||q.hide)return;const e=ext(q);TX.push(q.x,q.x-e.hx,q.x+e.hx);TY.push(q.y,q.y-e.hy,q.y+e.hy)});
 const a=sn(l.x,hx,[D.w/2],TX),b=sn(l.y,hy,[D.h/2],TY);if(a){l.x+=a.d;gd.push({x:a.g})}if(b){l.y+=b.d;gd.push({y:b.g})}}
function rc(l){const q=ref>=0&&L[ref]&&L[ref]!==l?L[ref]:null;return q?{x:q.x,y:q.y,w:q.w,h:q.h}:{x:D.w/2,y:D.h/2,w:D.w,h:D.h}}
function align(l,v){const b=rc(l),{hx,hy}=ext(l);
 if(v=='l')l.x=b.x-b.w/2+hx;if(v=='r')l.x=b.x+b.w/2-hx;if(v=='ch'||v=='c')l.x=b.x;
 if(v=='t')l.y=b.y-b.h/2+hy;if(v=='b')l.y=b.y+b.h/2-hy;if(v=='cv'||v=='c')l.y=b.y}
const SH={rect:'Kotak',circ:'Lingkaran',rrect:'Rounded',tri:'Segitiga',star:'Bintang',hex:'Segi enam',heart:'Hati'};
const FONTS={'system-ui':'Modern',"Georgia,serif":'Serif',"Impact,sans-serif":'Impact',"'Trebuchet MS',sans-serif":'Trebuchet',"'Courier New',monospace":'Mono',"'Brush Script MT',cursive":'Script'};
const TOOLS=[['layers','Lapisan','layers'],['pos','Posisi','move'],['adj','Atur','sliders'],['flt','Filter','contrast'],['fx','Efek','spark'],['bg','Latar','eraser'],['clip','Klip','cut'],['draw','Gambar','pen'],['text','Teks','type'],['shp','Bentuk','shapes'],['tpl','Templat','tpl']];
const IC=n=>`<svg class="i"><use href="#i-${n}"/></svg>`;
const flt=f=>`brightness(${f.br}%) contrast(${f.ct}%) saturate(${f.sa}%) blur(${f.bl}px) hue-rotate(${f.hu}deg) grayscale(${f.gr}%) sepia(${f.se}%) invert(${f.iv||0}%)`;
const cl=c=>{const n=document.createElement('canvas');n.width=c.width;n.height=c.height;n.getContext('2d').drawImage(c,0,0);return n};
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),1800)}
/* history */
const cp=()=>({D:{...D,bg:{...D.bg}},L:L.map(l=>({...l,f:l.f&&{...l.f},pa:l.pa&&{...l.pa},e:l.e&&{...l.e},rp:l.rp&&{...l.rp},d3:l.d3&&{...l.d3},nodes:l.nodes&&cn(l.nodes)})),sel});
function snap(){H.push(cp());if(H.length>40)H.shift();R=[]}
function ld(s){D=s.D;L=s.L;sel=s.sel;fit();ui();draw()}
function undo(){if(H.length){R.push(cp());ld(H.pop())}}
function redo(){if(R.length){H.push(cp());ld(R.pop())}}
/* geometry */
function path(k,w,h){const p=new Path2D,a=w/2,b=h/2;
 if(PG[k])PG[k](p,a,b);else if(k=='circ')p.ellipse(0,0,a,b,0,0,7);
 else if(k=='rrect')p.roundRect(-a,-b,w,h,Math.min(w,h)*.18);
 else if(k=='star'||k=='hex'){const s=k=='star',n=s?10:6;for(let i=0;i<n;i++){const r=s&&i%2?.45:1,t=Math.PI*2*i/n-Math.PI/2;p.lineTo(Math.cos(t)*a*r,Math.sin(t)*b*r)}p.closePath()}
 else if(k=='tri'){p.moveTo(0,-b);p.lineTo(a,b);p.lineTo(-a,b);p.closePath()}
 else if(k=='heart'){p.moveTo(0,b);p.bezierCurveTo(-a*1.3,b*.2,-a*.9,-b,0,-b*.45);p.bezierCurveTo(a*.9,-b,a*1.3,b*.2,0,b);p.closePath()}
 else p.rect(-a,-b,w,h);return p}
/* render */
function render(x,ov,flat){
 x.clearRect(0,0,D.w,D.h);const b=D.bg;
 if(flat){x.fillStyle='#fff';x.fillRect(0,0,D.w,D.h)}
 if(b.t=='color'){x.fillStyle=b.c;x.fillRect(0,0,D.w,D.h)}
 if(b.t=='grad'){const g=x.createLinearGradient(0,0,D.w,D.h);g.addColorStop(0,b.c);g.addColorStop(1,b.c2);x.fillStyle=g;x.fillRect(0,0,D.w,D.h)}
 if(b.t=='img'){const k=Math.max(D.w/b.i.width,D.h/b.i.height),w=b.i.width*k,h=b.i.height*k;x.drawImage(b.i,(D.w-w)/2,(D.h-h)/2,w,h)}
 if(b.t=='pat')bgPat(x,b);
 const DL=(l,x)=>{if(l.hide)return;if(l.mk&&!MKB.on){mkDraw(x,l);return}if(l.rp&&l.rp.m&&!l._ri){REP(DL,l,x);return}if(l.d3&&l.d3.m&&!l._3d){D3(DL,l,x);return}const e=l.e||(l.e={...E0}),hs=e.sb>0||e.so>0;x.save();x.globalAlpha=l.op;x.globalCompositeOperation=l.bm||'source-over';x.translate(l.x,l.y);x.rotate(l.r);if(l.fh||l.fv)x.scale(l.fh?-1:1,l.fv?-1:1);if(l._vs)x.scale(l._vs,l._vs);
  const sh=()=>{x.shadowColor=e.sc;x.shadowBlur=e.sb;x.shadowOffsetY=e.so},ns=()=>{x.shadowColor='transparent';x.shadowBlur=0;x.shadowOffsetY=0};
  if(l.t=='text'&&window.TXR&&TXR(x,l,e,hs,sh)){}else if(l.t=='text'){x.font=`${l.it?'italic ':''}${l.b?'700 ':''}${l.s}px ${l.ff}`;x.textAlign='center';x.letterSpacing=(l.ls||0)+'px';x.textBaseline='middle';x.fillStyle=l.c;
   const ln=l.txt.split('\n'),lh=l.s*1.25,dl=f=>ln.forEach((s,i)=>f(s,0,(i-(ln.length-1)/2)*lh));
   l.w=Math.max(10,...ln.map(s=>x.measureText(s).width));l.h=lh*ln.length;
   if(hs)sh();if(e.ow){x.lineJoin='round';x.lineWidth=e.ow*2;x.strokeStyle=e.oc;dl((s,a,b)=>x.strokeText(s,a,b))}dl((s,a,b)=>x.fillText(s,a,b))}
  else if(l.t=='shape'){const pa=path(l.k,l.w,l.h);if(hs)sh();x.fillStyle=window.GF?GF(x,l):l.c;x.fill(pa);ns();if(e.ow){x.lineJoin='round';x.lineWidth=e.ow*2;x.strokeStyle=e.oc;x.stroke(pa)}}
  else if(l.t=='vec'){const pa=vp(l.nodes,l.closed);if(hs)sh();if(l.fill){x.fillStyle=l.fc;x.fill(pa)}if(l.sw>0){x.lineJoin=x.lineCap='round';x.lineWidth=l.sw;x.strokeStyle=l.sc;x.stroke(pa)}}
  else{const pa=l.m&&path(l.m,l.w,l.h),f=flt(l.f);let S=adv(l),tm=0;
   if(e.px>1){const w=Math.max(1,Math.round(S.width/e.px)),h=Math.max(1,Math.round(S.height/e.px)),q=document.createElement('canvas');q.width=w;q.height=h;q.getContext('2d').drawImage(S,0,0,w,h);S=q;x.imageSmoothingEnabled=false}
   if(e.vg||e.gn||e.tn){const W=Math.max(1,Math.ceil(l.w)),Q=Math.max(1,Math.ceil(l.h));TMP.width=W;TMP.height=Q;const t=TMP.getContext('2d');t.imageSmoothingEnabled=x.imageSmoothingEnabled;t.filter=f;t.drawImage(S,0,0,W,Q);t.filter='none';t.globalCompositeOperation='source-atop';
    if(e.tn){t.globalAlpha=e.tn/100;t.fillStyle=e.tc;t.fillRect(0,0,W,Q);t.globalAlpha=1}
    if(e.vg){const g=t.createRadialGradient(W/2,Q/2,Math.min(W,Q)*.25,W/2,Q/2,Math.hypot(W,Q)/2);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,`rgba(0,0,0,${e.vg/100})`);t.fillStyle=g;t.fillRect(0,0,W,Q)}
    if(e.gn){t.globalAlpha=e.gn/160;t.fillStyle=t.createPattern(noise(),'repeat');t.fillRect(0,0,W,Q)}
    S=TMP;tm=1}
   if(e.ow){x.lineJoin='round';if(pa){x.lineWidth=e.ow*2;x.strokeStyle=e.oc;x.stroke(pa)}else{const s=sil(l,e.oc);for(let a=0;a<16;a++)x.drawImage(s,-l.w/2+Math.cos(a*Math.PI/8)*e.ow,-l.h/2+Math.sin(a*Math.PI/8)*e.ow,l.w,l.h)}}
   if(pa&&hs){sh();x.fillStyle='#000';x.fill(pa);ns()}
   if(pa)x.clip(pa);
   if(!pa&&hs)sh();
   if(!tm)x.filter=f;
   x.drawImage(S,-l.w/2,-l.h/2,l.w,l.h);if(dr&&dr.k=='bd'&&dr.l===l){x.globalAlpha=l.op*bk.o;x.drawImage(SC,-l.w/2,-l.h/2,l.w,l.h)}}
  x.restore()};L.forEach(l=>DL(l,x));
 if(ov&&gd.length){x.save();x.strokeStyle='#ef4444';x.lineWidth=2/sc;gd.forEach(g=>{x.beginPath();if(g.x!=null){x.moveTo(g.x,0);x.lineTo(g.x,D.h)}else{x.moveTo(0,g.y);x.lineTo(D.w,g.y)}x.stroke()});x.restore()}
 const vn=tool=='draw'&&mode=='node'&&sl()&&sl().t=='vec';
 if(ov&&sl()&&!vn)overlay(x,sl());
 if(ov&&vn)nodeOv(x,sl());
 if(ov&&pn.length){x.save();x.strokeStyle='#5b5bf0';x.lineWidth=2/sc;x.stroke(vp(pn,false));pn.forEach((q,k)=>{x.fillStyle=k?'#fff':'#5b5bf0';x.beginPath();x.arc(q.x,q.y,(k?5:7)/sc,0,7);x.fill();x.stroke()});x.restore()}
 if(ov&&dr&&dr.k=='pc'){x.save();x.strokeStyle=bk.sc;x.lineWidth=bk.sw;x.lineCap=x.lineJoin='round';x.beginPath();dr.pts.forEach((q,k)=>k?x.lineTo(q.x,q.y):x.moveTo(q.x,q.y));x.stroke();x.restore()}}
function overlay(x,l){x.save();x.translate(l.x,l.y);x.rotate(l.r);const u=1/sc;x.lineWidth=2*u;x.strokeStyle='#5b5bf0';x.fillStyle='#fff';
 x.strokeRect(-l.w/2,-l.h/2,l.w,l.h);x.beginPath();x.moveTo(0,-l.h/2);x.lineTo(0,-l.h/2-28*u);x.stroke();
 [[l.w/2,l.h/2],[0,-l.h/2-28*u]].forEach(([a,b])=>{x.beginPath();x.arc(a,b,8*u,0,7);x.fill();x.stroke()});x.restore()}
const draw=()=>render(X,true);
function fit(){cv.width=D.w;cv.height=D.h;const r=$('#stage').getBoundingClientRect();sc=Math.max(.05,Math.min((r.width-24)/D.w,(r.height-24)/D.h)*zm);cv.style.width=D.w*sc+'px';cv.style.height=D.h*sc+'px'}
/* pointer */
const pt=e=>{const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)/sc,y:(e.clientY-r.top)/sc}};
const lc=(l,p)=>{const c=Math.cos(-l.r),s=Math.sin(-l.r),dx=p.x-l.x,dy=p.y-l.y;return{x:dx*c-dy*s,y:dx*s+dy*c}};
cv.onpointerdown=e=>{cv.setPointerCapture(e.pointerId);const p=pt(e),l=sl();
 if(l&&l.t=='img'&&((tool=='bg'&&mode!='move')||(tool=='draw'&&mode=='erase'))){if(mode=='magic')cut(l,false,p);else{snap();l.cv=cl(l.cv);dr={k:'br'};brush(l,p);draw()}return}
 if(tool=='draw'){if(mode=='pen')return penDown(p);if(mode=='pencil'){dr={k:'pc',pts:[p]};return}if(mode=='brush')return brushDown(p);if(mode=='node'&&l&&l.t=='vec'&&nodeDown(l,p))return}
 if(l&&!(tool=='draw'&&mode=='node')){const q=lc(l,p),u=1/sc;
  if(Math.hypot(q.x-l.w/2,q.y-l.h/2)<18*u){snap();dr={k:'sc',d:Math.hypot(p.x-l.x,p.y-l.y),w:l.w,h:l.h,s:l.s,n0:l.nodes&&cn(l.nodes)};return}
  if(Math.hypot(q.x,q.y+l.h/2+28*u)<18*u){snap();dr={k:'rot'};return}}
 let i=-1;for(let j=L.length-1;j>=0;j--){const q=lc(L[j],p);if(Math.abs(q.x)<=L[j].w/2&&Math.abs(q.y)<=L[j].h/2){i=j;break}}
 if(i!=sel){sel=i;nsel=-1;ui()}if(i>=0){snap();dr={k:'mv',ox:p.x-L[i].x,oy:p.y-L[i].y}}draw()};
cv.onpointermove=e=>{if(!dr)return;const p=pt(e),l=sl();if(!l&&dr.k!='pen'&&dr.k!='pc')return;
 if(dr.k=='mv'){l.x=p.x-dr.ox;l.y=p.y-dr.oy;snapMv(l)}
 else if(dr.k=='sc'){const k=Math.max(.05,Math.hypot(p.x-l.x,p.y-l.y)/dr.d);l.w=dr.w*k;l.h=dr.h*k;if(l.t=='text')l.s=dr.s*k;if(l.nodes)l.nodes=dr.n0.map(n=>({...n,x:n.x*k,y:n.y*k,i:[n.i[0]*k,n.i[1]*k],o:[n.o[0]*k,n.o[1]*k]}))}
 else if(dr.k=='rot')l.r=Math.atan2(p.y-l.y,p.x-l.x)+Math.PI/2;
 else if(dr.k=='bd'){bpt(dr.l,p);bdraw(dr.l)}
 else if(dr.k=='pc')dr.pts.push(p);
 else if(dr.k=='pen'){const n=pn[pn.length-1],dx=p.x-n.x,dy=p.y-n.y;if(Math.hypot(dx,dy)>5/sc){n.o=[dx,dy];n.i=[-dx,-dy];n.sm=1}}
 else if(dr.k=='nd'){const q=lc(l,p),n=l.nodes[nsel];
  if(dr.h=='a'){n.x=q.x-dr.ox;n.y=q.y-dr.oy}
  else{const o=dr.h=='i'?'o':'i';n[dr.h]=[q.x-n.x,q.y-n.y];if(n.sm){const a=Math.hypot(...n[dr.h])||1,b=Math.hypot(...n[o])||a;n[o]=[-n[dr.h][0]/a*b,-n[dr.h][1]/a*b]}}}
 else brush(l,p);draw()};
cv.onpointerup=cv.onpointercancel=()=>{const d=dr;dr=null;gd=[];
 if(d){if(d.k=='pc'&&d.pts.length>1){snap();mkVec(fitC(rdp(d.pts,2.5/sc)),false)}if(d.k=='nd')nz(d.l);if(d.k=='bd')bfin(d)}
 draw();if(tool=='pos'||tool=='draw')ui()};
function brush(l,p){const a=dr.lp||p,n=Math.max(1,Math.ceil(Math.hypot(p.x-a.x,p.y-a.y)/(bs/4)));
 for(let i=1;i<=n;i++)dot(l,{x:a.x+(p.x-a.x)*i/n,y:a.y+(p.y-a.y)*i/n});dr.lp=p}
function dot(l,p){const q=lc(l,p),k=l.cv.width/l.w,x=l.cv.getContext('2d');x.save();x.beginPath();x.arc((q.x+l.w/2)*k,(q.y+l.h/2)*k,bs/2*k,0,7);
 if(mode=='erase'){x.globalCompositeOperation='destination-out';x.fill()}else{x.clip();x.drawImage(l.orig,0,0,l.cv.width,l.cv.height)}x.restore()}
/* mesin hapus latar v2: seed + region growing, tepi lembut, despill, susut/haluskan, bersihkan bintik */
function er(A,W){const B=A.slice(),N=A.length;for(let j=0;j<N;j++){const px=j%W;let m=A[j];if(px>0&&A[j-1]<m)m=A[j-1];if(px<W-1&&A[j+1]<m)m=A[j+1];if(j>=W&&A[j-W]<m)m=A[j-W];if(j<N-W&&A[j+W]<m)m=A[j+W];B[j]=m}return B}
function bl(A,W,Ht,r){const B=new Uint8ClampedArray(A.length),C=new Uint8ClampedArray(A.length),n=2*r+1,cl_=(v,m)=>Math.min(m,Math.max(0,v));
 for(let y=0;y<Ht;y++){let s=0;const o=y*W;for(let x=-r;x<=r;x++)s+=A[o+cl_(x,W-1)];for(let x=0;x<W;x++){B[o+x]=s/n;s+=A[o+cl_(x+r+1,W-1)]-A[o+cl_(x-r,W-1)]}}
 for(let x=0;x<W;x++){let s=0;for(let y=-r;y<=r;y++)s+=B[cl_(y,Ht-1)*W+x];for(let y=0;y<Ht;y++){C[y*W+x]=s/n;s+=B[cl_(y+r+1,Ht-1)*W+x]-B[cl_(y-r,Ht-1)*W+x]}}return C}
function isle(A,W){const N=A.length,lb=new Int32Array(N),sz=[0];let n=0;
 for(let s=0;s<N;s++){if(A[s]<20||lb[s])continue;n++;let c=0;const st=[s];lb[s]=n;
  while(st.length){const j=st.pop(),px=j%W;c++;const nb=[];if(px>0)nb.push(j-1);if(px<W-1)nb.push(j+1);if(j>=W)nb.push(j-W);if(j<N-W)nb.push(j+W);for(const q of nb)if(!lb[q]&&A[q]>=20){lb[q]=n;st.push(q)}}
  sz[n]=c}
 let mx=0;for(const v of sz)if(v>mx)mx=v;for(let j=0;j<N;j++)if(lb[j]&&sz[lb[j]]<mx*.04)A[j]=0}
function cut(l,auto,p){let q;if(!auto){q=lc(l,p);if(Math.abs(q.x)>l.w/2||Math.abs(q.y)>l.h/2)return}
 snap();l.cv=cl(l.cv);const c=l.cv,cx=c.getContext('2d'),W=c.width,Ht=c.height,N=W*Ht,id=cx.getImageData(0,0,W,Ht),d=id.data,S=[];let r,g,b;
 if(auto){const h=new Map,add=i=>{const k=(d[i]>>4)<<8|(d[i+1]>>4)<<4|d[i+2]>>4;h.set(k,(h.get(k)||0)+1)};
  for(let i=0;i<W;i++){add(i*4);add(((Ht-1)*W+i)*4)}for(let i=0;i<Ht;i++){add(i*W*4);add((i*W+W-1)*4)}
  let bk=0,bc=0;h.forEach((v,k)=>{if(v>bc){bc=v;bk=k}});r=(bk>>8&15)*16+8;g=(bk>>4&15)*16+8;b=(bk&15)*16+8;
  for(let i=0;i<W;i++)S.push(i,(Ht-1)*W+i);for(let i=0;i<Ht;i++)S.push(i*W,i*W+W-1)}
 else{const sx=Math.min(W-1,Math.floor((q.x/l.w+.5)*W)),sy=Math.min(Ht-1,Math.floor((q.y/l.h+.5)*Ht));let n=0;r=g=b=0;
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const X=sx+dx,Y=sy+dy;if(X<0||Y<0||X>=W||Y>=Ht)continue;const o=(Y*W+X)*4;r+=d[o];g+=d[o+1];b+=d[o+2];n++}
  r/=n;g/=n;b/=n;S.push(sy*W+sx)}
 const dd=j=>{const i=j*4,m=(d[i]+r)/2,a=d[i]-r,e=d[i+1]-g,f=d[i+2]-b;return Math.sqrt((2+m/256)*a*a+4*e*e+(2+(255-m)/256)*f*f)},T=tol*3.2,T2=T*1.5,M=new Uint8Array(N),st=[];
 const ps=j=>{if(!M[j]&&d[j*4+3]&&dd(j)<=T){M[j]=1;st.push(j)}};
 if(glob){for(let j=0;j<N;j++)if(d[j*4+3]&&dd(j)<=T)M[j]=1}
 else{S.forEach(ps);while(st.length){const j=st.pop(),px=j%W;if(px>0)ps(j-1);if(px<W-1)ps(j+1);if(j>=W)ps(j-W);if(j<N-W)ps(j+W)}}
 let A=new Uint8ClampedArray(N);
 for(let j=0;j<N;j++)A[j]=M[j]?0:255;
 for(let j=0;j<N;j++){if(M[j])continue;const px=j%W;if(!((px>0&&M[j-1])||(px<W-1&&M[j+1])||(j>=W&&M[j-W])||(j<N-W&&M[j+W])))continue;
  const k=dd(j);if(k<T2){const a=Math.max(0,(k-T)/(T2-T));A[j]=a*255;if(a>.05&&a<1){const i=j*4;d[i]=Math.min(255,Math.max(0,(d[i]-r*(1-a))/a));d[i+1]=Math.min(255,Math.max(0,(d[i+1]-g*(1-a))/a));d[i+2]=Math.min(255,Math.max(0,(d[i+2]-b*(1-a))/a))}}}
 for(let n=0;n<ch;n++)A=er(A,W);
 if(isl)isle(A,W);
 if(ft)A=bl(A,W,Ht,ft);
 for(let j=0;j<N;j++)d[j*4+3]=A[j]*d[j*4+3]/255;
 cx.putImageData(id,0,0);draw()}
/* images */
function addImg(f,bg){const im=new Image();im.onload=()=>{snap();
 if(bg){D.bg={t:'img',i:im};draw();return}
 const k=Math.min(1,1600/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);
 if(!L.length&&!D.t){const m=1350/Math.max(c.width,c.height);D.w=Math.round(c.width*m);D.h=Math.round(c.height*m);D.t=1;fit()}
 const s=Math.min(D.w/c.width,D.h/c.height)*(L.length?.7:1);
 L.push({t:'img',cv:c,orig:c,x:D.w/2,y:D.h/2,w:c.width*s,h:c.height*s,f:{...DF},m:null,op:1,r:0});sel=L.length-1;ui();draw()};
 im.src=URL.createObjectURL(f)}
const pick=m=>{fm=m;$('#fi').click()};
$('#fi').onchange=e=>{[...e.target.files].forEach(f=>addImg(f,fm=='bg'));e.target.value=''};
$('#stage').ondragover=e=>e.preventDefault();
$('#stage').ondrop=e=>{e.preventDefault();[...e.dataTransfer.files].filter(f=>f.type.startsWith('image/')).forEach(f=>addImg(f))};
/* templates */
function tpl(n){snap();L=[];sel=-1;D.t=1;
 const T=(t,x,y,s,c,b)=>L.push({t:'text',txt:t,x,y,s,c,b,ff:'system-ui',op:1,r:0,w:10,h:10}),S=(k,x,y,w,h,c)=>L.push({t:'shape',k,x,y,w,h,c,op:1,r:0});
 if(n=='poster'){D.w=1240;D.h=1754;D.bg={t:'color',c:'#fef3c7'};S('circ',620,700,920,920,'#fbbf24');S('star',1060,230,240,240,'#5b5bf0');
  T('PAW FEST',620,1230,230,'#18181b',1);T('Hari adopsi hewan terbesar',620,1370,64,'#18181b');T('Sabtu, 14 Desember · 10.00 WIB',620,1490,52,'#52525b');T('Taman Kota, gratis masuk',620,1600,40,'#52525b')}
 else if(n=='brosur'){D.w=1754;D.h=1240;D.bg={t:'color',c:'#ffffff'};S('rect',440,620,880,1240,'#5b5bf0');
  T('Rawat sahabat\nberbulumu',440,420,100,'#ffffff',1);T('Grooming · Vaksin · Penitipan',440,760,40,'#e0e7ff');
  T('Paket Spesial',1300,300,76,'#18181b',1);T('Mandi + potong kuku   Rp50.000\nCek kesehatan   Rp75.000\nPenitipan harian   Rp90.000',1300,620,44,'#3f3f46');
  S('rrect',1300,980,520,110,'#18181b');T('Pesan sekarang',1300,980,44,'#ffffff',1)}
 else{D.bg={t:'color',c:'#ffffff'}}
 fit();ui();draw()}
/* export */
function exp(f){const c=document.createElement('canvas');c.width=D.w;c.height=D.h;render(c.getContext('2d'),false,f=='jpg');
 c.toBlob(async b=>{const d=window.claude?await claude.use('downloads'):null;
  if(d){try{await d.save({filename:'pawpics.'+f,data:b});toast('Tersimpan')}catch(e){if(e.code!='declined')toast('Gagal menyimpan')}}
  else{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='pawpics.'+f;a.click();toast('Tersimpan')}},f=='jpg'?'image/jpeg':'image/png',.92)}
/* actions */
function act(a,v){const l=sl();
 if(a=='tool'){if(pn.length)penEnd(false);tool=v;mode=v=='draw'?'brush':'move';cv.style.cursor=mode=='move'?'':'crosshair';ui();draw();return}
 if(a=='theme')return theme(document.documentElement.dataset.theme=='dark'?'light':'dark');
 if(a=='undo')return undo();if(a=='redo')return redo();if(a=='exp')return exp(v);if(a=='pick')return pick(v);
 if(a=='mode'){if(pn.length)penEnd(false);mode=v;cv.style.cursor=v=='move'?'':'crosshair';ui();draw();return}
 if(a=='sel'){sel=+v;ui();draw();return}
 if(a=='pend'){penEnd(v=='1');return}
 if(a=='pcan'){pn=[];ui();draw();return}
 if(a=='auto'){if(l&&l.t=='img')cut(l,true);return}
 if(a=='tpl')return tpl(v);
 snap();
 if(a=='up'&&l&&sel<L.length-1){[L[sel],L[sel+1]]=[L[sel+1],L[sel]];sel++}
 if(a=='down'&&l&&sel>0){[L[sel],L[sel-1]]=[L[sel-1],L[sel]];sel--}
 if(a=='dup'&&l){L.push({...l,f:l.f&&{...l.f},pa:l.pa&&{...l.pa},e:l.e&&{...l.e},rp:l.rp&&{...l.rp},d3:l.d3&&{...l.d3},nodes:l.nodes&&cn(l.nodes),x:l.x+30,y:l.y+30});sel=L.length-1}
 if(a=='del'&&l){L.splice(sel,1);sel=Math.min(sel,L.length-1)}
 if(a=='pre'&&l)l.f={...DF,...PRE[v]};
 if(a=='al'&&l)align(l,v);
 if(a=='nsm'&&l&&l.t=='vec'&&nsel>=0){const n=l.nodes[nsel];if(n.sm){n.sm=0;n.i=[0,0];n.o=[0,0]}else{const m=l.nodes.length,pv=l.nodes[(nsel-1+m)%m],nx=l.nodes[(nsel+1)%m],tx=(nx.x-pv.x)/6,ty=(nx.y-pv.y)/6;n.sm=1;n.i=[-tx,-ty];n.o=[tx,ty]}}
 if(a=='ndel'&&l&&l.t=='vec'&&nsel>=0&&l.nodes.length>2){l.nodes.splice(nsel,1);nsel=-1;nz(l)}
 if(a=='tovec'&&l&&l.t=='shape'){l.t='vec';l.nodes=shNodes(l.k,l.w,l.h);l.closed=true;l.fill=true;l.fc=l.c;l.sc='#18181b';l.sw=0;delete l.k;delete l.c;tool='draw';mode='node';nsel=-1;cv.style.cursor='crosshair'}
 if(a=='nd'&&l){const[dx,dy]=v.split(',').map(Number);l.x+=dx;l.y+=dy}
 if(a=='fxp'&&l)l.e={...E0,...FXP[v]};
 if(a=='bgc')D.bg={t:'color',c:v};
 if(a=='bgn')D.bg={t:'none'};
 if(a=='mask'&&l)l.m=v||null;
 if(a=='fitc'&&l){const k=Math.max(D.w/l.w,D.h/l.h);l.w*=k;l.h*=k;l.x=D.w/2;l.y=D.h/2;l.r=0}
 if(a=='reset'&&l)l.cv=l.orig;
 if(a=='addt'){L.push({t:'text',txt:'Ketik teks',x:D.w/2,y:D.h/2,s:Math.round(D.w/9),c:'#18181b',b:1,ff:'system-ui',op:1,r:0,w:10,h:10});sel=L.length-1}
 if(a=='adds'){L.push({t:'shape',k:v,x:D.w/2,y:D.h/2,w:D.w/3,h:D.w/3,c:'#5b5bf0',op:1,r:0});sel=L.length-1}
 if(a=='size'){const[w,h]=v.split(',').map(Number);D.w=w;D.h=h;D.t=1;fit()}
 ui();draw()}
document.onclick=e=>{const b=e.target.closest('[data-a]');if(b)act(b.dataset.a,b.dataset.v)};
P.addEventListener('pointerdown',e=>{if(e.target.dataset.k&&['range','color'].includes(e.target.type))snap()});
P.oninput=e=>{const t=e.target,k=t.dataset.k;if(!k)return;const v=['range','number'].includes(t.type)?+t.value:t.type=='checkbox'?t.checked:t.value;if(v!==v)return;
 if(t.type=='range'){const b=t.parentNode.querySelector('b');if(b)b.textContent=Math.round(v*100)/100}
 if(k=='tol')tol=v;else if(k=='bs')bs=v;else if(k=='glob')glob=v;else if(k.startsWith('bk.'))bk[k.slice(3)]=v;else if(k=='ch')ch=v;else if(k=='ft')ft=v;else if(k=='isl')isl=v;else if(k=='snapOn')snapOn=v;
 else if(k=='ref'){ref=+v;ui();return}
 else if(k=='rd'){const l=sl();if(l)l.r=v*Math.PI/180}
 else if(k=='rx'||k=='ry'){const l=sl();if(l){const c=rc(l);l[k=='rx'?'x':'y']=(k=='rx'?c.x:c.y)+v}}
 else if(k.startsWith('e.')){const l=sl();if(l)(l.e||(l.e={...E0}))[k.slice(2)]=v}
 else if(k=='_c'){if(!['color','grad'].includes(D.bg.t))D.bg={t:'color'};D.bg.c=v}
 else if(k=='_c2'){D.bg={t:'grad',c:D.bg.c||'#ffffff',c2:v}}
 else{const l=sl();if(!l)return;if(k.startsWith('f.'))l.f[k.slice(2)]=v;else l[k]=v}
 draw()};
/* panel */
const bt=(a,t,i,on,v)=>`<button class="b${on?' on':''}" data-a="${a}" data-v="${v??''}">${i?IC(i):''}${t}</button>`;
const ib=(a,t,i)=>`<button class="ib" data-a="${a}" title="${t}" aria-label="${t}">${IC(i)}</button>`;
const rg=(t,k,a,b,v,s=1)=>`<label class="rw"><span>${t}<b>${Math.round(v*100)/100}</b></span><input type="range" data-k="${k}" min="${a}" max="${b}" step="${s}" value="${v}"></label>`;
const hint=t=>`<p class="mu">${t}</p>`;
const nm=l=>l.t=='text'?l.txt.split('\n')[0].slice(0,20):l.t=='img'?(l.pt?'Lukisan':'Foto'):l.t=='vec'?'Vektor':SH[l.k];
function ui(){
 document.querySelectorAll('#rail button').forEach(b=>b.classList.toggle('on',b.dataset.v==tool));
 const l=sl(),I=l&&l.t=='img';let h='';
 if(tool=='layers'){h=`<h3>Lapisan</h3><div class="row">${bt('pick','Tambah foto','plus')}</div><div class="ls">${L.map((q,i)=>i).reverse().map(i=>`<div class="ly${i==sel?' on':''}" data-a="sel" data-v="${i}">${IC(L[i].t=='img'?'image':L[i].t=='text'?'type':L[i].t=='vec'?'pen':'shapes')}<span>${nm(L[i])}</span></div>`).join('')||hint('Belum ada lapisan. Tambah foto, seret file ke kanvas, atau pilih templat.')}</div>`;
  if(l)h+=`<div class="row">${ib('up','Naikkan','up')}${ib('down','Turunkan','down')}${ib('dup','Gandakan','copy')}${ib('del','Hapus','trash')}</div>${rg('Opasitas','op',0,1,l.op,.01)}`}
 if(tool=='adj'){h='<h3>Atur foto</h3>';
  if(!I)h+=hint('Pilih sebuah foto di kanvas untuk mengatur warna dan filter.');
  else h+=`<div class="row">${bt('pre','Reset','undo',0,'Asli')}</div>${rg('Cahaya','f.br',0,200,l.f.br)}${rg('Kontras','f.ct',0,200,l.f.ct)}${rg('Saturasi','f.sa',0,200,l.f.sa)}${rg('Rona','f.hu',-180,180,l.f.hu)}${rg('Hitam putih','f.gr',0,100,l.f.gr)}${rg('Sepia','f.se',0,100,l.f.se)}${rg('Blur','f.bl',0,20,l.f.bl,.5)}`}
 if(tool=='flt'){h='<h3>Filter</h3>';if(!I)h+=hint('Pilih sebuah foto untuk memakai filter.');else h+=`<div class="chips">${Object.keys(PRE).map(k=>bt('pre',k,'',JSON.stringify({...DF,...PRE[k]})==JSON.stringify(l.f),k)).join('')}</div>`+hint('Atur detailnya di tab Atur.')}
 if(tool=='fx'){const e=l&&(l.e||E0);h='<h3>Efek</h3>';if(!l)h+=hint('Pilih sebuah lapisan untuk memberi efek.');
  else{h+=`<div class="chips">${Object.keys(FXP).map(k=>bt('fxp',k,'',0,k)).join('')}</div><h3>Bayangan / cahaya</h3>${rg('Blur','e.sb',0,80,e.sb)}${rg('Jarak','e.so',0,80,e.so)}<div class="row"><label class="cl">Warna<input type="color" data-k="e.sc" value="${e.sc}"></label></div><h3>Garis tepi</h3>${rg('Tebal','e.ow',0,40,e.ow)}<div class="row"><label class="cl">Warna<input type="color" data-k="e.oc" value="${e.oc}"></label></div>`;
   if(I)h+=`<h3>Efek foto</h3>${rg('Vinyet','e.vg',0,100,e.vg)}${rg('Grain','e.gn',0,100,e.gn)}${rg('Tint','e.tn',0,100,e.tn)}<div class="row"><label class="cl">Warna tint<input type="color" data-k="e.tc" value="${e.tc}"></label></div>${rg('Pixel','e.px',0,60,e.px)}`}}
 if(tool=='pos'){h='<h3>Posisi relatif</h3>';
  if(!l)h+=hint('Pilih sebuah lapisan di kanvas.');
  else{const c=rc(l);h+=`<label class="cl">Relatif terhadap<select data-k="ref"><option value="-1"${ref<0?' selected':''}>Kanvas</option>${L.map((q,i)=>i==sel?'':`<option value="${i}"${ref==i?' selected':''}>${nm(q)} (#${i+1})</option>`).join('')}</select></label>
   <div class="chips">${[['l','Kiri'],['ch','Tengah H'],['r','Kanan'],['t','Atas'],['cv','Tengah V'],['b','Bawah'],['c','Tengah penuh']].map(([k,n])=>bt('al',n,'',0,k)).join('')}</div>
   <div class="row"><label class="cl">X dari tengah<input type="number" data-k="rx" value="${Math.round(l.x-c.x)}"></label><label class="cl">Y dari tengah<input type="number" data-k="ry" value="${Math.round(l.y-c.y)}"></label></div>
   <div class="chips">${bt('nd','←','',0,'-10,0')}${bt('nd','→','',0,'10,0')}${bt('nd','↑','',0,'0,-10')}${bt('nd','↓','',0,'0,10')}</div>
   ${rg('Rotasi','rd',-180,180,Math.round(l.r*180/Math.PI))}<label class="ck"><input type="checkbox" data-k="snapOn" ${snapOn?'checked':''}>Magnet dan panduan merah</label>`}
  h+=hint('Saat menggeser, lapisan menempel otomatis ke tengah dan tepi kanvas atau lapisan lain, ditandai garis merah.')}
 if(tool=='draw'){h=`<h3>Gambar</h3><div class="chips">${[['brush','Kuas'],['pencil','Pensil vektor'],['pen','Pena'],['node','Edit titik'],['erase','Penghapus'],['move','Pindah']].map(([k,n])=>bt('mode',n,'',mode==k,k)).join('')}</div>`;
  if(mode=='brush')h+=`<div class="row"><label class="cl">Warna<input type="color" data-k="bk.c" value="${bk.c}"></label></div>${rg('Ukuran','bk.s',2,200,bk.s)}${rg('Opasitas','bk.o',.05,1,bk.o,.05)}${rg('Kehalusan tepi','bk.sf',0,40,bk.sf)}`+hint('Menggambar di lapisan lukisan, yang dibuat otomatis jika belum ada.');
  if(mode=='erase')h+=rg('Ukuran penghapus','bs',5,200,bs)+hint('Pilih lapisan lukisan atau foto, lalu usap untuk menghapus.');
  if(mode=='pencil')h+=`<div class="row"><label class="cl">Warna garis<input type="color" data-k="bk.sc" value="${bk.sc}"></label></div>${rg('Tebal garis','bk.sw',1,60,bk.sw)}`+hint('Gambar bebas; hasilnya menjadi kurva vektor halus yang bisa diedit titiknya.');
  if(mode=='pen')h+=`<div class="row"><label class="cl">Isian<input type="color" data-k="bk.fc" value="${bk.fc}"></label><label class="cl">Garis<input type="color" data-k="bk.sc" value="${bk.sc}"></label></div>${rg('Tebal garis','bk.sw',0,60,bk.sw)}<label class="ck"><input type="checkbox" data-k="bk.fl" ${bk.fl?'checked':''}>Isi bentuk tertutup</label><div class="row">${bt('pend','Selesai','',0,'0')}${bt('pend','Tutup bentuk','',0,'1')}${bt('pcan','Batal')}</div>`+hint('Ketuk untuk titik sudut, ketuk lalu seret untuk kurva halus. Ketuk titik pertama untuk menutup bentuk.');
  if(mode=='node')h+=hint('Seret titik atau gagangnya. Ketuk garis untuk menambah titik.')+(l&&l.t=='vec'?`<div class="row">${bt('nsm','Halus / sudut')}${bt('ndel','Hapus titik')}</div>`:hint('Pilih sebuah bentuk vektor.'));
  if(l&&l.t=='vec')h+=`<h3>Bentuk vektor</h3><div class="row"><label class="cl">Isian<input type="color" data-k="fc" value="${l.fc}"></label><label class="cl">Garis<input type="color" data-k="sc" value="${l.sc}"></label></div>${rg('Tebal garis','sw',0,80,l.sw)}<label class="ck"><input type="checkbox" data-k="fill" ${l.fill?'checked':''}>Isi</label><label class="ck"><input type="checkbox" data-k="closed" ${l.closed?'checked':''}>Tertutup</label>${rg('Opasitas','op',0,1,l.op,.01)}`}
 if(tool=='bg'){const sw=['#ffffff','#f4f4f5','#18181b','#fde68a','#fecaca','#bfdbfe','#bbf7d0','#e9d5ff'];
  h=`<h3>Latar kanvas</h3><div class="sw">${sw.map(c=>`<button class="s" style="background:${c}" data-a="bgc" data-v="${c}" aria-label="${c}"></button>`).join('')}</div>
  <div class="row"><label class="cl">Warna<input type="color" data-k="_c" value="${D.bg.c||'#ffffff'}"></label><label class="cl">Gradasi ke<input type="color" data-k="_c2" value="${D.bg.c2||'#5b5bf0'}"></label></div>
  <div class="row">${bt('bgn','Transparan','',D.bg.t=='none')}${bt('pick','Foto latar','image',D.bg.t=='img','bg')}</div><h3>Hapus latar foto</h3>`;
  if(!I)h+=hint('Pilih sebuah foto, lalu hapus latarnya dengan pipet ajaib atau penghapus.');
  else{h+=`<div class="chips">${bt('mode','Pindah','',mode=='move','move')}${bt('mode','Pipet ajaib','',mode=='magic','magic')}${bt('mode','Hapus','',mode=='erase','erase')}${bt('mode','Pulihkan','',mode=='restore','restore')}</div>`;
   h+=`<div class="row">${bt('auto','Hapus latar otomatis','spark')}</div>`+rg('Toleransi','tol',1,100,tol)+rg('Susutkan tepi','ch',0,4,ch)+rg('Haluskan tepi','ft',0,8,ft)+`<label class="ck"><input type="checkbox" data-k="isl" ${isl?'checked':''}>Bersihkan bintik</label><label class="ck"><input type="checkbox" data-k="glob" ${glob?'checked':''}>Hapus semua warna serupa</label>`+(mode=='magic'?hint('Ketuk warna latar pada foto.'):'');
   if(mode=='erase'||mode=='restore')h+=hint('Usap pada foto untuk '+(mode=='erase'?'menghapus.':'memulihkan.'))+rg('Ukuran kuas','bs',5,200,bs);
   h+=`<div class="row">${bt('reset','Reset foto','undo')}</div>`}}
 if(tool=='clip'){h='<h3>Klip foto</h3>';
  if(!I)h+=hint('Pilih sebuah foto untuk memotongnya ke dalam bentuk.');
  else h+=`<div class="chips">${bt('mask','Tanpa','',!l.m,'')}${Object.keys(SH).filter(k=>k!='rect').map(k=>bt('mask',SH[k],'',l.m==k,k)).join('')}</div><div class="row">${bt('fitc','Isi kanvas','fit')}</div>`}
 if(tool=='text'){h=`<h3>Teks</h3><div class="row">${bt('addt','Tambah teks','plus')}</div>`;
  if(l&&l.t=='text')h+=`<textarea rows="3" data-k="txt">${l.txt}</textarea><select data-k="ff">${Object.entries(FONTS).map(([v,n])=>`<option value="${v}"${l.ff==v?' selected':''}>${n}</option>`).join('')}</select>${rg('Ukuran','s',10,500,Math.round(l.s))}<div class="row"><label class="cl">Warna<input type="color" data-k="c" value="${l.c}"></label></div><label class="ck"><input type="checkbox" data-k="b" ${l.b?'checked':''}>Tebal</label>${rg('Opasitas','op',0,1,l.op,.01)}`}
 if(tool=='shp'){h=`<h3>Bentuk</h3><div class="chips">${Object.entries(SH).map(([k,n])=>bt('adds',n,'',0,k)).join('')}</div>`;
  if(l&&l.t=='shape')h+=`<div class="row"><label class="cl">Warna<input type="color" data-k="c" value="${l.c}"></label></div><div class="row">${bt('tovec','Ubah ke vektor','pen')}</div>${rg('Opasitas','op',0,1,l.op,.01)}`}
 if(tool=='tpl'){h=`<h3>Ukuran kanvas</h3><div class="chips">${bt('size','Poster A4','',0,'1240,1754')}${bt('size','Brosur','',0,'1754,1240')}${bt('size','Persegi','',0,'1080,1080')}${bt('size','Story','',0,'1080,1920')}${bt('size','Banner','',0,'1600,600')}</div><h3>Templat awal</h3><div class="chips">${bt('tpl','Poster acara','',0,'poster')}${bt('tpl','Brosur promo','',0,'brosur')}${bt('tpl','Kosong','',0,'blank')}</div>${hint('Setelah memilih templat, tambahkan foto lalu klip ke bentuk.')}`}
 P.innerHTML=h}
$('#rail').innerHTML=TOOLS.map(([id,n,i])=>`<button data-a="tool" data-v="${id}">${IC(i)}${n}</button>`).join('');
function theme(t){document.documentElement.dataset.theme=t;$('#thm').innerHTML=IC(t=='dark'?'sun':'moon')}
theme(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
new ResizeObserver(()=>{fit();draw()}).observe($('#stage'));
document.onkeydown=e=>{if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
 if(e.key=='Enter'&&pn.length)penEnd(false);if(e.key=='Escape'){pn=[];draw();ui()}
 if(e.key=='Delete'||e.key=='Backspace'){if(tool=='draw'&&mode=='node'&&nsel>=0)act('ndel');else act('del')}
 if((e.ctrlKey||e.metaKey)&&e.key=='z'){e.preventDefault();e.shiftKey?redo():undo()}};
fit();ui();draw();
