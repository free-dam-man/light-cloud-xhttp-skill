#!/usr/bin/env node
"use strict";
const http = require("http");

const PORT = Number(process.env.PORT || 8080);
const TOKEN = process.env.SUB_TOKEN || "CHANGE_ME_SUB_TOKEN";
const BODY = process.env.SUB_BODY || ""; // base64 of one VLESS URL line; set at deploy time

const server = http.createServer((req, res) => {
  const url = (req.url || "/").split("?")[0];
  if (url === "/health" || url === "/healthz") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("ok");
    return;
  }
  if (url === "/" + TOKEN || url === "/" + TOKEN + "/") {
    res.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    });
    res.end(BODY);
    return;
  }
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("not found");
});

server.listen(PORT, () => {
  console.log("stream-sub listening on", PORT);
});
