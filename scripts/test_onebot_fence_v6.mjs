import { MediaStore } from "./onebot-esm/media.mjs";
import os from "node:os"; import path from "node:path";
const dir=path.join(os.tmpdir(),"onebot-v6-"+Date.now());let fetched=false;
globalThis.fetch=async()=>{fetched=true;throw new Error("stub");};
const store=new MediaStore(dir,1,0,{allowPrivateHosts:false});
const hosts=["[::1]","[fc00::1]","[fd00::1]","[fe80::1]","[::ffff:10.0.0.1]","[64:ff9b::7f00:1]","[2001:db8::1]","[::]"];
for(const host of hosts){fetched=false;let err="";try{await store.downloadUrl("http://"+host+"/",".bin",0);}catch(e){err=String(e.message||e).slice(0,60);}console.log(host,"fetched="+fetched,"err="+err);}
