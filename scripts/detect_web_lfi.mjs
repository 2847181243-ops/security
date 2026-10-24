import fs from "node:fs";
const p = process.argv[2] || "tests/sample-lfi.log";
const deep = [/\.\.%2F\.\.%2F\.\.%2F/i, /\.\.\/\.\.\/\.\.\//];
const sensitive = [/etc%2fpasswd/i, /\/etc\/passwd/i, /win\.ini/i];
const lines = fs.readFileSync(p,"utf8").split(/\r?\n/).filter(Boolean);
let hits=0;
for(const line of lines){const hit=deep.some(r=>r.test(line))||sensitive.some(r=>r.test(line)); if(hit)hits++; console.log((hit?"ALERT ":"ok    ")+line.slice(0,110));}
console.log("hits="+hits+" total="+lines.length);
if(hits!==1) process.exit(1);
