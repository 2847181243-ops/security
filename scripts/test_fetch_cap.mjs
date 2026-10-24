import http from "node:http";
function get(p){return new Promise((res,rej)=>{http.get({host:"127.0.0.1",port:8099,path:p,timeout:8000},r=>{let b="";r.on("data",c=>b+=c);r.on("end",()=>res({s:r.statusCode,len:b.length}));}).on("error",rej);});}
const a=await get("/fetch?url="+encodeURIComponent("http://127.0.0.1:8098/"));
const b=await get("/fetch?url="+encodeURIComponent("http://127.0.0.1:8099/metadata"));
console.log("big="+JSON.stringify(a)+" normal="+JSON.stringify(b));
if(a.s!==413||b.s!==200)process.exit(1);
