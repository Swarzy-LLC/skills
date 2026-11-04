# skills

Reusable agent skills for coding agents, following the [Agent Skills](https://agentskills.io) format. Each skill lives in `skills/<name>/SKILL.md` with any supporting files beside it.

| Skill                                    | Use it when                                                                                       |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [test-audit](skills/test-audit/SKILL.md) | Writing, changing, reviewing, or pruning tests, including whole-subsystem test-pruning campaigns. |

## Install

Install with the [`skills` CLI](https://github.com/vercel-labs/skills). It needs Node.js 22.20 or later, and uses your existing Git, GitHub CLI, or SSH credentials for this private repo.

```bash
# Every skill, for your user, across all projects
npx skills add Swarzy-LLC/skills -g

# One skill
npx skills add Swarzy-LLC/skills -g --skill test-audit

# See what the repo offers without installing
npx skills add Swarzy-LLC/skills --list

# Update installed skills later
npx skills update
```

Prefer a global install (`-g`). Vendor a skill into a repo's `.agents/skills/` (run `npx skills add` without `-g` from that repo) only when cloud agents or collaborators working in that repo need it.

## Per-repo overrides

Skills read local rules from the repo they run in. For `test-audit`, add a `Testing` section to `AGENTS.md` or create `.agents/test-audit.md` with the repo's test commands, off-limits suites, and other boundaries. See [Per-repo overrides](skills/test-audit/SKILL.md#per-repo-overrides).

## Development

Tools are pinned in `mise.toml`. Bun is the only JavaScript runtime: mise installs npm-backed tools such as oxfmt with Bun (`npm.package_manager = "bun"`), and the checks run them with `bun run --bun`, so Node.js is not needed. [hk](https://hk.jdx.dev) runs the checks as git hooks.

```bash
mise install               # installs pinned tools and the git hooks
bun install                # installs @types/bun and TypeScript
hk check --all             # oxfmt, SKILL.md frontmatter validation, and typecheck
hk fix --all               # apply formatting
bun run check:frontmatter  # validate every skills/*/SKILL.md
```

`scripts/check-skill-frontmatter.ts` enforces the [Agent Skills](https://agentskills.io) rules: `name` is 1-64 lowercase letters, digits, or single hyphens and matches its directory, and `description` is present and at most 1024 characters.

## Credits

[test-audit](skills/test-audit) is inspired by and adapted from the [`test-audit` skill in openclaw/openclaw](https://github.com/openclaw/openclaw/tree/3195fba90643c3897c538f2f6891c405331bee9c/.agents/skills/test-audit) (MIT, Copyright (c) 2026 OpenClaw Foundation), which was its starting point. This version removes OpenClaw-specific tooling and adds repo discovery, per-repo overrides, and a per-stack guide.

## License

[MIT](LICENSE).
