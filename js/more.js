/* more.js — Ganti foto (replace layer), kategori Polaroid + banyak bingkai kolase baru, templat polaroid & kolase. Dimuat terakhir. */
(()=>{
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w));c.height=Math.max(1,Math.round(h));return c};

/* ---------- GANTI FOTO ---------- */
const fo=$('#fi').onchange;
$('#fi').onchange=e=>{if(fm!='rep'&&fm!='repfit')return fo(e);const f=e.target.files[0],l=sl(),fit=fm=='repfit';e.target.value='';if(!f||!l||l.t!='img')return;
 li(URL.createObjectURL(f)).then(i=>{snap();let h=l.h,sx=0,sy=0,sw=i.width,sh=i.height;
  if(fit)h=l.w*i.height/i.width;else{const a=l.w/l.h;if(i.width/i.height>a){sw=i.height*a;sx=(i.width-sw)/2}else{sh=i.width/a;sy=(i.height-sh)/2}}
  const k=Math.min(1,3000/Math.max(sw,sh)),c=mk(sw*k,sh*k);c.getContext('2d').drawImage(i,sx,sy,sw,sh,0,0,c.width,c.height);
  l.cv=c;l.orig=c;l.h=h;delete l._a;delete l._s;ui();draw();toast('Foto diganti')}).catch(()=>toast('Gagal membaca foto'))};
XA.zrep=v=>{const l=sl();if(!l||l.t!='img'){toast('Pilih lapisan foto dulu');return}if(l.col&&XA.co_rep){XA.co_rep();return}pick(v)};
const ui6=ui;ui=function(){ui6();if(tool=='layers'){const l=sl(),r=P.querySelector('.row');if(r&&l&&l.t=='img')r.insertAdjacentHTML('beforeend',bt('zrep','Ganti foto','image',0,'rep')+(l.col?'':bt('zrep','Ganti (ikuti rasio foto)','image',0,'repfit')))}};

/* ---------- LAYOUT KOLASE BARU ---------- */
const LY=COX.LY,GR=(c,r)=>{const o=[];for(let j=0;j<r;j++)for(let i=0;i<c;i++)o.push([i/c,j/r,1/c,1/r]);return o};
LY.min.push(GR(2,3),GR(3,2),GR(4,1),GR(1,4),GR(4,2),GR(2,4),GR(4,4),
 [[0,0,.5,1],[.5,0,.5,.33],[.5,.33,.5,.34],[.5,.67,.5,.33]],[[0,0,.33,1],[.33,0,.34,.5],[.67,0,.33,.5],[.33,.5,.67,.5]],
 [[0,0,1,.25],[0,.25,.25,.5],[.25,.25,.5,.5],[.75,.25,.25,.5],[0,.75,1,.25]],[[0,0,.5,.5],[.5,0,.25,.5],[.75,0,.25,.5],[0,.5,.25,.5],[.25,.5,.25,.5],[.5,.5,.5,.5]],
 [[0,0,1,.4],[0,.4,.5,.3],[.5,.4,.5,.3],[0,.7,.33,.3],[.33,.7,.34,.3],[.67,.7,.33,.3]],[[0,0,.5,.34],[.5,0,.5,.34],[0,.34,1,.32],[0,.66,.5,.34],[.5,.66,.5,.34]],
 [[0,0,.7,.7],[.7,0,.3,.35],[.7,.35,.3,.35],[0,.7,.35,.3],[.35,.7,.35,.3],[.7,.7,.3,.3]],[[0,0,.5,.7],[.5,0,.5,.35],[.5,.35,.5,.35],[0,.7,1,.3]]);
LY.free.push([[.05,.05,.42,.3,-4],[.53,.1,.42,.3,5],[.05,.4,.42,.3,3],[.53,.45,.42,.3,-3],[.28,.72,.44,.25,2]],[[.1,.1,.8,.5,-2],[.08,.58,.4,.3,4],[.52,.62,.4,.3,-4]],
 [[.08,.1,.38,.26,-8],[.54,.06,.38,.26,6],[.3,.34,.4,.28,0],[.08,.66,.38,.26,5],[.54,.68,.38,.26,-6]],[[.2,.05,.6,.4,3],[.1,.45,.38,.28,-5],[.52,.5,.38,.28,5],[.3,.78,.4,.18,-2]]);
LY.pos.push({c:[[0,0,1,.7],[0,.7,.5,.3],[.5,.7,.5,.3]],t:[['TRAVEL DIARY',.5,.06,.08,'#ffffff','Pacifico']]},{c:[[0,0,.5,.45],[.5,0,.5,.45],[0,.45,.5,.45],[.5,.45,.5,.45]],t:[['THE FOUR OF US',.5,.95,.06,'#111827','Anton']]},{c:[[.1,.08,.8,.62]],t:[['Nama Kamu',.5,.82,.1,'#18181b','Great Vibes'],['Senyum hari ini',.5,.92,.04,'#6b7280','Poppins']]});
LY.puz.push([[.25,.02,.5,.5,0,'heart'],[0,.45,.5,.5,0,'heart'],[.5,.45,.5,.5,0,'heart']],[[0,0,.5,.5,0,'circ'],[.5,0,.5,.5,0,'circ'],[0,.5,.5,.5,0,'circ'],[.5,.5,.5,.5,0,'circ']],[[.05,.1,.9,.9,0,'star']],[[.05,.1,.9,.9,0,'hex']],[[.05,.1,.9,.9,0,'diamond']],[[0,.05,.5,.5,0,'tri'],[.5,.05,.5,.5,0,'tri'],[.25,.5,.5,.5,0,'tri']],[[0,.3,.34,.34,0,'circ'],[.33,.3,.34,.34,0,'circ'],[.66,.3,.34,.34,0,'circ']]);
/* polaroid: ukuran kartu dihitung dari rasio kanvas, jadi tetap berbentuk polaroid di semua rasio */
const fr=(o,W,H)=>o.map(c=>[c[0]/W,c[1]/H,c[2]/W,c[3]/H,c[4]]);
const pf=(c,r,rots,m=.06)=>(W,H)=>{const o=[],aw=W*(1-2*m),ah=H*(1-2*m),cw=Math.min(aw/c,ah/(r*1.2))*.9,ch=cw*1.2;for(let j=0;j<r;j++)for(let i=0;i<c;i++)o.push([W*m+(i+.5)*aw/c-cw/2,H*m+(j+.5)*ah/r-ch/2,cw,ch,rots[(i+j*c)%rots.length]]);return fr(o,W,H)};
const fan=(n,sp)=>(W,H)=>{const cw=Math.min(W*.44,H*.34),ch=cw*1.2,o=[];for(let i=0;i<n;i++){const t=n>1?i/(n-1)-.5:0;o.push([W/2+t*W*.42-cw/2,H*.55+Math.abs(t)*H*.08-ch/2,cw,ch,t*sp])}return fr(o,W,H)};
const pile=(n,sd)=>(W,H)=>{let s=sd*9301+49297;const R=()=>(s=(s*9301+49297)%233280)/233280,cw=Math.min(W*.55,H*.42),ch=cw*1.2,o=[];for(let i=0;i<n;i++)o.push([W/2+(R()-.5)*W*.3-cw/2,H/2+(R()-.5)*H*.3-ch/2,cw,ch,(R()-.5)*28]);return fr(o,W,H)};
const cas=n=>(W,H)=>{const cw=Math.min(W*.5,H*.36),ch=cw*1.2,o=[];for(let i=0;i<n;i++){const t=n>1?i/(n-1):.5;o.push([W*(.28+.44*t)-cw/2,H*(.26+.48*t)-ch/2,cw,ch,i%2?6:-6])}return fr(o,W,H)};
const PO=f=>({c:f(1080,1350),f});
LY.pol=[pf(1,1,[-3]),pf(1,2,[-3,3]),pf(2,1,[-4,4]),pf(2,2,[0]),pf(2,2,[-4,3,3,-4]),pf(2,3,[0]),pf(2,3,[-3,4,4,-3,-4,3]),pf(3,2,[0]),pf(3,2,[-4,3,-2,3,-4,2]),pf(3,3,[0]),pf(3,3,[-3,2,-4,4,-2,3,-3,4,-2]),pf(3,4,[-2,3,-3,2]),pf(4,3,[-2,3,-3,2]),pf(2,4,[-3,3]),fan(3,30),fan(4,40),fan(5,50),pile(3,1),pile(4,2),pile(5,3),pile(6,4),cas(3),cas(4),cas(5)].map(PO);


ui();
})();
