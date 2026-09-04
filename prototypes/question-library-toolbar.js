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
    /* every page of this prototype, per version: the four tabs and the template
       detail (a template as the example). Dialogs are sub-functionality of these. */
    screens: [
      { key: "questions", label: "Questions", href: screen("questions"),
        desc: "The library: benchmarked and custom questions in one governed list." },
      { key: "custom", label: "To review", href: "question-library-custom.html",
        desc: "Custom questions created in surveys: spot similar ones, combine them, add them to the library." },
      { key: "templates", label: "Templates", href: screen("templates"),
        desc: "Standard and custom templates; open one to edit it." },
      { key: "template", label: "Template detail (DEI)", href: function (u) { return screen("template")(u) + "?t=dei"; },
        desc: "Editing a template: details, questions and sections." },
      { key: "themes", label: "Themes", href: screen("themes"),
        desc: "The themes questions report to." }
    ].filter(function (s) { return !(flex && s.key === "custom"); }), // To review exists in Fixed only
    edgeCases: [
      { key: "seed", label: "A year of custom content",
        desc: "Seeds ±25 accumulated custom questions: near-duplicates, stale one-offs, a few gems. For the findability and cleanup tasks." }
    ]
  };
})();
(function () {
  /* the toolbar remembers every page it was shown on; drop pages that no longer exist */
  var PAGES = ["question-library-questions.html", "question-library-custom.html", "question-library-templates.html",
    "question-library-template.html", "question-library-themes.html", "question-library-flexible-questions.html",
    "question-library-flexible-templates.html", "question-library-flexible-template.html", "question-library-flexible-themes.html"];
  try {
    var k = "ql.seen", seen = JSON.parse(localStorage.getItem(k) || "{}"), keep = {};
    /* the other version's pages belong to the version switcher, not this version's Screens list */
    var thisFlex = location.pathname.split("/").pop().indexOf("question-library-flexible-") === 0;
    Object.keys(seen).forEach(function (path) {
      var f = path.split("/").pop();
      if (PAGES.indexOf(f) === -1) return;
      if ((f.indexOf("question-library-flexible-") === 0) !== thisFlex) return;
      keep[path] = seen[path];
    });
    localStorage.setItem(k, JSON.stringify(keep));
  } catch (e) {}
})();
