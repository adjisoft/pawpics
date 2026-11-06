/* _helpers.js — fungsi bantu khusus templat (dipindah apa adanya dari tpl2.js, more.js, studio.js).
   Dipakai oleh berkas templat lewat: const {F,pol,...}=TPLH;  Dimuat sebelum semua templat (lihat index.js). */
window.TPLH=(()=>{
const F=n=>FK[n];
const A=o=>Object.assign(L[L.length-1],o);
/* — dari more.js: bantu templat Polaroid & Kolase — */
const pol=(x,y,w,th,cap,col='#d1d5db')=>{const h=w*1.2,b=w*.06,c=Math.cos(th),s=Math.sin(th),P=(dx,dy)=>[x+dx*c-dy*s,y+dx*s+dy*c],z=()=>L[L.length-1];
 let p=P(0,0);S('rect',p[0],p[1],w,h,'#ffffff');z().r=th;z().e={...E0,sb:24,so:8,sc:'rgba(0,0,0,.3)'};
 p=P(0,-(h/2-b-(w-2*b)/2));S('rect',p[0],p[1],w-2*b,w-2*b,col);z().r=th;
 if(cap){p=P(0,h/2-b*1.7);T(cap,p[0],p[1],w*.09,'#374151',0,FK.Caveat);z().r=th}};
const ph=(x,y,w,h,c,k='rect',th=0)=>{S(k,x,y,w,h,c);L[L.length-1].r=th;T('+',x,y,Math.min(w,h)*.3,'rgba(0,0,0,.22)',1,FK.Poppins)};
const PC=['#fbcfe8','#bfdbfe','#bbf7d0','#fde68a','#ddd6fe','#fed7aa'];
/* — dari studio.js: bantu templat Kreatif — */
const bl=(x,y,r,c,sd,op)=>{const n=7,P2=[];let s=sd*7.3;const R=()=>(s=(s*9301+49297)%233280)/233280;
 for(let i=0;i<n;i++){const a=i/n*Math.PI*2,rr=r*(.72+.5*R());P2.push([Math.cos(a)*rr,Math.sin(a)*rr])}
 L.push({t:'vec',nodes:P2.map((p,i)=>{const a=P2[(i+n-1)%n],b=P2[(i+1)%n],tx=(b[0]-a[0])/6,ty=(b[1]-a[1])/6;return{x:p[0],y:p[1],i:[-tx,-ty],o:[tx,ty],sm:1}}),closed:true,fill:true,fc:c,sc:'#000000',sw:0,x,y,w:r*2,h:r*2,r:0,op:op??1})};
const gs=(k,x,y,w,h,c,c2,ga,r,op)=>{S(k,x,y,w,h,c,op,r);A({g2:c2,ga})};
const cT=(t,x,y,s,c,ff,cu,r)=>{T(t,x,y,s,c,1,FK[ff]);A({cu,r:(r||0)*Math.PI/180})};
const sh2={...E0,sb:26,so:12,sc:'rgba(0,0,0,.3)'},stk={...E0,ow:16,oc:'#ffffff',sb:26,so:12,sc:'rgba(0,0,0,.3)'};
return {F,pol,ph,PC,bl,gs,A,cT,sh2,stk}})();
