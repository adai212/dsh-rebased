export const PluginPhase = Object.freeze({
  Scaffold: "scaffold",
  Ready: "ready",
  Disposed: "disposed",
});

export class DshGitPluginRuntime {
  #config;
  #phase = PluginPhase.Scaffold;

  constructor(config) {
    this.#config = config;
  }

  getSnapshot() {
    return Object.freeze({
      phase: this.#phase,
      capabilities: Object.freeze(["git-executable", "repository-discovery", "repository-status", "changes-model"]),
      config: this.#config,
    });
  }

  markReady() {
    if (this.#phase !== PluginPhase.Disposed) {
      this.#phase = PluginPhase.Ready;
    }
  }

  dispose() {
    this.#phase = PluginPhase.Disposed;
  }
}

export class GitPluginError extends Error {
  constructor(code, message, options) {
    super(message, options);
    this.name = "GitPluginError";
    this.code = code;
  }
}

export { GitCommandError, detectGitExecutable, runGit } from "./git-process.js";
export { createGitWorkspaceSnapshot, createRepositoryId, discoverRepositoryRoots } from "./repository.js";
