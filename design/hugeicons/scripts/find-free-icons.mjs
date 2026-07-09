#!/usr/bin/env node

import { createRequire } from "node:module";
import { readFileSync } from "node:fs";

const require = createRequire(process.cwd() + "/");
const query = process.argv.slice(2).join(" ").trim();

function normalize(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function scoreIconName(iconName, normalizedQuery) {
  const normalizedName = normalize(iconName.replace(/Icon$/, ""));

  if (!normalizedQuery) {
    return 1;
  }

  if (normalizedName === normalizedQuery) {
    return 100;
  }

  if (normalizedName.startsWith(normalizedQuery)) {
    return 80;
  }

  if (normalizedName.includes(normalizedQuery)) {
    return 60;
  }

  let queryIndex = 0;
  for (const char of normalizedName) {
    if (char === normalizedQuery[queryIndex]) {
      queryIndex += 1;
    }
  }

  return queryIndex === normalizedQuery.length ? 30 : 0;
}

function readExports() {
  const packageJsonPath = require.resolve("@hugeicons/core-free-icons/package.json");
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  const packageRoot = packageJsonPath.replace(/\/package\.json$/, "");
  const declarationsPath = `${packageRoot}/${packageJson.types ?? "index.d.ts"}`;
  const declarations = readFileSync(declarationsPath, "utf8");

  return [...declarations.matchAll(/export\s+declare\s+const\s+([A-Za-z0-9_]+Icon)\b/g)]
    .map((match) => match[1])
    .sort((a, b) => a.localeCompare(b));
}

try {
  const icons = readExports();
  const normalizedQuery = normalize(query);
  const matches = icons
    .map((iconName) => ({
      iconName,
      score: scoreIconName(iconName, normalizedQuery),
    }))
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score || a.iconName.localeCompare(b.iconName))
    .slice(0, query ? 40 : 200);

  if (matches.length === 0) {
    console.error(`No Hugeicons Free icons matched "${query}".`);
    process.exit(1);
  }

  for (const match of matches) {
    console.log(match.iconName);
  }
} catch (error) {
  console.error(
    "Could not read @hugeicons/core-free-icons. Install it first with: npm install @hugeicons/react @hugeicons/core-free-icons",
  );
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
