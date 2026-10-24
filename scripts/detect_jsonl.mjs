import fs from "node:fs";
const p=process.argv[2]||"tests/sample-jsonl.log";
const rows=fs.readFileSync(p,"utf8").split(/\r?\n/).filter(Boolean).map(l=>JSON.parse(l));
const sqli=rows.filter(r=>/%27%20OR%20|UNION%20SELECT|' OR '/i.test(r.cs_uri_query));
const xss=rows.filter(r=>/%3Cscript|<script|onerror/i.test(r.cs_uri_query));
console.log("rows="+rows.length+" sqli="+sqli.length+" xss="+xss.length);
if(sqli.length!==1) process.exit(1);
