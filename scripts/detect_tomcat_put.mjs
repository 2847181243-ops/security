import fs from "node:fs";
const lines=fs.readFileSync(process.argv[2]||"tests/sample-tomcat-put.log","utf8").split(/\r?\n/).filter(Boolean);
let hits=0;
for(const l of lines){const m=l.match(/"(\S+) (\S+)/);const h=m&&m[1]==="PUT"&&/\.jsp\/?$/i.test(m[2]);if(h)hits++;console.log((h?"ALERT ":"ok    ")+l.slice(0,80));}
console.log("hits="+hits+" total="+lines.length);
if(hits!==1)process.exit(1);
