/* question-library-toolbar.js — the prototype toolbar, ported from the CYOS
   toolbar (~/Claude/Projects/CYOS/toolbar/PrototypeBar.jsx, Sep 2 revision) to
   vanilla JS for this static multi-page prototype. Tooling, not product UI.
   Who sees it: on localhost always; anywhere else only for a URL carrying
   ?ql-3a7k-toolbar-active — every other link is the plain prototype. Hide with
   Ctrl+` or the collapse button; the peek tab on the right screen edge brings
   it back.
   Not ported (React/Vite-only): inline copy editing, the Piwik event layer,
   dev-server auto-start — the source bar hides those menus too when the host
   provides nothing for them. */
(function () {
  "use strict";
  var KEY = "ql-3a7k";
  var PREFIX = "ql";
  var FLAG = KEY + "-toolbar-active";

  function isDevHost() {
    var h = location.hostname;
    return h === "localhost" || h === "127.0.0.1" || /\.local$/.test(h) || /^192\.168\./.test(h);
  }
  function barActive() {
    try { return isDevHost() || new URLSearchParams(location.search).has(FLAG); }
    catch (e) { return false; }
  }
  if (!barActive()) return;

  var isFlex = location.pathname.indexOf("question-library-flexible-") !== -1;
  var current = isFlex ? "a" : "b";
  var VERSIONS = [
    { key: "a", label: "Flexible",
      desc: "One merged catalog: the coordinator curates order, naming and placement of custom and standard content." },
    { key: "b", label: "Fixed",
      desc: "Effectory's catalog stays as it is; the organisation's custom questions live in their own managed collection." }
  ];
  /* pages that exist in only one version map to their closest counterpart */
  var ONLY_B = { "question-library-custom.html": "question-library-flexible-questions.html" };

  function versionURL(key) {
    if (key === current) return location.href;
    var u = new URL(location.href);
    var file = u.pathname.split("/").pop();
    if (key === "a") {
      u.pathname = ONLY_B[file]
        ? u.pathname.replace(file, ONLY_B[file])
        : u.pathname.replace("question-library-", "question-library-flexible-");
    } else {
      u.pathname = u.pathname.replace("question-library-flexible-", "question-library-");
    }
    return u.toString();
  }
  function pageURL(name) {
    var u = new URL(location.href);
    var file = u.pathname.split("/").pop();
    u.pathname = u.pathname.replace(file, "question-library-" + (isFlex ? "flexible-" : "") + name + ".html");
    u.hash = "";
    return u.toString();
  }
  /* the current step without the toolbar flag: what you hand to a tester */
  function plainLink() {
    try {
      var u = new URL(location.href);
      u.searchParams.delete(FLAG);
      return u.toString().replace(/\?(?=#|$)/, "");
    } catch (e) { return location.href; }
  }

  var store = {
    get hidden() { try { return localStorage.getItem(PREFIX + ".barHidden") === "1"; } catch (e) { return false; } },
    set hidden(v) { try { localStorage.setItem(PREFIX + ".barHidden", v ? "1" : "0"); } catch (e) {} },
    get seed() { try { return localStorage.getItem(PREFIX + ".seed") === "1"; } catch (e) { return false; } },
    set seed(v) { try { localStorage.setItem(PREFIX + ".seed", v ? "1" : "0"); } catch (e) {} }
  };
  var openMenu = null;

  function icons() { if (window.Icons) window.Icons.render(); }
  function el(html) { var d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstElementChild; }

  var bar = null, peek = null;

  /* The bar is a real row above the prototype, but fixed-position layers (the
     sysnotif stack) would slide underneath it. Publishing the bar's height as
     a CSS variable lets the page offset those by exactly that much. */
  function publishHeight() {
    var h = store.hidden || !bar ? 0 : Math.round(bar.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--proto-bar-h", h + "px");
  }
  window.addEventListener("resize", publishHeight);

  var MENUS = {
    version: {
      html: function () {
        return '<div class="pbar-menu-head">Prototype versions</div>' +
          '<div class="pbar-menu-note">Compare versions of this prototype. You land on the same screen when the other version has it too.</div>' +
          VERSIONS.map(function (v) {
            if (v.key === current) {
              return '<span class="pbar-item is-on is-current">' +
                '<span class="pbar-item-label">' + v.label + "</span>" +
                '<i data-icon="check"></i>' +
                '<span class="pbar-item-desc">' + v.desc + "</span></span>";
            }
            return '<a class="pbar-item" href="' + versionURL(v.key) + '">' +
              '<span class="pbar-item-label">' + v.label + "</span>" +
              '<span class="pbar-item-desc">' + v.desc + "</span></a>";
          }).join("");
      },
      bind: function () {}
    },
    cases: {
      html: function () {
        var cases = [
          { page: "questions", label: "The question library", desc: "Where the coordinator manages content — the admin side of this version." },
          { page: "picker", label: "Survey creator’s picker", desc: "What a manager sees when adding questions to a survey — the published result of this version." }
        ];
        if (!isFlex) cases.splice(1, 0, { page: "custom", label: "To review", desc: "Custom questions created in surveys: spot similar ones, combine them, add them to the library." });
        return '<div class="pbar-menu-head">Jump to a screen</div>' +
          cases.map(function (c) {
            return '<button class="pbar-item" data-page="' + c.page + '">' +
              '<span class="pbar-item-label">' + c.label + "</span>" +
              '<span class="pbar-item-desc">' + c.desc + "</span></button>";
          }).join("");
      },
      bind: function (slot) {
        slot.querySelectorAll("[data-page]").forEach(function (b) {
          b.addEventListener("click", function () { location.href = pageURL(b.getAttribute("data-page")); });
        });
      }
    },
    edges: {
      html: function () {
        return '<div class="pbar-menu-head">Not every account is the same</div>' +
          '<div class="pbar-menu-note">Flip these to show a screen both ways. They reload the page.</div>' +
          '<button class="pbar-item' + (store.seed ? " is-on" : "") + '" role="switch" aria-checked="' + store.seed + '" data-seed>' +
          '<span class="pbar-item-label">A year of custom content</span>' +
          '<span class="pbar-switch" aria-hidden="true"></span>' +
          '<span class="pbar-item-desc">Seeds ±25 accumulated custom questions: near-duplicates, stale one-offs, a few gems. For the findability and cleanup tasks.</span>' +
          "</button>";
      },
      bind: function (slot) {
        slot.querySelector("[data-seed]").addEventListener("click", function () {
          store.seed = !store.seed;
          location.reload();
        });
      }
    },
    share: {
      html: function () {
        return '<div class="pbar-menu-head pbar-share-head">Share</div>' +
          '<div class="pbar-menu-note">No live address is set up for this prototype. This copies the current address without the toolbar.</div>' +
          '<button class="pbar-item" data-copy-share>' +
          '<span class="pbar-item-label">Copy link</span></button>';
      },
      bind: function (slot) {
        var b = slot.querySelector("[data-copy-share]");
        b.addEventListener("click", function () {
          try { navigator.clipboard.writeText(plainLink()); } catch (e) {}
          b.innerHTML = '<span class="pbar-item-label">Copied</span><i data-icon="check"></i>';
          icons();
        });
      }
    }
  };

  function render() {
    if (bar) { bar.remove(); bar = null; }
    if (peek) { peek.remove(); peek = null; }
    document.body.classList.toggle("proto-shell", !store.hidden);
    if (store.hidden) {
      peek = el('<button class="pbar-peek" title="Show toolbar (Ctrl+`)"><i data-icon="sliders"></i><span class="pbar-peek-lbl">Toolbar</span></button>');
      document.body.appendChild(peek);
      peek.addEventListener("click", function () { store.hidden = false; render(); });
      icons();
      publishHeight();
      return;
    }
    var me = VERSIONS.filter(function (v) { return v.key === current; })[0];
    var seedCount = store.seed ? 1 : 0;
    bar = el(
      '<div class="pbar">' +
      /* the badge names the version you are on and switches between them */
      '<div class="pbar-menu-wrap" data-menu="version">' +
      '<button class="pbar-badge pbar-badge-btn" data-tip="Switch version">' + me.label +
      '<span class="pbar-chev"><i data-icon="chevron-down"></i></span></button>' +
      '<div class="pbar-menu-slot"></div></div>' +
      '<div class="pbar-menu-wrap" data-menu="cases">' +
      '<button class="pbar-btn" data-tip="Screens"><i data-icon="shapes"></i><span class="pbar-lbl">Screens</span>' +
      '<span class="pbar-chev"><i data-icon="chevron-down"></i></span></button>' +
      '<div class="pbar-menu-slot"></div></div>' +
      '<div class="pbar-menu-wrap" data-menu="edges">' +
      '<button class="pbar-btn" data-tip="Edge cases"><i data-icon="randomize"></i><span class="pbar-lbl">Edge cases</span>' +
      (seedCount ? '<span class="pbar-count">' + seedCount + "</span>" : "") +
      '<span class="pbar-chev"><i data-icon="chevron-down"></i></span></button>' +
      '<div class="pbar-menu-slot"></div></div>' +
      '<span class="pbar-spacer" aria-hidden="true"></span>' +
      '<div class="pbar-menu-wrap is-right" data-menu="share">' +
      '<button class="pbar-icon pbar-tt is-right" data-tip="Share" aria-label="Share"><i data-icon="share"></i></button>' +
      '<div class="pbar-menu-slot"></div></div>' +
      '<button class="pbar-icon pbar-tt is-right" data-hide data-tip="Collapse toolbar (Ctrl+`)" aria-label="Collapse toolbar"><i data-icon="collapse-right"></i></button>' +
      "</div>"
    );
    document.body.insertBefore(bar, document.body.firstChild);

    function closeMenus() {
      openMenu = null;
      bar.querySelectorAll(".pbar-menu-slot").forEach(function (s) { s.innerHTML = ""; });
      bar.querySelectorAll(".is-open").forEach(function (b) { b.classList.remove("is-open"); });
    }
    bar.querySelectorAll(".pbar-menu-wrap").forEach(function (wrap) {
      var key = wrap.getAttribute("data-menu");
      var m = MENUS[key];
      var right = wrap.classList.contains("is-right");
      wrap.querySelector(".pbar-badge-btn, .pbar-btn, .pbar-icon").addEventListener("click", function () {
        if (openMenu === key) return closeMenus();
        closeMenus();
        openMenu = key;
        this.classList.add("is-open");
        var slot = wrap.querySelector(".pbar-menu-slot");
        slot.innerHTML = '<div class="pbar-scrim"></div><div class="pbar-menu' + (right ? " is-right" : "") + '">' + m.html() + "</div>";
        slot.querySelector(".pbar-scrim").addEventListener("mousedown", closeMenus);
        m.bind(slot, closeMenus);
        icons();
      });
    });

    bar.querySelector("[data-hide]").addEventListener("click", function () { store.hidden = true; render(); });
    icons();
    publishHeight();
  }

  /* Ctrl+` toggles the bar; ignored while typing */
  window.addEventListener("keydown", function (e) {
    var t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
    if (e.ctrlKey && (e.key === "`" || e.code === "Backquote")) {
      e.preventDefault();
      store.hidden = !store.hidden;
      render();
    }
  });

  /* the include sits right after <body> opens, so the bar renders synchronously
     BEFORE the page content parses — no pop-in or reflow on tab switches */
  if (document.body) render();
  else document.addEventListener("DOMContentLoaded", render);
})();
