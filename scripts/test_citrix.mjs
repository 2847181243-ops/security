import fs from "node:fs";
const ls=fs.readFileSync("D:/dsh-private/data/security/detections/sample-citrix.log","utf8").split(/\r?\n/).filter(Boolean);
let h=0;for(const l of ls){const x=/\/oauth\/idp\/\.well-known\/openid-configuration/i.test(l);if(x)h++;console.log((x?"ALERT ":"ok    ")+l.slice(0,80));}
console.log("hits="+h+" total="+ls.length);
if(h!==1)process.exit(1);
