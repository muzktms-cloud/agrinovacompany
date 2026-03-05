

## Problem Analysis

There are two main gaps in the i18n integration:

### 1. Hardcoded text in components
- **About.tsx (lines 101-108)**: Country names ("India", "Bangladesh", etc.) and crop lists ("Rice, Wheat, Cotton, Sugarcane") are hardcoded English strings, not using `t()`.
- **LanguageChooser.tsx (line 90)**: "Welcome to AgriNova" is hardcoded.

### 2. Incomplete locale files
All 20 non-English locale files (hi, bn, ta, te, ur, mr, gu, pa, ne, si, kn, ml, or, es, fr, ar, as, sd, dv, bho) are **severely incomplete**. For example:
- **Hindi (hi.json)**: ~200 keys — missing `features.*` sub-items, `about.regions/sdg/values/story`, `planner.*`, detailed `weather/advisor/simulator/predictor/market/chatbot` keys, and more.
- **Tamil (ta.json)**: Only ~40 keys total — missing nearly everything except `common`, `nav`, `hero`, `language`.
- Other locale files are similarly sparse.

The English file (`en.json`) has ~400+ keys. Most locale files have 50-200 keys.

## Plan

### Step 1: Fix hardcoded text in About.tsx
Add translation keys for the regions section:
- Add `about.regions.countries.india`, `about.regions.countries.bangladesh`, etc. keys to `en.json`
- Add corresponding crop translation keys
- Update About.tsx to use `t()` for country names and crop descriptions
- Fix "Welcome to AgriNova" in LanguageChooser.tsx with a `t()` key

### Step 2: Complete all 20 locale files
Update every non-English locale file to include ALL keys from `en.json`. This covers:
- `features.pestDetection/weatherAdvisor/cropPlanning/cropHealthScanner/hardwareStore/aiChatbot/cropAdvisor/simulator/harvestPredictor/marketAdvisor` (title + description for each)
- `about.tagline/title/titleHighlight/description/stats/regions/sdg/values/story` (all sub-keys)
- `footer.tagline`
- Complete `pestDetector`, `cropHealth`, `store`, `weather`, `advisor`, `simulator`, `predictor`, `market`, `planner`, `chatbot` sections with all detailed keys
- `about.regions.countries.*` (new country/crop keys)
- `common.*` additional keys (selected, dismiss, returnHome, pageNotFound, perQuintal, perMonth, risk)

Each file will be fully rewritten with all ~420+ keys properly translated into its respective language.

### Files to modify
- `src/components/About.tsx` — use `t()` for country names and crops
- `src/components/LanguageChooser.tsx` — translate "Welcome to AgriNova"
- `src/i18n/locales/en.json` — add region country/crop keys
- All 20 locale files: `hi.json`, `bn.json`, `ta.json`, `te.json`, `ur.json`, `mr.json`, `gu.json`, `pa.json`, `ne.json`, `si.json`, `kn.json`, `ml.json`, `or.json`, `es.json`, `fr.json`, `ar.json`, `as.json`, `sd.json`, `dv.json`, `bho.json`

### Scope
This is a large batch of 23 file edits. The bulk is translating ~400 keys into 20 languages. The component changes are small.

