# Development Notes

## Current Scope

This is only the DSH plugin scaffold. It deliberately does not run Git commands yet.

What exists now:

- Host entry: `lib/index.js`
- Browser client entry: `lib/client.js`
- Core runtime placeholder: `lib/core/index.js`
- Git domain contracts placeholder: `lib/core/contracts.js`
- Sidebar UI model placeholder: `lib/ui-model/sidebar.js`
- DSH bundle patch: `cordis.patch.yml`

## Local Checks

Do not run these automatically after edits unless explicitly requested.

Manual syntax checks:

```powershell
cd D:\AI\dsh-rebased\dsh-rebased
npm.cmd run check:syntax
npm.cmd run check:client-syntax
```

The checks only parse the scaffold JavaScript. They do not start DSH and do not test Git behavior.

## How To See The Effect In DSH

For a development install, add this package to the DSH desktop profile and insert the plugin into the Cordis patch layer.

1. Add the package dependency in `C:\Users\98799\.dsh\profiles\desktop\package.json`:

```json
{
  "dependencies": {
    "dsh-rebased": "link:D:/AI/dsh-rebased/dsh-rebased"
  }
}
```

2. Add the plugin entry to `C:\Users\98799\.dsh\profiles\desktop\cordis.patch.yml`:

```yaml
- insert:
    - id: dsh-rebased
      name: dsh-rebased
      config:
        enabled: true
```

3. Let the DSH profile install/update dependencies, then restart DSH Desktop.

Expected visible result:

- A disabled `Git` entry appears in the sidebar footer area.
- The entry says `Plugin scaffold` in English locales or `插件框架` in Chinese locales.
- No Git operation should be available yet.

## Alternative Bundle-Style Install

The package includes `dsh.bundle.patch` in `package.json`, pointing to `cordis.patch.yml`. If DSH accepts local packages as profile bundles in your setup, you can add `dsh-rebased` to the profile `dsh.profile.bundles` list instead of copying the patch entry.

## Uninstall During Development

Remove the `dsh-rebased` dependency and the `dsh-rebased` Cordis patch entry from the profile, then restart DSH Desktop.

## Next Framework Step

Before implementing real Git behavior, confirm:

- Which DSH sidebar slot should own the final Git surface: footer action, workspaces replacement, a new details panel, or a custom slot declared by this plugin.
- Whether the plugin should coexist with `dsh-better-sidebar` first or replace its Git module directly.
- Which DSH services should back host operations: filesystem, subprocess, workspace, notifications, and settings.
