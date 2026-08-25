window.__ModuleLoader__.load({
  id: "dsh-rebased",
  factory: (require) => {
    const module = { exports: {} };
    const exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

    const React = require("react");

    const NS = "dsh-rebased";
    const STYLE_ID = "dsh-rebased/sidebar-entry";

    const inject = ["slots", "locale", "sessions"];

    const zh = {
      "sidebar.git": "Git",
      "sidebar.status": "读取仓库状态",
      "sidebar.title": "dsh-rebased Git 仓库状态",
      "status.loading": "正在读取",
      "status.noSession": "无当前会话",
      "status.missingGit": "未找到 Git",
      "status.noRepository": "不是 Git 仓库",
      "status.clean": "干净",
      "status.dirty": "有改动",
      "status.conflicted": "有冲突",
      "status.operating": "操作进行中",
      "status.unknown": "状态未知",
      "status.error": "读取失败",
      "count.staged": "暂存",
      "count.unstaged": "未暂存",
      "count.untracked": "未跟踪",
      "count.conflicted": "冲突",
    };

    const en = {
      "sidebar.git": "Git",
      "sidebar.status": "Read repository state",
      "sidebar.title": "dsh-rebased Git repository state",
      "status.loading": "Loading",
      "status.noSession": "No active session",
      "status.missingGit": "Git not found",
      "status.noRepository": "Not a Git repository",
      "status.clean": "Clean",
      "status.dirty": "Changes",
      "status.conflicted": "Conflicts",
      "status.operating": "Operation running",
      "status.unknown": "Unknown state",
      "status.error": "Failed to read",
      "count.staged": "staged",
      "count.unstaged": "unstaged",
      "count.untracked": "untracked",
      "count.conflicted": "conflicted",
    };

    function tOrFallback(t, key, fallback) {
      return typeof t === "function" ? t(key) : fallback;
    }

    function ensureStyles() {
      if (typeof document === "undefined") return;
      if (document.querySelector(`style[data-plugin-css="${STYLE_ID}"]`) !== null) return;

      const tag = document.createElement("style");
      tag.dataset.plugin = "dsh-rebased";
      tag.dataset.pluginCss = STYLE_ID;
      tag.textContent = `
        .dsh-rebased-sidebar-entry {
          width: 100%;
          min-width: 0;
          min-height: 38px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: var(--dsw-alias-label-secondary);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: flex-start;
          gap: 8px;
          padding: 4px 8px;
          font: inherit;
        }

        .dsh-rebased-sidebar-entry:hover {
          background: var(--dsw-alias-interactive-bg-hover);
          color: var(--dsw-alias-label-primary);
        }

        .dsh-rebased-sidebar-entry__mark {
          width: 18px;
          height: 18px;
          border-radius: 5px;
          background: var(--dsw-alias-label-caption);
          color: var(--dsw-alias-label-primary-inverted);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: none;
          font-size: 10px;
          font-weight: 700;
          line-height: 1;
        }

        .dsh-rebased-sidebar-entry__mark[data-state="clean"] {
          background: var(--dsw-alias-state-success-primary, #16825d);
        }

        .dsh-rebased-sidebar-entry__mark[data-state="dirty"],
        .dsh-rebased-sidebar-entry__mark[data-state="operating"] {
          background: var(--dsw-alias-state-warning-primary, #9a6700);
        }

        .dsh-rebased-sidebar-entry__mark[data-state="conflicted"],
        .dsh-rebased-sidebar-entry__mark[data-state="error"],
        .dsh-rebased-sidebar-entry__mark[data-state="missing-git"] {
          background: var(--dsw-alias-state-danger-primary, #c93535);
        }

        .dsh-rebased-sidebar-entry__text {
          min-width: 0;
          display: inline-flex;
          flex-direction: column;
          align-items: flex-start;
          line-height: 1.1;
        }

        .dsh-rebased-sidebar-entry__label {
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 13px;
          font-weight: 500;
        }

        .dsh-rebased-sidebar-entry__status {
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: var(--dsw-alias-label-caption);
          font-size: 11px;
        }
      `;
      document.head.appendChild(tag);
    }

    class DshRebasedApiError extends Error {
      constructor(code, message) {
        super(message);
        this.name = "DshRebasedApiError";
        this.code = code;
      }
    }

    async function fetchRepositorySnapshot(scope, signal) {
      const body = {
        sessionId: scope.sessionId,
        ...(scope.cwd !== undefined && scope.cwd !== "" ? { cwd: scope.cwd } : {}),
      };
      const response = await fetch("/dsh-rebased/api/repository.snapshot", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
        signal,
      });
      const parsed = await response.json().catch(() => null);
      if (!response.ok || parsed === null || parsed.ok !== true || parsed.value === undefined) {
        throw new DshRebasedApiError(parsed?.error?.code ?? "http", parsed?.error?.message ?? `HTTP ${response.status}`);
      }
      return parsed.value;
    }

    function useActiveSessionScope(ctx) {
      const subscribe = React.useMemo(
        () => (callback) => ctx.sessions.list.subscribe(callback),
        [ctx],
      );
      const getSnapshot = React.useCallback(() => ctx.sessions.list.getSnapshot(), [ctx]);
      const sessionList = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
      const sessionId = sessionList.current;
      const cwd = sessionId == null ? undefined : sessionList.byId[sessionId]?.cwd;
      return sessionId == null ? null : { sessionId, cwd };
    }

    function statusLabel(t, state) {
      if (state === "missing-git") return tOrFallback(t, "status.missingGit", "Git not found");
      if (state === "no-repository") return tOrFallback(t, "status.noRepository", "Not a Git repository");
      if (state === "clean") return tOrFallback(t, "status.clean", "Clean");
      if (state === "dirty") return tOrFallback(t, "status.dirty", "Changes");
      if (state === "conflicted") return tOrFallback(t, "status.conflicted", "Conflicts");
      if (state === "operating") return tOrFallback(t, "status.operating", "Operation running");
      return tOrFallback(t, "status.unknown", "Unknown state");
    }

    function basename(path) {
      if (typeof path !== "string" || path === "") return "";
      const trimmed = path.replace(/[\\/]+$/, "");
      const parts = trimmed.split(/[\\/]+/);
      return parts[parts.length - 1] || trimmed;
    }

    function formatCounts(t, counts) {
      if (counts === undefined) return "";
      const rows = [
        [counts.conflicted, tOrFallback(t, "count.conflicted", "conflicted")],
        [counts.staged, tOrFallback(t, "count.staged", "staged")],
        [counts.unstaged, tOrFallback(t, "count.unstaged", "unstaged")],
        [counts.untracked, tOrFallback(t, "count.untracked", "untracked")],
      ].filter(([count]) => typeof count === "number" && count > 0);
      return rows.map(([count, label]) => `${count} ${label}`).join(", ");
    }

    function useRepositorySnapshot(ctx, scope) {
      const [state, setState] = React.useState({ status: "idle", snapshot: null, error: null });
      const refresh = React.useCallback(() => {
        if (scope === null) {
          setState({ status: "idle", snapshot: null, error: null });
          return () => {};
        }

        const controller = new AbortController();
        setState((current) => ({ status: "loading", snapshot: current.snapshot, error: null }));
        fetchRepositorySnapshot(scope, controller.signal).then(
          (snapshot) => {
            setState({ status: "ready", snapshot, error: null });
          },
          (error) => {
            if (error instanceof DOMException && error.name === "AbortError") return;
            setState({ status: "error", snapshot: null, error });
          },
        );
        return () => controller.abort();
      }, [scope?.sessionId, scope?.cwd]);

      React.useEffect(() => refresh(), [refresh]);
      return [state, refresh];
    }

    function SidebarGitEntry(props) {
      ensureStyles();
      const wide = props.wide !== false;
      const scope = useActiveSessionScope(props.ctx);
      const [snapshotState, refresh] = useRepositorySnapshot(props.ctx, scope);
      const label = tOrFallback(props.t, "sidebar.git", "Git");
      const repository = snapshotState.snapshot?.repository;
      const countText = formatCounts(props.t, repository?.counts);
      const branchText = repository?.branch !== undefined && repository.branch !== null ? repository.branch : "";
      const repoText = repository?.root !== undefined && repository.root !== null ? basename(repository.root) : "";
      const status = scope === null
        ? tOrFallback(props.t, "status.noSession", "No active session")
        : snapshotState.status === "loading" && snapshotState.snapshot === null
          ? tOrFallback(props.t, "status.loading", "Loading")
          : snapshotState.status === "error"
            ? tOrFallback(props.t, "status.error", "Failed to read")
            : statusLabel(props.t, repository?.state);
      const detail = countText || [repoText, branchText].filter(Boolean).join(" · ") || tOrFallback(props.t, "sidebar.status", "Read repository state");
      const title = `${tOrFallback(props.t, "sidebar.title", "dsh-rebased Git repository state")}: ${status}${detail ? ` · ${detail}` : ""}`;
      const markerState = snapshotState.status === "error" ? "error" : repository?.state ?? "unknown";

      return React.createElement(
        "button",
        {
          type: "button",
          className: "dsh-rebased-sidebar-entry",
          "aria-label": title,
          title,
          onClick: () => refresh(),
        },
        React.createElement("span", { className: "dsh-rebased-sidebar-entry__mark", "aria-hidden": "true", "data-state": markerState }, "G"),
        wide
          ? React.createElement(
              "span",
              { className: "dsh-rebased-sidebar-entry__text" },
              React.createElement("span", { className: "dsh-rebased-sidebar-entry__label" }, label),
              React.createElement("span", { className: "dsh-rebased-sidebar-entry__status" }, `${status}${detail ? ` · ${detail}` : ""}`),
            )
          : null,
      );
    }

    function normalizeConfig(config) {
      return {
        enabled: config?.enabled !== false,
        registerSidebarEntry: config?.registerSidebarEntry !== false,
      };
    }

    function apply(ctx, config) {
      const resolved = normalizeConfig(config);
      if (!resolved.enabled || !resolved.registerSidebarEntry) return;

      ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-rebased: client dictionaries");
      ctx.slots.inject("sidebar.footer.action", () =>
        ctx.slots.register(
          {
            name: "sidebar.footer.action",
            id: "dsh-rebased-git",
            order: 20,
            locale: NS,
          },
          (props) => React.createElement(SidebarGitEntry, { ...props, ctx }),
        ),
      );
    }

    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  },
});
