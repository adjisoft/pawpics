/* zoom.js — Zoom & geser kanvas PawPics, dimuat setelah extra2.js:
   cubit 2 jari (ponsel), Ctrl + scroll / cubit trackpad (desktop), pintasan Ctrl +/-/0/1, panel zoom melayang
   (− / persen / + / pas layar / mode geser), Spasi untuk geser sementara, klik tengah mouse untuk geser. */
const STG=$('#stage'),PT=new Map();let handOn=false,spc=false,pan=null,pinch=null;
const clampZ=z=>Math.min(8,Math.max(.2,z)),ctr=()=>{const r=STG.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2]};
function zoomAt(z,cx,cy){const r=cv.getBoundingClientRect(),ux=(cx-r.left)/r.width,uy=(cy-r.top)/r.height;zm=clampZ(z);fit();
 const q=cv.getBoundingClientRect();STG.scrollLeft+=q.left+ux*q.width-cx;STG.scrollTop+=q.top+uy*q.height-cy;draw()}
const fit0=fit;fit=function(){fit0();hudUpd()};
function hudUpd(){const p=$('#zp');if(p)p.textContent=Math.round(sc*100)+'%';const h=$('#zhud');if(h){const r=STG.getBoundingClientRect();h.style.left=Math.max(4,r.right-h.offsetWidth-10)+'px';h.style.top=(r.top+10)+'px'}}
const isHand=()=>handOn||spc,setHand=()=>{document.body.classList.toggle('hand',isHand());const b=$('#zh');if(b)b.classList.toggle('on',handOn)};
document.body.insertAdjacentHTML('beforeend',`<div id="zhud"><button data-z="out" aria-label="Perkecil">−</button><button data-z="pct" id="zp" aria-label="Zoom 100%">100%</button><button data-z="in" aria-label="Perbesar">+</button><button data-z="fit" aria-label="Pas layar">${IC('fit')}</button><button data-z="hand" id="zh" aria-label="Mode geser">${IC('move')}</button></div>`);
document.addEventListener('click',e=>{const b=e.target.closest('[data-z]');if(!b)return;const[x,y]=ctr(),a=b.dataset.z;
 if(a=='in')zoomAt(zm*1.25,x,y);if(a=='out')zoomAt(zm/1.25,x,y);if(a=='fit')zoomAt(1,x,y);if(a=='pct')zoomAt(zm/sc,x,y);if(a=='hand'){handOn=!handOn;setHand()}});
/* cubit 2 jari + geser (capture, agar tidak menggambar saat jari kedua menyentuh) */
STG.addEventListener('pointerdown',e=>{if(e.pointerType!='mouse')PT.set(e.pointerId,{x:e.clientX,y:e.clientY});
 if(PT.size==2){dr=null;const[a,b]=[...PT.values()];pinch={d:Math.hypot(a.x-b.x,a.y-b.y)||1,z:zm,mx:(a.x+b.x)/2,my:(a.y+b.y)/2};pan=null;e.stopPropagation();return}
 if(PT.size<2&&(isHand()||e.button==1)){pan={x:e.clientX,y:e.clientY,l:STG.scrollLeft,t:STG.scrollTop};STG.setPointerCapture(e.pointerId);e.stopPropagation();e.preventDefault()}},true);
STG.addEventListener('pointermove',e=>{if(PT.has(e.pointerId))PT.set(e.pointerId,{x:e.clientX,y:e.clientY});
 if(pinch&&PT.size>=2){const[a,b]=[...PT.values()],d=Math.hypot(a.x-b.x,a.y-b.y)||1,mx=(a.x+b.x)/2,my=(a.y+b.y)/2;
  zoomAt(pinch.z*d/pinch.d,mx,my);STG.scrollLeft-=mx-pinch.mx;STG.scrollTop-=my-pinch.my;pinch.mx=mx;pinch.my=my;e.stopPropagation();return}
 if(pan){STG.scrollLeft=pan.l-(e.clientX-pan.x);STG.scrollTop=pan.t-(e.clientY-pan.y);e.stopPropagation()}},true);
const pu=e=>{PT.delete(e.pointerId);if(PT.size<2)pinch=null;pan=null};STG.addEventListener('pointerup',pu,true);STG.addEventListener('pointercancel',pu,true);
/* Ctrl + scroll / cubit trackpad */
STG.addEventListener('wheel',e=>{if(e.ctrlKey||e.metaKey){e.preventDefault();zoomAt(zm*Math.exp(-e.deltaY*(e.deltaMode?.05:.0025)),e.clientX,e.clientY)}},{passive:false});
document.addEventListener('gesturestart',e=>e.preventDefault());
document.addEventListener('keydown',e=>{const tg=/INPUT|TEXTAREA|SELECT/.test(e.target.tagName);
 if(e.code=='Space'&&!tg&&!spc){spc=true;setHand();e.preventDefault()}
 if((e.ctrlKey||e.metaKey)&&['=','+','-','0','1'].includes(e.key)){e.preventDefault();const[x,y]=ctr();
  e.key=='0'?zoomAt(1,x,y):e.key=='1'?zoomAt(zm/sc,x,y):zoomAt(e.key=='-'?zm/1.25:zm*1.25,x,y)}});
document.addEventListener('keyup',e=>{if(e.code=='Space'){spc=false;setHand()}});
hudUpd();
