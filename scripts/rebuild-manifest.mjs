import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const bucketDirs = ["agent", "design", "media", "meta", "tools", "web-design", "writing"];

const bucketTags = {
  agent: ["agent", "debugging", "browser", "testing"],
  design: ["design", "ui"],
  media: ["media", "assets"],
  meta: ["meta", "workflow"],
  tools: ["tool"],
  "web-design": ["web-design", "motion", "animation"],
  writing: ["writing", "content"],
};

const nameTags = {
  "figma-plugin-builder": ["figma"],
  "framer-agents": ["framer"],
  "framer-code-components-overrides": ["framer"],
  "framer-plugins": ["framer"],
  "tailwindcss": ["tailwind"],
  "canva-app-builder": ["canva"],
  "swiftui-debugging": ["swiftui"],
  "swiftui-pro": ["swiftui"],
  "hugeicons": ["icons"],
  "iconsax": ["icons"],
};

const manifest = { skills: [] };

for (const bucket of bucketDirs) {
  const bucketPath = path.join(rootDir, bucket);
  const entries = await readdir(bucketPath, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const skillDir = path.join(bucketPath, entry.name);
    const pkgPath = path.join(skillDir, "package.json");
    const packageJson = JSON.parse(await readFile(pkgPath, "utf8"));
    const tags = new Set([...(bucketTags[bucket] || []), ...(nameTags[entry.name] || [])]);

    manifest.skills.push({
      name: entry.name,
      package: packageJson.name,
      path: `${bucket}/${entry.name}`,
      tags: [...tags],
    });
  }
}

manifest.skills.sort((a, b) => a.name.localeCompare(b.name));

await writeFile(path.join(rootDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
await writeFile(
  path.join(rootDir, "skills", "skills.manifest.json"),
  `${JSON.stringify(
    {
      skills: manifest.skills.map(({ name, package: pkg, path: skillPath }) => ({
        name,
        package: pkg,
        path: skillPath,
      })),
    },
    null,
    2,
  )}\n`,
);
