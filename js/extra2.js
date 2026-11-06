/* extra2.js — Tambahan PawPics, dimuat setelah extra.js:
   topeng lapisan (masking: kuas sembunyikan/tampilkan, gradasi, balik, hapus), 12 templat baru,
   dan pemilih font dengan pratinjau langsung memakai teks lapisan. */

/* ---- topeng lapisan: kanvas penuh, bagian buram = terlihat ---- */
function mkNew(vis){const c=document.createElement('canvas');c.width=D.w;c.height=D.h;if(vis){const q=c.getContext('2d');q.fillRect(0,0,D.w,D.h)}return c}
function mkDraw(x,l){const t=document.createElement('canvas');t.width=D.w;t.height=D.h;const sv=[L,D.bg,sel];L=[l];D.bg={t:'none'};sel=-1;MKB.on=1;
 try{render(t.getContext('2d'),false)}finally{MKB.on=0;L=sv[0];D.bg=sv[1];sel=sv[2]}
 const q=t.getContext('2d');q.globalCompositeOperation='destination-in';q.drawImage(l.mk,0,0);
 x.save();x.globalCompositeOperation=l.bm||'source-over';x.drawImage(t,0,0);x.restore()}
function mkdot(l,p,hide){const q=l.mk.getContext('2d'),r=Math.max(2,bs/2),s=(l.mfs??50)/100,g=q.createRadialGradient(p.x,p.y,r*(1-s),p.x,p.y,r);
 g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(1,'rgba(0,0,0,0)');q.save();q.globalCompositeOperation=hide?'destination-out':'source-over';q.fillStyle=g;q.beginPath();q.arc(p.x,p.y,r,0,7);q.fill();q.restore()}
const pd1=cv.onpointerdown;cv.onpointerdown=e=>{const l=sl();
 if(tool=='mask'&&(mode=='mh'||mode=='mr')&&l&&l.mk){const p=pt(e);cv.setPointerCapture(e.pointerId);snap();l.mk=cl(l.mk);dr={k:'mk',l,h:mode=='mh',lp:p};mkdot(l,p,dr.h);draw();return}
 pd1(e)};
const pm1=cv.onpointermove;cv.onpointermove=e=>{if(dr&&dr.k=='mk'){const p=pt(e),a=dr.lp,n=Math.max(1,Math.ceil(Math.hypot(p.x-a.x,p.y-a.y)/(Math.max(4,bs)/4)));
 for(let i=1;i<=n;i++)mkdot(dr.l,{x:a.x+(p.x-a.x)*i/n,y:a.y+(p.y-a.y)*i/n},dr.h);dr.lp=p;draw();return}pm1(e)};
Object.assign(XA,{
 mka:()=>{const l=sl();if(l){l.mk=mkNew(1);mode='mh';cv.style.cursor='crosshair'}},
 mkh:()=>{const l=sl();if(l){l.mk=mkNew(0);mode='mr';cv.style.cursor='crosshair'}},
 mkd:()=>{const l=sl();if(l)delete l.mk},
 mki:()=>{const l=sl();if(!l||!l.mk)return;const c=mkNew(1),q=c.getContext('2d');q.globalCompositeOperation='destination-out';q.drawImage(l.mk,0,0);l.mk=c},
 mkg:v=>{const l=sl();if(!l)return;const{hx,hy}=ext(l),c=document.createElement('canvas');c.width=D.w;c.height=D.h;const q=c.getContext('2d');let g;
  if(v=='o')g=q.createRadialGradient(l.x,l.y,Math.min(hx,hy)*.4,l.x,l.y,Math.hypot(hx,hy));
  else{const x0=l.x-hx,x1=l.x+hx,y0=l.y-hy,y1=l.y+hy;g=q.createLinearGradient(...{d:[0,y0,0,y1],u:[0,y1,0,y0],r:[x0,0,x1,0],l:[x1,0,x0,0]}[v])}
  g.addColorStop(0,'#000');g.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=g;q.fillRect(0,0,D.w,D.h);l.mk=c},
 ff:v=>{const l=sl();if(l&&l.t=='text'){l.ff=v;loadF()}}});



/* ---- tab Topeng + pemilih font berpratinjau ---- */
const esc=t=>t.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ui1=ui;ui=function(){ui1();const l=sl();
 if(tool=='mask'){if(!l){P.innerHTML='<h3>Topeng</h3>'+hint('Pilih sebuah lapisan dulu.');return}
  const gr=`<h3>Topeng dari gradasi</h3><div class="chips">${[['d','Pudar ke bawah'],['u','Pudar ke atas'],['l','Pudar ke kiri'],['r','Pudar ke kanan'],['o','Vinyet radial']].map(([k,n])=>bt('mkg',n,'',0,k)).join('')}</div>`;
  P.innerHTML=l.mk?`<h3>Topeng lapisan</h3><div class="chips">${bt('mode','Pindah','',mode=='move','move')}${bt('mode','Sembunyikan','',mode=='mh','mh')}${bt('mode','Tampilkan','',mode=='mr','mr')}</div>${rg('Ukuran kuas','bs',5,300,bs)}${rg('Kelembutan','mfs',0,100,l.mfs??50)}<div class="row">${bt('mki','Balik topeng')}${bt('mkd','Hapus topeng','trash')}</div>`+hint('Usap pada kanvas: Sembunyikan menyamarkan bagian lapisan, Tampilkan memulihkannya. Lapisan aslinya tidak rusak.')+gr
   :`<h3>Topeng lapisan</h3>`+hint('Topeng menyembunyikan sebagian lapisan tanpa menghapusnya.')+`<div class="row">${bt('mka','Mulai terlihat penuh','plus')}${bt('mkh','Mulai tersembunyi','plus')}</div>`+gr;return}
 if(tool=='text'&&l&&l.t=='text'){const s=P.querySelector('select[data-k=ff]');if(s){const smp=esc(l.txt.split('\n')[0].slice(0,22)||'Aa');
  s.outerHTML=`<div class="fpk">${Object.entries(FONTS).map(([k,n])=>`<button class="fp${l.ff==k?' on':''}" data-a="ff" data-v="${esc(k)}"><span style="font-family:${esc(k)}">${smp}</span><small>${n}</small></button>`).join('')}</div>`;
  const fk=P.querySelector('.fpk'),on=fk.querySelector('.on');if(on)fk.scrollTop=Math.max(0,on.offsetTop-fk.offsetTop-60)}}};
TOOLS.splice(8,0,['mask','Topeng','mask']);
$('svg[aria-hidden]').insertAdjacentHTML('beforeend','<symbol id="i-mask" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="5"/></symbol>');
$('#rail').innerHTML=TOOLS.map(([id,n,i])=>`<button data-a="tool" data-v="${id}">${IC(i)}${n}</button>`).join('');
ui();draw();
