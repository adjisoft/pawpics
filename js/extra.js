/* extra.js — Tambahan PawPics, dimuat setelah app.js:
   30 font Google, tab "Pro" (penyesuaian ala Polarr: eksposur, sorotan, bayangan, suhu, tint, vibrance, ketajaman, pudar),
   mode campur (blend) & balik, ember cat + pipet warna, 7 bentuk baru, 12 templat baru + ukuran kanvas kustom,
   zoom (tombol & cubit 2 jari di ponsel). */
const FL=[['Poppins','sans-serif'],['Montserrat','sans-serif'],['Raleway','sans-serif'],['Oswald','sans-serif'],['Bebas Neue','sans-serif'],['Anton','sans-serif'],['Archivo Black','sans-serif'],['Space Grotesk','sans-serif'],['Fredoka','sans-serif'],['Comfortaa','sans-serif'],['Righteous','sans-serif'],['Orbitron','sans-serif'],['Bangers','cursive'],['Playfair Display','serif'],['Merriweather','serif'],['Roboto Slab','serif'],['Abril Fatface','serif'],['Cinzel','serif'],['Lobster','cursive'],['Pacifico','cursive'],['Dancing Script','cursive'],['Great Vibes','cursive'],['Satisfy','cursive'],['Caveat','cursive'],['Permanent Marker','cursive'],['Shadows Into Light','cursive'],['Special Elite','monospace'],['Press Start 2P','monospace']],FK={};
FL.forEach(([n,g])=>{FK[n]=`'${n}',${g}`;FONTS[FK[n]]=n});
const loadF=()=>Promise.all(L.filter(l=>l.t=='text').map(l=>document.fonts.load(`${l.b?700:400} 40px ${l.ff}`))).then(draw).catch(()=>{});
P.addEventListener('change',e=>{if(e.target.dataset.k=='ff')loadF()});

/* bentuk baru */
Object.assign(PP,{diamond:(a,b)=>[[0,-b],[a,0],[0,b],[-a,0]],
 pent:(a,b)=>[...Array(5)].map((_,i)=>{const t=Math.PI*2*i/5-Math.PI/2;return[Math.cos(t)*a,Math.sin(t)*b]}),
 oct:(a,b)=>[...Array(8)].map((_,i)=>{const t=Math.PI*2*i/8+Math.PI/8;return[Math.cos(t)*a,Math.sin(t)*b]}),
 arrow:(a,b)=>[[-a,-b*.35],[a*.2,-b*.35],[a*.2,-b],[a,0],[a*.2,b],[a*.2,b*.35],[-a,b*.35]],
 plus:(a,b)=>{const x=a*.33,y=b*.33;return[[-x,-b],[x,-b],[x,-y],[a,-y],[a,y],[x,y],[x,b],[-x,b],[-x,y],[-a,y],[-a,-y],[-x,-y]]},
 bolt:(a,b)=>[[a*.2,-b],[-a*.6,b*.1],[-a*.05,b*.1],[-a*.2,b],[a*.6,-b*.15],[a*.05,-b*.15]],
 trap:(a,b)=>[[-a*.6,-b],[a*.6,-b],[a,b],[-a,b]]});
Object.keys(PP).forEach(k=>PG[k]=(p,a,b)=>{PP[k](a,b).forEach(q=>p.lineTo(q[0],q[1]));p.closePath()});
Object.assign(SH,{diamond:'Berlian',pent:'Segi lima',oct:'Segi delapan',arrow:'Panah',plus:'Plus',bolt:'Petir',trap:'Trapesium'});

/* penyesuaian Pro (piksel) */
function adv(l){const a=l.pa;if(!a||!Object.values(a).some(v=>v))return l.cv;
 const k=JSON.stringify(a);if(l._a&&l._a.cv===l.cv&&l._a.k===k)return l._a.o;
 const c=cl(l.cv),q=c.getContext('2d'),W=c.width,H=c.height,id=q.getImageData(0,0,W,H),d=id.data,
 ex=Math.pow(2,(a.ex||0)/100),te=(a.te||0)*.4,ti=(a.ti||0)*.3,sh=(a.sh||0)*.7,hl=(a.hl||0)*.7,vb=(a.vb||0)/100,fd=(a.fd||0)/100,sp=(a.sp||0)/100;
 for(let i=0;i<d.length;i+=4){let r=d[i]*ex+te,g=d[i+1]*ex-ti,b=d[i+2]*ex-te;
  const y=(.2126*r+.7152*g+.0722*b)/255,m=sh*(1-y)*(1-y)+hl*y*y;r+=m;g+=m;b+=m;
  if(vb){const mx=Math.max(r,g,b),mn=Math.min(r,g,b),f=vb*(1-(mx-mn)/255),u=(r+g+b)/3;r+=(r-u)*f;g+=(g-u)*f;b+=(b-u)*f}
  if(fd){r=r*(1-fd*.25)+fd*45;g=g*(1-fd*.25)+fd*45;b=b*(1-fd*.25)+fd*45}
  d[i]=r;d[i+1]=g;d[i+2]=b}
 if(sp){const s=new Uint8ClampedArray(d),R=W*4;for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){const o=(y*W+x)*4;for(let z=0;z<3;z++)d[o+z]=s[o+z]+sp*(4*s[o+z]-s[o+z-4]-s[o+z+4]-s[o+z-R]-s[o+z+R])}}
 q.putImageData(id,0,0);l._a={cv:l.cv,k,o:c};return c}
P.addEventListener('pointerdown',e=>{if(e.target.dataset.p&&sl())snap()});
P.addEventListener('input',e=>{const p=e.target.dataset.p,l=sl();if(!p||!l)return;(l.pa||(l.pa={}))[p]=+e.target.value;
 const b=e.target.parentNode.querySelector('b');if(b)b.textContent=e.target.value;draw()});

/* ember cat & pipet */
function eyed(p){if(p.x<0||p.y<0||p.x>=D.w||p.y>=D.h)return;const c=document.createElement('canvas');c.width=D.w;c.height=D.h;const q=c.getContext('2d');render(q,false,true);
 const d=q.getImageData(Math.floor(p.x),Math.floor(p.y),1,1).data;bk.c=bk.sc=bk.fc='#'+[d[0],d[1],d[2]].map(v=>v.toString(16).padStart(2,'0')).join('');mode='brush';ui();toast('Warna diambil')}
function bucket(p){const l=sl();if(!l||l.t!='img'){toast('Pilih lapisan lukisan atau foto');return}
 const q=lc(l,p),W=l.cv.width,H=l.cv.height,k=W/l.w,x0=Math.floor((q.x+l.w/2)*k),y0=Math.floor((q.y+l.h/2)*k);if(x0<0||y0<0||x0>=W||y0>=H)return;
 snap();l.cv=cl(l.cv);const cx=l.cv.getContext('2d'),id=cx.getImageData(0,0,W,H),d=id.data,i0=(y0*W+x0)*4,t=[d[i0],d[i0+1],d[i0+2],d[i0+3]],
 fc=[1,3,5].map(i=>parseInt(bk.c.substr(i,2),16)),tl=tol*5,seen=new Uint8Array(W*H),st=[y0*W+x0];
 while(st.length){const j=st.pop();if(seen[j])continue;const i=j*4;if(Math.abs(d[i]-t[0])+Math.abs(d[i+1]-t[1])+Math.abs(d[i+2]-t[2])+Math.abs(d[i+3]-t[3])>tl)continue;
  seen[j]=1;d[i]=fc[0];d[i+1]=fc[1];d[i+2]=fc[2];d[i+3]=255;const x=j%W;if(x>0)st.push(j-1);if(x<W-1)st.push(j+1);if(j>=W)st.push(j-W);if(j<W*H-W)st.push(j+W)}
 cx.putImageData(id,0,0);draw()}
const pd0=cv.onpointerdown;cv.onpointerdown=e=>{if(tool=='draw'&&(mode=='bucket'||mode=='eyed')){const p=pt(e);mode=='eyed'?eyed(p):bucket(p);return}pd0(e)};

/* templat baru */
const T=(t,x,y,s,c,b,ff)=>L.push({t:'text',txt:t,x,y,s,c,b,ff:ff||'system-ui',op:1,r:0,w:10,h:10}),
S=(k,x,y,w,h,c,op,r)=>L.push({t:'shape',k,x,y,w,h,c,op:op??1,r:r||0}),
B=(c,c2)=>{D.bg=c2?{t:'grad',c,c2}:{t:'color',c}},G=(c,b)=>{L[L.length-1].e={...E0,sb:b||40,sc:c}};
const TPX=[];
function tplx(k){const t=TPX.find(q=>q[0]==k);snap();L=[];sel=-1;D.t=1;D.w=t[2];D.h=t[3];t[4]();fit();ui();draw();loadF()}

/* aksi tambahan */
const XA={r90:()=>{const l=sl();if(l)l.r+=Math.PI/2},
 enh:()=>{const l=sl();if(l&&l.t=='img')l.pa={ex:8,hl:-25,sh:30,vb:25,sp:25}},
 prr:()=>{const l=sl();if(l)delete l.pa},
 newp:()=>{const c=document.createElement('canvas');c.width=D.w;c.height=D.h;L.push({t:'img',pt:1,cv:c,orig:c,x:D.w/2,y:D.h/2,w:D.w,h:D.h,f:{...DF},m:null,op:1,r:0});sel=L.length-1;tool='draw';mode='brush'},
 zin:()=>{zm=Math.min(8,zm*1.25);fit()},zout:()=>{zm=Math.max(.25,zm/1.25);fit()},zfit:()=>{zm=1;fit()},
 csz:()=>{const w=+$('#cw').value,h=+$('#ch2').value;if(w>=50&&h>=50&&w<=4000&&h<=4000){D.w=w;D.h=h;D.t=1;fit()}else toast('Ukuran 50–4000 px')},
 mkt:v=>tplx(v)};
const act0=act;act=(a,v)=>{if(!XA[a])return act0(a,v);if(!/^z|^mkt/.test(a))snap();XA[a](v);ui();draw()};

/* panel tambahan */
const BM=[['source-over','Normal'],['multiply','Multiply'],['screen','Screen'],['overlay','Overlay'],['soft-light','Soft light'],['hard-light','Hard light'],['darken','Darken'],['lighten','Lighten'],['color-dodge','Color dodge'],['difference','Difference'],['hue','Hue'],['color','Color'],['luminosity','Luminosity']];
const pr=(l,k,n,a,b)=>{const v=(l.pa&&l.pa[k])||0;return`<label class="rw"><span>${n}<b>${v}</b></span><input type="range" data-p="${k}" min="${a}" max="${b}" step="1" value="${v}"></label>`};
const ui0=ui;ui=function(){ui0();const l=sl(),I=l&&l.t=='img';let h='';
 if(tool=='pro'){if(!I){P.innerHTML='<h3>Pro</h3>'+hint('Pilih sebuah foto untuk penyesuaian ala Polarr.');return}
  P.innerHTML=`<h3>Pro · Cahaya</h3>${pr(l,'ex','Eksposur',-100,100)}${pr(l,'hl','Sorotan',-100,100)}${pr(l,'sh','Bayangan',-100,100)}<h3>Warna</h3>${pr(l,'te','Suhu',-100,100)}${pr(l,'ti','Tint',-100,100)}${pr(l,'vb','Vibrance',-100,100)}<h3>Detail</h3>${pr(l,'sp','Ketajaman',0,100)}${pr(l,'fd','Pudar',0,100)}<div class="row">${bt('enh','Perbaiki otomatis','spark')}${bt('prr','Reset','undo')}</div>`;return}
 if(tool=='layers'&&l)h=`<h3>Campur &amp; balik</h3><select data-k="bm">${BM.map(([v,n])=>`<option value="${v}"${(l.bm||'source-over')==v?' selected':''}>${n}</option>`).join('')}</select><label class="ck"><input type="checkbox" data-k="fh" ${l.fh?'checked':''}>Balik horizontal</label><label class="ck"><input type="checkbox" data-k="fv" ${l.fv?'checked':''}>Balik vertikal</label><div class="row">${bt('r90','Putar 90°','undo')}</div>`;
 if(tool=='text'&&l&&l.t=='text')h=`<label class="ck"><input type="checkbox" data-k="it" ${l.it?'checked':''}>Miring</label>${rg('Jarak huruf','ls',-5,60,l.ls||0)}`;
 if(tool=='draw'){h=`<h3>Raster lanjutan</h3><div class="chips">${bt('mode','Ember cat','',mode=='bucket','bucket')}${bt('mode','Pipet warna','',mode=='eyed','eyed')}${bt('newp','Lapisan lukis baru','plus')}</div>`;
  if(mode=='bucket')h+=`<div class="row"><label class="cl">Warna isi<input type="color" data-k="bk.c" value="${bk.c}"></label></div>${rg('Toleransi','tol',1,100,tol)}`+hint('Ketuk area pada lapisan lukisan atau foto untuk mengisinya.');
  if(mode=='eyed')h+=hint('Ketuk kanvas untuk mengambil warna.')}
 if(tool=='tpl')h=`<h3>Ukuran lain</h3><div class="chips">${bt('size','YouTube','',0,'1280,720')}${bt('size','Facebook','',0,'1200,630')}${bt('size','Kartu nama','',0,'1050,600')}${bt('size','Potret 4:5','',0,'1080,1350')}</div><div class="row"><label class="cl">Lebar<input id="cw" type="number" value="${D.w}"></label><label class="cl">Tinggi<input id="ch2" type="number" value="${D.h}"></label></div><div class="row">${bt('csz','Terapkan ukuran')}</div><h3>Templat desain</h3><div class="chips">${TPX.map(t=>bt('mkt',t[1],'',0,t[0])).join('')}</div>`;
 if(h)P.insertAdjacentHTML('beforeend',h)};
TOOLS.splice(3,0,['pro','Pro','sun']);
$('#rail').innerHTML=TOOLS.map(([id,n,i])=>`<button data-a="tool" data-v="${id}">${IC(i)}${n}</button>`).join('');

ui();loadF();
