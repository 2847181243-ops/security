import { MediaStore } from "./onebot-esm/media.mjs";
import os from "node:os"; import path from "node:path";
const dir = path.join(os.tmpdir(), "onebot-fence-" + Date.now());
let fetched=false;
globalThis.fetch = async () => { fetched=true; throw new Error("stub fetch"); };
const store = new MediaStore(dir,1,0,{allowPrivateHosts:false});
const hosts=["10.0.0.1","127.0.0.1","192.168.1.1","169.254.1.1","100.64.1.2","100.127.255.255","100.128.0.1","0.0.0.0","240.0.0.1","198.18.0.1","192.0.0.1","[::ffff:127.0.0.1]","[::ffff:100.64.1.2]","localtest.me","2130706433"];
for (const host of hosts) {
  fetched=false; let err="";
  try { await store.downloadUrl("http://"+host+"/",".bin",0); } catch(e){ err=String(e.message||e).slice(0,60); }
  console.log(host, "fetched="+fetched, "err="+err);
}
