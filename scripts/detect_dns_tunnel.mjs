import fs from "node:fs";
const lines=fs.readFileSync(process.argv[2]||"tests/sample-dns.log","utf8").split(/\r?\n/).filter(Boolean);
let hits=0;
for(const l of lines){
  const m=l.match(/query\s+(\S+)/i); const q=m?m[1]:"";
  const label=q.split(".")[0];
  const h=label.length>=40 && /^[A-Za-z0-9+/=_-]+$/.test(label);
  if(h)hits++; console.log((h?"ALERT ":"ok    ")+q.slice(0,60));
}
console.log("hits="+hits+" total="+lines.length);
if(hits!==1)process.exit(1);
