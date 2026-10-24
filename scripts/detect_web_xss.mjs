import fs from "node:fs";
const p = "<workspace>/data/security/detections/sample-xss.log";
const patterns = [/%3Cscript/i, /<script/i, /onerror%3D/i, /onerror=/i];
const lines = fs.readFileSync(p, "utf8").split(/\r?\n/).filter(Boolean);
let hits = 0;
for (const line of lines) { const hit = patterns.some(r => r.test(line)); if (hit) hits++; console.log((hit ? "ALERT " : "ok    ") + line.slice(0, 110)); }
console.log("hits=" + hits + " total=" + lines.length);
if (hits !== 1) process.exit(1);
