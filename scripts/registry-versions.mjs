import process from "node:process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_REGISTRY = "https://registry.npmjs.org/";
const DEFAULT_CONCURRENCY = 8;
const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_RETRIES = 2;

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function packageUrl(registryUrl, packageName) {
  const base = registryUrl.endsWith("/") ? registryUrl : `${registryUrl}/`;
  return new URL(encodeURIComponent(packageName), base).href;
}

async function fetchOne(packageName, options) {
  const {
    registryUrl,
    timeoutMs,
    retries,
    fetchImpl,
    sleep = wait,
  } = options;
  const url = packageUrl(registryUrl, packageName);

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(url, {
        headers: { accept: "application/json" },
        signal: controller.signal,
      });

      if (response.status === 404) return null;
      if (response.ok) {
        const metadata = await response.json();
        return metadata["dist-tags"]?.latest ?? metadata.version ?? null;
      }

      const transient = response.status === 429 || response.status >= 500;
      if (!transient || attempt === retries) {
        throw new Error(`Registry request failed for ${packageName}: HTTP ${response.status}`);
      }
    } catch (error) {
      const transient = error.name === "AbortError" || error.name === "TypeError";
      if (!transient || attempt === retries) {
        if (error.name === "AbortError") {
          throw new Error(`Registry request timed out for ${packageName} after ${timeoutMs}ms`);
        }
        throw new Error(`Registry request failed for ${packageName}: ${error.message}`);
      }
    } finally {
      clearTimeout(timer);
    }

    await sleep(100 * 2 ** attempt);
  }

  throw new Error(`Registry request failed for ${packageName}`);
}

export async function fetchRegistryVersions(packageNames, options = {}) {
  const registryUrl = options.registryUrl ?? DEFAULT_REGISTRY;
  const concurrency = options.concurrency ?? DEFAULT_CONCURRENCY;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const retries = options.retries ?? DEFAULT_RETRIES;
  const fetchImpl = options.fetchImpl ?? fetch;
  if (!Array.isArray(packageNames) || packageNames.length === 0) {
    return {};
  }
  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new Error("Registry concurrency must be a positive integer");
  }

  const results = new Array(packageNames.length);
  let nextIndex = 0;
  async function worker() {
    while (true) {
      const index = nextIndex;
      nextIndex += 1;
      if (index >= packageNames.length) return;
      results[index] = await fetchOne(packageNames[index], {
        registryUrl,
        timeoutMs,
        retries,
        fetchImpl,
        sleep: options.sleep,
      });
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, packageNames.length) }, worker));
  return Object.fromEntries(packageNames.map((name, index) => [name, results[index]]));
}

function parseArgs(argv) {
  let outputJson = false;
  let registryUrl = DEFAULT_REGISTRY;
  let concurrency = DEFAULT_CONCURRENCY;
  let timeoutMs = DEFAULT_TIMEOUT_MS;
  const packageNames = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--json") {
      outputJson = true;
      continue;
    }
    if (["--registry", "--concurrency", "--timeout-ms"].includes(arg)) {
      const value = argv[index + 1];
      if (!value) throw new Error(`${arg} requires a value`);
      if (arg === "--registry") registryUrl = value;
      if (arg === "--concurrency") concurrency = Number(value);
      if (arg === "--timeout-ms") timeoutMs = Number(value);
      index += 1;
      continue;
    }
    if (arg.startsWith("--")) throw new Error(`Unknown option: ${arg}`);
    packageNames.push(arg);
  }

  if (packageNames.length === 0) throw new Error("At least one package name is required");
  return { outputJson, registryUrl, concurrency, timeoutMs, packageNames };
}

async function main() {
  const { outputJson, registryUrl, concurrency, timeoutMs, packageNames } = parseArgs(process.argv.slice(2));
  const versions = await fetchRegistryVersions(packageNames, { registryUrl, concurrency, timeoutMs });
  if (outputJson) {
    console.log(JSON.stringify(versions));
    return;
  }
  for (const [name, version] of Object.entries(versions)) {
    console.log(`${name}\t${version ?? "none"}`);
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((error) => {
    console.error(`ERROR: ${error.message}`);
    process.exitCode = 1;
  });
}
