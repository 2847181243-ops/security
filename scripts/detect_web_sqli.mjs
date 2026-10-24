import fs from "node:fs";
const p = process.argv[2] || "tests/sample-web.log";
const patterns = [/%27%20OR%20/i, /UNION%20SELECT/i, /' OR '/i, /UNION SELECT/i];
const lines = fs.readFileSync(p, "utf8").split(/\r?\n/).filter(Boolean);
let hits = 0;
for (const line of lines) {
  const hit = patterns.some(r => r.test(line));
  if (hit) hits++;
  console.log((hit ? "ALERT " : "ok    ") + line.slice(0, 120));
}
console.log("hits=" + hits + " total=" + lines.length);
if (hits !== 1) process.exit(1);
