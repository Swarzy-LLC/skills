import { spawnSync } from "node:child_process";
import { cpSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const installed = join(root, ".agents/skills/modern-web-guidance");
const published = join(root, "skills/modern-web-guidance");

const update = spawnSync(process.execPath, ["x", "skills", "update", "modern-web-guidance", "-y"], {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env, DISABLE_TELEMETRY: "1" },
});

if (update.status !== 0) process.exit(update.status ?? 1);

rmSync(published, { recursive: true, force: true });
cpSync(installed, published, { recursive: true });
console.log("Copied .agents/skills/modern-web-guidance to skills/modern-web-guidance.");
