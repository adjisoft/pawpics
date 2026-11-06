/* studio.js — PawPics Studio, dimuat terakhir:
   tipografi lanjutan (rata, garis bawah, tinggi baris, teks melengkung, gradasi, gaya), potong (kanvas & foto),
   grading warna (level, kurva RGB, keseimbangan warna, HSL 8 warna, split toning, preset, auto),
   retus (klon, penyembuh, noda, dodge/burn, sponge, blur, tajam), mesin kuas lukis (12 preset, tekanan pena, stabilizer,
   simetri, kuas kustom dari lapisan/gambar), gradasi bentuk, dan templat kategori Kreatif. */
(()=>{
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w));c.height=Math.max(1,Math.round(h));return c};
const sr=(t,s,a,b,v,st=1)=>`<label class="rw"><span>${t}<b>${Math.round(v*100)/100}</b></span><input type="range" data-s="${s}" min="${a}" max="${b}" step="${st}" value="${v}"></label>`;
const ck=(t,s,v)=>`<label class="ck"><input type="checkbox" data-s="${s}" ${v?'checked':''}>${t}</label>`;
const co=(t,s,v)=>`<label class="cl">${t}<input type="color" data-s="${s}" value="${v}"></label>`;
const sg=(it,cur,a)=>`<div class="seg">${it.map(([k,n])=>`<button class="${cur==k?'on':''}" data-a="${a}" data-v="${k}">${n}</button>`).join('')}</div>`;
const A=o=>Object.assign(L[L.length-1],o);

/* ---------- teks lanjutan: dipanggil dari render() ---------- */
window.TXR=(x,l,e,hsh,sh)=>{
 if(!(l.al&&l.al!='c'||l.ul||l.sk||l.lh||l.cu||l.g2||l.up||l.hol))return 0;
 x.font=`${l.it?'italic ':''}${l.b?'700 ':''}${l.s}px ${l.ff}`;x.letterSpacing=(l.ls||0)+'px';x.textBaseline='middle';
 const ln=(l.up?l.txt.toUpperCase():l.txt).split('\n'),lh=l.s*(l.lh||1.25),mw=s=>x.measureText(s).width,W=Math.max(10,...ln.map(mw)),al=l.al||'c',ax=al=='l'?-W/2:al=='r'?W/2:0;
 l.w=W;l.h=lh*ln.length;
 let fs=l.c;if(l.g2){fs=x.createLinearGradient(-W/2,0,W/2,0);fs.addColorStop(0,l.c);fs.addColorStop(1,l.g2)}
 const put=(s,y,f)=>{
  if(!l.cu){x.textAlign=al=='l'?'left':al=='r'?'right':'center';f?x.fillText(s,ax,y):x.strokeText(s,ax,y);return}
  x.textAlign='center';const w=mw(s),th=l.cu/100*Math.PI*1.5,R=w/th;let d=0;
  for(const ch of s){const cw=mw(ch),a=(d+cw/2)/R-th/2;d+=cw;x.save();x.translate(R*Math.sin(a),y+R*(1-Math.cos(a)));x.rotate(a);f?x.fillText(ch,0,0):x.strokeText(ch,0,0);x.restore()}};
 const ys=ln.map((_,i)=>(i-(ln.length-1)/2)*lh);
 if(hsh)sh();
 if(e.ow||l.hol){x.lineJoin='round';x.lineWidth=(e.ow||Math.max(2,l.s/22))*2;x.strokeStyle=e.ow?e.oc:l.c;ln.forEach((s,i)=>put(s,ys[i],0))}
 x.fillStyle=fs;if(!l.hol)ln.forEach((s,i)=>put(s,ys[i],1));
 if((l.ul||l.sk)&&!l.cu)ln.forEach((s,i)=>{const w=mw(s),x0=al=='l'?-W/2:al=='r'?W/2-w:-w/2,t=Math.max(2,l.s/15);if(l.ul)x.fillRect(x0,ys[i]+l.s*.42,w,t);if(l.sk)x.fillRect(x0,ys[i]-t/2,w,t)});
 return 1};
window.GF=(x,l)=>{if(!l.g2)return l.c;const a=(l.ga??45)*Math.PI/180,d=Math.hypot(l.w,l.h)/2,g=x.createLinearGradient(-Math.cos(a)*d,-Math.sin(a)*d,Math.cos(a)*d,Math.sin(a)*d);g.addColorStop(0,l.c);g.addColorStop(1,l.g2);return g};

/* ---------- grading warna ---------- */
const HB=[['Merah',0],['Oranye',30],['Kuning',60],['Hijau',120],['Aqua',180],['Biru',240],['Ungu',280],['Magenta',320]];
const cur=(a,b,c)=>{const Y=[0,.25+a/250,.5+b/250,.75+c/250,1],m=Y.map((_,i)=>i==0?(Y[1]-Y[0])*4:i==4?(Y[4]-Y[3])*4:(Y[i+1]-Y[i-1])*2);
 return v=>{v=Math.min(1,Math.max(0,v));const i=Math.min(3,v*4|0),t=v*4-i,t2=t*t,t3=t2*t;return Math.min(1,Math.max(0,(2*t3-3*t2+1)*Y[i]+(t3-2*t2+t)*.25*m[i]+(-2*t3+3*t2)*Y[i+1]+(t3-t2)*.25*m[i+1]))}};
function r2h(r,g,b){r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;let h=0,s=0;if(mx!=mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx==r?(g-b)/d+(g<b?6:0):mx==g?(b-r)/d+2:(r-g)/d+4;h*=60}return[h,s,l]}
function h2r(h,s,l){const f=n=>{const k=(n+h/30)%12,a=s*Math.min(l,1-l);return 255*(l-a*Math.max(-1,Math.min(k-3,9-k,1)))};return[f(0),f(8),f(4)]}
const hx=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16));
function cgApply(l,S){const a=l.cg;if(!a||!Object.keys(a).length)return S;const key=JSON.stringify(a);if(l._g&&l._g.s===S&&l._g.k===key)return l._g.o;
 const c=cl(S),q=c.getContext('2d'),id=q.getImageData(0,0,c.width,c.height),d=id.data,g=(k,z=0)=>a[k]??z,lb=g('lb'),lw=g('lw',255),gm=g('lg',100)/100,
 cs=['m','r','g','b'].map(n=>cur(g('c'+n+'1'),g('c'+n+'2'),g('c'+n+'3'))),
 LUT=[1,2,3].map(ci=>{const t=new Uint8ClampedArray(256),wk=g(['','wr','wg','wb'][ci],1);for(let i=0;i<256;i++){let v=Math.min(1,Math.max(0,(i*wk-lb)/Math.max(1,lw-lb)));v=Math.pow(v,1/gm);t[i]=255*cs[ci](cs[0](v))}return t}),
 K=Object.keys(a),hB=K.some(k=>/^b[smh]\d/.test(k)&&a[k]),hH=K.some(k=>/^(hh|ss|ll)\d/.test(k)&&a[k]),hS=a.sa>0,S1=hx(g('sc','#1e3a5f')),H1=hx(g('hc','#ff9a3c')),sa=g('sa')/200;
 for(let i=0;i<d.length;i+=4){let r=LUT[0][d[i]],e=LUT[1][d[i+1]],b=LUT[2][d[i+2]];const y=(.2126*r+.7152*e+.0722*b)/255;
  if(hB){const ws=(1-y)*(1-y),wm=4*y*(1-y),wh=y*y,f=z=>(g('bs'+z)*ws+g('bm'+z)*wm+g('bh'+z)*wh)*.5;r+=f(0);e+=f(1);b+=f(2)}
  if(hS){const ws=(1-y)*(1-y)*sa,wh=y*y*sa;r+=(S1[0]-r)*ws+(H1[0]-r)*wh;e+=(S1[1]-e)*ws+(H1[1]-e)*wh;b+=(S1[2]-b)*ws+(H1[2]-b)*wh}
  if(hH){const[h,s,L0]=r2h(Math.min(255,Math.max(0,r)),Math.min(255,Math.max(0,e)),Math.min(255,Math.max(0,b)));
   if(s>.02){let dh=0,ds=0,dl=0;for(let z=0;z<8;z++){let df=Math.abs(h-HB[z][1]);df=Math.min(df,360-df);const w=Math.max(0,1-df/45);if(w){dh+=g('hh'+z)*.3*w;ds+=g('ss'+z)/100*w;dl+=g('ll'+z)/200*w}}
    [r,e,b]=h2r((h+dh+360)%360,Math.min(1,Math.max(0,s*(1+ds))),Math.min(1,Math.max(0,L0+dl*(1-Math.abs(L0-.5)*1.4))))}}
  d[i]=r;d[i+1]=e;d[i+2]=b}
 q.putImageData(id,0,0);l._g={s:S,k:key,o:c};return c}
const adv0=adv;adv=function(l){return cgApply(l,adv0(l))};
const sm=l=>{const c=mk(Math.min(400,l.cv.width),Math.min(400,l.cv.height)),x=c.getContext('2d');x.drawImage(l.cv,0,0,c.width,c.height);return x.getImageData(0,0,c.width,c.height).data};
const al8=(k,v)=>Object.fromEntries([...Array(8)].map((_,i)=>[k+i,v]));
const GP={'Teal-Orange':{bs0:-18,bs2:22,bh0:26,bh2:-20,sc:'#0e6b7a',hc:'#ff9a3c',sa:28,cm1:-6,cm3:6},'Film hangat':{cm1:-6,cm2:8,cm3:-4,bh0:18,bh2:-14,lb:8,...al8('ss',-8)},'Bleach':{cm1:-14,cm3:14,...al8('ss',-38)},'Moody':{cm2:-12,bs2:20,bm1:-8,sc:'#1e3a5f',hc:'#d9a066',sa:30,lb:10,lg:90},'Pastel':{cm1:16,cm2:10,lw:240,lb:6,...al8('ss',-22)},'Dramatis':{cm1:-22,cm3:22,...al8('ss',16)},'Mono film':{...al8('ss',-100),cm1:-14,cm3:10,lb:6}};
const GC={ch:'m',rg:0,bd:0};
function gradeUI(l){let h='<h3>Warna &amp; grading</h3>';if(!l||l.t!='img')return P.innerHTML=h+hint('Pilih sebuah foto untuk grading dan koreksi warna.');const a=l.cg||{},g=(k,z=0)=>a[k]??z,B=['Bayangan','Tengah','Sorotan'];
 P.innerHTML=h+`<div class="hs">${Object.keys(GP).map(k=>bt('cg_p',k,'',0,k)).join('')}</div><div class="row">${bt('cg_al','Level otomatis','spark')}${bt('cg_wb','Seimbang putih otomatis')}${bt('cg_r','Reset','undo')}</div>`
 +`<h3>Level</h3>`+sr('Titik hitam','cg:lb',0,100,g('lb'))+sr('Gamma','cg:lg',30,300,g('lg',100))+sr('Titik putih','cg:lw',155,255,g('lw',255))
 +`<h3>Kurva</h3>`+sg([['m','RGB'],['r','Merah'],['g','Hijau'],['b','Biru']],GC.ch,'zg_ch')+B.map((n,i)=>sr(n,'cg:c'+GC.ch+(i+1),-100,100,g('c'+GC.ch+(i+1)))).join('')
 +`<h3>Keseimbangan warna</h3>`+sg([[0,'Bayangan'],[1,'Tengah'],[2,'Sorotan']],GC.rg,'zg_rg')+['Cyan ↔ Merah','Magenta ↔ Hijau','Kuning ↔ Biru'].map((n,i)=>sr(n,'cg:b'+'smh'[GC.rg]+i,-100,100,g('b'+'smh'[GC.rg]+i))).join('')
 +`<h3>HSL per warna</h3><div class="hs">${HB.map(([n],i)=>`<button class="b${GC.bd==i?' on':''}" data-a="zg_bd" data-v="${i}">${n}</button>`).join('')}</div>`+sr('Rona','cg:hh'+GC.bd,-100,100,g('hh'+GC.bd))+sr('Saturasi','cg:ss'+GC.bd,-100,100,g('ss'+GC.bd))+sr('Cahaya','cg:ll'+GC.bd,-100,100,g('ll'+GC.bd))
 +`<h3>Split toning</h3><div class="row">${co('Bayangan','cg:sc',g('sc','#1e3a5f'))}${co('Sorotan','cg:hc',g('hc','#ff9a3c'))}</div>`+sr('Jumlah','cg:sa',0,100,g('sa'))+hint('Ketajaman, vinyet, dan grain ada di tab Pro dan Efek.')}

/* ---------- potong ---------- */
const CR={t:'canvas',a:null,r:null};
function cropUI(){const A0=[['0','Bebas'],['1,1','1:1'],['4,5','4:5'],['3,4','3:4'],['16,9','16:9'],['9,16','9:16']];
 P.innerHTML=`<h3>Potong</h3>`+sg([['canvas','Kanvas'],['photo','Foto terpilih']],CR.t,'zcr_t')+hint('Seret pada kanvas untuk membuat area potong, lalu Terapkan.')+`<h3>Rasio</h3><div class="hs">${A0.map(([k,n])=>`<button class="b${(CR.a?CR.a.join():'0')==k?' on':''}" data-a="zcr_a" data-v="${k}">${n}</button>`).join('')}</div><div class="row">${bt('zcr_all','Pilih semua')}${bt('cr_ok','Terapkan','',1)}${bt('zcr_x','Batal')}</div>`+(CR.r?`<p class="mu">${Math.round(CR.r.w)} × ${Math.round(CR.r.h)} px</p>`:'')}
function cropOv(x){const r=CR.r;if(!r||r.w<2)return;x.save();x.fillStyle='rgba(0,0,0,.55)';x.beginPath();x.rect(-4000,-4000,9000,9000);x.rect(r.x,r.y,r.w,r.h);x.fill('evenodd');x.strokeStyle='#fff';x.lineWidth=2/sc;x.strokeRect(r.x,r.y,r.w,r.h);x.globalAlpha=.5;x.lineWidth=1/sc;
 for(let i=1;i<3;i++){x.beginPath();x.moveTo(r.x+r.w*i/3,r.y);x.lineTo(r.x+r.w*i/3,r.y+r.h);x.moveTo(r.x,r.y+r.h*i/3);x.lineTo(r.x+r.w,r.y+r.h*i/3);x.stroke()}x.restore()}
const rd0=render;render=function(x,ov,flat){rd0(x,ov,flat);if(ov&&tool=='crop')cropOv(x)};
function cropGo(){const r=CR.r;if(!r||r.w<4||r.h<4){toast('Buat area potong dulu');return}
 if(CR.t=='canvas'){const x0=Math.max(0,r.x),y0=Math.max(0,r.y),w=Math.min(D.w,r.x+r.w)-x0,h=Math.min(D.h,r.y+r.h)-y0;if(w<4||h<4)return;
  L.forEach(l=>{l.x-=x0;l.y-=y0;if(l.mt){l.mt.x-=x0;l.mt.y-=y0}if(l.mk){const c=mk(w,h);c.getContext('2d').drawImage(l.mk,-x0,-y0);l.mk=c}});
  D.w=Math.round(w);D.h=Math.round(h);D.t=1;fit()}
 else{const l=sl();if(!l||l.t!='img'||l.mk){toast('Pilih lapisan foto tanpa topeng');return}
  const a=lc(l,{x:r.x,y:r.y}),b=lc(l,{x:r.x+r.w,y:r.y+r.h}),x0=Math.max(-l.w/2,Math.min(a.x,b.x)),x1=Math.min(l.w/2,Math.max(a.x,b.x)),y0=Math.max(-l.h/2,Math.min(a.y,b.y)),y1=Math.min(l.h/2,Math.max(a.y,b.y));
  if(x1-x0<4||y1-y0<4){toast('Area di luar foto');return}
  const k=l.cv.width/l.w,c=mk((x1-x0)*k,(y1-y0)*k);c.getContext('2d').drawImage(l.cv,(x0+l.w/2)*k,(y0+l.h/2)*k,(x1-x0)*k,(y1-y0)*k,0,0,c.width,c.height);
  const cx=(x0+x1)/2,cy=(y0+y1)/2,cs=Math.cos(l.r),sn=Math.sin(l.r);l.x+=cx*cs-cy*sn;l.y+=cx*sn+cy*cs;l.w=x1-x0;l.h=y1-y0;l.cv=l.orig=c;delete l._a;delete l._s;delete l._g}
 CR.r=null}

/* ---------- mesin kuas ---------- */
const BASE={tp:'round',s:30,o:100,f:100,h:80,sp:10,jt:0,sc:0,an:0,aj:0,rd:100,ps:0,pa:0,sm:20,sy:0,bm:'source-over',er:0};
const PRS={'Pensil':{tp:'chalk',s:8,f:75,sp:8,jt:10,aj:180,ps:1,pa:1,sm:15},'Pena tinta':{s:10,h:100,sp:4,ps:1,sm:45},'Marker':{s:36,h:100,o:70,sp:5,rd:35,an:45},'Airbrush':{s:70,h:0,f:10,sp:6,pa:1},'Cat air':{s:44,h:50,f:45,o:85,sp:9,jt:12,ps:1,pa:1,sm:25},'Arang':{tp:'chalk',s:34,f:65,sp:10,jt:30,aj:180,ps:1,pa:1},'Kapur':{tp:'chalk',s:46,f:90,sp:14,jt:20,aj:180},'Spray':{s:8,h:100,sp:35,sc:500,jt:45},'Kaligrafi':{s:30,h:100,sp:3,rd:22,an:-40,ps:1},'Cap cakar':{tp:'paw',s:70,h:100,sp:130,aj:40,jt:10},'Cap bintang':{tp:'star',s:56,h:100,sp:120,aj:180,sc:40,jt:20},'Cap hati':{tp:'heart',s:56,h:100,sp:120,aj:30,jt:15},'Penghapus':{er:1,s:40,h:60}};
const BP={...BASE,...PRS.Pensil,n:'Pensil',cu:null};
const TCH={};
function baseTip(){const B=BP,key=B.tp+B.h+(B.cu?B.cu.id:'');if(TCH[key])return TCH[key];const c=mk(96,96),q=c.getContext('2d'),m=48;
 if(B.tp=='custom'&&B.cu)q.drawImage(B.cu,0,0);
 else if(B.tp=='paw'){q.translate(m,m);q.scale(3.6,3.6);q.translate(-12,-12);[[5,11,2.2],[9.2,6,2.4],[14.8,6,2.4],[19,11,2.2]].forEach(a=>{q.beginPath();q.arc(a[0],a[1],a[2],0,7);q.fill()});q.fill(new Path2D('M12 11.5c-3 0-6 3.6-6 6.2 0 1.6 1.5 2.5 3 2.1 1-.3 2-.5 3-.5s2 .2 3 .5c1.5.4 3-.5 3-2.1 0-2.6-3-6.2-6-6.2z'))}
 else if(B.tp=='star'||B.tp=='heart'){q.translate(m,m);q.fill(path(B.tp,86,86))}
 else{const g=q.createRadialGradient(m,m,m*B.h/100*.98,m,m,m);g.addColorStop(0,'#000');g.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=g;q.fillRect(0,0,96,96);
  if(B.tp=='chalk'){q.globalCompositeOperation='destination-out';for(let i=0;i<260;i++){q.globalAlpha=Math.random()*.9;q.beginPath();q.arc(Math.random()*96,Math.random()*96,Math.random()*3+.5,0,7);q.fill()}}}
 return TCH[key]=c}
function tipC(col){const b=baseTip(),k=col+'|'+(b.__k||(b.__k=Math.random()));if(tipC.k===k)return tipC.c;const c=mk(96,96),q=c.getContext('2d');q.drawImage(b,0,0);q.globalCompositeOperation='source-in';q.fillStyle=col;q.fillRect(0,0,96,96);tipC.k=k;tipC.c=c;return c}
function mkTip(src){const c=mk(96,96),q=c.getContext('2d'),opq=src.getContext('2d').getImageData(0,0,1,1).data[3]>=250,k=Math.min(96/src.width,96/src.height),w=src.width*k,h=src.height*k;
 q.drawImage(src,(96-w)/2,(96-h)/2,w,h);const id=q.getImageData(0,0,96,96),d=id.data;
 for(let i=0;i<d.length;i+=4){const lm=(.2126*d[i]+.7152*d[i+1]+.0722*d[i+2])/255;if(opq&&d[i+3])d[i+3]=(1-lm)*255;d[i]=d[i+1]=d[i+2]=0}q.putImageData(id,0,0);c.id=Math.random();return c}
function dab(d,x,y,pr){const B=BP,s=Math.max(1,B.s*d.u*(1+(Math.random()*2-1)*B.jt/100)*(B.ps?.25+.75*pr:1)),fl=B.f/100*(B.pa?.2+.8*pr:1),W=d.cw,H=d.ch,
 jx=B.sc?(Math.random()*2-1)*B.sc/100*s:0,jy=B.sc?(Math.random()*2-1)*B.sc/100*s:0,X=x+jx,Y=y+jy,P2=[[X,Y,0]];
 if(B.sy==1||B.sy==3)P2.push([W-X,Y,0]);if(B.sy==2||B.sy==3)P2.push([X,H-Y,0]);if(B.sy==3)P2.push([W-X,H-Y,0]);
 if(B.sy==4)for(let i=1;i<6;i++){const a=i*Math.PI/3,dx=X-W/2,dy=Y-H/2;P2.push([W/2+dx*Math.cos(a)-dy*Math.sin(a),H/2+dx*Math.sin(a)+dy*Math.cos(a),a])}
 const q=d.q,a=(B.an+(Math.random()*2-1)*B.aj)*Math.PI/180;
 P2.forEach(([px,py,r])=>{q.save();q.globalAlpha=Math.min(1,fl*(B.tp=='chalk'?.6+.4*Math.random():1));q.translate(px,py);q.rotate(a+r);q.scale(1,B.rd/100);q.drawImage(d.tip,-s/2,-s/2,s,s);q.restore()})}
function seg(d,c,pr,fn,step){if(!d.last){fn(d,c.x,c.y,pr);d.last=c;d.lpr=pr;d.acc=0;return}
 const dx=c.x-d.last.x,dy=c.y-d.last.y,n=Math.hypot(dx,dy);let t=step-d.acc;while(t<=n){const u=t/n;fn(d,d.last.x+dx*u,d.last.y+dy*u,d.lpr+(pr-d.lpr)*u);t+=step}d.acc=n-(t-step);d.last=c;d.lpr=pr}
const toC=(d,p)=>{const q=lc(d.l,p);return{x:(q.x+d.l.w/2)*d.u,y:(q.y+d.l.h/2)*d.u}};
const prs=e=>e.pointerType=='mouse'?1:(e.pressure||.5);
function newPaint(){const c=mk(D.w,D.h);L.push({t:'img',pt:1,cv:c,orig:c,x:D.w/2,y:D.h/2,w:D.w,h:D.h,f:{...DF},m:null,op:1,r:0});sel=L.length-1;return sl()}
function paintUI(){const B=BP;P.innerHTML=`<h3>Kuas lukis</h3><div class="hs">${Object.keys(PRS).map(k=>bt('zbp',k,'',B.n==k,k)).join('')}</div><div class="row">${co('Warna','bk:c',bk.c)}</div>`
 +sr('Ukuran','bp:s',1,300,B.s)+sr('Opasitas goresan %','bp:o',5,100,B.o)+sr('Aliran %','bp:f',1,100,B.f)+sr('Kekerasan','bp:h',0,100,B.h)+sr('Jarak cap %','bp:sp',1,300,B.sp)+sr('Stabilizer garis','bp:sm',0,90,B.sm)
 +`<label class="cl">Mode campur<select data-s="bp:bm">${BM.map(([v,n])=>`<option value="${v}"${B.bm==v?' selected':''}>${n}</option>`).join('')}</select></label><h3>Dinamika</h3>`
 +ck('Tekanan pena mengatur ukuran','bp:ps',B.ps)+ck('Tekanan pena mengatur aliran','bp:pa',B.pa)+sr('Variasi ukuran %','bp:jt',0,100,B.jt)+sr('Sebar %','bp:sc',0,800,B.sc,5)+sr('Sudut cap','bp:an',-180,180,B.an)+sr('Variasi sudut','bp:aj',0,180,B.aj)+sr('Kebulatan %','bp:rd',5,100,B.rd)
 +`<h3>Simetri</h3>`+sg([[0,'Mati'],[1,'Vertikal'],[2,'Horizontal'],[3,'Kuadran'],[4,'Radial 6']],B.sy,'zbp_sy')
 +`<h3>Kuas kustom</h3><div class="row">${bt('zbp_cu','Dari lapisan terpilih','copy')}${bt('zbp_im','Impor gambar','image')}</div>`+hint('Bentuk lapisan atau gambar dipakai sebagai cap; warnanya mengikuti warna kuas.')+`<div class="row">${bt('newp','Lapisan lukis baru','plus')}</div>`}

/* ---------- retus ---------- */
const RT={m:'clone',s:60,st:60,pick:1,sp:null,off:null};
const RM=[['clone','Klon'],['heal','Penyembuh'],['spot','Noda'],['dodge','Terang'],['burn','Gelap'],['sponge','Pudarkan warna'],['blur','Blur'],['sharp','Tajam']];
function retUI(){const cl2=['clone','heal'].includes(RT.m);P.innerHTML=`<h3>Retus</h3><div class="hs">${RM.map(([k,n])=>bt('zrt',n,'',RT.m==k,k)).join('')}</div>`+sr('Ukuran','rt:s',5,300,RT.s)+sr('Kekuatan %','rt:st',5,100,RT.st)
 +(cl2?`<div class="row">${bt('zrt_src','Pilih sumber','',RT.pick)}</div>`+hint(RT.sp&&!RT.pick?'Sumber sudah dipilih. Seret pada area yang ingin diperbaiki.':'Ketuk titik sumber (atau Alt+klik), lalu seret pada area yang ingin diperbaiki.'):RT.m=='spot'?hint('Usap pada noda atau jerawat; area diisi dari warna sekitarnya.'):'')+hint('Bekerja pada lapisan foto atau lukisan yang dipilih.')}
function rdab(d,x,y){const r=Math.max(2,RT.s/2*d.u)|0,x0=Math.max(0,x-r|0),y0=Math.max(0,y-r|0),w=Math.min(d.cw-x0,2*r+1),h=Math.min(d.ch-y0,2*r+1);if(w<1||h<1)return;
 const q=d.q,id=q.getImageData(x0,y0,w,h),p=id.data,o=new Uint8ClampedArray(p),m=RT.m,cp=m=='clone'||m=='heal',sd=cp?d.src.getImageData(x0+d.ox,y0+d.oy,w,h).data:null;let dl=[0,0,0],rc=[0,0,0];
 if(m=='heal'){let n=0,a=[0,0,0],b=[0,0,0];for(let j=0;j<w*h;j+=3){const i=j*4;if(sd[i+3]<9)continue;n++;for(let z=0;z<3;z++){a[z]+=sd[i+z];b[z]+=p[i+z]}}if(n)dl=a.map((v,z)=>(b[z]-v)/n)}
 if(m=='spot'){let n=0;for(let t=0;t<24;t++){const a=t/24*6.283,X=Math.round(x+Math.cos(a)*r*1.35),Y=Math.round(y+Math.sin(a)*r*1.35);if(X<0||Y<0||X>=d.cw||Y>=d.ch)continue;const v=q.getImageData(X,Y,1,1).data;for(let z=0;z<3;z++)rc[z]+=v[z];n++}if(!n)return;rc=rc.map(v=>v/n)}
 for(let j=0;j<w*h;j++){const px=j%w+x0-x,py=(j/w|0)+y0-y,dd=Math.hypot(px,py);if(dd>r)continue;const a=Math.pow(1-dd/r,.6)*RT.st/100,i=j*4;
  if(cp){if(sd[i+3]<9)continue;for(let z=0;z<3;z++)p[i+z]+=(sd[i+z]+dl[z]-p[i+z])*a;p[i+3]=Math.max(p[i+3],sd[i+3]*a)}
  else if(m=='spot')for(let z=0;z<3;z++)p[i+z]+=(rc[z]-p[i+z])*a;
  else if(m=='dodge'||m=='burn'){const f=1+(m=='dodge'?.35:-.35)*a;for(let z=0;z<3;z++)p[i+z]*=f}
  else if(m=='sponge'){const g=(p[i]+p[i+1]+p[i+2])/3;for(let z=0;z<3;z++)p[i+z]=g+(p[i+z]-g)*(1-.4*a)}
  else{const s=[0,0,0];let n=0;for(const[ox,oy]of[[1,0],[-1,0],[0,1],[0,-1]]){const X=j%w+ox,Y=(j/w|0)+oy;if(X<0||Y<0||X>=w||Y>=h)continue;const k=(Y*w+X)*4;s[0]+=o[k];s[1]+=o[k+1];s[2]+=o[k+2];n++}
   if(n)for(let z=0;z<3;z++){const v=s[z]/n;p[i+z]+=m=='blur'?(v-p[i+z])*a:(p[i+z]-v)*a*1.2}}}
 q.putImageData(id,x0,y0)}

/* ---------- pointer ---------- */
const pd=cv.onpointerdown,pm=cv.onpointermove,pu=cv.onpointerup;
cv.onpointerdown=e=>{
 if(tool=='crop'){cv.setPointerCapture(e.pointerId);const p=pt(e);dr={k:'cr',p0:p};CR.r={x:p.x,y:p.y,w:0,h:0};return}
 if(tool=='paint'){let l=sl();snap();if(!(l&&l.t=='img'))l=newPaint();cv.setPointerCapture(e.pointerId);
  const er=BP.er,u=l.cv.width/l.w;l.cv=cl(l.cv);if(!er){SC.width=l.cv.width;SC.height=l.cv.height}bk.o=BP.o/100;
  const d=dr={k:'bd',pnt:1,l,u,er,cw:l.cv.width,ch:l.cv.height,tip:tipC(er?'#000000':bk.c),q:(er?l.cv:SC).getContext('2d')};if(er)d.q.globalCompositeOperation='destination-out';
  const p=pt(e);d.sp=p;seg(d,toC(d,p),prs(e),dab,Math.max(1,BP.s*u*BP.sp/100));draw();return}
 if(tool=='retch'){const l=sl();if(!l||l.t!='img'){toast('Pilih lapisan foto atau lukisan');return}cv.setPointerCapture(e.pointerId);const cp=RT.m=='clone'||RT.m=='heal',u=l.cv.width/l.w,p=pt(e),c={x:(lc(l,p).x+l.w/2)*u,y:(lc(l,p).y+l.h/2)*u};
  if(cp&&(RT.pick||e.altKey)){RT.sp=c;RT.pick=0;RT.off=null;toast('Sumber diatur');ui();return}
  if(cp&&!RT.sp){RT.pick=1;toast('Pilih sumber dulu');ui();return}
  snap();l.cv=cl(l.cv);if(cp&&!RT.off)RT.off=[RT.sp.x-c.x,RT.sp.y-c.y];
  const d=dr={k:'rt',l,u,cw:l.cv.width,ch:l.cv.height,q:l.cv.getContext('2d'),src:cp?cl(l.cv).getContext('2d'):null,ox:cp?Math.round(RT.off[0]):0,oy:cp?Math.round(RT.off[1]):0};
  seg(d,c,1,rdab,Math.max(1,RT.s*u*.18));delete l._a;delete l._s;delete l._g;draw();return}
 pd(e)};
cv.onpointermove=e=>{
 if(dr&&dr.k=='cr'){const p=pt(e);let w=p.x-dr.p0.x,h=p.y-dr.p0.y;if(CR.a){const r=CR.a[0]/CR.a[1];if(Math.abs(w)/r>Math.abs(h))h=Math.sign(h||1)*Math.abs(w)/r;else w=Math.sign(w||1)*Math.abs(h)*r}
  CR.r={x:Math.min(dr.p0.x,dr.p0.x+w),y:Math.min(dr.p0.y,dr.p0.y+h),w:Math.abs(w),h:Math.abs(h)};draw();return}
 if(dr&&dr.pnt){const ev=e.getCoalescedEvents?e.getCoalescedEvents():[];(ev.length?ev:[e]).forEach(E=>{const p=pt(E),s=1-BP.sm/100*.92;dr.sp={x:dr.sp.x+(p.x-dr.sp.x)*s,y:dr.sp.y+(p.y-dr.sp.y)*s};seg(dr,toC(dr,dr.sp),prs(E),dab,Math.max(1,BP.s*dr.u*BP.sp/100))});draw();return}
 if(dr&&dr.k=='rt'){(e.getCoalescedEvents&&e.getCoalescedEvents().length?e.getCoalescedEvents():[e]).forEach(E=>{const p=pt(E),q=lc(dr.l,p);seg(dr,{x:(q.x+dr.l.w/2)*dr.u,y:(q.y+dr.l.h/2)*dr.u},1,rdab,Math.max(1,RT.s*dr.u*.18))});delete dr.l._a;delete dr.l._s;delete dr.l._g;draw();return}
 pm(e)};
cv.onpointerup=cv.onpointercancel=e=>{const d=dr;
 if(d&&d.k=='cr'){dr=null;if(CR.r&&CR.r.w<3)CR.r=null;draw();ui();return}
 if(d&&d.pnt){dr=null;const q=d.l.cv.getContext('2d');if(d.er)q.globalCompositeOperation='source-over';else{q.save();q.globalAlpha=BP.o/100;q.globalCompositeOperation=BP.bm;q.drawImage(SC,0,0);q.restore()}delete d.l._a;delete d.l._s;delete d.l._g;draw();ui();return}
 if(d&&d.k=='rt'){dr=null;draw();return}
 pu(e)};

/* ---------- aksi ---------- */
Object.assign(XA,{
 tal:v=>{const l=sl();if(l)l.al=v},tg0:()=>{const l=sl();if(l)delete l.g2},
 tfl:v=>{const l=sl(),k=v=='h'?'fh':'fv';if(l)l[k]=!l[k]},
 tsty:v=>{const l=sl();if(!l)return;const d3={m:1,dp:30,da:45,dc:'#4338ca',sh:35,ry:0,rx:0,pf:50,rf:0,lg:0};
  ({Neon:()=>l.e={...E0,sb:40,sc:l.c},Stiker:()=>l.e={...E0,ow:12,oc:'#ffffff',sb:14,so:6},Garis:()=>{l.hol=1;l.e={...E0,ow:3,oc:l.c}},'Retro 3D':()=>l.d3=d3,'B. panjang':()=>l.d3={...d3,dp:90,lg:1,dc:'#000000'},Gradasi:()=>l.g2='#ec4899',Reset:()=>{l.e={...E0};delete l.d3;delete l.g2;delete l.hol}})[v]()},
 zcr_t:v=>{CR.t=v;CR.r=null},zcr_a:v=>{CR.a=v=='0'?null:v.split(',').map(Number)},zcr_x:()=>{CR.r=null},
 zcr_all:()=>{const l=sl();CR.r=CR.t=='photo'&&l?{x:l.x-l.w/2,y:l.y-l.h/2,w:l.w,h:l.h}:{x:0,y:0,w:D.w,h:D.h}},cr_ok:cropGo,
 cg_p:v=>{const l=sl();if(l)l.cg={...GP[v]}},cg_r:()=>{const l=sl();if(l){delete l.cg;delete l._g}},
 cg_al:()=>{const l=sl();if(!l||l.t!='img')return;const d=sm(l),h=new Uint32Array(256);let n=0,s=0,b=0,w=255;for(let i=0;i<d.length;i+=4)if(d[i+3]>20){h[(.2126*d[i]+.7152*d[i+1]+.0722*d[i+2])|0]++;n++}
  for(let i=0;i<256;i++){s+=h[i];if(s>n*.005){b=i;break}}s=0;for(let i=255;i>=0;i--){s+=h[i];if(s>n*.005){w=i;break}}l.cg={...(l.cg||{}),lb:Math.min(100,b),lw:Math.max(155,w)}},
 cg_wb:()=>{const l=sl();if(!l||l.t!='img')return;const d=sm(l);let r=0,g=0,b=0,n=0;for(let i=0;i<d.length;i+=4)if(d[i+3]>20){r+=d[i];g+=d[i+1];b+=d[i+2];n++}if(!n)return;const m=(r+g+b)/3/1;l.cg={...(l.cg||{}),wr:+(m/r).toFixed(3),wg:+(m/g).toFixed(3),wb:+(m/b).toFixed(3)}},
 zg_ch:v=>{GC.ch=v},zg_rg:v=>{GC.rg=+v},zg_bd:v=>{GC.bd=+v},
 zbp:v=>{Object.assign(BP,BASE,PRS[v],{n:v})},zbp_sy:v=>{BP.sy=+v},zbp_im:()=>pick('tip'),
 zbp_cu:()=>{const l=sl();if(!l){toast('Pilih lapisan dulu');return}let src;
  if(l.t=='img')src=l.cv;else{const t=mk(D.w,D.h),sv=[L,D.bg,sel];L=[l];D.bg={t:'none'};sel=-1;try{render(t.getContext('2d'),false)}finally{L=sv[0];D.bg=sv[1];sel=sv[2]}
   const{hx:a,hy:b}=ext(l);src=mk(2*a,2*b);src.getContext('2d').drawImage(t,l.x-a,l.y-b,2*a,2*b,0,0,2*a,2*b)}
  BP.cu=mkTip(src);BP.tp='custom';BP.n='Kustom'},
 zrt:v=>{RT.m=v;if(v=='clone'||v=='heal')RT.pick=!RT.sp},zrt_src:()=>{RT.pick=1}});
const fo2=$('#fi').onchange;$('#fi').onchange=e=>{if(fm!='tip')return fo2(e);const f=e.target.files[0];e.target.value='';if(!f)return;
 li(URL.createObjectURL(f)).then(i=>{const c=mk(i.width,i.height);c.getContext('2d').drawImage(i,0,0);BP.cu=mkTip(c);BP.tp='custom';BP.n='Kustom';ui()}).catch(()=>toast('Gagal membaca gambar'))};

/* ---------- input panel ---------- */
P.addEventListener('pointerdown',e=>{const s=e.target.dataset&&e.target.dataset.s;if(s&&!/^(bp|rt|bk)/.test(s))snap()});
P.addEventListener('input',e=>{const t=e.target,s=t.dataset.s;if(!s)return;const[n,k]=s.split(':'),l=sl(),v=t.type=='checkbox'?+t.checked:t.type=='range'?+t.value:t.value;
 if(t.type=='range'){const b=t.parentNode.querySelector('b');if(b)b.textContent=Math.round(v*100)/100}
 if(n=='bp'){BP[k]=v;if(k=='o')bk.o=v/100}else if(n=='bk')bk[k]=v;else if(n=='rt')RT[k]=v;
 else if(n=='cg'&&l)l.cg={...(l.cg||{}),[k]:v};else if(n=='t'&&l)l[k]=v;
 draw()});

/* ---------- panel: sambungan ke ui() ---------- */
const ui9=ui;ui=function(){ui9();const l=sl();
 if(tool=='crop'||tool=='paint'||tool=='retch')cv.style.cursor='crosshair';
 if(tool=='crop')cropUI();else if(tool=='paint')paintUI();else if(tool=='retch')retUI();else if(tool=='grade')gradeUI(l);
 else if(tool=='text'&&l&&l.t=='text')P.insertAdjacentHTML('beforeend',`<h3>Tipografi</h3>`+sg([['l','Kiri'],['c','Tengah'],['r','Kanan']],l.al||'c','tal')+`<div class="row">${ck('Garis bawah','t:ul',l.ul)}${ck('Coret','t:sk',l.sk)}${ck('HURUF BESAR','t:up',l.up)}${ck('Hanya garis','t:hol',l.hol)}</div>`
  +sr('Tinggi baris','t:lh',.6,3,l.lh||1.25,.05)+sr('Lengkung teks','t:cu',-100,100,l.cu||0)+co('Gradasi ke','t:g2',l.g2||l.c)+`<div class="row">${bt('tg0','Hapus gradasi')}${bt('tfl','Balik ↔','',l.fh,'h')}${bt('tfl','Balik ↕','',l.fv,'v')}</div><h3>Gaya teks</h3><div class="chips">${['Neon','Stiker','Garis','Retro 3D','B. panjang','Gradasi','Reset'].map(k=>bt('tsty',k,'',0,k)).join('')}</div>`);
 else if(tool=='shp'&&l&&l.t=='shape')P.insertAdjacentHTML('beforeend',co('Gradasi ke','t:g2',l.g2||l.c)+sr('Sudut gradasi','t:ga',-180,180,l.ga??45)+`<div class="row">${bt('tg0','Hapus gradasi')}</div>`)};
TOOLS.splice(2,0,['crop','Potong','cut'],['grade','Warna','contrast'],['retch','Retus','spark'],['paint','Lukis','pen']);
$('#rail').innerHTML=TOOLS.map(([id,n,i])=>`<button data-a="tool" data-v="${id}">${IC(i)}${n}</button>`).join('');


try{FEAT.push(['Tipografi lanjutan','Rata teks, teks melengkung, garis bawah, gradasi, gaya'],['Grading warna','Level, kurva RGB, HSL, split toning, preset'],['Retus & kuas','Klon, penyembuh, kuas tekanan pena, simetri, kuas kustom']);
 GUIDE.push(['Potong, retus, kuas, grading','Tab <b>Potong</b>: seret area lalu Terapkan (kanvas atau foto). Tab <b>Retus</b>: klon dan penyembuh (ketuk sumber dulu), noda, terang/gelap. Tab <b>Lukis</b>: pilih kuas, atur tekanan pena, stabilizer, simetri, atau buat kuas dari lapisan. Tab <b>Warna</b>: level, kurva, HSL, split toning. Tab <b>Teks</b>: rata, lengkung, gradasi, gaya.'])}catch(e){}
ui();draw();
})();
