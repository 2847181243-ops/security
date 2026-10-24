import http from "node:http";
const base="http://127.0.0.1:8099";
const seeds=["http://127.0.0.1:8099/","http://example.com/","file:///etc/passwd","gopher://127.0.0.1:1389/_x","http://[::1]:8099/","http://127.0.0.1:1/","http://","http://%zz/","ftp://127.0.0.1/","http://169.254.169.254/latest/meta-data/"];
function req(path){return new Promise(res=>{const r=http.request(base+path,{timeout:2000},resp=>{let b="";resp.on("data",c=>b+=c);resp.on("end",()=>res(resp.statusCode));});r.on("timeout",()=>{r.destroy();res("timeout");});r.on("error",e=>res("err:"+e.code));r.end();});}
let numeric=0,err=0,alive=false;const st={};
for(let i=0;i<200;i++){
 const u=seeds[Math.floor(Math.random()*seeds.length)]+(Math.random()<0.5?Math.random().toString(36).slice(2,8):"");
 const r=await req("/fetch?url="+encodeURIComponent(u));
 if(typeof r==="number"){numeric++;st[r]=(st[r]||0)+1;} else err++;
}
alive=(await req("/"))===200;
console.log("requests=200 numeric="+numeric+" errors="+err+" alive="+alive+" statuses="+JSON.stringify(st));
