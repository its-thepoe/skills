#!/usr/bin/env node
import { readFile } from "node:fs/promises";

const MAIN_BASE_URL = "https://api.lemonsqueezy.com/v1";
const LICENSE_BASE_URL = "https://api.lemonsqueezy.com";

const usage = `Usage:
  node tools/lemonsqueezy/scripts/lemonsqueezy-api.mjs METHOD PATH_OR_URL [options]

Options:
  --body JSON_OR_FILE     JSON request body, or path to a JSON file
  --form KEY=VALUE        Form field for License API POST requests; repeatable
  --license-api           Use License API headers/base URL
  --dry-run               Print sanitized request without sending it

Examples:
  node tools/lemonsqueezy/scripts/lemonsqueezy-api.mjs GET /stores
  node tools/lemonsqueezy/scripts/lemonsqueezy-api.mjs GET "/orders?filter[user_email]=a@b.com"
`;

function fail(message) {
  console.error(message);
  console.error("");
  console.error(usage);
  process.exit(1);
}

function redact(value) {
  if (!value) return value;
  if (value.length <= 8) return "***";
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function isHttpUrl(value) {
  return value.startsWith("https://") || value.startsWith("http://");
}

function buildUrl(pathOrUrl, licenseApi) {
  if (isHttpUrl(pathOrUrl)) return pathOrUrl;

  const base = licenseApi ? LICENSE_BASE_URL : MAIN_BASE_URL;
  const normalizedPath = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${normalizedPath}`;
}

async function parseBody(value) {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) return trimmed;
  return readFile(value, "utf8");
}

const args = process.argv.slice(2);
const method = args.shift()?.toUpperCase();
const pathOrUrl = args.shift();

if (!method || !pathOrUrl || method === "--help" || method === "-h") {
  fail("Missing METHOD or PATH_OR_URL.");
}

let bodyInput;
let licenseApi = false;
let dryRun = false;
const formFields = [];

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];

  if (arg === "--body") {
    bodyInput = args[++i];
    if (!bodyInput) fail("--body requires a value.");
  } else if (arg === "--form") {
    const pair = args[++i];
    if (!pair || !pair.includes("=")) fail("--form requires KEY=VALUE.");
    formFields.push(pair);
  } else if (arg === "--license-api") {
    licenseApi = true;
  } else if (arg === "--dry-run") {
    dryRun = true;
  } else {
    fail(`Unknown option: ${arg}`);
  }
}

const apiKey = process.env.LEMONSQUEEZY_API_KEY;
if (!apiKey) {
  fail("Missing LEMONSQUEEZY_API_KEY.");
}

if (bodyInput && formFields.length > 0) {
  fail("Use either --body or --form, not both.");
}

const headers = {
  Authorization: `Bearer ${apiKey}`,
};

let body;
if (licenseApi) {
  headers.Accept = "application/json";
  if (formFields.length > 0) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    body = new URLSearchParams(formFields.map((pair) => pair.split(/=(.*)/s).slice(0, 2))).toString();
  } else if (bodyInput) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    body = await parseBody(bodyInput);
  }
} else {
  headers.Accept = "application/vnd.api+json";
  headers["Content-Type"] = "application/vnd.api+json";
  body = await parseBody(bodyInput);
}

const url = buildUrl(pathOrUrl, licenseApi);
const sanitizedHeaders = { ...headers, Authorization: `Bearer ${redact(apiKey)}` };

if (dryRun) {
  console.log(JSON.stringify({ method, url, headers: sanitizedHeaders, body }, null, 2));
  process.exit(0);
}

const response = await fetch(url, {
  method,
  headers,
  body: ["GET", "HEAD"].includes(method) ? undefined : body,
});

const text = await response.text();
let parsed;
try {
  parsed = text ? JSON.parse(text) : null;
} catch {
  parsed = text;
}

const output = {
  ok: response.ok,
  status: response.status,
  statusText: response.statusText,
  rateLimit: {
    limit: response.headers.get("x-ratelimit-limit"),
    remaining: response.headers.get("x-ratelimit-remaining"),
  },
  request: {
    method,
    url,
    headers: sanitizedHeaders,
  },
  response: parsed,
};

console.log(JSON.stringify(output, null, 2));

if (!response.ok) {
  process.exit(1);
}

