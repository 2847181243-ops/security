import fs from "node:fs";
const p=process.argv[2]||"D:/dsh-private/data/security/detections/evasion-web.log";
function decode(s){
  let o=s;
  for(let i=0;i<2;i++){ try{o=decodeURIComponent(o);}catch{} }
  o=o.replace(/&#x([0-9a-f]+);?/gi,(m,h)=>{try{return String.fromCharCode(parseInt(h,16));}catch{return m;}});
  o=o.replace(/&#(\d+);?/g,(m,d)=>{try{return String.fromCharCode(parseInt(d,10));}catch{return m;}});
  o=o.replace(/&lt;/gi,"<").replace(/&gt;/gi,">").replace(/&quot;/gi,'"').replace(/&amp;/gi,"&");
  return o;
}
const sqli=[/%27%20OR%20/i,/UNION%20SELECT/i,/' OR '/i,/UNION SELECT/i];
const xss=[/%3Cscript/i,/<script/i,/onerror%3D/i,/onerror=/i];
let s=0,x=0;const lines=fs.readFileSync(p,"utf8").split(/\r?\n/).filter(Boolean);
for(const l of lines){const n=decode(l);const sh=sqli.some(r=>r.test(n));const xh=xss.some(r=>r.test(n));if(sh)s++;if(xh)x++;console.log((sh?"SQLI ":"     ")+(xh?"XSS ":"    ")+l.slice(0,90));}
console.log("sqli="+s+" xss="+x+" total="+lines.length);
