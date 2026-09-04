## The prototype toolbar (`toolbar/`)

`toolbar/` is a **vendored copy** of the shared prototype toolbar
(https://github.com/effectory-ux/prototype-toolbar), taken from its published
release line; `toolbar/version.json` says which release. Rules:

- **Don't edit files in `toolbar/`** — the next `toolbar/update.sh` overwrites
  them. Change the toolbar in its own repo (locally `~/Claude/prototype-toolbar`)
  and release it there; to try an unreleased toolbar here, run `toolbar.sh serve`
  in that clone and open this prototype once with `?proto-toolbar-src=http://localhost:8790/`.
  Or put that clone's working tree in here with `./toolbar.sh vendor question-library`
  (from the clone): `toolbar/version.json` then has an empty `tag`, meaning an
  unreleased build; the next `toolbar/update.sh` replaces it with the release.
- This prototype's own settings for the bar (key, screens, versions, edge
  cases) live in `prototypes/question-library-toolbar.js`, outside that folder.
- Deployed, a page loads the published toolbar first and this copy only as a
  fallback; on localhost this copy comes first. The bar shows **Update** when
  the copy is behind: run `toolbar/update.sh` and commit the result.
- Every screen page includes `prototypes/question-library-toolbar.js` and then `toolbar/load.js`
  right after `<body>` opens. Nothing else is needed.
