import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { probe } from "../src/lib/probe";

test("probe", async () => {
  const srv = createServer((req, res) => {
    res.statusCode = req.url === "/bad" ? 500 : 200;
    res.end("x");
  }).listen(0);

  const { port } = srv.address() as AddressInfo;
  const base = `http://127.0.0.1:${port}`;

  assert.equal((await probe(`${base}/ok`)).up, true);

  const bad = await probe(`${base}/bad`);
  assert.equal(bad.up, false);
  assert.equal(bad.status, 500);

  srv.close();
  srv.closeAllConnections();

  const dead = await probe(base, 500);
  assert.equal(dead.up, false);
  assert.equal(dead.status, null);
});
