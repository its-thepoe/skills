#!/usr/bin/env node

import { createRequire } from "node:module";
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
let packageName = "iconsax-react";
let outputMode = "names";
let showAllMatches = false;
const queryParts = [];

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  if (arg === "--package" && args[i + 1]) {
    packageName = args[i + 1];
    i += 1;
  } else if (arg.startsWith("--package=")) {
    packageName = arg.slice("--package=".length);
  } else if (arg === "--import") {
    outputMode = "import";
  } else if (arg === "--jsx") {
    outputMode = "jsx";
  } else if (arg === "--all") {
    showAllMatches = true;
  } else {
    queryParts.push(arg);
  }
}

const query = queryParts.join(" ").trim();
const require = createRequire(process.cwd() + "/");

function normalize(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function splitWords(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Za-z])([0-9])/g, "$1 $2")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function scoreIconName(iconName, normalizedQuery, queryWords) {
  const normalizedName = normalize(iconName);
  const nameWords = splitWords(iconName);

  if (!normalizedQuery) {
    return 1;
  }

  if (normalizedName === normalizedQuery) {
    return 100;
  }

  if (normalizedName.startsWith(normalizedQuery)) {
    let score = 85;
    if (nameWords.includes("normal")) score += 8;
    if (!/[0-9]$/.test(iconName)) score += 3;
    if (queryWords.length === 1 && nameWords[0] === queryWords[0]) score += 2;
    return score;
  }

  if (normalizedName.includes(normalizedQuery)) {
    let score = 70;
    if (nameWords.includes("normal")) score += 5;
    if (!/[0-9]$/.test(iconName)) score += 2;
    return score;
  }

  const matchedWords = queryWords.filter((word) =>
    nameWords.some((nameWord) => nameWord === word || nameWord.includes(word)),
  );

  if (matchedWords.length === queryWords.length) {
    return 60 + matchedWords.length;
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
  const packageJsonPath = require.resolve(`${packageName}/package.json`);
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  const packageRoot = packageJsonPath.replace(/\/package\.json$/, "");
  const declarationsPath = `${packageRoot}/${packageJson.types ?? "dist/index.d.ts"}`;
  const declarations = readFileSync(declarationsPath, "utf8");

  return [...declarations.matchAll(/export\s+(?:declare\s+)?const\s+([A-Za-z0-9_]+)\s*:\s*Icon\b/g)]
    .map((match) => match[1])
    .sort((a, b) => a.localeCompare(b));
}

function formatMatch(iconName) {
  if (outputMode === "import") {
    return `import { ${iconName} } from "${packageName}";`;
  }

  if (outputMode === "jsx") {
    return `<${iconName} size={20} color="currentColor" variant="Linear" aria-hidden="true" />`;
  }

  return iconName;
}

try {
  const icons = readExports();
  const normalizedQuery = normalize(query);
  const queryWords = splitWords(query);
  const matches = icons
    .map((iconName) => ({
      iconName,
      score: scoreIconName(iconName, normalizedQuery, queryWords),
    }))
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score || a.iconName.localeCompare(b.iconName))
    .slice(0, query ? 50 : 200);

  if (matches.length === 0) {
    console.error(`No Iconsax icons matched "${query}" in ${packageName}.`);
    process.exit(1);
  }

  const printableMatches =
    outputMode === "names" || showAllMatches ? matches : matches.slice(0, 1);

  const seen = new Set();
  for (const match of printableMatches) {
    const formatted = formatMatch(match.iconName);
    if (!seen.has(formatted)) {
      console.log(formatted);
      seen.add(formatted);
    }
  }
} catch (error) {
  console.error(`Could not read ${packageName}. Install it first in the target project.`);
  console.error("React: npm install iconsax-react");
  console.error("React Native: npm install iconsax-react-nativejs");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
