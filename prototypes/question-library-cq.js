/* question-library-cq.js — the add & edit question dialogs, ported from the
   CYOS phase-2 project (~/Claude/Projects/CYOS/phase-2, React) to vanilla JS
   for the Question library prototype. Interaction design and copy follow the
   CYOS CustomQuestionDialog; the standard-question mode borrows the
   "write your own wording" hand-off from its BenchmarkQuestionDialog.
   QL-specific addition: "Used in N surveys" + the propagation confirm on save. */
window.QLQ = (function () {
  "use strict";

  /* ── languages: the QL's library languages (emoji flags, no asset dependency) ── */
  var LANGUAGES = [
    { code: "en", label: "English", country: "United States", flag: "🇺🇸", primary: true },
    { code: "nl", label: "Dutch", country: "The Netherlands", flag: "🇳🇱" },
    { code: "pt", label: "Portuguese", country: "Portugal", flag: "🇵🇹" }
  ];
  var PRIMARY = LANGUAGES[0];
  var OTHERS = LANGUAGES.slice(1);

  var QTYPES = {
    scale5:   { label: "5-point scale",   icon: "point-scale",   bg: "var(--bg-accent-turquoise-subtle)", fg: "var(--content-accent-turquoise)", creatable: true },
    multiple: { label: "Multiple choice", icon: "check-square",  bg: "var(--bg-highlight-subtle)",        fg: "var(--content-highlight)",        creatable: true },
    single:   { label: "Single choice",   icon: "single-answer", bg: "var(--bg-highlight-subtle)",        fg: "var(--content-highlight)",        creatable: true },
    text:     { label: "Text answer",     icon: "text-entry",    bg: "var(--bg-accent-purple-subtle)",    fg: "var(--border-accent-purple-base)", creatable: true },
    nps:      { label: "0–10 scale",      icon: "net-promoter-score", bg: "var(--bg-accent-blue-subtle)", fg: "var(--content-accent-blue)",      creatable: false }
  };
  /* QL data types (L/O/N/T) ↔ dialog types */
  var FROM_QL = { L: "scale5", O: "multiple", N: "nps", T: "text" };
  var TO_QL = { scale5: "L", multiple: "O", single: "O", text: "T", nps: "N" };

  /* Effectory-approved alternative wordings (CYOS variants.js): picking one
     keeps the benchmark valid. Curated for common questions; the synthesized
     rewrites keep the mechanic testable on every standard question. */
  var VARIANTS = {
    "I am satisfied with my job as a whole": [
      "Overall, I am satisfied with my job",
      "Taking everything into account, I am satisfied with my job"],
    "I enjoy doing my work / tasks": [
      "I enjoy the work I do",
      "Day to day, I find my work enjoyable"],
    "I have confidence in my manager": [
      "I trust my manager",
      "I can rely on my manager's judgement"],
    "I am proud of the work I deliver": [
      "I take pride in the work I deliver",
      "The work I deliver is something I'm proud of"]
  };
  function variantsOf(text, type) {
    var curated = VARIANTS[text] || [];
    if (!text) return curated;
    var t = text.replace(/\.$/, "");
    var lower = t.charAt(0).toLowerCase() + t.slice(1);
    var made = (type === "scale5")
      ? ["To what extent do you agree: " + lower, "In my experience, " + lower]
      : ["In your view, " + lower, "From your experience, " + lower];
    return curated.concat(made.filter(function (v) { return curated.indexOf(v) === -1; }));
  }

  /* ── answer scale per language (fixed product strings, real translations) ── */
  var ANSWER_SCALE = {
    en: { points: ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"], dontKnow: "I don’t know", open: "Share your thoughts…" },
    nl: { points: ["Helemaal oneens", "Oneens", "Niet eens, niet oneens", "Eens", "Helemaal eens"], dontKnow: "Weet ik niet", open: "Deel hier je gedachten…" },
    pt: { points: ["Discordo totalmente", "Discordo", "Não concordo nem discordo", "Concordo", "Concordo totalmente"], dontKnow: "Não sei", open: "Partilhe os seus pensamentos…" }
  };
  var scaleFor = function (code) { return ANSWER_SCALE[code] || ANSWER_SCALE.en; };
  var SCALE_DOTS = [
    "var(--bg-distribution-strongly-disagree)",
    "var(--bg-distribution-disagree)",
    "var(--bg-distribution-neither)",
    "var(--bg-distribution-agree)",
    "var(--bg-distribution-strongly-agree)"
  ];

  /* ── fake word-level "machine translation" (CYOS i18n.js model) ── */
  var DICT = {
    nl: { the: "de", a: "een", an: "een", and: "en", or: "of", of: "van", "in": "in", to: "om te", "for": "voor", "with": "met", my: "mijn", our: "onze", your: "je", i: "ik", we: "wij", is: "is", are: "zijn", at: "op", on: "op", how: "hoe", what: "wat", team: "team", teams: "teams", work: "werk", working: "werken", job: "baan", role: "rol", manager: "manager", questions: "vragen", question: "vraag", growth: "groei", development: "ontwikkeling", learning: "leren", people: "mensen", culture: "cultuur", goals: "doelen", feedback: "feedback", support: "steun", tools: "middelen", office: "kantoor", remote: "op afstand", satisfaction: "tevredenheid", wellbeing: "welzijn", workload: "werkdruk", company: "bedrijf", organisation: "organisatie", organization: "organisatie", about: "over", "this": "dit", here: "hier", "do": "doe", you: "je", feel: "voel", get: "krijg", have: "heb", good: "goed", well: "goed", "new": "nieuw", more: "meer", enough: "genoeg", time: "tijd", day: "dag", week: "week", year: "jaar", yes: "ja", no: "nee", never: "nooit", often: "vaak", sometimes: "soms", always: "altijd", other: "anders", budget: "budget", activities: "activiteiten" },
    pt: { the: "o", a: "um", an: "um", and: "e", or: "ou", of: "de", "in": "em", to: "para", "for": "para", "with": "com", my: "o meu", our: "a nossa", your: "o seu", i: "eu", we: "nós", is: "é", are: "são", at: "em", on: "em", how: "como", what: "o que", team: "equipa", teams: "equipas", work: "trabalho", working: "trabalhar", job: "emprego", role: "função", manager: "gestor", questions: "perguntas", question: "pergunta", growth: "crescimento", development: "desenvolvimento", learning: "aprendizagem", people: "pessoas", culture: "cultura", goals: "objetivos", feedback: "feedback", support: "apoio", tools: "ferramentas", office: "escritório", remote: "remoto", satisfaction: "satisfação", wellbeing: "bem-estar", workload: "carga de trabalho", company: "empresa", organisation: "organização", organization: "organização", about: "sobre", "this": "isto", here: "aqui", "do": "faço", you: "você", feel: "sinto", get: "recebo", have: "tenho", good: "bom", well: "bem", "new": "novo", more: "mais", enough: "suficiente", time: "tempo", day: "dia", week: "semana", year: "ano", yes: "sim", no: "não", never: "nunca", often: "frequentemente", sometimes: "às vezes", always: "sempre", other: "outro", budget: "orçamento", activities: "atividades" }
  };
  function autoTranslation(text, code) {
    if (!text) return "";
    var dict = DICT[code] || {};
    return text.split(/(\s+)/).map(function (w) {
      var m = w.toLowerCase().replace(/[^a-z']/g, "");
      if (!m || !dict[m]) return w;
      var t = dict[m];
      return /^[A-Z]/.test(w) ? t.charAt(0).toUpperCase() + t.slice(1) : t;
    }).join("");
  }

  /* ── similarity check (CYOS similar.js, prototype-grade token overlap) ── */
  var STOP = new Set(["i", "im", "my", "me", "we", "our", "us", "you", "your", "the", "a", "an", "to", "of", "in", "on", "at", "and", "or", "for", "with", "is", "are", "am", "be", "being", "it", "its", "this", "that", "these", "those", "do", "does", "have", "has", "had", "can", "could", "will", "would", "by", "as", "from", "here", "there", "day", "find", "feel", "get"]);
  var stem = function (w) {
    return w.replace(/ies$/, "y").replace(/(es|s)$/, "")
      .replace(/(ations|ation|ment|ness|able|ible|ivity|ity|ive|ful|ing|ed|ly)$/, "").replace(/e$/, "");
  };
  var alike = function (a, b) {
    return a === b || (a.length >= 4 && b.indexOf(a) === 0) || (b.length >= 4 && a.indexOf(b) === 0);
  };
  function tokenize(text) {
    var out = new Set();
    (text || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).forEach(function (w) {
      if (w.length > 2 && !STOP.has(w)) out.add(stem(w));
    });
    return out;
  }
  function similarScored(text, pool, limit, min) {
    var toks = Array.from(tokenize(text));
    if (!toks.length) return [];
    return pool.map(function (q) {
      var qt = Array.from(tokenize(q.text));
      if (!qt.length) return { q: q, score: 0 };
      var hits = toks.filter(function (t) { return qt.some(function (u) { return alike(t, u); }); }).length;
      var score = (2 * hits) / (toks.length + qt.length) + (q.bench ? 0.03 : 0);
      return { q: q, score: score };
    }).filter(function (m) { return m.score >= (min === undefined ? 0.34 : min); })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, limit || 3);
  }
  /* min: the bar for "similar" — 0.34 finds rewordings inside one list; a
     library of 150 questions needs a higher one (custom.html passes 0.5) */
  function similarQuestions(text, pool, limit, min) {
    return similarScored(text, pool, limit, min).map(function (m) { return m.q; });
  }

  /* which library topic the wording points to: a word of the topic's name
     weighs most; a word from the topic's questions counts by how rare it is
     across topics (tf·idf); stems match exactly ("management" is not
     "manager"); no clear winner → no suggestion */
  function topicScores(text, topicNames) {
    var topics = ((window.QL && QL.TOPICS) || []).filter(function (t) { return !topicNames || !topicNames.length || topicNames.indexOf(t.name) !== -1; });
    var toks = Array.from(tokenize(text));
    if (!toks.length || !topics.length) return [];
    var bags = topics.map(function (t) {
      var bag = {};
      (t.qs || []).forEach(function (q) { tokenize(q[0]).forEach(function (w) { bag[w] = (bag[w] || 0) + 1; }); });
      return bag;
    });
    function countIn(bag, w) { return bag[w] || 0; } /* exact stems: "manager" is not "management" */
    var N = topics.length, norm = Math.log(N + 1);
    var idf = {};
    toks.forEach(function (w) {
      var df = bags.filter(function (bag) { return countIn(bag, w) > 0; }).length;
      idf[w] = df ? Math.log((N + 1) / df) / norm : 0;
    });
    /* "work" sits in five topic names, "workload" in one: a name word counts
       by how few names share it */
    var nameSets = topics.map(function (t) { return Array.from(tokenize(t.name)); });
    function nameDf(w) { return nameSets.filter(function (n) { return n.indexOf(w) !== -1; }).length || 1; }
    return topics.map(function (t, i) {
      var nameToks = nameSets[i], score = 0;
      toks.forEach(function (w) {
        if (nameToks.indexOf(w) !== -1) score += 3 / nameDf(w);
        var cnt = countIn(bags[i], w);
        if (cnt) score += (Math.min(cnt, 3) / 3) * idf[w];
      });
      return { name: t.name, score: score / toks.length };
    }).sort(function (a, b) { return b.score - a.score; });
  }
  function suggestTopic(text, topicNames) {
    var r = topicScores(text, topicNames);
    if (!r.length || r[0].score < 0.3) return "";
    if (r.length > 1 && r[1].score > r[0].score * 0.7) return ""; /* too close to call */
    return r[0].name;
  }

  var CHECK_MS = 1400, DONE_MS = 6000;
  var MANUAL_LABEL = "Manually translated";
  var STALE_NOTE = "Manually translated — check if it’s still correct";

  /* ── tiny DOM helpers ── */
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function el(html) { var d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstElementChild; }
  function icons() { if (window.Icons) window.Icons.render(); }
  function autosize(ta) { ta.style.height = "auto"; ta.style.height = ta.scrollHeight + "px"; }
  var qtile = function (type, size) {
    var m = QTYPES[type];
    return '<span class="qtile" style="background:' + m.bg + ";color:" + m.fg + ";width:" + (size || 24) + "px;height:" + (size || 24) + 'px;" data-tt="' + esc(m.label) + '"><i data-icon="' + m.icon + '"></i></span>';
  };
  var flagHTML = function (l) { return '<span class="cq-flag">' + l.flag + "</span>"; };

  /* ── read-only question preview: the create/edit dialog's preview card, for
     pages that show a question without editing it (e.g. add-to-library) ── */
  function typeTile(qlType, size) {
    return qtile(FROM_QL[qlType] || qlType || "scale5", size);
  }
  function previewHTML(q) {
    var type = FROM_QL[q.type] || q.type || "scale5";
    var answer;
    if (type === "text") {
      answer = '<textarea class="ta" rows="3" disabled placeholder="' + esc(scaleFor("en").open) + '" style="background:var(--bg-secondary);resize:none;min-height:84px;"></textarea>';
    } else if (type === "nps") {
      var dots = "";
      for (var i = 0; i <= 10; i++) dots += '<span class="cq-dot" style="--dot:var(--bg-distribution-no-answer);width:18px;height:18px;" data-tt="' + i + '"></span>';
      answer = '<div class="cq-scale"><div class="cq-scale-row"><span class="cq-scale-end">Not at all likely</span><div class="cq-dots" style="gap:6px;">' + dots + "</div>" +
        '<span class="cq-scale-end">Extremely likely</span></div></div>';
    } else if (type === "multiple" || type === "single") {
      answer = '<div class="cq-opts">' + [1, 2].map(function (i) {
        return '<div class="cq-opt"><span class="cq-mark ' + (type === "single" ? "is-radio" : "is-check") + '" role="' + (type === "single" ? "radio" : "checkbox") + '" aria-checked="false" aria-label="Answer option ' + i + '"></span>' +
          '<input class="cq-opt-input" value="" placeholder="Answer option ' + i + '" disabled /></div>';
      }).join("") + "</div>";
    } else {
      var s = scaleFor("en");
      answer = '<div class="cq-scale"><div class="cq-scale-row"><span class="cq-scale-end">' + esc(s.points[0]) + "</span>" +
        '<div class="cq-dots">' + SCALE_DOTS.map(function (c, i) {
          return '<span class="cq-dot" style="--dot:' + c + '" role="img" aria-label="' + esc(s.points[i]) + '" data-tt="' + esc(s.points[i]) + '"></span>';
        }).join("") + "</div>" +
        '<span class="cq-scale-end">' + esc(s.points[4]) + "</span></div>" +
        '<span class="cq-idk">' + esc(s.dontKnow) + "</span></div>";
    }
    return '<div class="cq-frame"><div class="cq-preview"><div class="bmq-inner"><div class="cq-card">' +
      '<div class="bmq-locked is-big">' + esc(q.text) + "</div>" +
      (q.desc ? '<div class="bmq-locked">' + esc(q.desc) + "</div>" : "") +
      '<div class="cq-answer">' + answer + "</div>" +
      "</div></div></div></div>";
  }

  /* MiniSelect (CYOS shared.jsx) — sel-btn trigger + .menu popover, self-managed */
  function miniSelect(mount, cfg) {
    var state = { open: false, value: cfg.value };
    function sel() { return cfg.items.filter(function (it) { return !it.header && it.value === state.value; })[0]; }
    function render() {
      var s = sel();
      mount.innerHTML =
        '<div class="cq-menu-wrap' + (cfg.block ? " is-block" : "") + '">' +
        '<button type="button" class="sel-btn cq-sel' + (state.open ? " is-pressed" : "") + (cfg.invalid && cfg.invalid() ? " is-error" : "") + '"' +
        ' aria-haspopup="listbox" aria-expanded="' + state.open + '" aria-label="' + esc(cfg.ariaLabel || "") + '"' + (cfg.disabled ? " disabled" : "") + ">" +
        '<span style="display:flex;align-items:center;gap:8px;min-width:0;">' +
        (s && s.lead ? s.lead : "") +
        '<span class="' + (s ? "sel-btn-name" : "cq-sel-placeholder") + '" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' +
        esc(s ? s.label : cfg.placeholder || "") + "</span></span>" +
        '<i data-icon="chevron-down"></i></button>' +
        (state.open ?
          '<div class="cq-menu-scrim"></div><div class="menu cq-menu-pop" role="listbox" style="max-height:320px;overflow-y:auto;">' +
          cfg.items.map(function (it, i) {
            if (it.header) return '<div class="menu-group-lbl">' + esc(it.label) + "</div>";
            var on = it.value === state.value;
            return '<div class="menu-item' + (on ? " is-selected" : "") + (it.working ? " is-working" : "") + '" role="option" aria-selected="' + on + '" data-i="' + i + '">' +
              (it.lead || "") +
              '<span class="menu-item-body"><span class="menu-item-title">' + esc(it.label) + "</span>" +
              (it.sub ? '<span class="menu-item-sub">' + esc(it.sub) + "</span>" : "") + "</span>" +
              (it.trail || "") +
              (on ? '<span class="menu-item-check"><i data-icon="check"></i></span>' : "") +
              "</div>";
          }).join("") + "</div>" : "") +
        "</div>";
      var btn = mount.querySelector(".cq-sel");
      if (!cfg.disabled) btn.addEventListener("click", function () { state.open = !state.open; render(); });
      var scrim = mount.querySelector(".cq-menu-scrim");
      if (scrim) scrim.addEventListener("mousedown", function () { state.open = false; render(); });
      mount.querySelectorAll(".menu-item").forEach(function (item) {
        item.addEventListener("click", function () {
          state.open = false;
          state.value = cfg.items[+item.getAttribute("data-i")].value;
          render();
          cfg.onChange(state.value);
        });
      });
      icons();
    }
    render();
    return { set: function (v) { state.value = v; render(); }, refresh: render };
  }

  /* ═════════ the dialog ═════════
     opts: {
       mode: "create" | "edit",
       question: {text, desc, type(ql), topic, custom, usedIn} (edit),
       standard: true       — locked wording (standard question),
       topics: [names], defaultTopic, pool: [{id,text,type(ql),bench,theme}],
       focusTitle: true     — select-all in the title field on open,
       onAdd(q), onSave(q), onDelete()
     } */
  function open(opts) {
    var editing = opts.mode === "edit";
    var standard = !!opts.standard;
    var q = opts.question || {};
    var usedIn = q.usedIn || (editing ? (window.QL ? QL.USAGE : []) : []);

    var st = {
      text: q.text ? (window.QL ? QL.fill(q.text) : q.text) : "",
      desc: q.desc || "",
      type: q.type ? FROM_QL[q.type] : "scale5",
      topic: q.topic || opts.defaultTopic || "",
      opts: q.options && q.options.length ? q.options.slice() : ["", ""],
      variant: undefined,   /* standard: the approved alternative wording chosen */
      attempted: false,
      active: PRIMARY.code,
      tr: {},              /* {code: {status,text,desc,opts,edited,stale}} */
      editingNow: null,
      phase: null,         /* loading | picking | success */
      checked: null, pick: "mine", done: null,
      also: false,          /* create: also add to the library (opts.alsoLibrary) */
      compact: matchMedia("(max-width: 1160px)").matches
    };
    var timers = [], checkTimer = null, lastSource = "";
    var canonical = st.text ? (window.QL ? QL.fill(st.text) : st.text) : "";
    var dirty = false;
    function markDirty() { dirty = true; renderFooter(); }

    var hasOpts = function () { return st.type === "multiple" || st.type === "single"; };
    var cleanOpts = function () { return st.opts.map(function (o) { return o.trim(); }).filter(Boolean); };
    var textErr = function () { return st.text.trim().length <= 2; };
    /* topics are findability scaffolding, not mandatory: a question without one
       collects in the library's custom-questions group */
    var topicOptional = !!opts.topicOptional;
    var topicErr = function () { return !st.topic && !topicOptional; };
    /* a topic suggested from the wording: a starting point, not a decision */
    var suggested = "";
    if (opts.suggestTopic && !st.topic) { suggested = suggestTopic(st.text, opts.topics || []); if (suggested) st.topic = suggested; }
    var optsErr = function () { return hasOpts() && cleanOpts().length < 2; };
    var isPrimary = function () { return st.active === PRIMARY.code; };
    var trOf = function (code) { return st.tr[code] || {}; };

    var overlay = el(
      '<div class="overlay" style="z-index:60;">' +
      '<div class="dialog dialog-worksurface cq-dialog' + "" + '" role="dialog" aria-modal="true" aria-labelledby="cq-title" style="display:flex;flex-direction:column;">' +
      '<div class="tt-demo dialog-close-tt"><button class="dialog-close" aria-label="Close" data-tt="Close"><i data-icon="cross"></i></button></div>' +
      '<div class="cq-step-mount"></div>' +
      '<div class="dialog-header is-sm" style="padding-right:16px;">' +
      '<div class="bmq-kind"></div>' +
      '<h2 class="dialog-title" id="cq-title"></h2>' +
      '<p class="dialog-subtitle"></p>' +
      "</div>" +
      '<div class="dialog-body cq-body">' +
      '<div class="cq-sim-mount"></div>' +
      '<div class="cq-selects">' +
      '<div class="cq-field"><span class="cq-lbl">Topic <span class="cq-info" data-tt="Topics organise questions in your library. They don\'t affect benchmarks."><i data-icon="info"></i></span></span><div class="cq-topic-mount"></div><div class="cq-topic-hint" hidden></div><div class="cq-topic-err"></div></div>' +
      '<div class="cq-field"><span class="cq-lbl">Answer type</span><div class="cq-type-mount"></div></div>' +
      "</div>" +
      '<div class="cq-frame"><div class="cq-preview"></div><div class="cq-langs-mount"></div></div>' +
      "</div>" +
      '<div class="dialog-footer"></div>' +
      "</div></div>"
    );
    document.body.appendChild(overlay);

    /* review mode: the library may already have this question in other words —
       said once, up top; the decision stays with the coordinator */
    if (opts.review && opts.review.similar && opts.review.similar.length) {
      var s0 = opts.review.similar[0];
      overlay.querySelector(".cq-sim-mount").innerHTML =
        '<div class="inline-notif is-info cq-sim" role="status">' +
        '<img class="inline-notif-icon" src="assets/icons/notification-information.svg" alt="" />' +
        '<div class="inline-notif-content"><span class="inline-notif-text">' +
        '<span class="inline-notif-title">The library already has a similar question</span> ' +
        '<span class="inline-notif-msg">“' + esc(window.QL ? QL.fill(s0.text) : s0.text) + "” · " + (s0.bench ? "Standard" : "Custom") + ". You can still add this one.</span>" +
        "</span></div></div>";
    }

    function close() { QL.closeOverlay(overlay); timers.forEach(clearTimeout); clearTimeout(checkTimer); }
    overlay.querySelector(".dialog-close").addEventListener("click", close);
    overlay.addEventListener("mousedown", function (e) { if (e.target === overlay) close(); });
    document.addEventListener("keydown", function onEsc(e) {
      if (e.key === "Escape" && document.body.contains(overlay)) { close(); document.removeEventListener("keydown", onEsc); }
    });

    /* ── header ── */
    function renderHeader() {
      var kind = overlay.querySelector(".bmq-kind");
      var title = overlay.querySelector(".dialog-title");
      var sub = overlay.querySelector(".dialog-subtitle");
      if (opts.review) {
        /* review mode: the settings dialog, framed as adding to the library */
        var n = opts.review.uses || 0;
        kind.innerHTML =
          '<span class="infotag is-custom"><i data-icon="edit-inline"></i>Custom</span><span class="infotag is-alt">No benchmark</span>' +
          '<span class="infotag is-alt">Used in ' + n + (n === 1 ? " survey" : " surveys") + "</span>" +
          (opts.review.by ? '<span class="infotag is-alt">Created by ' + esc(opts.review.by) + "</span>" : "");
        title.textContent = st.text.trim() || "Review question";
        sub.textContent = "Review this question and add it to the library. Everyone who creates surveys can use it after you publish.";
      } else if (editing) {
        kind.innerHTML =
          (standard
            ? '<span class="infotag is-standard"><i data-icon="barchart-2"></i>Standard</span>' +
              (st.variant ? '<span class="infotag is-alt">Alternative wording</span>' : "")
            : '<span class="infotag is-custom"><i data-icon="edit-inline"></i>Custom</span><span class="infotag is-alt">No benchmark</span>') +
          (usedIn.length ? '<span class="infotag is-alt" data-tt="' + esc(usedIn.map(function (u) { return u[0]; }).join("\n")).replace(/\n/g, "&#10;") + '">Used in ' + usedIn.length + (usedIn.length === 1 ? " survey" : " surveys") + "</span>" : "");
        title.textContent = standard ? (st.variant || canonical) : (st.text.trim() || "Custom question");
        sub.textContent = standard
          ? "Defined by our professionals and compared to relevant benchmarks."
          : "Change the question and check its translations. Your changes apply everywhere this question is used.";
      } else {
        kind.innerHTML = "";
        title.textContent = "New custom question";
        sub.textContent = "Write your own question and choose how people answer it. Use this for specific questions that are only valid for your context.";
      }
      icons();
    }

    /* ── selects ── */
    var topicItems = (topicOptional ? [{ value: "", label: "No topic" }] : [])
      .concat((opts.topics || []).map(function (t) { return { value: t, label: t }; }));
    if (opts.review || (!editing && !standard)) {
      /* adding to the library: the field is the destination, not a property */
      overlay.querySelector(".cq-topic-mount").parentNode.querySelector(".cq-lbl").firstChild.textContent = "Add to topic ";
    }
    if (opts.topicLabel) {
      overlay.querySelector(".cq-topic-mount").parentNode.querySelector(".cq-lbl").firstChild.textContent = opts.topicLabel + " ";
    }
    var typeItems = [{ header: true, label: "Standard" }]
      .concat(["scale5", "text"].map(function (k) { return { value: k, label: QTYPES[k].label, lead: qtile(k) }; }))
      .concat([{ header: true, label: "Custom" }])
      .concat(["multiple", "single"].map(function (k) { return { value: k, label: QTYPES[k].label, lead: qtile(k) }; }));
    if (st.type === "nps") typeItems.push({ value: "nps", label: QTYPES.nps.label, lead: qtile("nps") });

    var topicSel = miniSelect(overlay.querySelector(".cq-topic-mount"), {
      value: st.topic || (topicOptional ? "" : undefined), placeholder: topicOptional ? "No topic" : "Topic name", items: topicItems, block: true,
      ariaLabel: "Topic",
      invalid: function () { return st.attempted && topicErr(); },
      onChange: function (v) { st.topic = v; topicHint.hidden = true; renderTopicErr(); if (editing) markDirty(); }
    });
    var topicHint = overlay.querySelector(".cq-topic-hint");
    if (suggested) { topicHint.textContent = "Suggested from the wording"; topicHint.hidden = false; }
    if (standard) {
      /* the answer type of a benchmarked question is fixed — visibly disabled (CYOS BMQ) */
      overlay.querySelector(".cq-type-mount").innerHTML =
        '<div class="bmq-type-disabled" aria-disabled="true" data-tt="The answer type of a benchmarked question is fixed">' +
        qtile(st.type, 20) + "<span>" + esc(QTYPES[st.type].label) + '</span><span class="spacer"></span><i data-icon="chevron-down"></i></div>';
    } else {
      miniSelect(overlay.querySelector(".cq-type-mount"), {
        value: st.type, items: typeItems, block: true, ariaLabel: "Answer type",
        onChange: function (v) { st.type = v; if (editing) markDirty(); renderPreview(); }
      });
    }
    function renderTopicErr() {
      overlay.querySelector(".cq-topic-err").innerHTML = (st.attempted && topicErr())
        ? '<div class="tf-err"><i data-icon="alert-circle"></i>Choose a topic for this question</div>' : "";
      icons();
    }

    /* ── translations (CYOS model) ── */
    function runAuto(langs, srcText, srcDesc, srcOpts) {
      if (!langs.length) return;
      langs.forEach(function (l) { st.tr[l.code] = { status: "pending" }; });
      renderLangs(); renderPreview();
      langs.forEach(function (l, i) {
        timers.push(setTimeout(function () {
          if ((st.tr[l.code] || {}).edited) return;
          st.tr[l.code] = {
            status: "done",
            text: autoTranslation(srcText, l.code),
            desc: autoTranslation(srcDesc, l.code),
            opts: srcOpts.map(function (o) { return autoTranslation(o, l.code); })
          };
          renderLangs();
          if (st.active === l.code) renderPreview();
        }, 700 + i * 180));
      });
    }
    function retranslate() {
      var srcText = st.text.trim(), srcDesc = st.desc.trim(), srcOpts = hasOpts() ? st.opts : [];
      if (!srcText) return;
      var key = srcText + " " + srcDesc + " " + srcOpts.join("|");
      if (key === lastSource) return;
      lastSource = key;
      if (!editing) return; /* while creating there are no translations yet */
      var handEdited = OTHERS.filter(function (l) { return trOf(l.code).edited; });
      runAuto(OTHERS.filter(function (l) { return !trOf(l.code).edited; }), srcText, srcDesc, srcOpts);
      if (handEdited.length) conflictDialog(handEdited, srcText, srcDesc, srcOpts);
    }
    function conflictDialog(langs, srcText, srcDesc, srcOpts) {
      var names = langs.map(function (l) { return l.label + " (" + l.country + ")"; });
      var joined = names.length < 2 ? names[0] : names.slice(0, -1).join(", ") + " and " + names[names.length - 1];
      var d = el(
        '<div class="overlay" style="z-index:70;"><div class="dialog dialog-s" role="dialog" aria-modal="true">' +
        '<div class="dialog-header is-sm"><div class="dialog-header-top">' +
        '<span class="dialog-header-icon is-warning"><i data-icon="alert-circle"></i></span>' +
        '<h2 class="dialog-title">Keep your manual translations?</h2></div>' +
        '<p class="dialog-subtitle">You changed the question, so the manual translation' + (langs.length > 1 ? "s" : "") + " for " + esc(joined) +
        " no longer match" + (langs.length > 1 ? "" : "es") + ". Keep " + (langs.length > 1 ? "them" : "it") +
        " and check " + (langs.length > 1 ? "them" : "it") + " yourself, or replace " + (langs.length > 1 ? "them" : "it") + " with new automatic translations.</p></div>" +
        '<div class="dialog-footer">' +
        '<button class="btn btn-secondary" data-ow>Replace with automatic</button>' +
        '<button class="btn btn-primary" data-keep>Keep manual translations</button>' +
        "</div></div></div>"
      );
      document.body.appendChild(d);
      icons();
      d.querySelector("[data-keep]").addEventListener("click", function () {
        langs.forEach(function (l) { st.tr[l.code].stale = true; });
        d.remove(); renderLangs(); renderPreview();
      });
      d.querySelector("[data-ow]").addEventListener("click", function () {
        d.remove(); runAuto(langs, srcText, srcDesc, srcOpts);
      });
    }
    function selectLanguage(code) {
      if (code === st.active) return;
      if (trOf(st.active).stale) st.tr[st.active].stale = false;
      st.editingNow = null;
      st.active = code;
      var lang = OTHERS.filter(function (l) { return l.code === code; })[0];
      /* standard questions ship pre-translated by Effectory — nothing to run */
      if (!standard && lang && !st.tr[code] && st.text.trim()) {
        runAuto([lang], st.text.trim(), st.desc.trim(), hasOpts() ? st.opts : []);
      }
      renderLangs(); renderPreview();
    }

    /* ── languages sidebar / compact select ── */
    function langRow(l) {
      var t = trOf(l.code);
      var active = st.active === l.code;
      return '<button type="button" class="cq-lang' + (active ? " is-active" : "") + (t.status === "pending" ? " is-working" : "") + '" data-lang="' + l.code + '"' + (active ? ' aria-current="true"' : "") + ">" +
        flagHTML(l) +
        '<span class="cq-lang-txt"><span class="cq-lang-name">' + esc(l.label) + '</span><span class="cq-lang-country">' + esc(l.country) + "</span></span>" +
        (t.edited ? '<span class="cq-lang-manual" data-tt="' + MANUAL_LABEL + '"><i data-icon="language"></i></span>' : "") +
        "</button>";
    }
    function renderLangs() {
      var mount = overlay.querySelector(".cq-langs-mount");
      var frame = overlay.querySelector(".cq-frame");
      frame.classList.toggle("is-compact", st.compact);
      if (!editing || st.compact) { mount.innerHTML = ""; renderCompactLangSel(); return; }
      mount.innerHTML = '<div class="cq-langs">' +
        '<div class="cq-langs-head">Primary language</div>' + langRow(PRIMARY) +
        '<div class="cq-langs-head is-count"><span class="cq-langs-title">Translations (' + OTHERS.length + ")</span></div>" +
        '<div class="cq-langs-scroll scroll-y">' + OTHERS.map(langRow).join("") + "</div></div>";
      mount.querySelectorAll("[data-lang]").forEach(function (b) {
        b.addEventListener("click", function () { selectLanguage(b.getAttribute("data-lang")); });
      });
      icons();
    }
    function renderCompactLangSel() {
      var slot = overlay.querySelector(".cq-langsel-slot");
      if (!editing || !st.compact) { if (slot) slot.remove(); return; }
      /* rendered inside the preview by renderPreview() */
    }

    /* ── preview ── */
    function scalePreviewHTML(lang) {
      var s = scaleFor(lang);
      return '<div class="cq-scale"><div class="cq-scale-row">' +
        '<span class="cq-scale-end">' + esc(s.points[0]) + "</span>" +
        '<div class="cq-dots">' + SCALE_DOTS.map(function (c, i) {
          return '<span class="cq-dot" style="--dot:' + c + '" tabindex="0" role="img" aria-label="' + esc(s.points[i]) + '" data-tt="' + esc(s.points[i]) + '"></span>';
        }).join("") + "</div>" +
        '<span class="cq-scale-end">' + esc(s.points[4]) + "</span></div>" +
        '<span class="cq-idk">' + esc(s.dontKnow) + "</span></div>";
    }
    function npsPreviewHTML() {
      var dots = "";
      for (var i = 0; i <= 10; i++) dots += '<span class="cq-dot" style="--dot:var(--bg-distribution-no-answer);width:18px;height:18px;" data-tt="' + i + '"></span>';
      return '<div class="cq-scale"><div class="cq-scale-row">' +
        '<span class="cq-scale-end">Not at all likely</span><div class="cq-dots" style="gap:6px;">' + dots + "</div>" +
        '<span class="cq-scale-end">Extremely likely</span></div></div>';
    }
    function renderPreview() {
      var pv = overlay.querySelector(".cq-preview");
      var t = trOf(st.active);
      var working = !isPrimary() && t.status === "pending";
      var stale = !isPrimary() && !!t.stale;
      var showManual = !isPrimary() && !working && !stale && !!t.edited && st.editingNow !== st.active;
      var shownText = isPrimary() ? st.text : (t.text != null ? t.text : (st.text.trim() ? autoTranslation(st.text, st.active) : ""));
      var shownDesc = isPrimary() ? st.desc : (t.desc != null ? t.desc : (st.desc.trim() ? autoTranslation(st.desc, st.active) : ""));
      var shownOpts = isPrimary() ? st.opts : (t.opts || st.opts.map(function (o) { return o ? autoTranslation(o, st.active) : ""; }));
      var showTextErr = isPrimary() && st.attempted && textErr() && !standard;

      var langSelHTML = (editing && st.compact)
        ? '<div class="cq-field cq-langsel cq-langsel-slot"><span class="cq-lbl">Languages</span><div class="cq-langsel-mount"></div></div>' : "";

      var answer;
      if (st.type === "text") {
        answer = '<textarea class="ta" rows="4" disabled placeholder="' + esc(scaleFor(st.active).open) + '" style="background:var(--bg-secondary);resize:none;min-height:96px;"></textarea>';
      } else if (st.type === "nps") {
        answer = npsPreviewHTML();
      } else if (hasOpts()) {
        answer = '<div class="cq-opts">' + shownOpts.map(function (o, i) {
          return '<div class="cq-opt">' +
            '<button type="button" class="cq-mark ' + (st.type === "single" ? "is-radio" : "is-check") + '" data-pv="' + i + '" data-tt="' + (st.type === "single" ? "Participants pick one" : "Participants pick any") + '" role="' + (st.type === "single" ? "radio" : "checkbox") + '" aria-checked="false" aria-label="Preview answer option ' + (i + 1) + '"></button>' +
            '<input class="cq-opt-input" data-opt="' + i + '" value="' + esc(o) + '" placeholder="Answer option ' + (i + 1) + '"' + (standard ? " disabled" : "") + ">" +
            (isPrimary() && !standard ? '<button class="ib ib-36 ib-tertiary' + (st.opts.length <= 2 ? " is-disabled" : "") + '" data-rmopt="' + i + '" aria-label="Remove option" data-tt="Remove option"' + (st.opts.length <= 2 ? " disabled" : "") + '><i data-icon="cross"></i></button>' : "") +
            "</div>";
        }).join("") +
        (isPrimary() && st.attempted && optsErr() && !standard ? '<div class="tf-err"><i data-icon="alert-circle"></i>Add at least 2 answer options.</div>' : "") +
        (isPrimary() && !standard && st.opts.length < 8 ? '<button class="btn btn-tertiary cq-add-opt" data-addopt><i data-icon="plus"></i>Add option</button>' : "") +
        "</div>";
      } else {
        answer = scalePreviewHTML(st.active);
      }

      /* standard questions: the wording is a select over the approved
         alternatives (CYOS BenchmarkQuestionDialog); translations are locked */
      var fields;
      if (standard) {
        fields = isPrimary()
          ? '<div class="bmq-sel-wrap is-big"><button type="button" class="bmq-sel" id="bmqWording" aria-haspopup="listbox"><span class="bmq-sel-text">' + esc(st.variant || canonical) + '</span><i data-icon="chevron-down"></i></button></div>' +
            '<textarea class="bmq-descfield" rows="2" placeholder="Add a description (optional)" aria-label="Description">' + esc(st.desc) + "</textarea>"
          : '<div class="bmq-lang-note">Translations of benchmarked questions are provided by Effectory. Change the wording in the primary language.</div>' +
            '<div class="bmq-locked is-big">' + esc(autoTranslation(st.variant || canonical, st.active)) + "</div>" +
            (st.desc.trim() ? '<div class="bmq-locked">' + esc(autoTranslation(st.desc, st.active)) + "</div>" : "");
      } else {
        fields =
          (showManual ? '<div class="cq-card-note"><i data-icon="language"></i>' + MANUAL_LABEL + "</div>" : "") +
          (stale ? '<div class="cq-card-note is-stale" role="status"><i data-icon="alert-circle"></i>' + STALE_NOTE + '<button type="button" class="cq-note-action" data-retr>Translate again</button></div>' : "") +
          '<textarea class="cq-qfield' + (showTextErr ? " is-error" : "") + '" rows="1" placeholder="' + (working ? "" : "Write a positive statement here") + '">' + esc(shownText) + "</textarea>" +
          (showTextErr ? '<div class="tf-err"><i data-icon="alert-circle"></i>Write a question of at least a few words</div>' : "") +
          '<textarea class="cq-descfield" rows="1" placeholder="' + (working ? "" : "Elaborate the context of your question here (optional)") + '">' + esc(shownDesc) + "</textarea>";
      }

      pv.innerHTML = langSelHTML +
        '<div class="bmq-inner"><div class="cq-card' + (working ? " is-working" : "") + '">' +
        fields +
        '<div class="cq-answer">' + answer + "</div>" +
        "</div></div>";

      if (editing && st.compact) {
        miniSelect(pv.querySelector(".cq-langsel-mount"), {
          value: st.active, block: true, ariaLabel: "Languages",
          items: [{ header: true, label: "Primary language" }, langItem(PRIMARY), { header: true, label: "Translations (" + OTHERS.length + ")" }].concat(OTHERS.map(langItem)),
          onChange: selectLanguage
        });
      }

      var qf = pv.querySelector(".cq-qfield"), df = pv.querySelector(".cq-descfield");
      if (qf) {
        [qf, df].forEach(autosize);
        qf.addEventListener("input", function () {
          autosize(qf);
          if (isPrimary()) { st.text = qf.value; if (editing) { markDirty(); renderHeader(); } }
          else { st.editingNow = st.active; st.tr[st.active] = Object.assign({}, trOf(st.active), { text: qf.value, edited: true, stale: false, status: "done" }); if (editing) markDirty(); renderLangs(); }
          resetCheck();
        });
        df.addEventListener("input", function () {
          autosize(df);
          if (isPrimary()) st.desc = df.value;
          else { st.editingNow = st.active; st.tr[st.active] = Object.assign({}, trOf(st.active), { desc: df.value, edited: true, stale: false, status: "done" }); renderLangs(); }
          if (editing) markDirty();
          resetCheck();
        });
        if (isPrimary()) {
          qf.addEventListener("blur", retranslate);
          df.addEventListener("blur", retranslate);
        }
      }
      var bw = pv.querySelector("#bmqWording");
      if (bw) bw.addEventListener("click", function (e) { e.stopPropagation(); wordingDropdown(bw); });
      var bd = pv.querySelector(".bmq-descfield");
      if (bd) bd.addEventListener("input", function () { st.desc = bd.value; markDirty(); });
      var retr = pv.querySelector("[data-retr]");
      if (retr) retr.addEventListener("click", function () {
        var lang = LANGUAGES.filter(function (l) { return l.code === st.active; })[0];
        runAuto([lang], st.text.trim(), st.desc.trim(), hasOpts() ? st.opts : []);
      });
      pv.querySelectorAll("[data-pv]").forEach(function (b) {
        b.addEventListener("click", function () {
          if (st.type === "single") {
            var was = b.classList.contains("is-on");
            pv.querySelectorAll("[data-pv]").forEach(function (x) { x.classList.remove("is-on"); x.setAttribute("aria-checked", "false"); });
            if (!was) { b.classList.add("is-on"); b.setAttribute("aria-checked", "true"); }
          } else {
            b.classList.toggle("is-on");
            b.setAttribute("aria-checked", b.classList.contains("is-on"));
          }
        });
      });
      pv.querySelectorAll("[data-opt]").forEach(function (inp) {
        inp.addEventListener("input", function () {
          var i = +inp.getAttribute("data-opt");
          if (isPrimary()) st.opts[i] = inp.value;
          else {
            st.editingNow = st.active;
            var cur = trOf(st.active);
            var arr = (cur.opts || st.opts.map(function (o) { return o ? autoTranslation(o, st.active) : ""; })).slice();
            arr[i] = inp.value;
            st.tr[st.active] = Object.assign({}, cur, { opts: arr, edited: true, stale: false, status: "done" });
            renderLangs();
          }
          resetCheck();
        });
        if (!standard && isPrimary()) inp.addEventListener("blur", retranslate);
      });
      pv.querySelectorAll("[data-rmopt]").forEach(function (b) {
        b.addEventListener("click", function () {
          st.opts.splice(+b.getAttribute("data-rmopt"), 1);
          renderPreview();
        });
      });
      var add = pv.querySelector("[data-addopt]");
      if (add) add.addEventListener("click", function () { st.opts.push(""); renderPreview(); });
      icons();
    }
    function langItem(l) {
      var t = trOf(l.code);
      return { value: l.code, label: l.label, sub: l.country, lead: flagHTML(l), working: t.status === "pending", trail: t.edited ? '<span class="cq-lang-manual"><i data-icon="language"></i></span>' : "" };
    }

    /* ── the check step (create flow) ── */
    function resetCheck() { st.checked = null; if (st.phase === "picking") { st.phase = null; renderStep(); } }
    function buildQ() {
      return {
        text: st.text.trim(), desc: st.desc.trim() || undefined,
        type: TO_QL[st.type], topic: st.topic, custom: true, also: !!st.also,
        options: hasOpts() ? cleanOpts() : undefined
      };
    }
    function finish(nq, reused) {
      st.done = { q: nq, reused: reused };
      st.phase = "success";
      renderStep();
      checkTimer = setTimeout(close, DONE_MS);
    }
    function checkThenSubmit() {
      st.attempted = true;
      if (!standard) { renderTopicErr(); renderPreview(); }
      if (!standard && (textErr() || topicErr() || optsErr())) return;
      if (editing) { saveEdit(); return; }
      /* adding is deliberately simple here: no similarity check, no extra steps
         (the CYOS check flow is still in this file behind opts.withCheck) */
      if (!opts.withCheck) {
        opts.onAdd(buildQ());
        close();
        var q0 = buildQ();
        var note = typeof opts.addNotify === "function" ? opts.addNotify(q0) : opts.addNotify;
        if (note) QL.notify(note.title, note.desc);
        else QL.notify("Question added to your library");
        return;
      }
      st.phase = "loading";
      renderStep();
      checkTimer = setTimeout(function () {
        var m = similarQuestions(st.text, opts.pool || []);
        if (m.length) { st.checked = m; st.pick = "mine"; st.phase = "picking"; renderStep(); }
        else {
          var nq = buildQ();
          opts.onAdd(nq);
          finish(nq, false);
        }
      }, CHECK_MS);
    }
    function addPicked() {
      var m = st.pick === "mine" ? null : (st.checked || []).filter(function (x) { return x.id === st.pick; })[0];
      if (m) { if (opts.onUse) opts.onUse(m); finish({ text: m.text, topic: m.theme, custom: !m.bench, bench: m.bench }, true); return; }
      var nq = buildQ();
      opts.onAdd(nq);
      finish(nq, false);
    }
    function createAnother() {
      clearTimeout(checkTimer);
      st.phase = null; st.checked = null; st.pick = "mine"; st.done = null;
      st.text = ""; st.desc = ""; st.opts = ["", ""]; st.attempted = false; st.tr = {};
      lastSource = "";
      renderStep(); renderPreview(); renderHeader();
    }
    function renderStep() {
      var mount = overlay.querySelector(".cq-step-mount");
      if (!st.phase) { mount.innerHTML = ""; renderFooter(); return; }
      var html = '<div class="cq-step" role="group" aria-label="Check question">';
      if (st.phase === "loading") {
        html += '<div class="cq-step-center" role="status" aria-live="polite"><span class="block-loader"><span class="spinner spinner-lg"></span>Checking for similar questions</span></div>';
      } else if (st.phase === "success") {
        html += '<div class="cq-step-center" role="status" aria-live="polite">' +
          '<span class="cq-step-ok is-pop"><i data-icon="check"></i>' +
          '<svg class="cq-step-ring" viewBox="0 0 100 100" aria-hidden="true"><circle class="cq-ring-track" cx="50" cy="50" r="46"/><circle class="cq-ring-run" cx="50" cy="50" r="46" style="animation-duration:' + DONE_MS + 'ms"/></svg></span>' +
          '<div class="cq-step-title">Question added</div>' +
          '<div class="cq-step-sub">' + (st.done.reused
            ? (st.done.q.bench ? "You reused a library question, so its benchmark and translations come with it" : "You reused an existing question, so its translations come with it")
            : "It went in as the last question in " + esc(st.done.q.topic || "your library")) + "</div>" +
          '<div class="cq-step-btns">' +
          '<button class="btn btn-tertiary" data-another>Create another question</button>' +
          '<button class="btn btn-secondary" data-closeok>Close</button>' +
          (st.done.q.custom && opts.onOpenCreated ? '<button class="btn btn-primary" data-checktr>Check translations</button>' : "") +
          "</div></div>";
      } else if (st.phase === "picking") {
        html += '<div class="cq-step-head"><h3 class="cq-step-title">We found similar existing questions</h3>' +
          '<p class="cq-step-sub is-wide">Reusing an existing question keeps your results comparable with the rest of the organisation and with earlier surveys. Keeping your own wording is fine too: it just won\'t have a benchmark to compare against.</p></div>' +
          '<div class="cq-step-opts" role="radiogroup" aria-label="Question to add">' +
          '<div class="cq-opt-sec"><h4 class="cq-opt-sechead">Your new question</h4>' + optCard("mine", st.text.trim(), null, st.type) + "</div>" +
          '<div class="cq-opt-sec"><h4 class="cq-opt-sechead">Similar questions <span class="tag tag-count">' + st.checked.length + "</span></h4>" +
          st.checked.map(function (m) { return optCard(m.id, m.text, m, FROM_QL[m.type] || "scale5"); }).join("") +
          "</div></div>" +
          '<div class="cq-step-foot"><button class="btn btn-secondary" data-back><i data-icon="arrow-left"></i>Back</button><span class="spacer"></span>' +
          '<button class="btn btn-primary" data-confirm>Confirm &amp; add</button></div>';
      }
      html += "</div>";
      mount.innerHTML = html;
      var q1 = mount.querySelector("[data-another]"); if (q1) q1.addEventListener("click", createAnother);
      var q2 = mount.querySelector("[data-closeok]"); if (q2) q2.addEventListener("click", close);
      var q3 = mount.querySelector("[data-checktr]"); if (q3) q3.addEventListener("click", function () { clearTimeout(checkTimer); close(); opts.onOpenCreated(st.done.q); });
      var q4 = mount.querySelector("[data-back]"); if (q4) q4.addEventListener("click", function () { st.phase = null; st.checked = null; renderStep(); });
      var q5 = mount.querySelector("[data-confirm]"); if (q5) q5.addEventListener("click", addPicked);
      mount.querySelectorAll(".cq-opt-card").forEach(function (c) {
        c.addEventListener("click", function () {
          st.pick = c.getAttribute("data-pick") === "mine" ? "mine" : c.getAttribute("data-pick");
          mount.querySelectorAll(".cq-opt-card").forEach(function (x) {
            var on = x === c;
            x.classList.toggle("is-on", on);
            x.setAttribute("aria-checked", on);
          });
        });
      });
      renderFooter();
      icons();
    }
    function optCard(id, text, m, type) {
      var on = st.pick === id;
      var tags = m
        ? (m.bench ? '<span class="infotag is-standard"><i data-icon="barchart-2"></i>Standard</span>' : '<span class="infotag is-custom"><i data-icon="edit-inline"></i>Custom</span>') +
          (m.theme ? '<span class="infotag is-alt">' + esc(m.theme) + "</span>" : "")
        : '<span class="infotag is-custom"><i data-icon="edit-inline"></i>Your question</span><span class="infotag is-alt">No benchmark</span>';
      return '<button type="button" class="cq-opt-card' + (on ? " is-on" : "") + '" role="radio" aria-checked="' + on + '" data-pick="' + esc(String(id)) + '">' +
        '<span class="cq-opt-mark" aria-hidden="true"></span>' +
        '<span class="cq-opt-text">' + esc(text) + "</span>" +
        '<span class="cq-opt-tags">' + tags + "</span>" + qtile(type) + "</button>";
    }

    /* ── the approved-wordings dropdown (CYOS PreviewSelect, portalled) ── */
    var ddOpen = null;
    function wordingDropdown(trigger) {
      if (ddOpen) { ddOpen.dd.remove(); ddOpen.scrim.remove(); ddOpen = null; return; }
      var current = st.variant || canonical;
      var options = [canonical].concat(variantsOf(canonical, st.type));
      var r = trigger.getBoundingClientRect();
      var scrim = el('<div class="cq-menu-scrim" style="z-index:1200;"></div>');
      var dd = el('<div class="bmq-dropdown is-portal is-big" role="listbox" style="position:fixed;z-index:1300;left:' + r.left + "px;top:" + (r.bottom + 4) + "px;width:" + r.width + 'px;max-height:320px;"></div>');
      dd.innerHTML = options.map(function (o) {
        var on = o === current;
        return '<div class="bmq-dd-opt' + (on ? " is-selected" : "") + '" role="option" aria-selected="' + on + '" data-w="' + esc(o) + '">' +
          '<span class="bmq-dd-opt-text">' + esc(o) + "</span>" + (on ? '<i data-icon="check"></i>' : "") + "</div>";
      }).join("") +
        '<div class="bmq-dd-foot"><button class="bmq-dd-detach" data-detach><i data-icon="edit"></i><span><b>Write your own wording</b><span>Becomes a custom question. Loses the benchmark.</span></span></button></div>';
      document.body.appendChild(scrim);
      document.body.appendChild(dd);
      ddOpen = { dd: dd, scrim: scrim };
      function closeDD() {
        dd.remove(); scrim.remove(); ddOpen = null;
        document.removeEventListener("scroll", onScroll, true);
      }
      /* the dropdown is fixed-position: close it when the dialog scrolls away */
      function onScroll(e) { if (!dd.contains(e.target)) closeDD(); }
      document.addEventListener("scroll", onScroll, true);
      scrim.addEventListener("mousedown", closeDD);
      dd.querySelectorAll(".bmq-dd-opt").forEach(function (o) {
        o.addEventListener("click", function () {
          var w = o.getAttribute("data-w");
          st.variant = (w === canonical) ? undefined : w;
          closeDD();
          markDirty(); renderHeader(); renderPreview();
        });
      });
      dd.querySelector("[data-detach]").addEventListener("click", function () { closeDD(); writeOwnWording(); });
      icons();
    }

    /* ── save / delete (edit flow) — publishing pushes changes platform-wide ── */
    function saveEdit() {
      close();
      QL.notify("Question updated", QL.DRAFT_NOTE);
      opts.onSave({
        text: standard ? (st.variant || canonical) : st.text.trim(),
        desc: st.desc.trim(),
        type: TO_QL[st.type], topic: st.topic
      });
    }
    function deleteQuestion() {
      QL.confirmDialog({
        icon: "error",
        title: "Remove this question from the library?",
        subtitle: "It stays in the surveys and templates that already use it. New surveys can't pick it from the library anymore.",
        confirmLabel: "Remove",
        danger: true
      }, function () {
        close();
        if (!opts.quietDelete) QL.notify("Question removed from the library", "It stays in the surveys and templates that already use it.");
        opts.onDelete();
      });
    }
    /* standard → custom hand-off (CYOS BenchmarkQuestionDialog) */
    function writeOwnWording() {
      var d = el(
        '<div class="overlay" style="z-index:70;"><div class="dialog dialog-s" role="dialog" aria-modal="true">' +
        '<div class="dialog-header is-sm"><div class="dialog-header-top">' +
        '<span class="dialog-header-icon is-warning"><i data-icon="alert-circle"></i></span>' +
        '<h2 class="dialog-title">Write your own wording?</h2></div>' +
        '<p class="dialog-subtitle">Your version becomes a custom question: it won\'t have a benchmark to compare against, and its translations are yours to review. The standard question stays in the library.</p></div>' +
        '<div class="dialog-footer">' +
        '<button class="btn btn-secondary" data-cancel>Cancel</button>' +
        '<button class="btn btn-primary" data-go>Write my own wording</button>' +
        "</div></div></div>"
      );
      document.body.appendChild(d);
      icons();
      d.querySelector("[data-cancel]").addEventListener("click", function () { d.remove(); });
      d.querySelector("[data-go]").addEventListener("click", function () {
        d.remove(); close();
        open({
          mode: "create", topics: opts.topics, defaultTopic: st.topic, pool: opts.pool,
          prefill: { text: st.variant || canonical || st.text, type: st.type }, focusTitle: true,
          onAdd: opts.onAdd, onOpenCreated: opts.onOpenCreated
        });
      });
    }

    /* ── footer ── */
    function renderFooter() {
      var f = overlay.querySelector(".dialog-footer");
      var busy = !!st.phase;
      if (opts.review) {
        /* review mode: no delete, no save — the outcome is adding to the library */
        f.innerHTML = '<span class="spacer"></span>' +
          '<span class="cq-bench-note"><i data-icon="info"></i>Custom questions do not have a benchmark comparison in the results</span>' +
          '<button class="btn btn-secondary" data-cancel>Cancel</button>' +
          '<button class="btn btn-primary" data-primary>Add to library</button>';
        f.querySelector("[data-primary]").addEventListener("click", function () {
          st.attempted = true;
          renderTopicErr(); renderPreview();
          if (textErr() || topicErr() || optsErr()) return;
          close();
          opts.onConfirm({ text: st.text.trim(), desc: st.desc.trim(), type: TO_QL[st.type], topic: st.topic });
        });
        f.querySelector("[data-cancel]").addEventListener("click", close);
        icons();
        return;
      }
      if (editing && standard) {
        f.innerHTML = '<span class="spacer"></span>' +
          '<button class="btn btn-secondary" data-cancel>Cancel</button>' +
          '<button class="btn btn-primary' + (dirty ? "" : " is-disabled") + '" data-primary' + (dirty ? "" : " disabled") + ">Save</button>";
        var sb = f.querySelector("[data-primary]");
        if (dirty) sb.addEventListener("click", checkThenSubmit);
      } else if (editing) {
        f.innerHTML = '<button class="btn btn-danger-tertiary" data-del><i data-icon="trash"></i>Remove from library</button><span class="spacer"></span>' +
          '<span class="cq-bench-note"><i data-icon="info"></i>Custom questions do not have a benchmark comparison in the results</span>' +
          '<button class="btn btn-secondary" data-cancel>Cancel</button>' +
          '<button class="btn btn-primary" data-primary>Save changes</button>';
        f.querySelector("[data-del]").addEventListener("click", deleteQuestion);
        f.querySelector("[data-primary]").addEventListener("click", checkThenSubmit);
      } else {
        f.innerHTML =
          /* writing a question outside the library (e.g. in a template): the
             coordinator's shortcut to make it a library question right away */
          (opts.alsoLibrary
            ? '<label class="cb-label-wrap cq-also"><span class="cb-wrap"><input type="checkbox" class="cb" data-also' + (st.also ? " checked" : "") + ' /></span>Also add to the library</label>'
            : "") +
          '<span class="spacer"></span>' +
          '<span class="cq-bench-note"><i data-icon="info"></i>Custom questions do not have a benchmark comparison in the results</span>' +
          '<button class="btn btn-secondary" data-cancel>Cancel</button>' +
          '<button class="btn btn-primary' + (busy ? " is-disabled" : "") + '" data-primary' + (busy ? " disabled" : "") + ">" +
          (opts.withCheck ? "Check question" : "Add question") + "</button>";
        var also = f.querySelector("[data-also]");
        if (also) also.addEventListener("change", function () { st.also = also.checked; });
        var p = f.querySelector("[data-primary]");
        if (p) p.addEventListener("click", checkThenSubmit);
      }
      f.querySelector("[data-cancel]").addEventListener("click", close);
      icons();
    }

    /* prefill (write-your-own-wording hand-off) */
    if (opts.prefill) { st.text = opts.prefill.text || ""; st.type = opts.prefill.type || "scale5"; }

    /* compact breakpoint */
    var mq = matchMedia("(max-width: 1160px)");
    var onMQ = function () { st.compact = mq.matches; renderLangs(); renderPreview(); };
    mq.addEventListener("change", onMQ);

    renderHeader();
    renderLangs();
    renderPreview();
    renderFooter();
    icons();

    if (opts.focusTitle || !editing) {
      setTimeout(function () {
        var elq = overlay.querySelector(".cq-qfield");
        /* preventScroll: focusing must not scroll the dialog's own box and push the header up */
        if (elq && !standard) { try { elq.focus({ preventScroll: true }); } catch (e) { elq.focus(); } if (opts.focusTitle) elq.select(); }
      }, 80);
    }
    return { close: close };
  }

  return {
    openCreate: function (o) { return open(Object.assign({ mode: "create" }, o)); },
    openEdit: function (question, o) { return open(Object.assign({ mode: "edit", question: question }, o)); },
    /* the settings dialog reframed as a review step: topic on top, editable
       wording and translations, "Add to library" as the outcome */
    openReview: function (question, o) { return open(Object.assign({ mode: "edit", question: question }, o)); },
    QTYPES: QTYPES, FROM_QL: FROM_QL, TO_QL: TO_QL,
    similar: similarQuestions, similarScored: similarScored, topicScores: topicScores, suggestTopic: suggestTopic,
    previewHTML: previewHTML, typeTile: typeTile
  };
})();
