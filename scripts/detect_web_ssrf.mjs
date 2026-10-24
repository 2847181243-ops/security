import fs from "node:fs";
const p = process.argv[2] || "tests/sample-ssrf.log";
const lines=fs.readFileSync(p,"utf8").split(/\r?\n/).filter(Boolean);
let hits=0;
for(const line of lines){
  const m=line.match(/url=([^\s"]+)/i);
  const internal=!!m && /(127\.0\.0\.1|localhost|169\.254\.|10\.|192\.168\.)/i.test(m[1]);
  if(internal)hits++;
  console.log((internal?"ALERT ":"ok    ")+line.slice(0,110));
}
console.log("hits="+hits+" total="+lines.length);
if(hits!==1)process.exit(1);
