window.__ModuleLoader__.load({
  id: "dsh-rebased",
  factory: (require) => {
    const module = { exports: {} };
    const exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

    const React = require("react");

    const NS = "dsh-rebased";
    const STYLE_ID = "dsh-rebased/sidebar-entry";

    const inject = ["slots", "locale", "sessions", "betterSidebar"];

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
      "tab.changes": "Git 变更",
      "action.refresh": "刷新",
      "panel.empty": "没有本地改动",
      "panel.unavailable": "变更视图不可用",
      "group.conflicted": "冲突",
      "group.staged": "已暂存",
      "group.unstaged": "未暂存",
      "group.untracked": "未跟踪",
      "group.renamed": "重命名",
      "group.deleted": "删除",
      "field.branch": "分支",
      "field.head": "HEAD",
      "field.upstream": "上游",
      "field.repo": "仓库",
      "label.truncated": "列表已截断",
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
      "tab.changes": "Git Changes",
      "action.refresh": "Refresh",
      "panel.empty": "No local changes",
      "panel.unavailable": "Changes view unavailable",
      "group.conflicted": "Conflicts",
      "group.staged": "Staged",
      "group.unstaged": "Unstaged",
      "group.untracked": "Untracked",
      "group.renamed": "Renamed",
      "group.deleted": "Deleted",
      "field.branch": "Branch",
      "field.head": "HEAD",
      "field.upstream": "Upstream",
      "field.repo": "Repository",
      "label.truncated": "List truncated",
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

        .dsh-rebased-panel {
          --dsh-rebased-bg: #101216;
          --dsh-rebased-bg-muted: #171a20;
          --dsh-rebased-border: rgba(255, 255, 255, 0.12);
          --dsh-rebased-text: #f2f4f7;
          --dsh-rebased-muted: #a6adbb;
          --dsh-rebased-hover: rgba(255, 255, 255, 0.07);
          --dsh-rebased-danger: #ff6b6b;
          --dsh-rebased-success: #4ade80;
          --dsh-rebased-warning: #fbbf24;
          box-sizing: border-box;
          height: 100%;
          min-width: 0;
          overflow: auto;
          padding: 12px;
          background: var(--dsw-alias-bg-app, var(--dsw-alias-bg-layer, var(--dsh-rebased-bg)));
          color: var(--dsw-alias-label-primary, var(--dsh-rebased-text));
          font: inherit;
          color-scheme: dark;
        }

        @media (prefers-color-scheme: light) {
          .dsh-rebased-panel {
            --dsh-rebased-bg: #ffffff;
            --dsh-rebased-bg-muted: #f4f6f8;
            --dsh-rebased-border: rgba(15, 23, 42, 0.12);
            --dsh-rebased-text: #151922;
            --dsh-rebased-muted: #667085;
            --dsh-rebased-hover: rgba(15, 23, 42, 0.06);
            --dsh-rebased-danger: #c93535;
            --dsh-rebased-success: #16825d;
            --dsh-rebased-warning: #9a6700;
            color-scheme: light;
          }
        }

        .dsh-rebased-panel__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
        }

        .dsh-rebased-panel__title {
          min-width: 0;
        }

        .dsh-rebased-panel__name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 14px;
          font-weight: 650;
          line-height: 1.25;
        }

        .dsh-rebased-panel__meta {
          margin-top: 3px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: var(--dsw-alias-label-caption, var(--dsh-rebased-muted));
          font-size: 12px;
        }

        .dsh-rebased-panel__button {
          flex: none;
          height: 28px;
          border: 1px solid var(--dsw-alias-border-subtle, var(--dsh-rebased-border));
          border-radius: 6px;
          background: var(--dsw-alias-bg-layer, var(--dsh-rebased-bg-muted));
          color: var(--dsw-alias-label-secondary, var(--dsh-rebased-muted));
          cursor: pointer;
          padding: 0 9px;
          font: inherit;
          font-size: 12px;
        }

        .dsh-rebased-panel__button:hover {
          background: var(--dsw-alias-interactive-bg-hover, var(--dsh-rebased-hover));
          color: var(--dsw-alias-label-primary, var(--dsh-rebased-text));
        }

        .dsh-rebased-panel__chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 12px;
        }

        .dsh-rebased-panel__chip {
          min-width: 0;
          border-radius: 6px;
          background: var(--dsw-alias-bg-elevated, var(--dsh-rebased-bg-muted));
          color: var(--dsw-alias-label-secondary, var(--dsh-rebased-muted));
          padding: 4px 7px;
          font-size: 12px;
          line-height: 1.2;
        }

        .dsh-rebased-panel__group {
          margin-top: 12px;
        }

        .dsh-rebased-panel__group-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 5px;
          color: var(--dsw-alias-label-secondary, var(--dsh-rebased-muted));
          font-size: 12px;
          font-weight: 650;
          text-transform: uppercase;
        }

        .dsh-rebased-panel__rows {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .dsh-rebased-panel__row {
          min-width: 0;
          border-radius: 6px;
          display: grid;
          grid-template-columns: 22px minmax(0, 1fr);
          align-items: center;
          gap: 6px;
          padding: 4px 6px;
        }

        .dsh-rebased-panel__row:hover {
          background: var(--dsw-alias-interactive-bg-hover, var(--dsh-rebased-hover));
        }

        .dsh-rebased-panel__badge {
          width: 20px;
          height: 20px;
          border-radius: 5px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--dsw-alias-bg-elevated, var(--dsh-rebased-bg-muted));
          color: var(--dsw-alias-label-secondary, var(--dsh-rebased-muted));
          font-size: 11px;
          font-weight: 700;
        }

        .dsh-rebased-panel__path {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace;
          font-size: 12px;
        }

        .dsh-rebased-panel__old-path {
          margin-top: 2px;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: var(--dsw-alias-label-caption, var(--dsh-rebased-muted));
          font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace;
          font-size: 11px;
        }

        .dsh-rebased-panel__empty,
        .dsh-rebased-panel__error {
          border: 1px solid var(--dsw-alias-border-subtle, var(--dsh-rebased-border));
          border-radius: 8px;
          padding: 12px;
          background: var(--dsw-alias-bg-layer, var(--dsh-rebased-bg-muted));
          color: var(--dsw-alias-label-secondary, var(--dsh-rebased-muted));
          font-size: 13px;
        }

        .dsh-rebased-panel__error {
          color: var(--dsw-alias-state-danger-primary, var(--dsh-rebased-danger));
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

    function currentTranslator(ctx) {
      return ctx.locale?.bind?.(NS);
    }

    function changesTitle(ctx) {
      return tOrFallback(currentTranslator(ctx), "tab.changes", "Git Changes");
    }

    function openChangesTab(ctx, scope) {
      const service = optionalBetterSidebar(ctx);
      if (typeof service?.openTab === "function") {
        service.openTab({ type: "dsh-rebased:changes", title: changesTitle(ctx) }, scope ?? undefined);
        return true;
      }
      return false;
    }

    function optionalBetterSidebar(ctx) {
      try {
        return typeof ctx.get === "function" ? ctx.get("betterSidebar") : ctx.betterSidebar;
      } catch {
        return undefined;
      }
    }

    function groupLabel(t, name) {
      if (name === "conflicted") return tOrFallback(t, "group.conflicted", "Conflicts");
      if (name === "staged") return tOrFallback(t, "group.staged", "Staged");
      if (name === "unstaged") return tOrFallback(t, "group.unstaged", "Unstaged");
      if (name === "untracked") return tOrFallback(t, "group.untracked", "Untracked");
      if (name === "renamed") return tOrFallback(t, "group.renamed", "Renamed");
      if (name === "deleted") return tOrFallback(t, "group.deleted", "Deleted");
      return name;
    }

    function ChangeRow(props) {
      const change = props.change;
      return React.createElement(
        "div",
        { className: "dsh-rebased-panel__row", title: change.originalPath ? `${change.originalPath} -> ${change.path}` : change.path },
        React.createElement("span", { className: "dsh-rebased-panel__badge", "aria-hidden": "true" }, change.badge || "?"),
        React.createElement(
          "span",
          { style: { minWidth: 0 } },
          React.createElement("span", { className: "dsh-rebased-panel__path" }, change.path),
          change.originalPath
            ? React.createElement("span", { className: "dsh-rebased-panel__old-path" }, change.originalPath)
            : null,
        ),
      );
    }

    function ChangeGroup(props) {
      const changes = props.changes ?? [];
      if (changes.length === 0) return null;
      return React.createElement(
        "section",
        { className: "dsh-rebased-panel__group" },
        React.createElement(
          "div",
          { className: "dsh-rebased-panel__group-title" },
          React.createElement("span", null, groupLabel(props.t, props.name)),
          React.createElement("span", null, String(changes.length)),
        ),
        React.createElement(
          "div",
          { className: "dsh-rebased-panel__rows" },
          ...changes.map((change, index) => React.createElement(ChangeRow, { key: `${props.name}:${change.path}:${index}`, change })),
        ),
      );
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
        React.Fragment,
        null,
        React.createElement(
          "button",
          {
            type: "button",
            className: "dsh-rebased-sidebar-entry",
            "aria-label": title,
            title,
            onClick: () => {
              refresh();
              openChangesTab(props.ctx, scope);
            },
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
        ),
      );
    }

    function ChangesPanel(props) {
      ensureStyles();
      const [snapshotState, refresh] = useRepositorySnapshot(props.ctx, props.scope);
      const snapshot = snapshotState.snapshot;
      const repository = snapshot?.repository;
      const state = repository?.state;
      const title = repository?.root ? basename(repository.root) : tOrFallback(props.t, "tab.changes", "Git Changes");
      const meta = repository?.root ?? props.scope?.cwd ?? tOrFallback(props.t, "status.noSession", "No active session");
      const counts = formatCounts(props.t, repository?.counts);
      const groups = repository?.changes?.groups ?? {};
      const hasChanges = ["conflicted", "staged", "unstaged", "untracked", "renamed", "deleted"].some((name) => (groups[name]?.length ?? 0) > 0);

      React.useEffect(() => {
        if (props.visible) refresh();
      }, [props.visible, refresh]);

      return React.createElement(
        "div",
        { className: "dsh-rebased-panel" },
        React.createElement(
          "div",
          { className: "dsh-rebased-panel__header" },
          React.createElement(
            "div",
            { className: "dsh-rebased-panel__title" },
            React.createElement("div", { className: "dsh-rebased-panel__name" }, title),
            React.createElement("div", { className: "dsh-rebased-panel__meta", title: meta }, meta),
          ),
          React.createElement(
            "button",
            { className: "dsh-rebased-panel__button", type: "button", onClick: () => refresh() },
            tOrFallback(props.t, "action.refresh", "Refresh"),
          ),
        ),
        snapshotState.status === "error"
          ? React.createElement("div", { className: "dsh-rebased-panel__error" }, snapshotState.error?.message ?? tOrFallback(props.t, "status.error", "Failed to read"))
          : null,
        snapshotState.status === "loading" && snapshot === null
          ? React.createElement("div", { className: "dsh-rebased-panel__empty" }, tOrFallback(props.t, "status.loading", "Loading"))
          : null,
        snapshotState.status === "idle" && snapshot === null
          ? React.createElement("div", { className: "dsh-rebased-panel__empty" }, tOrFallback(props.t, "status.noSession", "No active session"))
          : null,
        snapshotState.status !== "error" && snapshot !== null
          ? React.createElement(
              React.Fragment,
              null,
              React.createElement(
                "div",
                { className: "dsh-rebased-panel__chips" },
                React.createElement("span", { className: "dsh-rebased-panel__chip" }, statusLabel(props.t, state)),
                repository?.branch ? React.createElement("span", { className: "dsh-rebased-panel__chip" }, `${tOrFallback(props.t, "field.branch", "Branch")}: ${repository.branch}`) : null,
                repository?.head ? React.createElement("span", { className: "dsh-rebased-panel__chip" }, `${tOrFallback(props.t, "field.head", "HEAD")}: ${repository.head}`) : null,
                repository?.upstream ? React.createElement("span", { className: "dsh-rebased-panel__chip" }, `${tOrFallback(props.t, "field.upstream", "Upstream")}: ${repository.upstream}`) : null,
                counts ? React.createElement("span", { className: "dsh-rebased-panel__chip" }, counts) : null,
                repository?.truncated ? React.createElement("span", { className: "dsh-rebased-panel__chip" }, tOrFallback(props.t, "label.truncated", "List truncated")) : null,
              ),
              hasChanges
                ? React.createElement(
                    React.Fragment,
                    null,
                    React.createElement(ChangeGroup, { name: "conflicted", changes: groups.conflicted, t: props.t }),
                    React.createElement(ChangeGroup, { name: "staged", changes: groups.staged, t: props.t }),
                    React.createElement(ChangeGroup, { name: "unstaged", changes: groups.unstaged, t: props.t }),
                    React.createElement(ChangeGroup, { name: "untracked", changes: groups.untracked, t: props.t }),
                    React.createElement(ChangeGroup, { name: "renamed", changes: groups.renamed, t: props.t }),
                    React.createElement(ChangeGroup, { name: "deleted", changes: groups.deleted, t: props.t }),
                  )
                : React.createElement("div", { className: "dsh-rebased-panel__empty" }, tOrFallback(props.t, "panel.empty", "No local changes")),
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

      ctx.effect(() => {
        const disposers = [
          ctx.locale.register(NS, "zh", zh),
          ctx.locale.register(NS, "en", en),
        ];
        return () => {
          for (const dispose of disposers) dispose();
        };
      }, "dsh-rebased: client dictionaries");
      ctx.effect(() => {
        const service = optionalBetterSidebar(ctx);
        if (service === undefined || typeof service.registerTab !== "function") return () => {};
        return service.registerTab({
          id: "dsh-rebased:changes",
          title: () => changesTitle(ctx),
          order: 21,
          single: true,
          component: (props) => React.createElement(ChangesPanel, { ...props, t: currentTranslator(props.ctx) }),
        });
      }, "dsh-rebased: better-sidebar changes tab");
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
