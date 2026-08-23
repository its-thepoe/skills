import test from "node:test";
import assert from "node:assert/strict";
import { fetchRegistryVersions } from "./registry-versions.mjs";

const response = (status, body) => ({
  status,
  ok: status >= 200 && status < 300,
  async json() {
    return body;
  },
});

test("returns latest versions in input order", async () => {
  const result = await fetchRegistryVersions(["@scope/slow", "@scope/fast"], {
    concurrency: 2,
    fetchImpl: async (url) => {
      if (url.includes("slow")) await new Promise((resolve) => setTimeout(resolve, 10));
      return response(200, { "dist-tags": { latest: url.includes("slow") ? "1.0.0" : "2.0.0" } });
    },
  });

  assert.deepEqual(Object.keys(result), ["@scope/slow", "@scope/fast"]);
  assert.deepEqual(result, { "@scope/slow": "1.0.0", "@scope/fast": "2.0.0" });
});

test("maps registry 404 to an unpublished package", async () => {
  const result = await fetchRegistryVersions(["@scope/new"], {
    fetchImpl: async () => response(404, {}),
  });
  assert.deepEqual(result, { "@scope/new": null });
});

test("retries transient registry responses", async () => {
  let attempts = 0;
  const result = await fetchRegistryVersions(["@scope/retry"], {
    retries: 2,
    sleep: async () => {},
    fetchImpl: async () => {
      attempts += 1;
      return attempts < 3 ? response(503, {}) : response(200, { version: "3.0.0" });
    },
  });
  assert.equal(attempts, 3);
  assert.deepEqual(result, { "@scope/retry": "3.0.0" });
});

test("fails closed on non-transient registry errors", async () => {
  await assert.rejects(
    fetchRegistryVersions(["@scope/forbidden"], {
      fetchImpl: async () => response(403, {}),
    }),
    /HTTP 403/,
  );
});

test("bounds request concurrency", async () => {
  let active = 0;
  let maximum = 0;
  const result = await fetchRegistryVersions(["a", "b", "c", "d"], {
    concurrency: 2,
    fetchImpl: async () => {
      active += 1;
      maximum = Math.max(maximum, active);
      await new Promise((resolve) => setTimeout(resolve, 5));
      active -= 1;
      return response(200, { version: "1.0.0" });
    },
  });
  assert.equal(maximum, 2);
  assert.equal(Object.keys(result).length, 4);
});
