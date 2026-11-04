# Install the skills

Each skill is a folder with a `SKILL.md`, in the [Agent Skills](https://agentskills.io) format, so the same folder works in every tool below. Examples use `test-audit`.

**This repo is private.** Every route below needs your own GitHub access to `Swarzy-LLC/skills`. The [`skills` CLI](https://github.com/vercel-labs/skills) (Node.js 22.20 or later) uses your existing Git credentials, then the GitHub CLI, then SSH. For the upload routes, clone first:

```bash
gh repo clone Swarzy-LLC/skills
```

## Claude

### Claude Code

```bash
npx skills add Swarzy-LLC/skills -g -a claude-code --skill test-audit
```

This installs to `~/.claude/skills/test-audit/`, which loads in every project on this machine. Without `-g` it installs to the current repo's `.claude/skills/`. In a session that was already open, run `/reload-skills` if it doesn't appear. Run it with `/test-audit` or let Claude choose it.

Cowork and cloud sessions don't read `~/.claude/skills/`. For those, upload the skill to your Claude account (next section) or commit it to the repo's `.claude/skills/`.

### Claude apps (claude.ai and desktop)

1. Zip the skill folder so the folder itself is the top level of the archive:

   ```bash
   cd skills && zip -r test-audit.zip test-audit
   ```

2. Make sure code execution is on: **Settings > Capabilities > Code execution and file creation** (Free, Pro, Max, Ultra). On Team and Enterprise, an owner controls this in **Organization settings > Plugins & skills**.
3. Go to **Customize > Skills**, click **+**, then **+ Create skill > Upload a skill**, and choose the zip.
4. Turn the skill on in the list.

Uploaded skills also sync to Claude Code sessions signed in to the same claude.ai account.

## ChatGPT and Codex

### Codex (CLI, IDE extension, and Codex in the ChatGPT desktop app)

```bash
npx skills add Swarzy-LLC/skills -g -a codex --skill test-audit
```

This installs to `~/.agents/skills/test-audit/`, which Codex reads for every repo. Without `-g` it installs to the current repo's `.agents/skills/`. Mention it with `$test-audit` or list skills with `/skills`. Restart Codex if it doesn't appear.

### ChatGPT

Uploading skills in ChatGPT is available to eligible Business, Enterprise, Healthcare, and Edu workspaces, subject to admin settings.

1. In the sidebar, select **Plugins**, then the **Skills** tab.
2. Select **Create > Upload from your computer** and upload the skill. The zip from the Claude section is a complete skill folder.
3. ChatGPT scans the upload before it becomes available. Use it by typing `@` and picking the skill, or let ChatGPT choose it.

## Cursor

```bash
npx skills add Swarzy-LLC/skills -g -a cursor --skill test-audit
```

This installs to `~/.agents/skills/test-audit/`, which Cursor loads for every project on this machine. Without `-g` it installs to the current repo's `.agents/skills/`. Cursor also reads `.cursor/skills/`, `~/.cursor/skills/`, and the Claude and Codex skill folders. Run it by typing `/test-audit` in Agent chat, and check it under **Customize > Skills**.

Cloud Agents don't load `~/.agents/skills/`. To use the skill there, either commit it to the repo's `.cursor/skills/` or `.agents/skills/`, or copy it into `~/.cursor/skills/` and turn on **Settings > Agents > Sync Skills for Cloud Agents**.

## Grok Bot

Ask the bot in chat to save the skill, and paste the repo link or the skill's `SKILL.md` link, for example `https://github.com/Swarzy-LLC/skills/blob/main/skills/test-audit/SKILL.md`. Because the repo is private, the bot's computer needs GitHub access to `Swarzy-LLC/skills`.
