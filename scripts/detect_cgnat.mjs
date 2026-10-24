import fs from "node:fs";
const ls=fs.readFileSync(process.argv[2]||"tests/sample-cgnat.log","utf8").split(/\r?\n/).filter(Boolean);
let h=0;for(const l of ls){const x=/100\.(6[4-9]|[7-9][0-9]|1[01][0-9]|12[0-7])\./.test(l);if(x)h++;console.log((x?"ALERT ":"ok    ")+l.slice(0,90));}
console.log("hits="+h+" total="+ls.length);
if(h!==1)process.exit(1);
