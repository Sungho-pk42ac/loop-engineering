// 로컬 서버: GET / → dashboard.html, GET /api/sessions → 수집 결과(5초 캐시). 실행: node server.mjs [포트]
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { collect } from "./collect.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.argv[2] ?? process.env.PORT ?? 3170);
let cache = { at: 0, body: "" };

createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname === "/api/sessions") {
    if (Date.now() - cache.at > 5000) cache = { at: Date.now(), body: JSON.stringify(collect()) };
    res.writeHead(200, { "content-type": "application/json; charset=utf-8" }).end(cache.body);
  } else if (url.pathname === "/") {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(readFileSync(join(HERE, "dashboard.html")));
  } else res.writeHead(404).end();
}).listen(PORT, () => console.log(`loop-dashboard: http://localhost:${PORT}`));
