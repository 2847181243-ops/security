import { MediaStore } from "./onebot-esm/media.mjs";
import os from "node:os"; import path from "node:path";
const dir=path.join(os.tmpdir(),"onebot-redir-"+Date.now());
let calls=0, locations=[];
globalThis.fetch=async (url)=>{ calls++; locations.push(String(url)); return new Response(null,{status:302,headers:{location:"http://127.0.0.1/"}}); };
const store=new MediaStore(dir,1,0,{allowPrivateHosts:false});
let err=""; try{ await store.downloadUrl("http://example.com/",".bin",0); }catch(e){err=String(e.message||e).slice(0,80);}
console.log("redirect_to_private calls="+calls+" err="+err);
if (calls !== 1) { console.error("ASSERT FAILED: private redirect should stop after first hop"); process.exit(1); }
calls=0; locations=[];
globalThis.fetch=async (url)=>{ calls++; locations.push(String(url)); return new Response(null,{status:302,headers:{location:"http://100.64.1.2/"}}); };
err=""; try{ await store.downloadUrl("http://example.com/",".bin",0); }catch(e){err=String(e.message||e).slice(0,80);}
console.log("redirect_to_cgnat calls="+calls+" err="+err+" urls="+locations.join(","));
if (calls <= 1) { console.error("ASSERT FAILED: CGNAT redirect should be followed"); process.exit(1); }
