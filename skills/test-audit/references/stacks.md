# Stack guide

Per-stack notes for the commands, seams, and tools this skill refers to. Always prefer the repo's own wrapper (hk step, mise task, package script, `bin/` script) when one exists, and run tools through `mise exec --` when the repo pins them with mise. Repo rules from a [per-repo override](../SKILL.md#per-repo-overrides) win over anything here.

## Table tests in any language

Cover variations of one contract as rows of one test, not as copies of the test.

```ts
test.each([
  { input: "", expected: "empty" },
  { input: "a", expected: "ok" },
])("classify($input)", ({ input, expected }) => {
  expect(classify(input)).toBe(expected);
});
```

```ruby
{ "" => "empty", "a" => "ok" }.each do |input, expected|
  test "classify(#{input.inspect})" do
    assert_equal expected, classify(input)
  end
end
```

## Vitest

- Focused runs: `vitest run path/to/file.test.ts`, `vitest run -t "name pattern"`, `vitest related src/changed.ts --run` for tests that import a changed file, and `--project <name>` in a workspace. Add `path:line` to run one test.
- Typical test-only seams: exported internals or `__resetForTests` helpers, `vi.mock` of the module under test or of a collaborator whose behavior is then asserted, `vi.spyOn` call-shape assertions that duplicate boundary proof, and snapshots of large objects nobody reviews.
- Prefer a real boundary with fakes at the edge, for example an HTTP fixture server or `msw`, over mocking internal modules.
- Dead-code tools: [knip](https://knip.dev) for unused files, exports, and dependencies (`knip`, `knip --include files,exports,dependencies`). TypeScript `noUnusedLocals` and `noUnusedParameters` catch leftovers inside files.

## bun test

- Focused runs: `bun test path/to/file.test.ts`, `bun test -t "name pattern"` (alias of `--test-name-pattern`), `--bail` to stop on the first failure, and `--rerun-each <n>` to shake out flakiness. `test.only` runs with `--only`.
- Typical test-only seams: `mock.module` replacing the module under test, `spyOn` call-shape assertions, and test-only exports or reset functions.
- `test.each` and `describe.each` work as in Vitest.
- Dead-code tools: knip supports Bun projects. Use `tsc --noEmit` or the repo's typecheck script for unused locals.

## Rails minitest

- Focused runs: `bin/rails test test/models/user_test.rb`, `bin/rails test test/models/user_test.rb:42` for one test, `bin/rails test -n /pattern/`, and `bin/rails test:system` for system tests. Some repos wrap these in `bin/ci`, `Rakefile` tasks, or mise tasks.
- Typical test-only seams: `attr_writer` or `attr_accessor` that only tests use, `Rails.env.test?` branches in app code, `instance_variable_set` or `send` to reach private state, stubs (`stub`, `Minitest::Mock`) that supply the behavior being asserted, and fixtures that encode records the code is supposed to create.
- Prefer request and integration tests at the HTTP boundary over controller internals, and model tests against the real database over stubbed Active Record.
- Browser and system tests: use Playwright, for example through `capybara-playwright-driver`, or agent-browser. Do not add Selenium.
- Dead-code tools: [debride](https://github.com/seattlerb/debride) for unused methods and [traceroute](https://github.com/amatsuda/traceroute) for unused routes and actions, if the repo has them. Treat their output as candidates that still need [evidence](audit.md#candidate-evidence); Rails calls many methods by convention.

## Playwright

- Focused runs: `playwright test path/to/spec.ts`, `playwright test path/to/spec.ts:42`, `-g "title pattern"`, `--project <name>`, `--last-failed`, and `--repeat-each <n>` for flakiness. Run through the repo's script or `bunx`/`npx` with the pinned version.
- Typical test-only seams: test-only routes, query flags, or `window` hooks shipped in production code; fixed sleeps (`waitForTimeout`) instead of web-first assertions; and assertions on CSS classes or DOM structure instead of what the user sees. Role- and label-based locators are preferred; a stable `data-testid` is acceptable.
- Each end-to-end test should own a user flow that lower layers cannot prove. Do not replay unit-level edge cases through the browser.
- Dead-code tools: knip understands Playwright configs, so unused page objects and fixtures show up in its report.
