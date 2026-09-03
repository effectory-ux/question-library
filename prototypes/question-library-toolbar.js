// question-library-toolbar.js — what THIS prototype puts in the shared
// prototype toolbar (toolbar/prototype-bar.js, a git subtree of
// effectory-ux/prototype-toolbar). Host-specific by design; the toolbar itself
// knows nothing about the question library. Pages come in two versions,
// question-library-<page>.html (Fixed) and question-library-flexible-<page>.html
// (Flexible); a page that exists in only one version maps to its closest
// counterpart.
(function () {
  function file(u) { return u.pathname.split("/").pop(); }
  function isFlex(u) { return file(u).indexOf("question-library-flexible-") === 0; }
  var ONLY_FIXED = { "question-library-custom.html": "question-library-flexible-questions.html" };
  function toFlexible(u) { var f = file(u); return ONLY_FIXED[f] || f.replace("question-library-", "question-library-flexible-"); }
  function toFixed(u) { return file(u).replace("question-library-flexible-", "question-library-"); }
  function screen(name) { return function (u) { return "question-library-" + (isFlex(u) ? "flexible-" : "") + name + ".html"; }; }
  var flex = isFlex(new URL(location.href));

  window.PROTO_TOOLBAR = {
    key: "ql-3a7k",            // the ?<key>-toolbar-active gate of the live site
    prefix: "ql",              // localStorage namespace (ql.edge.seed is read by question-library-shared.js)
    name: "Question library",
    live: "https://effectory-ux.github.io/question-library/",
    versions: [
      { key: "a", label: "Flexible", match: "question-library-flexible-", go: toFlexible,
        desc: "One merged catalog: the coordinator curates order, naming and placement of custom and standard content." },
      { key: "b", label: "Fixed", match: function (u) { return !isFlex(u); }, go: toFixed,
        desc: "Effectory's catalog stays as it is; the organisation's custom questions live in their own managed collection." }
    ],
    screens: [
      { key: "questions", label: "The question library", href: screen("questions"),
        desc: "Where the coordinator manages content — the admin side of this version." },
      { key: "custom", label: "To review", href: "question-library-custom.html",
        desc: "Custom questions created in surveys: spot similar ones, combine them, add them to the library." },
      { key: "picker", label: "Survey creator’s picker", href: screen("picker"),
        desc: "What a manager sees when adding questions to a survey — the published result of this version." }
    ].filter(function (s) { return !(flex && s.key === "custom"); }), // To review exists in Fixed only
    edgeCases: [
      { key: "seed", label: "A year of custom content",
        desc: "Seeds ±25 accumulated custom questions: near-duplicates, stale one-offs, a few gems. For the findability and cleanup tasks." }
    ]
  };
})();
