const { URL } = require("node:url");
exports.fuzz = (data) => {
  const s = data.toString("utf8");
  try {
    const u = new URL(s, "http://x");
    if (u.pathname.length > 0 && u.pathname.includes("\0")) throw new Error("NUL in pathname");
  } catch (e) {
    if (!(e instanceof TypeError)) throw e;
  }
};
