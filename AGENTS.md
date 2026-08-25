# Project Rules

## Repository Layout

- `D:\AI\dsh-rebased\dsh-rebased` is the implementation target for the DSH Git plugin.
- `D:\AI\dsh-rebased\rebased` is a read-only reference checkout of JetBrains Rebased / IntelliJ Git and VCS implementation.

## Hard Constraints

- Do not edit, format, delete, move, generate files into, or otherwise modify anything under `D:\AI\dsh-rebased\rebased`.
- The `rebased` directory may only be used for reading code, inspecting architecture, and deriving implementation ideas.
- `DSH-better-sidebar` (`https://github.com/omdsh-dev/DSH-better-sidebar`) is the user's previously mentioned DSH plugin reference. Its code may be read when needed, but must not be edited, formatted, deleted, moved, or otherwise modified.
- New source code, documentation, tests, examples, and generated assets for the DSH plugin must live under `D:\AI\dsh-rebased\dsh-rebased` unless the user explicitly requests another path.
- Do not copy large JetBrains source files verbatim. Reimplement behavior in a DSH-appropriate shape and keep attribution/licensing considerations explicit when using reference ideas.
- After modifying code or files, do not proactively run compile, test, build, lint, preview, or dev-server commands unless the user explicitly asks for those commands.

## Product Direction

The project goal is to replace the hard-to-use Git module in `dsh-better-sidebar` with a JetBrains-quality DSH Git plugin. The plugin should prioritize practical IDE workflows: repository state, changes, staging, branch switching, commit, log, diff, fetch/pull/push, conflict handling, and progressive support for more advanced Git operations.

## Delivery Workflow

- Implement one functional capability at a time.
- After completing each capability, stop and provide a focused manual test checklist for the user.
- Do not continue to the next capability until the user has manually tested the current one and confirmed the result.
- The checklist must state what should be tested in DSH, what the expected visible behavior is, and any known limitations of that increment.
