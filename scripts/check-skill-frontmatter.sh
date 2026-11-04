#!/usr/bin/env bash
# Validates SKILL.md frontmatter against the agentskills.io name and description rules.
set -euo pipefail

if [[ $# -eq 0 ]]; then
  mapfile -t files < <(find skills -name SKILL.md -type f | sort)
else
  files=("$@")
fi

status=0
fail() {
  echo "$1: $2" >&2
  status=1
}

for file in "${files[@]}"; do
  if [[ "$(head -n 1 "$file")" != "---" ]]; then
    fail "$file" "must start with a --- frontmatter line"
    continue
  fi

  frontmatter="$(awk 'NR == 1 { next } /^---$/ { exit } { print }' "$file")"
  name="$(sed -n 's/^name:[[:space:]]*//p' <<<"$frontmatter" | head -n 1)"
  description="$(sed -n 's/^description:[[:space:]]*//p' <<<"$frontmatter" | head -n 1)"
  dir="$(basename "$(dirname "$file")")"

  if [[ -z "$name" ]]; then
    fail "$file" "missing name"
  elif ((${#name} > 64)) || ! [[ "$name" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
    fail "$file" "name must be 1-64 lowercase letters, digits, or single hyphens"
  elif [[ "$name" != "$dir" ]]; then
    fail "$file" "name '$name' must match directory '$dir'"
  fi

  if [[ -z "$description" ]]; then
    fail "$file" "missing description"
  elif ((${#description} > 1024)); then
    fail "$file" "description exceeds 1024 characters"
  fi
done

exit "$status"
