// Preview only public production files; never serve reports, source tools or Git internals.
const http = require("node:http"),
  fs = require("node:fs"),
  path = require("node:path");
const root = path.resolve(__dirname, "../..");
const port = Number(process.env.PORT || 8771);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "application/javascript",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".xml": "application/xml",
  ".txt": "text/plain",
};
http
  .createServer((req, res) => {
    let name;
    try {
      name = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    } catch {
      res.writeHead(400).end();
      return;
    }
    const allowed =
      /^\/(?:index\.html|privacy\.html|404\.html|robots\.txt|sitemap\.xml)$/.test(
        name,
      ) ||
      name === "/" ||
      /^\/products\/[a-z-]+\/(?:index\.html)?$/.test(name) ||
      /^\/assets\/(?:images|css)\/[a-zA-Z0-9_.-]+$/.test(name) ||
      /^\/Vayam-Analytics-Dashboard\/integration\/[a-z-]+\.(?:js|css)$/.test(
        name,
      ) ||
      /^\/Vayam-Analytics-Dashboard\/(?:index\.html|style\.css|dashboard\.js|sample-data\.js|report-schema\.js|report-engine\.js|google-connector\.js|assets\/logo\.png)?$/.test(
        name,
      );
    if (
      (!allowed &&
        name !== "/Vayam-Analytics-Dashboard/tools/responsive-check.html") ||
      name.includes("..")
    ) {
      res.writeHead(404).end("Not found");
      return;
    }
    if (name.endsWith("/")) name += "index.html";
    const file = path.resolve(root, "." + name);
    if (
      !file.startsWith(root + path.sep) ||
      !fs.existsSync(file) ||
      !fs.statSync(file).isFile()
    ) {
      res.writeHead(404).end("Not found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": mime[path.extname(file)] || "application/octet-stream",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    fs.createReadStream(file).pipe(res);
  })
  .listen(port, "127.0.0.1", () =>
    console.log("Business website preview: http://127.0.0.1:" + port + "/"),
  );
