<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Agent Interface Documentation

Use the following contracts when invoking agents from orchestration code (for example via `Agent.run(input)` or `Agent.handleEvent(event)`).

### Agent: PrimaryCodingAgent

**Responsibilities**

- Implement or modify application code and configuration in this repository.
- Apply minimal, targeted edits and preserve existing behavior unless change is requested.
- Validate changed files (type/lint/build level checks where practical).

**Inputs**

- Task request (goal, constraints, acceptance criteria).
- Workspace context (target files, current errors/findings, runtime environment).
- Optional event payloads (`codeReviewFinding`, `bugReport`, `featureRequest`).

**Outputs**

- Code edits and updated files.
- Validation summary (what was checked, pass/fail, notable warnings).
- Brief skipped-findings summary when requested.

**Boundaries/Permissions**

- May read/edit repository files and run non-destructive local commands.
- May not run destructive git operations (for example reset/checkout hard) unless explicitly requested.
- Must not revert unrelated user changes.

**Errors/Failures**

- Missing required context (unknown target file, ambiguous acceptance criteria).
- Tooling/runtime limitations (missing dependency manager, unavailable command/tool).
- Validation blockers that require user decision.

**Examples**

- `PrimaryCodingAgent.run({ findingId: "F-12", action: "verify-and-fix" })`
- `PrimaryCodingAgent.handleEvent({ type: "codeReviewFinding", file: "lib/constants.ts", issue: "unsafe env access" })`

### Agent: ExploreAgent

**Responsibilities**

- Perform fast, read-only codebase discovery.
- Locate symbols/files/usages and return concise evidence paths.
- Support implementation agents with context before edits.

**Inputs**

- Search intent (`query`, `scope`, `thoroughness`: `quick | medium | thorough`).
- Optional include/exclude path filters.

**Outputs**

- Ranked list of relevant files/snippets.
- Key observations and confidence notes.

**Boundaries/Permissions**

- Read-only: may not edit files or execute destructive operations.
- Should avoid broad noisy output when a focused query is possible.

**Errors/Failures**

- No matches found for query.
- Ambiguous query returning low-confidence results.
- Workspace indexing/search unavailable.

**Examples**

- `ExploreAgent.run({ query: "where is upload form schema defined", thoroughness: "quick" })`
- `ExploreAgent.handleEvent({ type: "preEditDiscovery", target: "app/(root)/books/new/page.tsx" })`

### Agent: ExecutionAgent

**Responsibilities**

- Run one-shot project commands (install, build, test, lint) and summarize results.
- Return actionable failure excerpts instead of raw verbose logs.

**Inputs**

- Command intent (`install dependencies`, `run lint`, `run tests`).
- Execution constraints (working directory, timeout, command restrictions).

**Outputs**

- Executed command list.
- Exit status and concise output summary.
- Failure diagnostics with likely next actions.

**Boundaries/Permissions**

- May execute local shell commands needed for validation.
- May not run destructive operations unless explicitly requested.
- Must respect repository and user command restrictions.

**Errors/Failures**

- Command not found or dependency manager unavailable.
- Timeout/resource failures.
- Interactive prompt required but unresolved.

**Examples**

- `ExecutionAgent.run({ task: "npm run lint", cwd: "." })`
- `ExecutionAgent.handleEvent({ type: "postChangeValidation", checks: ["lint", "build"] })`
