# Test-pruning campaign

Campaign mode prunes one subsystem's whole test surface in a single PR, for example one plugin, package, or core area. The authoring gate, retention bar, candidate evidence, and validation rules in [SKILL.md](SKILL.md) apply to every lane. This file adds the order of work and the lessons learned from full campaigns. Each step ends on its completion criterion; do not start the next step early.

## 1. Baseline

At a pinned commit on the default branch, record the subsystem's test and support line counts and the pass or fail state of every test file. Keep baseline failures in their own list. They are often real product bugs rather than stale tests.

Done when every in-scope test file has a recorded baseline result.

## 2. Lanes and inventory

Split the surface into **lanes** along production owner boundaries, not file name prefixes. Typical lanes are accounts, commands, inbound, outbound, persistence, transport, shared code, test harness, and end-to-end or live scenarios. Include the subsystem's cases in shared core suites and its end-to-end and QA harness tests.

Done when every test file and scenario the subsystem owns belongs to exactly one lane.

## 3. Read-only ledger per lane

Give each lane to its own read-only reviewer or agent. It reads every assigned test in full, including parameter tables, and the production owners with their entry points, callers, history, and CI routing. Each test declaration goes into a written **ledger** with one mark. A table or parametrized test counts as one declaration unless its rows need different marks; then mark each row.

- `R` retain: name the contract and the bug it catches. A retained test that only moves to a better-named file stays `R`, with the move noted.
- `F` fix: keep the contract but repair the assertion, such as a vacuous negative that passes when only one of several items is missing.
- `C` consolidate: name the owner that absorbs the assertion first, such as a sibling table row, a stronger boundary suite, or a shared owner in another package.
- `D` delete: name the proof that remains, or explain why no contract exists.

Judge a test by its assertions, not its name. A test named for clearing some state may in fact assert that the state was _not_ cleared.

Done when every declaration in the lane has a mark and a line of evidence.

## 4. Layer plan per lane

The per-test ledger is input, not the edit list. A second read-only pass starts from the ledger and looks for redundant **layers**: for example, several suites that replay the same shared component through one mocked collaborator, next to stronger suites that exercise the real stream or an HTTP fixture. Name the **keeper** suite for each contract. Prefer the real transport boundary with a fake network over a mocked collaborator. Correct any ledger errors this pass finds.

Done when each lane plan names its retired files, its keeper per contract, the assertions to carry into keepers, and the test-only production seams this unlocks.

## 5. Cutover

Edit lane by lane. Route changes to shared harnesses and support files through one owner so they do not conflict. With each lane, remove the test-only production seams it unlocks: injection parameters, getters, reset exports, and needless indirection. Register moved suites in CI routing and any test inventories, and update any line-count baselines that may only shrink. Record durable test-ownership rules in the subsystem's `AGENTS.md`, based on mistakes this campaign actually found.

Done when every lane plan is applied and each lane's keepers pass.

## 6. Preservation review

Before claiming completion, have independent reviewers compare the deleted coverage against the keepers, one reviewer per boundary group. They look for contracts that lost their only proof, and for new assertions that cannot fail, such as a rejection row the production code never reaches. Expect this review to find real gaps.

For each restored contract, make one deliberate **mutation** to the production owner and confirm the keeper fails. Then restore the source exactly.

Done when every reported gap is restored or rejected with source evidence, and every restored contract has a caught mutation.

## 7. Product defects

A baseline failure that survives into a keeper is a bug report. Fix it at its owner in a separate commit, and prove it through the real user flow with a **control** run: revert the fix and show the old behavior. Record unrelated product problems you find as follow-ups instead of fixing them in the campaign.

Done when each repaired defect has a failing control and a passing candidate on the same harness.

## 8. Reconcile and hand off

Campaigns outlive many commits on the default branch. Prefer merging the default branch over rebasing a long, many-commit campaign, unless the repo's rules say otherwise and the human agrees. When the default branch modified a file the campaign deleted, keep the deletion, port the new contract into the keeper, and confirm every new regression test still has a home. Let CI rerun the broad suite on the merged head. Locally, rerun only tests touched by the merge or that failed in CI, and repeat any end-to-end proof whose inputs the merge changed.

Review tools may show a truncated file list on a diff this large. Record decisions the humans make about compatibility flags in the PR description rather than editing the gates.

Hand off with the report described in [SKILL.md](SKILL.md), plus:

- baseline and final test and support line counts, with production counted separately;
- lanes, retired layers, and keepers;
- preservation gaps found and the mutations that proved them;
- product defects with their control and candidate proof.
