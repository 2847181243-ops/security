import fs from "node:fs";
const rows=fs.readFileSync("<workspace>/data/security/detections/live-dvwa.jsonl","utf8").split(/\r?\n/).filter(Boolean).map(l=>JSON.parse(l));
const sqli=rows.filter(r=>/%27%20OR%20|UNION%20SELECT|' OR '/i.test(r.cs_uri_query));
const xss=rows.filter(r=>/%3Cscript|<script|onerror/i.test(r.cs_uri_query));
console.log("rows="+rows.length+" sqli="+sqli.length+" xss="+xss.length);
console.log("sample="+JSON.stringify(sqli[0]?sqli[0].cs_uri_query:"none").slice(0,120));
