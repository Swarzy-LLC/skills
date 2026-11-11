# skills

Reusable agent skills for coding agents, following the [Agent Skills](https://agentskills.io) format. Each skill lives in `skills/<name>/SKILL.md` with any supporting files beside it.

| Skill                                                      | Use it when                                                                                       |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [modern-web-guidance](skills/modern-web-guidance/SKILL.md) | Writing or changing HTML, CSS, or client-side JavaScript. Upstream skill, installed unmodified.   |
| [test-audit](skills/test-audit/SKILL.md)                   | Writing, changing, reviewing, or pruning tests, including whole-subsystem test-pruning campaigns. |

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

For Claude Code, Claude apps, ChatGPT, Codex, Cursor, and Grok Bot, see [docs/install.md](docs/install.md).

Prefer a global install (`-g`). Vendor a skill into a repo's `.agents/skills/` (run `npx skills add` without `-g` from that repo) only when cloud agents or collaborators working in that repo need it.

## Per-repo overrides

Skills read local rules from the repo they run in. For `test-audit`, add a `Testing` section to `AGENTS.md` or create `.agents/test-audit.md` with the repo's test commands, off-limits suites, and other boundaries. See [Per-repo overrides](skills/test-audit/SKILL.md#per-repo-overrides).

## Development

Tools are pinned in `mise.toml`. Bun is the only JavaScript runtime: mise installs npm-backed tools such as oxfmt with Bun (`npm.package_manager = "bun"`), and the checks run them with `bun run --bun`, so Node.js is not needed. [hk](https://hk.jdx.dev) runs the checks as git hooks.

```bash
mise install               # installs pinned tools and the git hooks
bun install                # installs @types/bun
hk check --all             # oxfmt, SKILL.md frontmatter, vendored-skill sync, and `bun check`
hk fix --all               # apply formatting
bun run check:frontmatter  # validate every skills/*/SKILL.md
bun run update:modern-web-guidance
```

`scripts/check-skill-frontmatter.ts` enforces the [Agent Skills](https://agentskills.io) rules: `name` is 1-64 lowercase letters, digits, or single hyphens and matches its directory, and `description` is present and at most 1024 characters.

## Vendored skills

[modern-web-guidance](skills/modern-web-guidance) is upstream content. `skills/modern-web-guidance` is the published copy, which `skills add` discovers. `.agents/skills/modern-web-guidance` plus [`skills-lock.json`](skills-lock.json) is the [skills CLI](https://github.com/vercel-labs/skills) install, which `npx skills update` refreshes. The two trees must stay identical. `bun run update:modern-web-guidance` runs that update and copies the refreshed tree over `skills/modern-web-guidance`.

The skills CLI hides a locked skill under `.agents/skills/` from `skills add`, and its discovery walk does not follow symlinks, so the published copy is a second tree rather than a link.

## Credits

[test-audit](skills/test-audit) is inspired by and adapted from the [`test-audit` skill in openclaw/openclaw](https://github.com/openclaw/openclaw/tree/3195fba90643c3897c538f2f6891c405331bee9c/.agents/skills/test-audit) (MIT, Copyright (c) 2026 OpenClaw Foundation), which was its starting point. This version removes OpenClaw-specific tooling and adds repo discovery, per-repo overrides, and a per-stack guide.

[modern-web-guidance](skills/modern-web-guidance) is the upstream skill from [GoogleChrome/modern-web-guidance](https://github.com/GoogleChrome/modern-web-guidance), installed unmodified. `SKILL.md` remains [Apache-2.0](licenses/modern-web-guidance/LICENSE). Guides under `guides/` remain [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/).

## License

This repository is [MIT](LICENSE), except the vendored Modern Web Guidance skill. That skill stays under Apache-2.0 and CC-BY 4.0, as credited above.
