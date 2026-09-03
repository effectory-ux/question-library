# Question library V3

Test-ready prototype of the Question library redesign, built on the
[Engage design system](https://github.com/effectory-ux/Engage-Design-system-).
The library is a governance tool at organisation level: one governed list of
benchmarked and custom questions, plus a bucket of questions created in
surveys across the organisation that the coordinator can review, combine into
one question with variants, and add to the library.

**Live prototype:** https://effectory-ux.github.io/question-library/

Two design versions are in the repo; the toolbar switches between them:

- **Fixed** (default) — Effectory's catalog stays as it is: benchmarked
  questions offer variant selection only, benchmarked topics can't be renamed.
  Custom questions live in the same list, freely editable and movable, with
  custom topics on top. "Created in surveys" is the optional review bucket
  with smart similar-question suggestions.
- **Flexible** — one merged catalog the coordinator fully curates: order,
  naming and placement of custom and standard content.

## Links

- **Tester / participant link** (no toolbar):
  `https://effectory-ux.github.io/question-library/`
- **Colleague link** (with the prototype toolbar — versions, screens, edge
  cases): `https://effectory-ux.github.io/question-library/?ql-3a7k-toolbar-active`

On localhost the toolbar is always on. See
[prototype-toolbar](https://github.com/effectory-ux/prototype-toolbar) for the
link contract.

## Running locally

```sh
python3 serve.py
```

Serves the prototype at http://localhost:3000 (the root redirects into the
prototype; caching is disabled for design iteration).

## What's in here

- `prototypes/` — the prototype pages (both versions, one HTML file per tab)
  plus the shared modules: `question-library-shared.js` (data, publish flow,
  dialogs), `question-library-cq.js` (question create/edit/review dialog with
  fake translations, ported from CYOS phase 2), `question-library-toolbar.js`
  (this prototype's config for the shared toolbar, whose vendored copy is `toolbar/`).
- `tokens.css`, `foundation.css`, `components.css`, `icons.js`, `assets/` —
  the bundled design-system files (pinned in `ds-pin.json`).
- `question-library-v2-prototype.html` — lookalike of the live QL v2 the
  redesign started from; `live-import-question-library-v2.md` documents the
  live capture.
- `ql-v3-research-brief.html` — the brief for evaluative research.
