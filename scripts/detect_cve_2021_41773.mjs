import fs from "node:fs";
const p=process.argv[2]||"tests/sample-cve-2021-41773.log";
const pats=[/\.%2e/i,/%2e%2e/i,/\.%2E/];
const lines=fs.readFileSync(p,"utf8").split(/\r?\n/).filter(Boolean);
let hits=0;
for(const line of lines){const h=pats.some(r=>r.test(line)); if(h)hits++; console.log((h?"ALERT ":"ok    ")+line.slice(0,110));}
console.log("hits="+hits+" total="+lines.length);
if(hits!==2) process.exit(1);
