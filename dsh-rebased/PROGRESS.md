# dsh-rebased Progress

This file is the project handoff ledger. Read it before starting new work, and update it after every capability checkpoint.

## Status Legend

- `planned`: not started.
- `in-progress`: currently being implemented.
- `implemented`: code/doc changes are in place, waiting for manual DSH testing.
- `confirmed`: user manually tested and accepted the checkpoint.
- `blocked`: cannot proceed without new information or a failed manual check.

## Checkpoints

### 2026-08-25: Project Rules And Roadmap

- Status: implemented.
- Scope: documented reference-code constraints, DSH Git plugin direction, delivery workflow, and staged roadmap.
- Changed areas:
  - `D:\AI\dsh-rebased\AGENTS.md`
  - `D:\AI\dsh-rebased\README.md`
  - `D:\AI\dsh-rebased\dsh-rebased\README.md`
  - `D:\AI\dsh-rebased\dsh-rebased\ROADMAP.md`
- Manual test checklist: documentation review only.
- User confirmation: pending.

### 2026-08-25: DSH Plugin Scaffold

- Status: implemented.
- Scope: created a minimal DSH plugin package with host entry, client entry, core placeholders, UI model placeholders, and Cordis patch.
- Changed areas:
  - `D:\AI\dsh-rebased\dsh-rebased\package.json`
  - `D:\AI\dsh-rebased\dsh-rebased\cordis.patch.yml`
  - `D:\AI\dsh-rebased\dsh-rebased\lib\index.js`
  - `D:\AI\dsh-rebased\dsh-rebased\lib\client.js`
  - `D:\AI\dsh-rebased\dsh-rebased\lib\core\index.js`
  - `D:\AI\dsh-rebased\dsh-rebased\lib\core\contracts.js`
  - `D:\AI\dsh-rebased\dsh-rebased\lib\ui-model\index.js`
  - `D:\AI\dsh-rebased\dsh-rebased\lib\ui-model\sidebar.js`
  - `D:\AI\dsh-rebased\dsh-rebased\docs\DEVELOPMENT.md`
- Manual test checklist:
  - Restart DSH Desktop.
  - Confirm the desktop profile loads without a startup/plugin error.
  - Confirm a disabled `Git` entry appears in the sidebar footer area.
  - Confirm the entry displays `Plugin scaffold` or `插件框架`.
  - Confirm no real Git action is exposed yet.
- User confirmation: pending.

### 2026-08-25: Desktop Profile Development Link

- Status: implemented.
- Scope: prepared DSH Desktop profile to load the local plugin during development.
- Changed areas:
  - `C:\Users\98799\.dsh\profiles\desktop\package.json`
  - `C:\Users\98799\.dsh\profiles\desktop\cordis.patch.yml`
  - `C:\Users\98799\.dsh\profiles\desktop\pnpm-lock.yaml`
  - `C:\Users\98799\.dsh\profiles\desktop\node_modules\dsh-rebased`
- Verification already performed:
  - `node_modules\dsh-rebased` is a Junction pointing to `D:\AI\dsh-rebased\dsh-rebased`.
  - `npm.cmd run check:syntax` passed.
  - `npm.cmd run check:client-syntax` passed.
- Manual test checklist:
  - Restart DSH Desktop.
  - Confirm the `dsh-rebased` plugin loads from the desktop profile.
  - Confirm the visible scaffold entry appears in the sidebar footer area.
- User confirmation: pending.

## Next Planned Capability

Wait for user confirmation of the scaffold in DSH before starting the next capability.
