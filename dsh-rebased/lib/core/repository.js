import { readdir, stat } from "node:fs/promises";
import { dirname, isAbsolute, join, resolve } from "node:path";

import { GitRepositoryState } from "./contracts.js";
import { GitCommandError, detectGitExecutable, runGit } from "./git-process.js";

const DISCOVERY_LIMIT = 200;
const DISCOVERY_TIMEOUT_MS = 5_000;
const STATUS_TIMEOUT_MS = 15_000;
const STATUS_LIMIT = 2_000;

export function createRepositoryId(root) {
  const normalized = pathIdentity(root);
  return `git:${Buffer.from(normalized, "utf8").toString("base64url")}`;
}

export function pathIdentity(path) {
  const normalized = resolve(path).replace(/[\\/]+$/, "");
  return process.platform === "win32" ? normalized.toLowerCase() : normalized;
}

function uniquePaths(paths) {
  const seen = new Set();
  const roots = [];
  for (const path of paths) {
    const identity = pathIdentity(path);
    if (seen.has(identity)) continue;
    seen.add(identity);
    roots.push(path);
  }
  return roots;
}

async function gitText(cwd, args, options = {}) {
  const result = await runGit(args, { cwd, timeoutMs: options.timeoutMs ?? STATUS_TIMEOUT_MS });
  return result.stdout.trim();
}

async function tryGitText(cwd, args, fallback = null, options = {}) {
  try {
    return await gitText(cwd, args, options);
  } catch {
    return fallback;
  }
}

async function directRepoRoot(cwd) {
  try {
    return await gitText(cwd, ["rev-parse", "--show-toplevel"], { timeoutMs: DISCOVERY_TIMEOUT_MS });
  } catch (error) {
    if (error instanceof GitCommandError && error.code === "missing-git") throw error;
    const bare = await tryGitText(cwd, ["rev-parse", "--is-bare-repository"], "false", { timeoutMs: DISCOVERY_TIMEOUT_MS });
    if (bare === "true") return resolve(cwd);
    throw error;
  }
}

export async function discoverRepositoryRoots(cwd) {
  try {
    return [await directRepoRoot(cwd)];
  } catch (error) {
    if (error instanceof GitCommandError && error.code === "missing-git") throw error;
  }

  const entries = await readdir(cwd, { withFileTypes: true }).catch(() => []);
  const roots = [];
  for (const entry of entries
    .filter((candidate) => candidate.isDirectory() && !candidate.name.startsWith(".") && candidate.name !== "node_modules")
    .sort((left, right) => left.name.localeCompare(right.name))
    .slice(0, DISCOVERY_LIMIT)) {
    try {
      roots.push(await directRepoRoot(join(cwd, entry.name)));
    } catch {
      // Ordinary child directory; keep scanning sibling repositories.
    }
  }
  return uniquePaths(roots);
}

function parsePorcelainZ(output) {
  const entries = [];
  const tokens = output.split("\0");
  let index = 0;

  while (index < tokens.length) {
    const token = tokens[index];
    index += 1;
    if (!token) continue;

    const xy = token.slice(0, 2);
    const path = token.slice(3);
    entries.push({ xy, path });

    if ((xy[0] === "R" || xy[0] === "C") && tokens[index]) {
      index += 1;
    }
  }

  return entries;
}

function summarizeStatus(entries) {
  const counts = {
    staged: 0,
    unstaged: 0,
    untracked: 0,
    conflicted: 0,
  };

  for (const entry of entries) {
    const index = entry.xy[0];
    const worktree = entry.xy[1];

    if (entry.xy === "??") {
      counts.untracked += 1;
      continue;
    }

    if (index === "U" || worktree === "U" || (index === "A" && worktree === "A") || (index === "D" && worktree === "D")) {
      counts.conflicted += 1;
      continue;
    }

    if (index !== " " && index !== "?") counts.staged += 1;
    if (worktree !== " " && worktree !== "?") counts.unstaged += 1;
  }

  return Object.freeze(counts);
}

function repositoryStateFromCounts(counts) {
  if (counts.conflicted > 0) return GitRepositoryState.Conflicted;
  if (counts.staged + counts.unstaged + counts.untracked > 0) return GitRepositoryState.Dirty;
  return GitRepositoryState.Clean;
}

async function resolveGitDir(root) {
  const gitDir = await gitText(root, ["rev-parse", "--git-dir"]);
  return isAbsolute(gitDir) ? gitDir : resolve(root, gitDir);
}

async function resolveCommonGitDir(root) {
  const gitDir = await gitText(root, ["rev-parse", "--git-common-dir"]);
  return isAbsolute(gitDir) ? gitDir : resolve(root, gitDir);
}

async function firstExisting(paths) {
  for (const path of paths) {
    if (await stat(path).then(() => true).catch(() => false)) return path;
  }
  return null;
}

async function operationState(root) {
  const gitDir = await resolveGitDir(root).catch(() => null);
  const commonGitDir = await resolveCommonGitDir(root).catch(() => gitDir);
  if (gitDir === null) return Object.freeze({ operation: null, operationPath: null });

  const probes = [
    { operation: "merge", path: join(gitDir, "MERGE_HEAD") },
    { operation: "rebase", path: join(gitDir, "rebase-merge") },
    { operation: "rebase", path: join(gitDir, "rebase-apply") },
    { operation: "cherry-pick", path: join(gitDir, "CHERRY_PICK_HEAD") },
    { operation: "revert", path: join(gitDir, "REVERT_HEAD") },
    { operation: "bisect", path: join(commonGitDir ?? gitDir, "BISECT_LOG") },
  ];

  for (const probe of probes) {
    if ((await firstExisting([probe.path])) !== null) {
      return Object.freeze({ operation: probe.operation, operationPath: probe.path });
    }
  }

  return Object.freeze({ operation: null, operationPath: null });
}

async function repositoryCapabilities(root, upstream) {
  const [remotes, shallow, bare, superproject] = await Promise.all([
    tryGitText(root, ["remote"], ""),
    tryGitText(root, ["rev-parse", "--is-shallow-repository"], "false"),
    tryGitText(root, ["rev-parse", "--is-bare-repository"], "false"),
    tryGitText(root, ["rev-parse", "--show-superproject-working-tree"], ""),
  ]);

  return Object.freeze({
    hasRemote: remotes.split(/\r?\n/).some(Boolean),
    hasUpstream: upstream !== null && upstream !== "",
    isShallow: shallow === "true",
    isBare: bare === "true",
    isSubmodule: superproject !== "",
  });
}

async function currentBranch(root) {
  const branch = await tryGitText(root, ["symbolic-ref", "--short", "-q", "HEAD"], null);
  if (branch !== null && branch !== "") return branch;
  return "HEAD";
}

async function createRepositorySnapshot(root, allRoots) {
  const [branch, head, upstream, statusRaw, operation] = await Promise.all([
    currentBranch(root),
    tryGitText(root, ["rev-parse", "--short=12", "HEAD"], null),
    tryGitText(root, ["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}"], null),
    runGit(["status", "--porcelain=v1", "-z", "--untracked-files=all"], { cwd: root, timeoutMs: STATUS_TIMEOUT_MS }).catch((error) => ({ stdout: "", error })),
    operationState(root),
  ]);

  const capabilities = await repositoryCapabilities(root, upstream);
  if (statusRaw.error !== undefined && capabilities.isBare !== true) throw statusRaw.error;

  const entries = parsePorcelainZ(statusRaw.stdout);
  const truncated = entries.length > STATUS_LIMIT;
  const counts = summarizeStatus(entries);
  const state = operation.operation !== null ? GitRepositoryState.Operating : repositoryStateFromCounts(counts);

  return Object.freeze({
    id: createRepositoryId(root),
    root,
    state,
    branch,
    head,
    upstream,
    counts,
    repositories: Object.freeze(allRoots.map((candidate) => Object.freeze({ id: createRepositoryId(candidate), root: candidate }))),
    capabilities,
    operation: operation.operation,
    sampleChanges: Object.freeze(entries.slice(0, 20).map((entry) => Object.freeze({ path: entry.path, status: entry.xy }))),
    truncated,
  });
}

export async function createGitWorkspaceSnapshot(cwd) {
  const git = await detectGitExecutable();
  if (!git.available) {
    return Object.freeze({
      git,
      repository: Object.freeze({
        root: null,
        state: GitRepositoryState.MissingGit,
        branch: null,
        head: null,
        upstream: null,
        counts: Object.freeze({ staged: 0, unstaged: 0, untracked: 0, conflicted: 0 }),
      }),
    });
  }

  let roots;
  try {
    roots = await discoverRepositoryRoots(cwd);
  } catch (error) {
    if (error instanceof GitCommandError && error.code === "missing-git") {
      return Object.freeze({
        git,
        repository: Object.freeze({
          root: null,
          state: GitRepositoryState.MissingGit,
          branch: null,
          head: null,
          upstream: null,
          counts: Object.freeze({ staged: 0, unstaged: 0, untracked: 0, conflicted: 0 }),
        }),
      });
    }
    throw error;
  }

  if (roots.length === 0) {
    return Object.freeze({
      git,
      repository: Object.freeze({
        root: null,
        state: GitRepositoryState.NoRepository,
        branch: null,
        head: null,
        upstream: null,
        counts: Object.freeze({ staged: 0, unstaged: 0, untracked: 0, conflicted: 0 }),
        repositories: Object.freeze([]),
      }),
    });
  }

  return Object.freeze({
    git,
    repository: await createRepositorySnapshot(roots[0], roots),
    cwd,
  });
}

export function parentOf(path) {
  const parent = dirname(path);
  return parent === path ? null : parent;
}
