## The prototype toolbar (`toolbar/`)

`toolbar/` is a **git subtree** of https://github.com/effectory-ux/prototype-toolbar
— the one toolbar every UX prototype shares. Rules for working in this repo:

- **Editing the toolbar here is fine.** Commit it as usual. The post-commit hook
  (from `toolbar/sync.sh hooks`) harvests any commit touching `toolbar/` into the
  upstream clone and fans it out to the other prototypes, all locally. Without
  the hook, run `toolbar/sync.sh in question-library` after committing.
- **Keep it generic.** Nothing in `toolbar/` may know about question-library; this
  prototype's own settings (key, screens, versions, edge cases) live in its
  config file outside the folder.
- **Getting the latest toolbar:** `toolbar/sync.sh out` (or `status` to look first).
- Never edit `toolbar/` and this prototype's own files in the same commit —
  the harvest works per commit, and a mixed commit muddles the toolbar's history.
