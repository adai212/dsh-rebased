export const GitOperationKind = Object.freeze({
  Status: "status",
  Diff: "diff",
  Stage: "stage",
  Commit: "commit",
  Branch: "branch",
  Fetch: "fetch",
  Pull: "pull",
  Push: "push",
  Log: "log",
});

export const GitRepositoryState = Object.freeze({
  Unknown: "unknown",
  MissingGit: "missing-git",
  NoRepository: "no-repository",
  Clean: "clean",
  Dirty: "dirty",
  Conflicted: "conflicted",
  Operating: "operating",
});

export function createEmptyRepositorySnapshot(root = null) {
  const emptyGroups = Object.freeze({
    conflicted: Object.freeze([]),
    staged: Object.freeze([]),
    unstaged: Object.freeze([]),
    untracked: Object.freeze([]),
    renamed: Object.freeze([]),
    deleted: Object.freeze([]),
  });

  return Object.freeze({
    id: null,
    root,
    state: GitRepositoryState.Unknown,
    branch: null,
    head: null,
    upstream: null,
    counts: Object.freeze({
      staged: 0,
      unstaged: 0,
      untracked: 0,
      conflicted: 0,
    }),
    changes: Object.freeze({
      groups: emptyGroups,
      total: 0,
      sampleLimit: 500,
    }),
    repositories: Object.freeze([]),
    capabilities: Object.freeze({
      hasRemote: false,
      hasUpstream: false,
      isShallow: false,
      isBare: false,
      isSubmodule: false,
    }),
    operation: null,
  });
}
