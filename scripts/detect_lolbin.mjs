import fs from "node:fs";
const ev=JSON.parse(fs.readFileSync(process.argv[2]||"tests/sample-lolbin.json","utf8"));
let hits=0;
for(const e of ev){
  const img=(e.Image||"").toLowerCase(), cmd=e.CommandLine||"";
  const h=(img.endsWith("certutil.exe")&&/(urlcache|-split|http)/i.test(cmd))||(img.endsWith("rundll32.exe")&&/(javascript:|http)/i.test(cmd))||(img.endsWith("mshta.exe")&&/http/i.test(cmd));
  if(h)hits++; console.log((h?"ALERT ":"ok    ")+cmd.slice(0,90));
}
console.log("hits="+hits+" total="+ev.length);
if(hits!==3)process.exit(1);
