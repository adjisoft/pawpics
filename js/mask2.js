/* mask2.js — Topeng lapisan v2, dimuat setelah pro.js.
   Alat: kuas (ukuran/kekerasan/aliran), persegi, elips, lasso, gradasi linear & radial (seret di kanvas), pilih warna,
   topeng dari bentuk/kecerahan lapisan lain, tepi lembut & kekuatan langsung (non-destruktif), balik langsung,
   topeng ikut bergerak/skala/putar bersama lapisan, overlay merah, perluas/susutkan, terapkan permanen. */
(()=>{
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w));c.height=Math.max(1,Math.round(h));return c};
const MS={t:'brush',op:'hide',size:80,hard:60,flow:100,feather:0,tol:25,soft:40,gs:6,view:0,src:0,hs:0};
const mtx=l=>{if(!(l.mt&&l.mlink))return new DOMMatrix();const t=l.mt;return new DOMMatrix().translate(l.x,l.y).rotate(l.r*180/Math.PI).scale(l.w/Math.max(1,t.w),l.h/Math.max(1,t.h)).rotate(-t.r*180/Math.PI).translate(-t.x,-t.y)};
const toM=(l,p)=>{const q=mtx(l).inverse().transformPoint(new DOMPoint(p.x,p.y));return{x:q.x,y:q.y}};
const scl=l=>l.mt&&l.mlink?(l.w/Math.max(1,l.mt.w)+l.h/Math.max(1,l.mt.h))/2:1;
const own=l=>{l.mk=cl(l.mk)};
const mt0=l=>{l.mt={x:l.x,y:l.y,r:l.r,w:Math.max(1,l.w),h:Math.max(1,l.h)};if(l.mlink==null)l.mlink=1};
const newMask=(l,vis)=>{l.mk=mkNew(vis);mt0(l)};
function alone(o,byp){const t=mk(D.w,D.h),sv=[L,D.bg,sel];L=[o];D.bg={t:'none'};sel=-1;MKB.on=byp?1:0;try{render(t.getContext('2d'),false)}finally{MKB.on=0;L=sv[0];D.bg=sv[1];sel=sv[2]}return t}

/* topeng efektif (ruang kanvas): tepi lembut, balik, kekuatan */
function effMask(l){const W=D.w,H=D.h,E=mk(W,H),e=E.getContext('2d'),M=mk(W,H),m=M.getContext('2d'),f=l.mfe||0;m.setTransform(mtx(l));
 if(f>0){const p=Math.ceil(f*3),B=mk(W+2*p,H+2*p),b=B.getContext('2d'),c=l.mk;b.drawImage(c,p,p);b.drawImage(c,0,0,1,c.height,0,p,p,c.height);b.drawImage(c,c.width-1,0,1,c.height,W+p,p,p,c.height);b.drawImage(c,0,0,c.width,1,p,0,c.width,p);b.drawImage(c,0,c.height-1,c.width,1,p,H+p,c.width,p);
  m.filter=`blur(${f}px)`;m.drawImage(B,-p,-p)}else m.drawImage(l.mk,0,0);
 if(l.minv){e.fillRect(0,0,W,H);e.globalCompositeOperation='destination-out';e.drawImage(M,0,0)}else e.drawImage(M,0,0);
 const s=(l.mst??100)/100;if(s<1){const F=mk(W,H),q=F.getContext('2d');q.fillStyle=`rgba(0,0,0,${1-s})`;q.fillRect(0,0,W,H);q.globalCompositeOperation='lighter';q.globalAlpha=s;q.drawImage(E,0,0);return F}return E}
mkDraw=function(x,l){const t=alone(l,1),q=t.getContext('2d');q.globalCompositeOperation='destination-in';q.drawImage(effMask(l),0,0);x.save();x.globalCompositeOperation=l.bm||'source-over';x.drawImage(t,0,0);x.restore()};

/* overlay merah + pratinjau seretan */
const r0=render;render=function(x,ov,flat){r0(x,ov,flat);if(ov&&tool=='mask')maskOv(x)};
function maskOv(x){const l=sl();if(!l)return;
 if(MS.view&&l.mk){const o=mk(D.w,D.h),q=o.getContext('2d');q.fillStyle='rgba(239,68,68,.5)';q.fillRect(0,0,D.w,D.h);q.globalCompositeOperation='destination-out';q.drawImage(effMask(l),0,0);x.drawImage(o,0,0)}
 const d=dr;if(d&&d.k=='m2'&&d.cur&&MS.t!='brush'){const a=d.p0,b=d.cur;x.save();x.lineWidth=2/sc;x.strokeStyle='#5b5bf0';x.fillStyle='rgba(91,91,240,.18)';x.setLineDash([8/sc,6/sc]);x.beginPath();
  if(MS.t=='rect')x.rect(a.x,a.y,b.x-a.x,b.y-a.y);else if(MS.t=='ell')x.ellipse((a.x+b.x)/2,(a.y+b.y)/2,Math.abs(b.x-a.x)/2||1,Math.abs(b.y-a.y)/2||1,0,0,7);
  else if(MS.t=='lasso')d.pts.forEach((p,i)=>i?x.lineTo(p.x,p.y):x.moveTo(p.x,p.y));else{x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);if(MS.t=='rad')x.arc(a.x,a.y,Math.hypot(b.x-a.x,b.y-a.y),0,7)}
  if(['rect','ell','lasso'].includes(MS.t))x.fill();x.stroke();x.restore()}}

/* alat */
function stamp(l,p){const q=l.mk.getContext('2d'),c=toM(l,p),r=Math.max(1,MS.size/2/scl(l)),g=q.createRadialGradient(c.x,c.y,r*MS.hard/100*.999,c.x,c.y,r);
 g.addColorStop(0,`rgba(0,0,0,${MS.flow/100})`);g.addColorStop(1,'rgba(0,0,0,0)');q.save();q.globalCompositeOperation=MS.op=='hide'?'destination-out':'source-over';q.fillStyle=g;q.beginPath();q.arc(c.x,c.y,r,0,7);q.fill();q.restore()}
function trail(d,p){const a=d.lp,n=Math.max(1,Math.ceil(Math.hypot(p.x-a.x,p.y-a.y)/Math.max(2,MS.size/8)));for(let i=1;i<=n;i++)stamp(d.l,{x:a.x+(p.x-a.x)*i/n,y:a.y+(p.y-a.y)*i/n});d.lp=p}
function fillPoly(l,pts){if(pts.length<3)return;const q=l.mk.getContext('2d'),f=MS.feather/scl(l);q.save();q.filter=f>0?`blur(${f}px)`:'none';q.globalCompositeOperation=MS.op=='hide'?'destination-out':'source-over';q.fillStyle='#000';q.beginPath();pts.forEach((p,i)=>{const c=toM(l,p);i?q.lineTo(c.x,c.y):q.moveTo(c.x,c.y)});q.closePath();q.fill();q.restore()}
function colSel(l,p){const t=alone(l,1),q=t.getContext('2d'),x0=Math.floor(p.x),y0=Math.floor(p.y);if(x0<0||y0<0||x0>=D.w||y0>=D.h)return;
 const id=q.getImageData(0,0,D.w,D.h),d=id.data,i0=(y0*D.w+x0)*4,r=d[i0],g=d[i0+1],b=d[i0+2],T=MS.tol*4.4,S=Math.max(1,T*MS.soft/100);
 for(let i=0;i<d.length;i+=4){const k=Math.hypot(d[i]-r,d[i+1]-g,d[i+2]-b),a=k<=T?1:k>=T+S?0:1-(k-T)/S;d[i+3]*=a}
 q.putImageData(id,0,0);const m=l.mk.getContext('2d');m.save();m.setTransform(mtx(l).inverse());m.globalCompositeOperation=MS.op=='hide'?'destination-out':'source-over';m.drawImage(t,0,0);m.restore()}
function finish(d){const l=d.l,a=d.p0,b=d.cur||a,w=b.x-a.x,h=b.y-a.y,big=Math.abs(w)>2&&Math.abs(h)>2;
 if(MS.t=='rect'&&big)fillPoly(l,[a,{x:b.x,y:a.y},b,{x:a.x,y:b.y}]);
 else if(MS.t=='ell'&&big){const P=[];for(let i=0;i<72;i++){const t=i/72*Math.PI*2;P.push({x:(a.x+b.x)/2+Math.cos(t)*w/2,y:(a.y+b.y)/2+Math.sin(t)*h/2})}fillPoly(l,P)}
 else if(MS.t=='lasso')fillPoly(l,d.pts);
 else if((MS.t=='lin'||MS.t=='rad')&&Math.hypot(w,h)>3){const q=l.mk.getContext('2d'),A=toM(l,a),Z=toM(l,b),g=MS.t=='lin'?q.createLinearGradient(A.x,A.y,Z.x,Z.y):q.createRadialGradient(A.x,A.y,0,A.x,A.y,Math.hypot(Z.x-A.x,Z.y-A.y)),s=MS.op=='hide'?0:1;
  g.addColorStop(0,`rgba(0,0,0,${s})`);g.addColorStop(1,`rgba(0,0,0,${1-s})`);q.save();q.globalCompositeOperation='copy';q.fillStyle=g;q.fillRect(0,0,D.w,D.h);q.restore()}}
const pd2=cv.onpointerdown;cv.onpointerdown=e=>{const l=sl();if(tool=='mask'&&l&&l.mk&&MS.t!='move'){cv.setPointerCapture(e.pointerId);const p=pt(e);snap();own(l);
 if(MS.t=='color'){colSel(l,p);draw();return}dr={k:'m2',l,p0:p,pts:[p],lp:p,cur:p};if(MS.t=='brush')stamp(l,p);draw();return}pd2(e)};
const pm2=cv.onpointermove;cv.onpointermove=e=>{if(dr&&dr.k=='m2'){const p=pt(e);dr.cur=p;dr.pts.push(p);if(MS.t=='brush')trail(dr,p);draw();return}pm2(e)};
const pu2=cv.onpointerup;cv.onpointerup=cv.onpointercancel=e=>{const d=dr;if(d&&d.k=='m2'){dr=null;finish(d);draw();return}pu2(e)};

/* aksi */
const gro=(c,n)=>{const o=mk(c.width,c.height),q=o.getContext('2d');q.drawImage(c,0,0);for(let a=0;a<24;a++)q.drawImage(c,Math.cos(a*Math.PI/12)*n,Math.sin(a*Math.PI/12)*n);return o};
const invc=c=>{const o=mk(c.width,c.height),q=o.getContext('2d');q.fillRect(0,0,c.width,c.height);q.globalCompositeOperation='destination-out';q.drawImage(c,0,0);return o};
Object.assign(XA,{
 zm_t:v=>{MS.t=v;mode=v=='move'?'move':'m2';cv.style.cursor=v=='move'?'':'crosshair'},zm_op:v=>{MS.op=v},
 m2_new:v=>{const l=sl();if(!l)return;newMask(l,v=='show');MS.op=v=='show'?'hide':'show';MS.t='brush';mode='m2';cv.style.cursor='crosshair'},
 m2_gr:v=>{const l=sl();if(!l)return;XA.mkg(v);mt0(l);MS.t='lin'},
 m2_inv:()=>{const l=sl();if(l&&l.mk)XA.mki()},
 m2_fill:v=>{const l=sl();if(l&&l.mk)l.mk=mkNew(v=='show')},
 m2_grow:v=>{const l=sl();if(!l||!l.mk)return;const n=MS.gs;if(v=='+')l.mk=gro(l.mk,n);else{const o=cl(l.mk),q=o.getContext('2d');q.globalCompositeOperation='destination-out';q.drawImage(gro(invc(l.mk),n),0,0);l.mk=o}},
 m2_src:v=>{const l=sl(),o=L[+MS.src];if(!l||!o)return;const t=alone(o,o===l),q=t.getContext('2d');
  if(v=='lum'){const id=q.getImageData(0,0,D.w,D.h),d=id.data;for(let i=0;i<d.length;i+=4)d[i+3]=(.2126*d[i]+.7152*d[i+1]+.0722*d[i+2])/255*d[i+3];q.putImageData(id,0,0)}
  newMask(l,0);l.mk.getContext('2d').drawImage(t,0,0);if(o!==l&&MS.hs)o.hide=1;MS.op='hide';MS.t='brush';mode='m2'},
 m2_bake:()=>{const l=sl();if(!l||!l.mk||l.t!='img'){toast('Hanya untuk lapisan foto');return}const E=effMask(l),k=l.cv.width/l.w,c=cl(l.cv),q=c.getContext('2d'),A=new DOMMatrix().translate(l.x,l.y).rotate(l.r*180/Math.PI).translate(-l.w/2,-l.h/2).scale(1/k,1/k);
  q.globalCompositeOperation='destination-in';q.setTransform(A.inverse());q.drawImage(E,0,0);l.cv=c;['mk','mt','mfe','mst','minv'].forEach(k=>delete l[k]);MS.t='move';mode='move'},
 m2_del:()=>{const l=sl();if(!l)return;['mk','mt','mlink','mfe','mst','minv'].forEach(k=>delete l[k]);MS.t='brush';mode='move'}});
P.addEventListener('pointerdown',e=>{const w=e.target.dataset.w;if(w&&w.startsWith('lm.'))snap()});
P.addEventListener('input',e=>{const t=e.target,q=t.dataset.w;if(!q)return;const[a,k]=q.split('.'),l=sl(),v=t.type=='checkbox'?(t.checked?1:0):t.type=='range'?+t.value:t.value;
 if(t.type=='range'){const b=t.parentNode.querySelector('b');if(b)b.textContent=v}
 if(a=='ms')MS[k]=v;
 else if(a=='lm'&&l){if(k=='mlink'&&l.mk){if(v&&!l.mlink)mt0(l);if(!v&&l.mlink&&l.mt){const c=mk(D.w,D.h),g=c.getContext('2d');g.setTransform(mtx(l));g.drawImage(l.mk,0,0);l.mk=c}}l[k]=v}
 draw()});

/* panel */
const rw=(t,k,a,b,v,s=1)=>`<label class="rw"><span>${t}<b>${Math.round(v*100)/100}</b></span><input type="range" data-w="${k}" min="${a}" max="${b}" step="${s}" value="${v}"></label>`;
const ck=(t,k,v)=>`<label class="ck"><input type="checkbox" data-w="${k}" ${v?'checked':''}>${t}</label>`;
const HINT={brush:'Usap pada kanvas. Mode Sembunyikan menyamarkan, Tampilkan memulihkan.',rect:'Seret untuk membuat persegi. Hasilnya ditambah atau dikurangi dari topeng sesuai mode.',ell:'Seret untuk membuat elips.',lasso:'Gambar bentuk bebas, lepas jari untuk menutup dan mengisi.',lin:'Seret dari titik awal ke akhir. Topeng diganti dengan gradasi.',rad:'Seret dari pusat ke tepi. Topeng diganti dengan gradasi radial.',color:'Ketuk warna pada lapisan. Warna serupa ditampilkan atau disembunyikan.',move:'Geser, ubah ukuran, atau putar lapisan. Topeng ikut jika opsi ikut lapisan aktif.'};
function maskUI(){const l=sl();if(!l){P.innerHTML='<h3>Topeng</h3>'+hint('Pilih sebuah lapisan dulu.');return}
 const src=`<label class="cl">Sumber<select data-w="ms.src">${L.map((q,i)=>`<option value="${i}"${+MS.src==i?' selected':''}>${nm(q)} #${i+1}${q===l?' (ini)':''}</option>`).join('')}</select></label><div class="row">${bt('m2_src','Dari bentuk','shapes',0,'alpha')}${bt('m2_src','Dari kecerahan','sun',0,'lum')}</div>${ck('Sembunyikan lapisan sumber','ms.hs',MS.hs)}`;
 if(!l.mk){P.innerHTML=`<h3>Topeng lapisan</h3>`+hint('Topeng menyembunyikan sebagian lapisan tanpa merusaknya. Mulai dari salah satu cara berikut.')+`<div class="row">${bt('m2_new','Terlihat penuh','plus',0,'show')}${bt('m2_new','Tersembunyi penuh','plus',0,'hide')}</div><h3>Dari gradasi</h3><div class="chips">${[['d','Pudar ke bawah'],['u','Pudar ke atas'],['l','Pudar ke kiri'],['r','Pudar ke kanan'],['o','Vinyet radial']].map(([k,n])=>bt('m2_gr',n,'',0,k)).join('')}</div><h3>Dari lapisan lain</h3>`+src;return}
 const T0=[['brush','Kuas','pen'],['rect','Persegi','shapes'],['ell','Elips','shapes'],['lasso','Lasso','cut'],['lin','Gradasi','contrast'],['rad','Radial','sun'],['color','Warna','spark'],['move','Pindah','move']];
 P.innerHTML=`<h3>Topeng</h3><div class="hs">${T0.map(([k,n,i])=>bt('zm_t',n,i,MS.t==k,k)).join('')}</div><div class="seg">${[['show','Tampilkan'],['hide','Sembunyikan']].map(([k,n])=>`<button class="${MS.op==k?'on':''}" data-a="zm_op" data-v="${k}">${n}</button>`).join('')}</div>`
 +(MS.t=='brush'?rw('Ukuran','ms.size',1,400,MS.size)+rw('Kekerasan','ms.hard',0,100,MS.hard)+rw('Aliran','ms.flow',1,100,MS.flow):'')
 +(['rect','ell','lasso'].includes(MS.t)?rw('Tepi lembut','ms.feather',0,80,MS.feather):'')
 +(MS.t=='color'?rw('Toleransi','ms.tol',1,100,MS.tol)+rw('Kelembutan','ms.soft',0,100,MS.soft):'')+hint(HINT[MS.t])
 +`<h3>Hasil topeng</h3>`+rw('Tepi lembut topeng','lm.mfe',0,60,l.mfe||0)+rw('Kekuatan topeng','lm.mst',0,100,l.mst??100)+ck('Balik topeng (langsung)','lm.minv',l.minv)+ck('Ikut bergerak dengan lapisan','lm.mlink',l.mlink)+ck('Tampilkan overlay merah','ms.view',MS.view)
 +`<div class="row">${bt('m2_inv','Balik permanen')}${bt('m2_fill','Tampilkan semua','',0,'show')}${bt('m2_fill','Sembunyikan semua','',0,'hide')}</div>`
 +rw('Perluas / susutkan (px)','ms.gs',1,60,MS.gs)+`<div class="row">${bt('m2_grow','Perluas','',0,'+')}${bt('m2_grow','Susutkan','',0,'-')}</div><h3>Dari lapisan lain</h3>`+src
 +`<div class="row">${l.t=='img'?bt('m2_bake','Terapkan permanen','image'):''}${bt('m2_del','Hapus topeng','trash')}</div>`}
const ui5=ui;ui=function(){ui5();if(tool=='mask')maskUI();else if(tool=='tpl')tplUI()};
document.addEventListener('keydown',e=>{if(tool=='mask'&&!/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)){if(e.key=='x'){MS.op=MS.op=='hide'?'show':'hide';ui()}if(e.key=='['||e.key==']'){MS.size=Math.max(1,Math.min(400,MS.size*(e.key=='['?.8:1.25)|0||1));ui()}}});

/* ---------- galeri templat berkategori + thumbnail ---------- */
const TC={cat:'Kreatif'},CATS=['Semua','Sosmed','Promo','Brosur','Bisnis','Acara','Foto','Kolase','Pendidikan','Kreatif','Lainnya'];
function th(t){if(t.th)return t.th;const sv=[D,L,sel];D={w:t[2],h:t[3],t:1,bg:{t:'color',c:'#ffffff'}};L=[];sel=-1;let u='';
 try{t[4]();const c=mk(D.w,D.h);render(c.getContext('2d'),false,true);const k=150/Math.max(D.w,D.h),s=mk(D.w*k,D.h*k);s.getContext('2d').drawImage(c,0,0,s.width,s.height);u=s.toDataURL('image/jpeg',.7)}catch(e){}finally{D=sv[0];L=sv[1];sel=sv[2]}return t.th=u}
XA.ztc=v=>{TC.cat=v};
function tplUI(){const ch=[...P.querySelectorAll('.chips')].pop();if(!ch)return;TPX.forEach(t=>{t[5]=t[5]||(window.TCAT||{})[t[0]]||'Lainnya'});
 const ls=TPX.filter(t=>TC.cat=='Semua'||t[5]==TC.cat);
 ch.outerHTML=`<div class="seg">${CATS.map(c=>`<button class="${TC.cat==c?'on':''}" data-a="ztc" data-v="${c}">${c}</button>`).join('')}</div><div class="tg">${ls.map(t=>`<button data-a="mkt" data-v="${t[0]}"><img src="${th(t)}" alt=""><span>${t[1]}</span></button>`).join('')||hint('Belum ada templat.')}</div>`}
ui();
})();
