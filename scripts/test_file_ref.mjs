import { MediaStore } from "./onebot-esm/media.mjs";
import os from "node:os"; import path from "node:path"; import { readFile } from "node:fs/promises";
const dir=path.join(os.tmpdir(),"onebot-file-"+Date.now());
const store=new MediaStore(dir,1,0,{allowPrivateHosts:false});
import { fileURLToPath } from "node:url";
const src=path.join(path.dirname(fileURLToPath(import.meta.url)),"fixtures","secret-proof.txt");
const ref={kind:"image", file:"file://"+src};
const r=await store.resolve(ref, async()=>undefined);
console.log("resolved="+(r!==undefined));
if(r){ const text=await readFile(r.path,"utf8"); console.log("copied_prefix="+text.slice(0,20)); console.log("dest="+r.path);
  if(!text.startsWith("jenkins-file-read-ok")){ console.error("ASSERT FAILED: copied content mismatch"); process.exit(1); } }
