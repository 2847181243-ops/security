import http from "node:http";
function get(p){return new Promise((res,rej)=>{http.get({host:"127.0.0.1",port:8099,path:p,timeout:5000},r=>{let b="";r.on("data",c=>b+=c);r.on("end",()=>res({s:r.statusCode,b}));}).on("error",rej);});}
const payload=encodeURIComponent('<img src=x onerror=alert(1)>');
const a=await get("/login?user="+payload+"&pass=x");
const b=await get("/file?name=..%2F..%2Flab.pass");
console.log("login_status="+a.s+" raw_img="+a.b.includes("<img")+" escaped="+a.b.includes("&lt;img"));
console.log("traversal_status="+b.s);
if(a.s!==401||a.b.includes("<img")||!a.b.includes("&lt;img")||b.s!==403)process.exit(1);
