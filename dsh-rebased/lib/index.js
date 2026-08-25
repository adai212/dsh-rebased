import { DshGitPluginRuntime } from "./core/index.js";
import { registerHostApi } from "./host-api.js";

export const name = "dsh-rebased";
export const inject = ["webServer", "sessions"];

const DEFAULT_CONFIG = Object.freeze({
  enabled: true,
  registerSidebarEntry: true,
});

export function normalizeConfig(config = {}) {
  return Object.freeze({
    enabled: config.enabled !== false,
    registerSidebarEntry: config.registerSidebarEntry !== false,
  });
}

export function apply(ctx, config = {}) {
  const resolved = normalizeConfig(config);
  if (!resolved.enabled) {
    ctx.logger?.info?.("[dsh-rebased] Git plugin scaffold disabled by config");
    return;
  }

  const runtime = new DshGitPluginRuntime(resolved);

  ctx.effect(() => {
    const disposeApi = registerHostApi(ctx);
    runtime.markReady();
    ctx.logger?.info?.("[dsh-rebased] Git repository status API mounted");
    return () => {
      disposeApi();
      runtime.dispose();
      ctx.logger?.info?.("[dsh-rebased] Git repository status API disposed");
    };
  }, "dsh-rebased: host repository status API");
}

export { DshGitPluginRuntime };
