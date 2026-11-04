import { Glob } from "bun";
import { basename, dirname } from "node:path";

const NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_NAME = 64;
const MAX_DESCRIPTION = 1024;

async function skillFiles(args: string[]): Promise<string[]> {
  if (args.length > 0) return args;
  const files = await Array.fromAsync(new Glob("skills/**/SKILL.md").scan("."));
  return files.sort();
}

function parseFrontmatter(text: string): Record<string, unknown> | string {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
  if (!match) return "must start with a --- frontmatter block closed by ---";
  try {
    const data = Bun.YAML.parse(match[1] ?? "");
    if (data === null || typeof data !== "object" || Array.isArray(data)) {
      return "frontmatter must be a YAML mapping";
    }
    return data as Record<string, unknown>;
  } catch (error) {
    return `invalid YAML frontmatter: ${(error as Error).message}`;
  }
}

function validate(file: string, text: string): string[] {
  const frontmatter = parseFrontmatter(text);
  if (typeof frontmatter === "string") return [frontmatter];

  const errors: string[] = [];
  const { name, description } = frontmatter;
  const dir = basename(dirname(file));

  if (typeof name !== "string" || name.length === 0) {
    errors.push("missing name");
  } else if (name.length > MAX_NAME || !NAME_PATTERN.test(name)) {
    errors.push(
      `name "${name}" must be 1-${MAX_NAME} lowercase letters, digits, or single hyphens`,
    );
  } else if (name !== dir) {
    errors.push(`name "${name}" must match its directory "${dir}"`);
  }

  if (typeof description !== "string" || description.trim().length === 0) {
    errors.push("missing description");
  } else if (description.length > MAX_DESCRIPTION) {
    errors.push(`description is ${description.length} characters; the limit is ${MAX_DESCRIPTION}`);
  }

  return errors;
}

const files = await skillFiles(Bun.argv.slice(2));
if (files.length === 0) {
  console.error("No SKILL.md files found.");
  process.exit(1);
}

let failed = 0;
for (const file of files) {
  const errors = validate(file, await Bun.file(file).text());
  for (const error of errors) console.error(`${file}: ${error}`);
  if (errors.length > 0) failed++;
}

if (failed > 0) {
  console.error(`${failed} of ${files.length} SKILL.md file(s) failed frontmatter validation.`);
  process.exit(1);
}
console.log(`${files.length} SKILL.md file(s) passed frontmatter validation.`);
