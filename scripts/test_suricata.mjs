import fs from "node:fs";
const rule=fs.readFileSync("<workspace>/rules/suricata/activemq-cve-2023-46604.rules","utf8");
const m=rule.match(/content:"([^"]+)"/i);
const needle=m[1].toLowerCase();
const data=fs.readFileSync("<workspace>/data/security/detections/sample-activemq.bin","latin1");
const parts=data.split("\n---\n");
let hits=0;parts.forEach((p,i)=>{const h=p.toLowerCase().includes(needle);if(h)hits++;console.log((h?"ALERT ":"ok    ")+"sample"+i);});
console.log("hits="+hits+" total="+parts.length);
if(hits!==1)process.exit(1);
