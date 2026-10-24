import fs from "node:fs";
const p=process.argv[2]||"<workspace>/data/security/detections/live-dvwa.log";
const out=process.argv[3]||"<workspace>/data/security/detections/live-dvwa.jsonl";
const re=/^(\S+) \S+ \S+ \[([^\]]+)\] "(\S+) (\S+) [^"]*" (\d{3}) (\S+)/;
const lines=fs.readFileSync(p,"utf8").split(/\r?\n/).filter(Boolean);
let ok=0, bad=0;
const rows=[];
for(const line of lines){
  const m=line.match(re);
  if(!m){bad++;continue;}
  const [_,ip,time,method,url,status,size]=m;
  let query="",stem=url;
  const qi=url.indexOf("?");
  if(qi>=0){stem=url.slice(0,qi);query=url.slice(qi+1);}
  rows.push({c_ip:ip,time,method,uri:url,cs_uri_stem:stem,cs_uri_query:query,sc_status:Number(status),bytes:Number(size)});
  ok++;
}
fs.writeFileSync(out,rows.map(r=>JSON.stringify(r)).join("\n")+"\n","utf8");
console.log("parsed="+ok+" bad="+bad+" out="+out);
