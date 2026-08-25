# dsh-rebased Roadmap

## Goal

Build a DSH Git plugin that provides the everyday Git experience users expect from JetBrains IDEs: clear repository state, reliable changes/staging, strong branch workflows, useful commit/log/diff views, and safe remote operations.

The reference implementation lives in `D:\AI\dsh-rebased\rebased` and is read-only. Relevant reference areas include:

- `plugins/git4idea/shared/src`: shared repository, branch, ref, RPC, UI model concepts.
- `plugins/git4idea/backend/src`: Git commands, repository tracking, branch actions, staging, commit, push/pull/fetch, merge/rebase/conflict flows.
- `plugins/git4idea/frontend/src`: toolbar/widget integration and quick actions.
- `platform/vcs-api`, `platform/vcs-impl`, `platform/dvcs-*`, `platform/diff-*`, `platform/vcs-log`: generic VCS, diff, and log abstractions to emulate at a smaller DSH scale.

## Design Principles

- Plugin first: ship as a DSH plugin, with internal core modules kept decoupled enough to test and evolve safely.
- Git CLI compatible: use installed Git as the execution backend first; keep room for later libgit integration only where it materially improves UX or performance.
- State model before UI: make repository status, branches, changes, logs, and operations observable and testable without DSH.
- Multi-root ready: support one or many repositories from the start, even if the first UI embeds a single-root mode.
- Safe operations: preview destructive operations, surface conflicts clearly, and support abort/continue/resume where Git supports it.
- Incremental parity: match JetBrains workflows by priority, not by copying every implementation detail.

## Delivery Rule

Each functional capability is a separate delivery checkpoint. After one capability is implemented, development pauses and the user receives a manual DSH test checklist. Work on the next capability starts only after the user confirms that the current capability works or reports what failed.

Each checkpoint must include:

- What to open or click in DSH.
- What repository/file state to prepare.
- Expected visible behavior.
- Expected command/output side effects, if any.
- Known limitations for that increment.

Progress must be recorded in `PROGRESS.md` after every checkpoint. A new session must read `PROGRESS.md` before planning or coding so already completed capabilities are not repeated.

## Priority 0: Foundation

1. Project skeleton
   - Package layout for `core`, `cli`, `state`, `operations`, `ui-model`, and `dsh-plugin`.
   - Public API boundary for host applications.
   - Internal event bus or observable store for repository changes.
   - Error model that distinguishes user errors, Git errors, auth errors, conflicts, and unexpected process failures.

2. Git process layer
   - Git executable discovery and version detection.
   - Command runner with cwd, env, stdin, cancellation, timeout, progress, and structured output capture.
   - Output parsers for porcelain/status/log/branch/remote commands.
   - Windows path handling and encoding strategy.
   - Redaction for credentials and tokens in logs.

3. Repository discovery and identity
   - Detect Git roots from workspace folders and nested repositories.
   - Read `.git`, worktrees, bare repo edge cases, submodules, and shallow repo flags.
   - Stable repository IDs for DSH state persistence.
   - Root-level capabilities: has remote, has upstream, is shallow, is detached, is merging/rebasing/cherry-picking/reverting.

## Priority 1: Everyday Local Changes

1. Repository state tracker
   - Current branch/ref, HEAD hash, upstream, ahead/behind placeholders.
   - File status refresh with debounce and explicit refresh.
   - Dirty scope tracking so large repos do not require full status on every file event.
   - Operation lock/state so UI can disable conflicting actions.

2. Changes model
   - Staged, unstaged, untracked, ignored, renamed, deleted, and conflicted file groups.
   - Multi-root grouping and path grouping.
   - Selection model suitable for sidebar embedding.
   - Lightweight status summaries for badges and toolbar widgets.

3. Staging operations
   - Stage/unstage selected files.
   - Stage/unstage all.
   - Stage intent-to-add for new files where useful.
   - Revert local unstaged changes with confirmation data for UI.
   - Delete untracked files only behind explicit confirmation.

4. Diff data
   - Working tree vs index, index vs HEAD, file vs HEAD, and file vs arbitrary ref.
   - Text diff hunks with rename and binary file metadata.
   - API for opening DSH diff UI without coupling core to rendering.
   - Later extension point for partial hunk/line staging.

## Priority 2: Commit Workflow

1. Commit model
   - Commit message draft per repository/workspace.
   - Author/committer data from Git config.
   - Amend mode.
   - Empty commit and no-verify options as explicit advanced options.

2. Commit operation
   - Commit staged files.
   - Commit selected files by staging temporarily when needed.
   - Commit all tracked changes option.
   - Parse commit result and expose new hash.
   - Preserve message draft on failure.

3. Commit UX support
   - Validation: empty message, no changes, merge commit constraints, unresolved conflicts.
   - Commit template loading.
   - Recent messages.
   - Optional commit-and-push executor.

## Priority 3: Branches And Refs

1. Branch/ref inventory
   - Local branches, remote branches, tags, HEAD, detached state.
   - Favorite/recent branches.
   - Tracking relationship and upstream display.
   - Branch tree/filter model similar to JetBrains branch popup, simplified for DSH.

2. Branch operations
   - Checkout local branch.
   - Checkout remote as local.
   - Create branch from HEAD or selected commit.
   - Rename local branch.
   - Delete local branch with merged/unmerged warning.
   - Compare branch with current branch.

3. Incoming/outgoing state
   - Ahead/behind calculation.
   - Incoming/outgoing badges in branch list.
   - Background refresh strategy that does not block sidebar rendering.

## Priority 4: Remote Operations

1. Remotes
   - List, add, edit, remove remotes.
   - Detect default remote and upstream push target.
   - Normalize and display remote URLs safely.

2. Fetch
   - Fetch current remote and all remotes.
   - Fetch tags mode.
   - Progress reporting and cancellation.
   - Shallow repo unshallow action.

3. Pull/update
   - Pull with merge.
   - Pull with rebase.
   - Fast-forward-only option.
   - Auto-stash policy hook.
   - Conflict and unfinished operation handling.

4. Push
   - Push current branch.
   - Set upstream on first push.
   - Push tags as optional mode.
   - Rejected push handling with suggested fetch/update path.
   - Force-with-lease as explicit advanced action, never as a default.

## Priority 5: Log And History

1. Log provider
   - Paginated commit log.
   - Branch/ref decorations.
   - Author, date, subject, body, parents, changed files.
   - Search by text, author, path, branch, hash, and date.

2. Graph model
   - Linear log first.
   - Commit graph lanes and merges after basic log is stable.
   - Multi-root log grouping.

3. History actions
   - Show file history.
   - Compare commit with working tree.
   - Compare two commits.
   - Create branch/tag from commit.
   - Checkout revision with detached HEAD warning.

## Priority 6: Conflict, Merge, Rebase, Cherry-pick

1. Operation state detection
   - Detect merge, rebase, cherry-pick, revert, bisect, and detached states.
   - Expose continue/abort/skip availability.
   - Surface conflict file list in the state model.

2. Merge workflow
   - Merge selected branch/ref.
   - Merge options: no-ff, squash, no-commit where supported.
   - Resolve conflicts action hooks into DSH merge/diff UI.
   - Abort merge.

3. Rebase workflow
   - Rebase current branch onto selected branch/ref.
   - Continue, abort, skip.
   - Auto-stash integration.
   - Interactive rebase can come later after log and commit editing are reliable.

4. Cherry-pick and revert
   - Cherry-pick selected commit.
   - Revert selected commit.
   - Continue/abort flows.
   - Clear messaging for empty commits and conflicts.

## Priority 7: Stash, Shelf, Patch

1. Stash
   - Create stash with message.
   - Include untracked option.
   - List stashes.
   - Apply, pop, drop, show stash diff.

2. Patch support
   - Create patch from selected changes.
   - Apply patch with preview.
   - Export selected commit patch.

3. DSH-local shelf equivalent
   - Optional local shelf abstraction if DSH needs IDE-style change shelving beyond raw Git stash.

## Priority 8: Advanced Repository Features

1. Worktrees
   - Detect existing worktrees.
   - Create worktree from branch/tag/commit.
   - Open worktree in DSH.
   - Prune stale worktrees.

2. Submodules
   - Detect submodules.
   - Update/init/deinit actions.
   - Status aggregation in parent repository.

3. Ignore and attributes
   - Add file/path to `.gitignore`.
   - Show ignored files.
   - Read basic attributes where diff/status behavior depends on them.

4. Annotation/blame
   - File annotation provider.
   - Commit tooltip/details lookup.
   - Open commit in log from annotation.

## Priority 9: DSH Plugin Integration

1. Plugin API
   - DSH plugin lifecycle: activate workspace, deactivate workspace, dispose.
   - UI model subscriptions for sidebar, toolbar, command palette, and diff/log views.
   - Command registration data: labels, icons, enabled states, confirmations.

2. Sidebar integration
   - Repository selector.
   - Branch widget.
   - Changes tree with staged/unstaged/conflicted groups.
   - Inline actions for stage, unstage, diff, revert, commit, pull, push.
   - Empty states for no repo, clean repo, Git missing, auth required, and unfinished operation.

3. Host services
   - Notification bridge.
   - Confirmation dialog bridge.
   - Secret/auth bridge.
   - File watcher bridge.
   - Diff/editor opener bridge.
   - Persistent settings bridge.

4. Plugin packaging
   - DSH plugin manifest and activation points.
   - Extension points for sidebar contribution, commands, status widgets, diff/log views, and settings.
   - Compatibility strategy for replacing or coexisting with the current `dsh-better-sidebar` Git module during migration.

## Priority 10: Quality, Performance, And Packaging

1. Tests
   - Git command parser unit tests using recorded output fixtures.
   - Temporary-repo integration tests for core operations.
   - Windows path and encoding tests.
   - State transition tests for merge/rebase/cherry-pick conflicts.

2. Performance
   - Debounced refresh.
   - Command cancellation.
   - Incremental status refresh where feasible.
   - Log pagination and cache.
   - Large untracked directories handling.

3. Packaging
   - Public API documentation.
   - Typed exports.
   - Minimal DSH plugin integration example.
   - Versioning and changelog policy.

## Suggested Delivery Milestones

1. MVP Local Git
   - Foundation, Git process layer, repository discovery, status, staged/unstaged/untracked groups, stage/unstage, diff data, commit staged changes.

2. Daily IDE Workflow
   - Branch list/switch/create/delete, fetch, pull, push, ahead/behind, commit-and-push, basic log.

3. Safe Recovery Workflow
   - Conflict detection, merge/rebase/cherry-pick/revert continue/abort, stash, patch export/apply.

4. JetBrains-grade Navigation
   - Graph log, file history, branch compare, annotation, branch dashboard refinements.

5. Power Features
   - Worktrees, submodules, interactive rebase, partial hunk/line staging, richer remote hosting hooks.
