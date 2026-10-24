import fs from "node:fs";
const ev = JSON.parse(fs.readFileSync(process.argv[2] || "tests/sample-process.json","utf8"));
const parents = ["/apache2","/httpd","/nginx"];
const children = ["/sh","/bash","/dash"];
let hits = 0;
for (const e of ev) {
  const p = parents.some(x => (e.ParentImage||"").endsWith(x));
  const c = children.some(x => (e.Image||"").endsWith(x));
  const hit = p && c; if (hit) hits++;
  console.log((hit?"ALERT ":"ok    ") + e.ParentImage + " -> " + e.Image);
}
console.log("hits="+hits+" total="+ev.length);
if (hits !== 1) process.exit(1);
