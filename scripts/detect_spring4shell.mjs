import fs from "node:fs";
const lines=fs.readFileSync(process.argv[2]||"tests/sample-spring4shell.log","utf8").split(/\r?\n/).filter(Boolean);
let hits=0;
for(const l of lines){const h=/class\.module\.classLoader/i.test(l); if(h)hits++; console.log((h?"ALERT ":"ok    ")+l.slice(0,100));}
console.log("hits="+hits+" total="+lines.length);
if(hits!==1)process.exit(1);
