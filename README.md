# Grocery List & Lyfe Tracker — Project Master README

**Owner:** Luke · **Built:** 2026-05-03 · **Goal:** sustainable fat loss (250 → 210 lbs)
**Stack:** Markdown + Word doc (printable) + HTML/JS PWA (mobile)

---

## 🆕 Session 3 — 2026-06-26 (Add Recipes tab · Phases 1–3 · SW cache v15)

Replaced the **How It Works** tab with a new **➕ Add Recipes** tab (the old How It Works pane is
**preserved but unlinked** in the HTML — `<div id="pane-how">` still present, just no tab button).
Current **SW cache = v15** (footer badge `v15`).

**v15:** the top-right **Clear all** button now has a **green glow** (lime border + glow, brighter on
hover) instead of the old red-on-hover styling.

> 📌 **Versioning convention (set 2026-06-26):** stay on **15** and bump the **decimal** each deploy —
> next is **v15.1**, then **v15.2**, and so on, **until Luke says otherwise**. Bump both the
> `CACHE = 'smoothie-v15.x'` const in `smoothie_sw.js` **and** the `<span id="appVer">v15.x</span>`
> footer badge on every deploy.

**How custom recipes integrate:** they merge into the live `RECIPES` / `ING` so every existing view
(Recipes tab, shopping list, store mode, phone sync) picks them up for free.
- New state: `S.customRecipes` (RECIPES-shaped, `cat:'My finds'`) + `S.customIngredients`
  (ING-shaped, `group:'myfinds'`, `price:0`, `custom:true`). Both added to `syncState()` + the
  sync-pull apply path, so they sync to the phone.
- `mergeCustom()` rebuilds `RECIPES`/`ING` from base + custom (uses `BASE_RECIPE_COUNT` / `BASE_ING_KEYS`
  captured at init). Called on init, after add/delete, and after sync pull.
- Added **`My finds`** to `CAT_ORDER`/`CAT_ICON` and a **`myfinds`** group (`⭐ From my recipes`) to `GROUPS`.
- `refreshList` shows custom (price-0) ingredients as **"Buy · price varies"** (not "Have it") via the
  `it.custom` flag; the "got" filter also excludes them.

**Three phases (all in the `AR` / `ar*` functions near the end of the script):**
- **Phase 1 — manual form** (no AI): name, good-for, best time, weight-loss rating (1–3 dots), why,
  dynamic ingredient rows → `arSave()` → `arCommit()`.
- **Phase 2 — text / link AI import:** `arFromText()` (paste recipe/caption/transcript) and `arFromUrl()`
  (reads the page via `https://r.jina.ai/<url>` CORS reader, then Claude). Fills the form for review.
- **Phase 3 — image AI import:** `arFromImage()` → base64 → Claude vision. Fills the form.
- AI calls go **direct from the browser** to `api.anthropic.com` with the header
  `anthropic-dangerous-direct-browser-access: true`, using the user's own key.

**AI settings:** API key + model stored in **localStorage only** (`smoothie_api_key`, `smoothie_model`) —
**deliberately kept OUT of `syncState()`** so the key never lands in the jsonblob sync. Model default
`claude-opus-4-8`; Haiku 4.5 offered as the cheap option. ⚠️ This direct-browser key approach is the
"try it out" path — for a shared/public setup, move the key into a **Cloudflare Worker** (next step).

---

## 🆕 Session 2 — 2026-06-26 (Polish + self-update + empty-kitchen · SW cache v13)

Second pass on the Smoothie Builder (same day). All changes deployed live; current **SW cache = v13**
(footer shows the version badge `v13`).

- **Professional polish pass** — added a contained CSS "polish layer" at the end of `<style>` (delete that
  block to revert). Typography upgraded from the system stack to **Fraunces** (editorial serif, headings)
  + **Hanken Grotesk** (body), loaded via Google Fonts with system-font fallback (degrades offline).
  Added film-grain + vignette atmosphere, card top-sheen, refined focus states, button gradient/lift,
  springy checkmark pop, `prefers-reduced-motion` support.
- **In-app self-update flow** — footer now has a **version badge + `↻ Check for updates` button**, and an
  auto **"✨ New version available"** banner appears when a new deploy is detected. The SW no longer
  auto-`skipWaiting()`s; it **waits for the user to tap Update** (then `postMessage SKIP_WAITING` →
  `controllerchange` → one reload). Message handler added in `smoothie_sw.js`.
  ⚠️ One-time: a device still on the pre-v9 SW must fully close & reopen once to get onto the new system.
- **My List items default to CHECKED** ("in cart") when added — user unchecks what they still need.
  Tracked via new `S.autoChk` map so manual unchecks persist across re-renders; items dropped from the
  list are untracked so they re-check if re-added. Reconciled in `reconcileAutoCheck(need)` (top of `refreshList`).
- **Assume empty kitchen** — removed all `price:0` "Have it" flags. **Whey** (`~$44.99`, → Base group) and
  **black pepper** (`~$3.49`) are now normal buy items; **lemon** moved to the **Fruit** group. The
  **"Already in your kitchen" group is kept but empty** (`group:'have'` has no members now) — **repopulate
  it when we link the full Loblaws list to the smoothie list later.**
- **Footer cleanup** — removed the "Open the full Loblaws grocery checklist" link (keeping the two apps
  separate) and the "Built for Luke's fat-loss toolkit" line. Footer = disclaimer + version row only.

---

## 🆕 Current Status — 2026-06-26 (Smoothie Builder — LIVE on GitHub Pages)

New standalone app this session: **`smoothie_shopping_list.html`** — **"Smoothie Builder & Shopping List"**,
an anti-inflammatory / fat-loss smoothie builder (dark theme; an "Editorial Wellness" light reskin was
tried and **reverted — user prefers the dark theme**).

**🌐 LIVE:** **https://lukewlynes-glitch.github.io/SmoothieRecipeShop/**
- **Repo:** `SmoothieRecipeShop` (GitHub user `lukewlynes-glitch`). Deployed `index.html` + PWA files. Now at **SW cache v7** (bump the `CACHE` const in `smoothie_sw.js` each deploy so installed copies refresh).
- **Redeploy:** `cp smoothie_shopping_list.html /tmp/smoothieshop/index.html` (+ support files) → `git -C /tmp/smoothieshop push origin HEAD`. User just says **"refresh it"** to trigger.

**Latest UI/feature pass (same day, after first deploy):**
- **14 recipes total**, grouped by goal (Everyday · Beauty & Glow · Brain & Focus · Sleep & Calm · Gut & Debloat · Heart & Hormones · Immunity · Performance & Recovery · Treats). Added 10 purpose-driven recipes + 9 ingredients (collagen, orange, kiwi, walnuts, oats, pomegranate, kefir, peanut butter, cucumber) — all journal-validated.
- **Optional Boosters** section: psyllium ✅, creatine ✅ (both "worth it"), MCT/ashwagandha/beet powder 🟡 (situational); lion's mane & greens powders flagged ❌ skip. Evidence card in How It Works.
- **Layout:** tabs are wide rectangles (order now **Recipes · My List · Ingredients · How It Works** so My List sits beside Recipes on iPhone). Benefit tags = big clickable rectangles that **jump to the best recipe** (Anti-inflam→Daily Driver, Fat loss→Lean & Light, Nutrition→Green Machine, Recovery→Golden Recovery) + flash highlight. Divider line under tags. Bigger/sharper text. Softer "less-boxy" cards.
- **Clear all** button top-right of title.
- **Export/Share consolidated:** both My List AND Recipes pages have a green **"Export / Share Options"** box = **Share · Image · Email only** (removed QR/Text/Copy/.txt + iPhone-Checklist button + live-sync/phone-link UI). Recipe share = only recipes currently added to list. Email still = real `.eml` w/ PNG attached (desktop) or share-sheet w/ image (phone).

**Features built:**
- **4 tabs:** Recipes · Ingredients · My List · How It Works.
- **Recipes (4):** Daily Driver, Golden Recovery, Green Machine, Chocolate Antioxidant. Each has a
  1–4 **serving stepper**, "best time to drink" badge, per-ingredient "why it works" bullets, and a
  **weight-loss rating** (●●●). Recipe amounts scale by servings.
- **Ingredients tab:** educational cards (why it works + 💎 quality pick) mapped to **real Loblaws
  products** (PC/PC Organics) with package size + approx price.
- **My List:** auto-aggregates selected recipes × servings into a shopping list that says
  **how many packages to buy** + estimated total. Store checklist with **cart-progress bar** and
  **All / Still need / Got it** filters (tap to check off; no strike-through).
- **Exports:** 📷 QR (text list), 📲 Share, 📸 Image (3× sharp, dark theme), ✉️ **Email with image
  attachment** (desktop = generates a real `.eml` with PNG attached + `X-Unsent` so Outlook opens it
  ready-to-send; phone = native share sheet attaches it), 📋 Copy, 💾 .txt. Timestamped filenames +
  in-app **Export History** (last 30).
- **Phone ↔ dashboard sync:** `smoothie_sw.js` + `smoothie_manifest.json` + `smoothie_icon.svg` make
  it an installable PWA. Live two-way sync via **jsonblob.com** (no signup, CORS) keyed by a code, OR
  a simpler **`?list=` encoded phone link/QR** (one-way snapshot, no backend). See `PHONE_SYNC_SETUP.md`.

**Validation:** ingredient claims checked against top-traffic health sites (Healthline/WebMD/Mayo/
MedlinePlus/AHA) + PubMed meta-analyses (protein/fiber strongest; curcumin moderate; matcha modest).
Confirmed PC frozen blueberries = single ingredient, **no preservatives**.

**Pending / next steps:**
- ✅ **Hosting DONE** — live on GitHub Pages (above). Phone sync, phone link/QR, Share, Add-to-Home-Screen
  all work from the live URL now.
- Optional: bump PWA cache version (`smoothie_sw.js` CACHE `smoothie-v1`→`v2`) when pushing changes so
  already-installed home-screen copies force-update instead of serving stale cache.
- Loblaws prices are **approximate** — confirm live in PC Express (no open inventory API; site blocks
  scraping).
- Optional: give the standalone `loblaws_shopping_list.html` the same serving/export treatment.

Also this session: created `exports/` folder (+ README) for export history; backed up this README.

---

## Project Purpose
Personal fat-loss + active-cyclist toolkit. Bikes 35km × 2 (commute, 2-3×/wk). Wants:
- Simple shopping plan tied to specific store (Loblaws Lakeshore & Bathurst)
- Repeatable meal rotation, no fancy cooking
- Bike-day vs rest-day calorie/carb flex
- Smart wine timing (red, with dinner, never before bike day)
- Lifting routine using existing kettlebells (30kg home, 25kg office)
- Mobile app on phone with checkboxes that actually work
- Sync data back to Claude across sessions
- Whoop + Apple Watch integration

## Folder Structure

```
F:\TestMapClaude\Grocery List\
├── README.md                          ← this file
├── Loblaws_Shopping_List_v8.docx     ← latest printable doc (8 pages)
├── grocery_list.md                    ← original markdown plan
├── 7_day_meal_plan.md                 ← weekly meal mapping
├── loblaws_shopping_list.md           ← markdown shopping list
├── weekly_shopping.md                 ← simple scan list
├── shopping_list_mobile.html          ← v1 mobile (single-page, touch-fixed)
├── build_shopping_doc.py              ← Word doc builder (bump VERSION + run)
├── make_stretch_figures.py            ← stretch SVG generator
│
├── stretch_figures/                   ← 8 stick-figure PNGs for the doc
├── versions/                          ← all archived Word doc versions (v1-v8)
└── app/                               ← Lyfe Tracker mobile PWA
    ├── index.html
    ├── app.js
    ├── manifest.json
    ├── sw.js
    ├── icon.png
    ├── make_icon.py
    └── SETUP_INSTRUCTIONS.md          ← read this first
```

## Daily Targets (current)
- **Bike day (Mon/Wed/Fri):** 2,700-2,900 cal · 200g protein · 300g carbs · 75g fat
- **Rest day (Tue/Thu/Sat/Sun):** 2,200-2,400 cal · 200g protein · 180g carbs · 70g fat
- **Weekly avg:** ~2,400 cal → ~1 lb fat loss/week
- **Time to goal:** ~9-10 months sustainable

## Already Stocked / Skipping at Loblaws
Olive oil · Almonds · Hot sauce · Whey protein · Soy sauce (skip) · Coffee (skip — uses tea)

## Key Files & What They Do

| File | Purpose | When to Update |
|---|---|---|
| `Loblaws_Shopping_List_v{N}.docx` | Printable master doc — 8 pages with shopping, meals, science, lifting, sleep, mobility, app setup | Bump version when content changes |
| `app/index.html` | Mobile app entry point | Edit for UI changes |
| `app/app.js` | All app logic | Edit for features/bug fixes |
| `build_shopping_doc.py` | Builds the Word doc from code (declarative) | Bump VERSION + add CHANGELOG entry on every change |

## Versioning System
- Latest doc lives at `Loblaws_Shopping_List_v{N}.docx` in main folder
- Every previous version archived in `versions/`
- `build_shopping_doc.py` has VERSION + CHANGELOG at top — bump and rebuild

## Sync Architecture (Phone → Claude)

```
Phone (Lyfe app)  →  webhook.site URL  ←  Claude (next session)
```

The phone POSTs full state on every action. Webhook stores it. Claude fetches it via the URL the user shares at the start of a chat.

**No direct connection between phone and Claude.** Webhook = required intermediary.

## Status (as of 2026-05-03 end of day)

✅ **Done:**
- Loblaws-specific shopping list with PC/No Name brands
- 7-day meal rotation (bike day vs rest day)
- 8-page printable Word doc (versioned, archived)
- Lyfe Tracker mobile PWA (offline-capable, touch-fixed, 6 sections)
- Stick-figure stretch illustrations
- Webhook sync scaffolding
- Whoop OAuth flow (needs backend for full token exchange)
- Apple Health Export workaround documented
- Setup instructions for Netlify Drop hosting

⚠️ **Partial:**
- Whoop integration scaffolded — full data pull needs Cloudflare Worker for token exchange
- Push notifications work when app is open / recently used (web limitation)
- Mobile app design is functional but admittedly "AI basic" — see `DESIGN_UPGRADE_PLAN.md` for next-pass styling

❌ **Not yet:**
- App not yet hosted on Netlify (user does this)
- Webhook URL not yet configured (user does this)
- Whoop API not yet connected (user creates dev app + redirect URL)
- Apple Watch via Auto Health Export — user installs + configures
- Style refresh of Lyfe app (glass morphism, gradient mesh, custom icons)

## Quick Commands

```powershell
# Open latest Word doc
Start-Process "F:\TestMapClaude\Grocery List\Loblaws_Shopping_List_v8.docx"

# Open mobile app locally (for testing on computer — phone needs hosted version)
Start-Process "F:\TestMapClaude\Grocery List\app\index.html"

# Rebuild Word doc after code edits
cd "F:\TestMapClaude\Grocery List"; python build_shopping_doc.py

# Regenerate stretch figures
python make_stretch_figures.py
```

## Notes / Reminders
- User likes red wine — Tue + Sat ONLY, never night before bike
- User likes high-rep lifting (12-25 reps) — perfect for fat loss anyway
- User has 30kg KB at home, 25kg at office
- Bike days assumed Mon/Wed/Fri (in code); user confirmed 2-3×/wk pattern
- User goes to bed late (1 AM-ish), so wine cutoff is 10-11 PM (2-3 hrs before bed, not "8 PM")
- White fish (cod/haddock) preferred over salmon for the cut — leaner

## Wager Note
This is for personal nutrition/fitness tracking, not medical advice. User should adjust based on actual response (weekly weigh-in trend).
