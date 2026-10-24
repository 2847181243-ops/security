import { MediaStore } from "./onebot-esm/media.mjs";
import os from "node:os";
import path from "node:path";
const dir = path.join(os.tmpdir(), "onebot-fence-test-" + Date.now());
let fetched = false;
globalThis.fetch = async () => { fetched = true; throw new Error("stub fetch: reached network layer"); };
const store = new MediaStore(dir, 1, 0, { allowPrivateHosts: false });
for (const host of ["10.0.0.1","127.0.0.1","192.168.1.1","169.254.1.1","100.64.1.2"]) {
  fetched = false;
  let err = "";
  try { await store.downloadUrl("http://" + host + "/", ".bin", 0); } catch (e) { err = String(e.message || e).slice(0,80); }
  console.log(host, "fetched=" + fetched, "err=" + err);
}
