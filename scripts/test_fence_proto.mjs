import { MediaStore } from "./onebot-esm/media.mjs";
import os from "node:os"; import path from "node:path";
const dir=path.join(os.tmpdir(),"onebot-proto-"+Date.now());let fetched=false;
globalThis.fetch=async()=>{fetched=true;throw new Error("stub");};
const store=new MediaStore(dir,1,0,{allowPrivateHosts:false});
const urls=["file:///etc/passwd","gopher://127.0.0.1/","ftp://127.0.0.1/","HTTP://10.0.0.1/","http://127.0.0.1@100.64.1.2/","http://100.64.1.2@example.com/","http://10.0.0.1.nip.io/"];
for(const u of urls){fetched=false;let err="";try{await store.downloadUrl(u,".bin",0);}catch(e){err=String(e.message||e).slice(0,70);}console.log(u,"fetched="+fetched,"err="+err);}
