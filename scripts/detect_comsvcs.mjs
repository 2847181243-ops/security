import fs from "node:fs";
const ev=JSON.parse(fs.readFileSync(process.argv[2]||"tests/sample-comsvcs.json","utf8"));
let hits=0;
for(const e of ev){
  const h=/rundll32\.exe$/i.test(e.Image||"")&&/comsvcs\.dll/i.test(e.CommandLine||"")&&/MiniDump/i.test(e.CommandLine||"");
  if(h)hits++; console.log((h?"ALERT ":"ok    ")+e.CommandLine.slice(0,90));
}
console.log("hits="+hits+" total="+ev.length);
if(hits!==1)process.exit(1);
