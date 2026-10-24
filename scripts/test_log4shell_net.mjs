import fs from "node:fs";
const lines=fs.readFileSync("D:/dsh-private/data/security/detections/sample-log4shell.bin","utf8").split(/\r?\n/).filter(Boolean);
let hits=0;lines.forEach((l,i)=>{const h=/jndi:ldap:\/\//i.test(l);if(h)hits++;console.log((h?"ALERT ":"ok    ")+"line"+i);});
console.log("hits="+hits+" total="+lines.length);
if(hits!==1)process.exit(1);
