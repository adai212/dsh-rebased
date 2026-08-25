window.__ModuleLoader__.load({
  id: "dsh-rebased",
  factory: (require) => {
    const module = { exports: {} };
    const exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

    const React = require("react");

    const NS = "dsh-rebased";
    const STYLE_ID = "dsh-rebased/sidebar-entry";

    const inject = ["slots", "locale"];

    const zh = {
      "sidebar.git": "Git",
      "sidebar.status": "插件框架",
      "sidebar.title": "dsh-rebased Git plugin scaffold",
    };

    const en = {
      "sidebar.git": "Git",
      "sidebar.status": "Plugin scaffold",
      "sidebar.title": "dsh-rebased Git plugin scaffold",
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
          height: 32px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: var(--dsw-alias-label-secondary);
          cursor: default;
          display: inline-flex;
          align-items: center;
          justify-content: flex-start;
          gap: 8px;
          padding: 0 8px;
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
          background: var(--dsw-alias-state-success-primary);
          color: var(--dsw-alias-label-primary-inverted);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: none;
          font-size: 10px;
          font-weight: 700;
          line-height: 1;
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

    function SidebarGitEntry(props) {
      ensureStyles();
      const wide = props.wide !== false;
      const label = tOrFallback(props.t, "sidebar.git", "Git");
      const status = tOrFallback(props.t, "sidebar.status", "Plugin scaffold");
      const title = tOrFallback(props.t, "sidebar.title", "dsh-rebased Git plugin scaffold");

      return React.createElement(
        "button",
        {
          type: "button",
          className: "dsh-rebased-sidebar-entry",
          "aria-label": title,
          title,
          disabled: true,
        },
        React.createElement("span", { className: "dsh-rebased-sidebar-entry__mark", "aria-hidden": "true" }, "G"),
        wide
          ? React.createElement(
              "span",
              { className: "dsh-rebased-sidebar-entry__text" },
              React.createElement("span", { className: "dsh-rebased-sidebar-entry__label" }, label),
              React.createElement("span", { className: "dsh-rebased-sidebar-entry__status" }, status),
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
          SidebarGitEntry,
        ),
      );
    }

    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  },
});
