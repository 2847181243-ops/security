import { extForUrl } from "./onebot-esm/media.mjs";
export function fuzz(data) {
  const s = data.toString("utf8");
  const ext = extForUrl("http://example.com/" + s, "bin");
  if (!/^\.[a-z0-9]{1,5}$/.test(ext)) throw new Error("bad extension: " + ext);
}
