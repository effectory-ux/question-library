# Question library v2 — live import (my.effectory.com)

Captured 2026-08-31 from `https://my.effectory.com/projects/32139/question-library-v2`
Project: "Central employee listening, March 2025 – November 2029" · Coordinator role · BETA label on the page title.
Org-name variable in this project resolves to "Questionnaire Logincode Migration".

This documents the current live v2 as the baseline for the Question library 3 concept work.

---

## Page frame

- Breadcrumb bar: `← Back` + project name; on tabs other than Overview it extends to `… / Your question library`.
- Title: **Question library** + `BETA` badge. Subtitle: "Explore the questions you can ask in your surveys for this project".
- Top-right button: **Learn more about questions** (opens a large modal, see below).
- Tab bar: **Overview · Themes & topics · All questions · Variables** (each tab is its own route: `/question-library-v2`, `/questionsets`, `/allquestions`, `/variables`).
- Persistent warning banner (orange, on every tab): *"Question Management is currently available in read-only mode. Changes to questionnaires, including adding your own questions, are temporarily under maintenance. Please request any changes via your main contact person. Change requests will be processed within 8–10 working days."*
- Persistent dismissible promo bar: "Learn everything about **question library!**" + **Watch Video** button + close.
- First visit shows a **"Discover your Question Library" BETA welcome dialog** (expectation-setting: inconsistent behavior, bugs, incomplete data, performance; feedback via support channels / CSM). Dismissed with "Got it!".

## Tab 1 — Overview (`/question-library-v2`)

Section heading: "Overview | Latest status of the question library".

- Three stat cards in one row, each with icon + arrow link (arrow navigates to the matching tab):
  - **21 themes** — breakdown row: Standard themes 21
  - **19 topics** — breakdown row: Standard topics 19
  - **145 questions** — breakdown rows: Standard questions 145 · Custom questions 0
- **Top question sets** card — errored in this session: *"We're unable to load your top questions sets"* (red text). Broken/unstable in the beta.

## Tab 2 — Themes & topics (`/questionsets`)

Toolbar:
- **Library languages** dropdown (with info icon): English (United States) ✓, Dutch (Netherlands), Portuguese (Portugal). Switches the display language of the library content.
- **Search for specific questions** field (right-aligned).
- **Collapse all** toggle button. All sections load expanded.

Content: one accordion card per **theme** and per **topic**, in a single list (themes first, then topics). Card header: name + "N Questions" + `Theme`/`Topic` badge + collapse chevron.

- **Theme card body**: description paragraph(s) on the left, an explainer **video thumbnail** on the right, then a "Questions" list (plain rows, not expandable, no answer-type shown here).
- **Topic card body**: no description, no video — just the "Questions" list.
- Question rows are static (no click/expand behavior).

### Themes (21)

| Theme | # questions |
|---|---|
| Alignment | 3 |
| Autonomy | 3 |
| Change Management | 3 |
| Customer focus | 2 |
| Employer Excellence | 4 |
| Enablement | 3 |
| Engagement | 4 |
| Inclusion | 3 |
| Ownership | 3 |
| Psychological safety | 3 |
| Role clarity | 3 |
| Leading change | 5 |
| Managing People | 5 |
| Managing Systems | 5 |
| Performance Environment | 18 |
| Providing Direction | 3 |
| Sustainable employability | 4 |
| Team Leadership | 4 |
| Team productivity | 3 |
| Teamwork | 4 |
| Trust | 3 |

Each theme has a 1–2 paragraph description ("what it is" + "what the score shows"). Questions can appear in multiple themes (e.g. "I have confidence in my manager" is in Trust, Leading change, and Performance Environment; Performance Environment is an 18-question umbrella largely composed of Leading change / Managing People / Managing Systems / Providing Direction items).

### Topics (19)

| Topic | # questions |
|---|---|
| Work enjoyment | 6 |
| Work enablement | 5 |
| Work performance | 11 |
| Wellbeing and workload | 12 |
| Work environment and conditions | 8 |
| Team dynamics | 10 |
| Team collaboration and performance | 15 |
| Team leadership | 19 |
| Company strategy | 4 |
| Company leadership | 4 |
| Company communication and collaboration | 6 |
| Company culture | 14 |
| Diversity, Equity and Inclusion | 7 |
| Change management | 9 |
| Feedback and action | 3 |
| Growth and development | 7 |
| eNPS | 1 |
| Topics of pride | 2 |
| Topics to improve | 2 |

Note: "Team leadership" exists both as a Theme (4 q) and a Topic (19 q); same for Change management. Topic groupings follow an ascending scope arc: work → team → company → cross-cutting subjects → open/eNPS questions.

## Tab 3 — All questions (`/allquestions`)

Same toolbar (language dropdown + search; no Collapse all). Flat list of all 145 questions **grouped under topic headings** (same 19 topics, same order). Each question row shows:

- Question text (left)
- `Standard` badge (teal) — custom questions would presumably get a different badge; this project has none
- Answer-type icon + label (right): **Likert** (vast majority), **Other**, **eNPS**, **Open text**

Hovering the answer-type label shows a tooltip listing the actual scale, e.g. Likert → "Strongly agree / Agree / Neither agree nor disagree / Disagree / Strongly disagree".

Search filters live across the list, keeps topic group headings, and highlights the matched term in yellow within each question.

Non-Likert questions in this project:
- "What hinders you in doing your work remotely? You may select multiple topics" — Other (select options)
- "My workload is" — Other (workload scale)
- "I am able to maintain a good balance between working and relaxing" — Other
- "I have experienced undesirable behavior by colleagues in the past year (…)" — Other
- "I have experienced undesirable behavior by customers/clients in the past year (…)" — Other
- "I have taken serious action to look for another job over the past three months, or plan to do so in the next three months" — Other (retention scale)
- "How likely is it that you would recommend … as an employer to others?" — eNPS
- "What are you most proud of within …?" — Other · "What makes you proud of this? Please give a short description" — Open text
- "What needs improvement within …?" — Other · "What could your organization do better? Please give a short description" — Open text

## Tab 4 — Variables (`/variables`)

Same language dropdown. Simple two-column table: **VARIABLE · OCCURRENCES**, each row with an eye icon.

| Variable | Occurrences |
|---|---|
| manager | 1 |
| Questionnaire Logincode Migration (org name) | 44 |

Eye icon opens a **"Variable" dialog**: variable shown as a highlighted chip, then "Content with the variable — Check if the content makes sense with the variable." followed by a scrollable Questions list where every occurrence of the variable is rendered as a chip inside the question text. Close button only (read-only).

- manager → 1 question: "I feel appreciated by my manager"
- org name → 44 questions (all org-referencing items)

## "Learn more about our questions" modal

Large modal with left side-nav (About questions · Question types and answer scales · Themes and topics) and scrollable article:

- **About questions**: content is based on validated, theory-based question sets; all validated questions/topics/themes are benchmarked against other organizations.
- **Question types and answer scales** (each with its icon):
  - **Likert scale** — 5-point: Strongly agree – Agree – Neither agree nor disagree – Disagree – Strongly disagree; reported as average scores.
  - **10-point scale** — 10 to 0; reported as averages.
  - **Workload scale** — Far too low – Too low – Just right – Too high – Far too high; reported as percentages per option.
  - **Retention scale** — No – Yes, within my organization – Yes, outside my organization; retention score = % not looking elsewhere.
  - **(e)NPS** — 0–10; promoters 9–10, passives 7–8, detractors 0–6; score = % promoters − % detractors.
  - **Open text** — reported verbatim.
  - **Select options scale** — multi-select custom categories; reported as percentages per option.
- **Themes and topics**: Themes = mandatory validated question sets with a theme-level average score. Topics = groupings of related questions, scores reported per question only (no topic-level score).

## Observations / pain points to feed the v3 concept

1. **Read-only + 8–10 working day change requests** — the single loudest constraint on the current experience; no self-service add/edit of custom questions.
2. **Beta fragility is user-visible**: welcome dialog manages expectations downward; "Top question sets" card fails to load.
3. **Themes vs topics duplication** is confusing: same names on both sides (Team leadership, Change management), questions repeated across many themes, and the 18-question "Performance Environment" mega-theme overlaps four other themes almost entirely.
4. **No question detail view**: answer scale only via hover tooltip on the type label; question rows in Themes & topics don't even show the type. No metadata (benchmark availability, source, translations per question).
5. **Flat, long pages**: Themes & topics loads ~40 expanded accordions; All questions is one long list. Search is the only navigation aid (works well, with highlighting).
6. **Variables are display-only** and buried in a fourth tab; the dialog asks the user to "check if the content makes sense" but offers no action.
7. **Custom questions count is surfaced (0) but there is no path to create one** in the UI.
8. **Language switcher** covers only the library display language (EN-US / NL / PT here).
