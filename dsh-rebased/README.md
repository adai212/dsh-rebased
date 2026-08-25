# dsh-rebased

DSH Git plugin inspired by JetBrains Rebased / IntelliJ Git UX and architecture.

This repository currently contains the first read-only Git status increment. It registers:

- a DSH host plugin entry (`lib/index.js`)
- a DSH browser client entry (`lib/client.js`)
- a host JSON API for Git executable detection and repository status snapshots
- a core Git process and repository discovery layer
- a read-only changes model with staged, unstaged, untracked, renamed, deleted, and conflicted groups
- a visible `Git` sidebar footer entry that reads the active session repository state and opens the changes view

See `ROADMAP.md` for the staged implementation plan and `docs/DEVELOPMENT.md` for how to check, preview, and install the plugin locally.
