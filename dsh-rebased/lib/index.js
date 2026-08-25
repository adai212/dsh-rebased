import { DshGitPluginRuntime } from "./core/index.js";

export const name = "dsh-rebased";
export const inject = [];

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
    ctx.logger?.info?.("[dsh-rebased] Git plugin scaffold mounted");
    return () => {
      runtime.dispose();
      ctx.logger?.info?.("[dsh-rebased] Git plugin scaffold disposed");
    };
  }, "dsh-rebased: host lifecycle");
}

export { DshGitPluginRuntime };
