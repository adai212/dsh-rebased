# Development Notes

## Current Scope

This is the read-only Git status and changes-model increment. It runs Git commands only through the plugin host API and does not expose write operations yet.

What exists now:

- Host entry: `lib/index.js`
- Browser client entry: `lib/client.js`
- Host API route: `lib/host-api.js`
- Git process layer: `lib/core/git-process.js`
- Repository discovery/status layer: `lib/core/repository.js`
- Changes grouping model in the repository snapshot
- Core runtime contracts: `lib/core/index.js` and `lib/core/contracts.js`
- Sidebar UI model: `lib/ui-model/sidebar.js`
- DSH bundle patch: `cordis.patch.yml`

## Local Checks

Do not run these automatically after edits unless explicitly requested.

Manual syntax checks:

```powershell
cd D:\AI\dsh-rebased\dsh-rebased
npm.cmd run check:syntax
npm.cmd run check:client-syntax
```

The checks only parse JavaScript. They do not start DSH and do not verify Git behavior.

## How To See The Effect In DSH

For a development install, add this package to the DSH desktop profile and insert the plugin into the Cordis patch layer.

Use only one activation path for `dsh-rebased`: either the profile patch entry below, or adding `dsh-rebased` to `dsh.profile.bundles`. Do not use both at the same time. Loading the same plugin twice can register duplicate host routes, sidebar footer actions, and better-sidebar tab ids, which can prevent DSH Desktop from opening.

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

- A `Git` entry appears in the sidebar footer area.
- In a Git repository session, the entry shows a clean/dirty/conflict status plus the repository or change-count summary.
- Clicking the `Git` entry refreshes the read-only snapshot. If `dsh-better-sidebar` is available, the plugin also opens the read-only changes view as a sidebar tab.
- The changes view groups files as conflicts, staged, unstaged, untracked, renamed, and deleted.
- In a non-Git directory, the entry shows `Not a Git repository` or `不是 Git 仓库`.
- Clicking the entry refreshes the read-only snapshot.
- No Git write operation should be available yet.

## Alternative Bundle-Style Install

The package includes `dsh.bundle.patch` in `package.json`, pointing to `cordis.patch.yml`. If DSH accepts local packages as profile bundles in your setup, you can add `dsh-rebased` to the profile `dsh.profile.bundles` list instead of copying the patch entry.

When using this bundle-style install, remove the manual `dsh-rebased` insert from `C:\Users\98799\.dsh\profiles\desktop\cordis.patch.yml`.

## Uninstall During Development

Remove the `dsh-rebased` dependency and the `dsh-rebased` Cordis patch entry from the profile, then restart DSH Desktop.

## Next Functional Step

Before staging operations, confirm the intended host surface for the full Git panel. The current known public integration opens a better-sidebar tab; a DSH center-area tab needs a separate confirmed host API.
