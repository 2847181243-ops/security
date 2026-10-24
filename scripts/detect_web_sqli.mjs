import fs from "node:fs";
const p = process.argv[2] || "D:/dsh-private/data/security/detections/sample-web.log";
const patterns = [/%27%20OR%20/i, /UNION%20SELECT/i, /' OR '/i, /UNION SELECT/i, /%2527%2520OR%2520/i, /%2527%2520or%2520/i];
const lines = fs.readFileSync(p, "utf8").split(/\r?\n/).filter(Boolean);
let hits = 0;
for (const line of lines) {
  const hit = patterns.some(r => r.test(line));
  if (hit) hits++;
  console.log((hit ? "ALERT " : "ok    ") + line.slice(0, 120));
}
console.log("hits=" + hits + " total=" + lines.length);
if (hits !== 1) process.exit(1);
