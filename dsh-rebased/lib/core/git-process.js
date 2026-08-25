import { spawn } from "node:child_process";

export class GitCommandError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "GitCommandError";
    this.code = code;
    this.command = details.command ?? null;
    this.cwd = details.cwd ?? null;
    this.exitCode = details.exitCode ?? null;
    this.stderr = details.stderr ?? "";
  }
}

export function runGit(args, options = {}) {
  const cwd = options.cwd ?? process.cwd();
  const timeoutMs = options.timeoutMs ?? 30_000;
  const command = ["git", ...args].join(" ");

  return new Promise((resolve, reject) => {
    const child = spawn("git", args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
      env: {
        ...process.env,
        GIT_OPTIONAL_LOCKS: "0",
        GIT_TERMINAL_PROMPT: "0",
      },
    });

    let stdout = "";
    let stderr = "";
    let settled = false;

    const finish = (callback) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      callback();
    };

    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      finish(() => {
        reject(new GitCommandError("git-timeout", `git timed out after ${timeoutMs}ms`, { command, cwd }));
      });
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString("utf8");
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString("utf8");
    });

    child.on("error", (error) => {
      finish(() => {
        const code = error && error.code === "ENOENT" ? "missing-git" : "git-process-error";
        reject(new GitCommandError(code, error.message, { command, cwd, stderr }));
      });
    });

    child.on("close", (exitCode) => {
      finish(() => {
        if (exitCode === 0) {
          resolve({
            stdout,
            stderr,
            exitCode,
            command,
            cwd,
          });
          return;
        }

        reject(
          new GitCommandError("git-error", stderr.trim() || `git exited with ${String(exitCode)}`, {
            command,
            cwd,
            exitCode,
            stderr,
          }),
        );
      });
    });
  });
}

export async function detectGitExecutable() {
  try {
    const result = await runGit(["--version"], { timeoutMs: 5_000 });
    const versionText = result.stdout.trim();
    return Object.freeze({
      available: true,
      versionText,
      version: versionText.replace(/^git version\s+/i, "") || null,
    });
  } catch (error) {
    if (error instanceof GitCommandError && error.code === "missing-git") {
      return Object.freeze({
        available: false,
        versionText: null,
        version: null,
        error: error.message,
      });
    }
    throw error;
  }
}
