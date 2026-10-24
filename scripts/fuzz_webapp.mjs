import http from "node:http";
const base="http://127.0.0.1:8099";
const seeds=["/","/xss?name=world","/login?user=alice","/idor?id=1","/fetch?url=http://127.0.0.1:8099/","/metadata"];
const chars="abcdefghijklmnopqrstuvwxyz0123456789%{}<>'\"\\/?:;&=+ ";
function rand(n){return Array.from({length:n},()=>chars[Math.floor(Math.random()*chars.length)]).join("");}
function req(path){return new Promise(res=>{const r=http.request(base+path,{method:"GET",timeout:1500},resp=>{let b="";resp.on("data",c=>b+=c);resp.on("end",()=>res({status:resp.statusCode,len:b.length}));});r.on("timeout",()=>{r.destroy();res({status:"timeout"});});r.on("error",e=>res({status:"err:"+e.code}));r.end();});}
let ok=0, err=0, s5=0; const statuses={};
for(let i=0;i<300;i++){
  let p=seeds[Math.floor(Math.random()*seeds.length)];
  if(Math.random()<0.7) p += (p.includes("?")?"&":"?") + rand(1+Math.floor(Math.random()*40));
  if(Math.random()<0.2) p = "/" + rand(1+Math.floor(Math.random()*80));
  const r=await req(p);
  if(typeof r.status==="number"){ok++; statuses[r.status]=(statuses[r.status]||0)+1; if(r.status>=500)s5++;} else err++;
}
const alive=await req("/");
console.log("requests=300 numeric="+ok+" errors="+err+" status5xx="+s5+" alive="+JSON.stringify(alive));
console.log("statuses="+JSON.stringify(statuses));
