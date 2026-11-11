import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const root = join(import.meta.dirname, "..");
const published = join(root, "skills/modern-web-guidance");
const installed = join(root, ".agents/skills/modern-web-guidance");
const lockPath = join(root, "skills-lock.json");

async function files(dir: string): Promise<Map<string, Buffer>> {
  const out = new Map<string, Buffer>();
  async function walk(current: string): Promise<void> {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const path = join(current, entry.name);
      if (entry.isDirectory()) await walk(path);
      else if (entry.isFile())
        out.set(relative(dir, path).split("\\").join("/"), await readFile(path));
    }
  }
  await walk(dir);
  return out;
}

const lock: unknown = JSON.parse(await readFile(lockPath, "utf8"));
const entry =
  lock !== null &&
  typeof lock === "object" &&
  "skills" in lock &&
  lock.skills !== null &&
  typeof lock.skills === "object" &&
  "modern-web-guidance" in lock.skills
    ? lock.skills["modern-web-guidance"]
    : undefined;
const source =
  entry !== null && typeof entry === "object" && "source" in entry ? entry.source : undefined;
const sourceType =
  entry !== null && typeof entry === "object" && "sourceType" in entry
    ? entry.sourceType
    : undefined;
const skillPath =
  entry !== null && typeof entry === "object" && "skillPath" in entry ? entry.skillPath : undefined;
const version =
  lock !== null && typeof lock === "object" && "version" in lock ? lock.version : undefined;

if (
  version !== 2 ||
  source !== "GoogleChrome/modern-web-guidance" ||
  sourceType !== "github" ||
  typeof skillPath !== "string" ||
  !skillPath.endsWith("SKILL.md")
) {
  console.error(
    "skills-lock.json must record modern-web-guidance from GoogleChrome/modern-web-guidance.",
  );
  process.exit(1);
}

const [publishedFiles, installedFiles] = await Promise.all([files(published), files(installed)]);
const paths = [...new Set([...publishedFiles.keys(), ...installedFiles.keys()])].sort();
const mismatches: string[] = [];
for (const path of paths) {
  const left = publishedFiles.get(path);
  const right = installedFiles.get(path);
  if (!left || !right || !left.equals(right)) mismatches.push(path);
}

if (mismatches.length > 0) {
  console.error(
    "skills/modern-web-guidance and .agents/skills/modern-web-guidance differ. Run `bun run update:modern-web-guidance` after refreshing upstream.",
  );
  for (const path of mismatches.slice(0, 20)) console.error(`  ${path}`);
  if (mismatches.length > 20) console.error(`  ... ${mismatches.length - 20} more`);
  process.exit(1);
}

console.log(`${publishedFiles.size} vendored modern-web-guidance files match.`);
