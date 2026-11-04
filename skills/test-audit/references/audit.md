# Audit workflow

- Use this after the [authoring gate](../SKILL.md#authoring-gate).
- For a whole-subsystem campaign, also follow [CAMPAIGN.md](../CAMPAIGN.md).

## Junk patterns

Reject new matches unless the [retention bar](#retention-bar) identifies an independent contract. When auditing existing tests, look for:

- Probes with no assertions, self-comparisons, tests that copy a value and compare it to itself, and expected values produced by the code under test.
- Copied inventories, manifests, or export lists, and exact greps over source, imports, or strings.
- Tests of private predicates or call shapes that duplicate proof already held at a boundary, and repeated replays of a shared helper inside each caller's suite.
- Test-only exports, globals, or wrappers, and production code paths that only tests call.
- Mocks that implement the behavior being asserted, or that pretend two different APIs behave the same.
- Fixtures that supply results, admission decisions, or callback ordering the owner should produce, and persistence asserted against a store path the code never writes.
- Capability flags asserted in place of the delivery or acknowledgement the feature promises.
- Negative controls that pass because of an unrelated guard, or that assert a rejection the code can never reach.
- Names that promise behavior the inputs and assertions never exercise.

## Retention bar

- Keep tests for independent contracts: public API, SDK, protocol, config, migration, storage, security, platform, defaults, exact prompt or output bytes, generated cross-language code, packaging, release, and architecture. Keep observable ordering and credible regressions.
- Source inspection is valid when it is the cheapest independent guard of a user-facing key, byte sequence, or path, and it survives renaming identifiers.
- Being static or slow is not a reason to delete. A baseline failure may be a product bug: reproduce it and repair the owner. Never delete a test because it fails.

## Candidate evidence

Discovery is read-only. Report candidates before editing.

- Before proposing a deletion, read the full test, the production owner, its entry points, callers and callees, sibling tests, overlapping proof, how CI runs it, and its git history. For claims about a dependency, read the dependency's source or types. Read the root and scoped agent instructions and any [per-repo override](../SKILL.md#per-repo-overrides).
- Record for each candidate:
  - the exact test name and location, and the failure it can detect;
  - non-test callers of the production or support code it covers;
  - the stronger proof that remains, or why none is needed;
  - why the test exists, from history, and what deleting it unlocks;
  - the risk, and the focused command that validates the change.
- Missing evidence means no deletion. Prefer a few high-confidence candidates over many weak ones. Independent owners can be investigated in parallel.
- Delete obsolete seams and dead paths along with their tests. Move retained regressions to the owner's suite, and consolidate generic package or dependency contracts.
- Prefer a net reduction in production code. Never add tests that reimplement the code under test, and never turn uncertainty into cleanup.

## Validation and handoff

- Do not edit files while a test watcher or long test run is using the same checkout.
- Run the focused tests for each touched owner and its siblings, using the repo's commands from [discovery](../SKILL.md#discover-the-repo-first). Then run the repo's broader gate, such as `hk check`.
- When you remove source greps or plan assertions, exercise the real executable or its dry-run mode instead.
- Run the formatter on changed files and `git diff --check`.
- Removing tests can orphan support files, fixtures, exports, and dependencies. Run the repo's dead-code tools if it has them (see [stacks.md](stacks.md)); ordinary PR CI often misses these.
- Review `git diff --numstat` to compare production and test line changes.
- Report causes, removed categories and seams, false positives you kept, proof and its cost, production versus test and support lines, PR state, and follow-ups.
- Commit, push, or merge only with the human's authority for this task. Before another audit batch, update from the default branch and redo discovery.
