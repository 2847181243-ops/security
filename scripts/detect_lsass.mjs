import fs from "node:fs";
const ev=JSON.parse(fs.readFileSync(process.argv[2]||"tests/sample-lsass.json","utf8"));
let hits=0;
for(const e of ev){
  const target=/lsass\.exe$/i.test(e.TargetImage||"");
  const mask=["0x1010","0x1410","0x143a"].some(m=>(e.GrantedAccess||"").toLowerCase().includes(m));
  const h=target&&mask; if(h)hits++;
  console.log((h?"ALERT ":"ok    ")+e.SourceImage+" -> "+e.TargetImage+" "+e.GrantedAccess);
}
console.log("hits="+hits+" total="+ev.length);
if(hits!==2)process.exit(1);
