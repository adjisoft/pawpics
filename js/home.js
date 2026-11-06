/* home.js — Layar sambutan PawPics (Mulai / Galeri / Panduan), popup "Proyek baru", logo SVG,
   dan penyimpanan proyek di IndexedDB (autosave + galeri). Dimuat paling akhir setelah zoom.js. */
let PJ=null,dirty=0,OPENP=0,lid=0,NPS={w:1080,h:1350,bg:{t:'color',c:'#ffffff'}};
const snap0=snap;snap=function(){snap0();dirty=1};
const PAW='<circle cx="5" cy="11" r="2.2"/><circle cx="9.2" cy="6" r="2.4"/><circle cx="14.8" cy="6" r="2.4"/><circle cx="19" cy="11" r="2.2"/><path d="M12 11.5c-3 0-6 3.6-6 6.2 0 1.6 1.5 2.5 3 2.1 1-.3 2-.5 3-.5s2 .2 3 .5c1.5.4 3-.5 3-2.1 0-2.6-3-6.2-6-6.2z"/>';
const LG=n=>{const g='lg'+(++lid);return`<svg width="${n}" height="${n}" viewBox="0 0 128 128" role="img" aria-label="PawPics"><defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#ec4899"/></linearGradient></defs><rect width="128" height="128" rx="30" fill="url(#${g})"/><g transform="translate(64 64) scale(4.6) translate(-12 -12)" fill="#fff">${PAW}<path d="M8.6 18.8 11 15.6l1.7 2.1 1.2-1.4 1.5 2.5z" fill="#8b5cf6"/><circle cx="14.6" cy="14.2" r=".9" fill="#8b5cf6"/></g></svg>`};
$('svg[aria-hidden]').insertAdjacentHTML('beforeend','<symbol id="i-save" viewBox="0 0 24 24"><path d="M5 3h11l4 4v14H5zM8 3v6h8V3M8 21v-7h8v7"/></symbol>');
$('.logo').innerHTML=LG(30)+'<span>PawPics</span>';$('.logo').dataset.h='home';$('.logo').style.cursor='pointer';
$('.logo').insertAdjacentHTML('afterend',`<button class="ib" data-h="new" title="Proyek baru" aria-label="Proyek baru">${IC('plus')}</button><button class="ib" data-h="sv" title="Simpan (Ctrl+S)" aria-label="Simpan proyek">${IC('save')}</button>`);
const esc2=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---- penyimpanan ---- */
const DBP=new Promise((ok,no)=>{try{const r=indexedDB.open('pawpics',1);r.onupgradeneeded=()=>{r.result.createObjectStore('m',{keyPath:'id'});r.result.createObjectStore('p',{keyPath:'id'})};r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)}catch(e){no(e)}});
const dbq=(st,m,f)=>DBP.then(db=>new Promise((ok,no)=>{const t=db.transaction(st,m);let q;t.oncomplete=()=>ok(q&&q.result);t.onerror=t.onabort=()=>no(t.error);q=f(...st.map(s=>t.objectStore(s)))}));
const li=u=>new Promise((r,j)=>{const i=new Image();i.onload=()=>r(i);i.onerror=j;i.src=u});
const toc=async u=>{const i=await li(u),c=document.createElement('canvas');c.width=i.width;c.height=i.height;c.getContext('2d').drawImage(i,0,0);return c};
function ser(){const bg=D.bg;let b=bg;if(bg.t=='img'){const c=document.createElement('canvas');c.width=bg.i.width;c.height=bg.i.height;c.getContext('2d').drawImage(bg.i,0,0);b={t:'img',u:c.toDataURL('image/jpeg',.9)}}
 return{D:{w:D.w,h:D.h,t:1,bg:b},L:L.map(l=>{const o={},same=l.orig===l.cv;for(const k in l){if(k[0]=='_')continue;const v=l[k];
  if(v instanceof HTMLCanvasElement)o[k]=k=='orig'&&same?{$s:1}:{$c:v.toDataURL('image/png')};else o[k]=v&&typeof v=='object'?JSON.parse(JSON.stringify(v)):v}return o})}}
async function unser(s){const Ls=[];for(const o of s.L){const l={};for(const k in o){const v=o[k];l[k]=v&&v.$c?await toc(v.$c):v}if(o.orig&&o.orig.$s)l.orig=l.cv;Ls.push(l)}
 let bg=s.D.bg;if(bg.t=='img')bg={t:'img',i:await li(bg.u)};return{D:{...s.D,bg},L:Ls}}
async function saveP(quiet){if(!PJ){if(!L.length&&D.bg.t=='color'){if(!quiet)toast('Belum ada yang disimpan');return}PJ={id:'p'+Date.now(),name:'Tanpa judul'}}
 const c=document.createElement('canvas');c.width=D.w;c.height=D.h;render(c.getContext('2d'),false,true);const k=360/Math.max(D.w,D.h),t=document.createElement('canvas');t.width=Math.max(1,Math.round(D.w*k));t.height=Math.max(1,Math.round(D.h*k));t.getContext('2d').drawImage(c,0,0,t.width,t.height);
 const m={id:PJ.id,name:PJ.name,date:Date.now(),w:D.w,h:D.h,thumb:t.toDataURL('image/jpeg',.7)},s=ser();
 try{await dbq(['m','p'],'readwrite',(a,b)=>{a.put(m);return b.put({id:m.id,s})});dirty=0;if(!quiet)toast('Proyek tersimpan')}catch(e){if(!quiet)toast('Penyimpanan tidak tersedia')}}
async function openP(id){try{const[m,p]=await Promise.all([dbq(['m'],'readonly',s=>s.get(id)),dbq(['p'],'readonly',s=>s.get(id))]),r=await unser(p.s);
 D=r.D;L=r.L;sel=-1;H=[];R=[];pn=[];PJ={id,name:m.name};dirty=0;zm=1;fit();ui();draw();loadF();hideHome()}catch(e){toast('Gagal membuka proyek')}}
setInterval(()=>{if(dirty&&L.length)saveP(true)},15000);document.addEventListener('visibilitychange',()=>{if(document.hidden&&dirty&&L.length)saveP(true)});

/* ---- layar sambutan ---- */
const GUIDE=[['Mulai cepat','Ketuk <b>Proyek baru</b>, pilih ukuran atau templat, lalu <b>Buat proyek</b>. Atau pilih <b>Buka foto</b> agar kanvas mengikuti ukuran fotomu. Proyek tersimpan otomatis dan muncul di Galeri; simpan manual dengan ikon disket atau Ctrl+S.'],
['Lapisan','Tab <b>Lapisan</b>: tambah foto, ubah urutan, gandakan, hapus, atur opasitas, mode campur, dan balik. Seret lapisan untuk memindah, tarik titik pojok untuk mengubah ukuran, titik atas untuk memutar.'],
['Foto & Pro','Tab <b>Atur</b> dan <b>Filter</b> untuk cahaya, kontras, saturasi, dan preset. Tab <b>Pro</b> untuk eksposur, sorotan, bayangan, suhu, tint, vibrance, ketajaman, pudar, dan <i>Perbaiki otomatis</i>.'],
['Hapus latar & klip','Tab <b>Latar</b>: hapus latar otomatis, atau pakai pipet ajaib dan kuas hapus/pulihkan. Tab <b>Klip</b> memotong foto ke dalam bentuk.'],
['Gambar raster & vektor','Tab <b>Gambar</b>: kuas, penghapus, ember cat, dan pipet warna (raster); pensil, pena, dan Edit titik (vektor). Bentuk di tab <b>Bentuk</b> bisa diubah ke vektor lalu diedit titiknya.'],
['Teks & font','Tab <b>Teks</b>: tambah teks, pilih font dari daftar berpratinjau, atur ukuran, warna, miring, dan jarak huruf. Tab <b>Efek</b> untuk bayangan, garis tepi, dan glow.'],
['Topeng','Tab <b>Topeng</b>: buat topeng, lalu usap kanvas untuk menyembunyikan atau menampilkan bagian lapisan, atau pakai gradasi. Lapisan asli tetap utuh.'],
['Zoom & geser','<b>Ponsel:</b> cubit 2 jari untuk zoom, geser dengan 2 jari. <b>Desktop:</b> Ctrl + scroll (atau cubit di trackpad); scroll biasa untuk menggeser. Panel di pojok kanvas: − / persen (ketuk untuk 100%) / + / pas layar / mode geser (tangan). Tahan Spasi atau klik tengah mouse untuk geser sementara.'],
['Pintasan','Ctrl+Z urungkan · Ctrl+Shift+Z ulangi · Ctrl+S simpan · Ctrl + / − / 0 / 1 zoom · Delete hapus lapisan · Esc batal pena.'],
['Ekspor','Ikon <b>PNG</b> (mendukung transparan) atau <b>JPG</b> di kanan atas.']];
const FEAT=[['Foto & Pro','Penyesuaian ala Polarr, filter, hapus latar'],['Raster & vektor','Kuas, ember cat, pena, edit titik'],['Teks','28+ font dengan pratinjau'],['Topeng & campur','Layer mask dan mode campur'],['24 templat','Poster, story, kartu, banner'],['Ponsel & desktop','Cubit zoom, Ctrl + scroll']];
const QS=[['Post',1080,1080],['Potret 4:5',1080,1350],['Story',1080,1920],['YouTube',1280,720],['A4',1240,1754]];
let htab='start';
function showHome(t){htab=t||'start';let h=$('#home');if(!h){document.body.insertAdjacentHTML('beforeend','<div id="home"></div>');h=$('#home')}h.style.display='flex';renderHome()}
function hideHome(){const h=$('#home');if(h)h.style.display='none';hudUpd()}
async function renderHome(){const T=[['start','Mulai'],['gal','Galeri'],['guide','Panduan']];
 let b='';
 if(htab=='start')b=`<div class="hero">${LG(96)}<h1>PawPics</h1><p>Editor foto dan desain di browser. Ringan, jalan di ponsel dan desktop.</p><div class="row c"><button class="b pri" data-h="new">+ Proyek baru</button><button class="b" data-h="open">Buka foto</button>${L.length?'<button class="b" data-h="hclose">Lanjutkan</button>':''}</div></div><h3>Mulai cepat</h3><div class="qg">${QS.map(([n,w,h])=>`<button class="b" data-h="quick" data-v="${w},${h},${n}">${n}<small>${w}×${h}</small></button>`).join('')}</div><h3>Fitur</h3><div class="ft">${FEAT.map(([a,c])=>`<div><b>${a}</b><span>${c}</span></div>`).join('')}</div>`;
 if(htab=='guide')b=`<h2>Panduan</h2>`+GUIDE.map(([a,c],i)=>`<details${i?'':' open'}><summary>${a}</summary><p>${c}</p></details>`).join('');
 if(htab=='gal'){b='<h2>Galeri</h2><p class="mu">Memuat…</p>';let ms=[];try{ms=(await dbq(['m'],'readonly',s=>s.getAll())).sort((x,y)=>y.date-x.date)}catch(e){b=`<h2>Galeri</h2><p class="mu">Penyimpanan tidak tersedia di browser ini.</p>`;ms=null}
  if(ms)b=`<h2>Galeri</h2>`+(ms.length?`<div class="gg">${ms.map(m=>`<div class="gc" data-h="op" data-v="${m.id}"><img src="${m.thumb}" alt=""><div class="gi"><b>${esc2(m.name)}</b><small>${m.w}×${m.h} · ${new Date(m.date).toLocaleDateString('id-ID')}</small></div><button class="b" data-h="del" data-v="${m.id}">Hapus</button></div>`).join('')}</div>`:`<p class="mu">Belum ada proyek. Buat satu, nanti otomatis tersimpan di sini.</p><div class="row"><button class="b pri" data-h="new">+ Proyek baru</button></div>`)}
 const h=$('#home');if(!h||htab!=T.find(x=>x[0]==htab)[0])return;
 h.innerHTML=`<div class="hh"><div class="hl">${LG(30)}<b>PawPics</b></div><nav class="ht">${T.map(([k,n])=>`<button class="${k==htab?'on':''}" data-h="tab" data-v="${k}">${n}</button>`).join('')}</nav><button class="ib" data-h="hclose" aria-label="Tutup">✕</button></div><div class="hb">${b}</div>`}

/* ---- popup proyek baru & simpan ---- */
const PRE2=[['Post persegi',1080,1080],['Potret 4:5',1080,1350],['Story 9:16',1080,1920],['Lanskap 16:9',1920,1080],['YouTube',1280,720],['A4 potret',1240,1754],['A4 lanskap',1754,1240],['Kartu nama',1050,600],['Banner',1600,600],['Facebook',1200,630]];
function modal(html){let m=$('#mdl');if(!m){document.body.insertAdjacentHTML('beforeend','<div id="mdl"></div>');m=$('#mdl')}m.innerHTML=`<div class="mc">${html}</div>`;m.style.display='flex'}
const closeM=()=>{const m=$('#mdl');if(m)m.style.display='none'};
function newModal(){modal(`<h2>Proyek baru</h2><label class="cl">Nama proyek<input id="pn" type="text" value="Proyek baru" maxlength="60"></label><h3>Ukuran</h3><div class="pg">${PRE2.map(([n,w,h],i)=>{const k=34/Math.max(w,h);return`<button class="pc${w==NPS.w&&h==NPS.h?' on':''}" data-m="pre" data-v="${w},${h}"><i style="width:${Math.max(8,w*k)}px;height:${Math.max(8,h*k)}px"></i><span>${n}</span><small>${w}×${h}</small></button>`}).join('')}</div>
 <div class="row"><label class="cl">Lebar (px)<input id="npw" type="number" min="50" max="4000" value="${NPS.w}"></label><label class="cl">Tinggi (px)<input id="nph" type="number" min="50" max="4000" value="${NPS.h}"></label></div>
 <h3>Latar</h3><div class="chips"><button class="b on" data-m="bg" data-v="#ffffff">Putih</button><button class="b" data-m="bg" data-v="#18181b">Hitam</button><button class="b" data-m="bg" data-v="none">Transparan</button><label class="b">Warna<input id="npc" type="color" value="#fde68a" data-m="bgc"></label></div>
 <h3>Mulai dari</h3><select id="npt"><option value="">Kanvas kosong</option>${TPX.map(t=>`<option value="${t[0]}">${t[1]} (${t[2]}×${t[3]})</option>`).join('')}</select><p class="mu">Memilih templat memakai ukuran templat.</p>
 <div class="row end"><button class="b" data-m="x">Batal</button><button class="b pri" data-m="mk">Buat proyek</button></div>`);NPS.bg={t:'color',c:'#ffffff'}}
function createP(){const w=+$('#npw').value,h=+$('#nph').value,t=$('#npt').value;if(!(w>=50&&h>=50&&w<=4000&&h<=4000)){toast('Ukuran 50–4000 px');return}
 const name=$('#pn').value.trim()||'Proyek baru',bg=NPS.bg;L=[];sel=-1;H=[];R=[];pn=[];D={w,h,t:1,bg};PJ={id:'p'+Date.now(),name};zm=1;
 if(t)tplx(t);else{fit();ui();draw()}H=[];R=[];tool='layers';mode='move';ui();closeM();hideHome();saveP(true);zoomAt(1,...ctr())}
function nameModal(){modal(`<h2>Simpan proyek</h2><label class="cl">Nama proyek<input id="pn" type="text" value="${esc2(PJ?PJ.name:'Proyek baru')}" maxlength="60"></label><div class="row end"><button class="b" data-m="x">Batal</button><button class="b pri" data-m="sv">Simpan</button></div>`)}
document.addEventListener('click',async e=>{
 const m=e.target.closest('[data-m]');if(m){const a=m.dataset.m,v=m.dataset.v;
  if(a=='x')closeM();if(a=='mk')createP();
  if(a=='sv'){const n=$('#pn').value.trim()||'Tanpa judul';if(!PJ)PJ={id:'p'+Date.now(),name:n};PJ.name=n;closeM();saveP()}
  if(a=='pre'){const[w,h]=v.split(',');$('#npw').value=w;$('#nph').value=h;NPS.w=+w;NPS.h=+h;document.querySelectorAll('.pc').forEach(x=>x.classList.toggle('on',x===m))}
  if(a=='bg'){NPS.bg=v=='none'?{t:'none'}:{t:'color',c:v};document.querySelectorAll('[data-m=bg]').forEach(x=>x.classList.toggle('on',x===m))}
  return}
 if(e.target.id=='mdl'){closeM();return}
 const b=e.target.closest('[data-h]');if(!b)return;const a=b.dataset.h,v=b.dataset.v;
 if(a=='home')showHome('start');if(a=='hclose')hideHome();if(a=='tab'){htab=v;renderHome()}
 if(a=='new')newModal();
 if(a=='sv'){PJ?saveP():nameModal()}
 if(a=='open'){OPENP=1;hideHome();pick('')}
 if(a=='quick'){const[w,h,n]=v.split(',');L=[];sel=-1;H=[];R=[];pn=[];D={w:+w,h:+h,t:1,bg:{t:'color',c:'#ffffff'}};PJ={id:'p'+Date.now(),name:n};zm=1;fit();ui();draw();hideHome();saveP(true);zoomAt(1,...ctr())}
 if(a=='op')openP(v);
 if(a=='del'){if(b.dataset.c!='1'){b.dataset.c='1';b.textContent='Yakin hapus?';setTimeout(()=>{if(b.isConnected){b.dataset.c='';b.textContent='Hapus'}},3000)}
  else{try{await dbq(['m','p'],'readwrite',(x,y)=>{x.delete(v);return y.delete(v)});if(PJ&&PJ.id==v)PJ=null;renderHome()}catch(_){toast('Gagal menghapus')}}}});
document.addEventListener('keydown',e=>{if(e.key=='Escape'&&$('#mdl')&&$('#mdl').style.display!='none')closeM();
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()=='s'){e.preventDefault();PJ?saveP():nameModal()}});
const fc0=$('#fi').onchange;$('#fi').onchange=e=>{if(OPENP&&e.target.files.length){OPENP=0;L=[];sel=-1;H=[];R=[];D={w:1080,h:1350,bg:{t:'color',c:'#ffffff'}};PJ=null}fc0(e)};
showHome('start');
