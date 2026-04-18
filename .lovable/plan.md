
The user wants:
1. A new e-commerce feature selling regenerative/organic plant boosters (biostimulants, microbial inoculants, biochar, mycorrhizae, seaweed extract, humic acid, neem cake, etc.) at fair prices, with detailed usage instructions, placement guidance, consequences, and expected results.
2. A new course teaching how/where/when to use these inputs.
3. Remove the bundle discount offer at the bottom of the Courses page.

Looking at existing patterns: HardwareStore.tsx fetches from `hardware_products` Supabase table. I'll create a parallel structure for "Plant Boosters" — a new table + page. Courses page already has a `courseData` array, so I just add an 8th course and delete the bundle CTA section.

## Plan

### 1. New "Plant Boosters & Bio-Inputs" Store (`/boosters`)

**New Supabase table** `plant_boosters`:
- `id`, `name`, `category` (microbial / biostimulant / soil amendment / seed treatment / organic nutrient)
- `description`, `price_rupees` (fair INR pricing, ₹150–₹1,200 range)
- `unit` (e.g. "1 kg", "500 ml")
- `how_to_use` (step-by-step application)
- `where_to_apply` (seed coating / soil / foliar / root zone — and where NOT to use)
- `consequences` (what happens if misused — over-application, wrong crop, etc.)
- `results` (expected benefits + timeframe)
- `safe_for` (crops/soils it suits), `image_url`, `in_stock`
- RLS: public read; admin insert/update later.

**Seed ~10 products** (fair pricing):
- Trichoderma viride bio-fungicide (₹250 / 1kg)
- Mycorrhizal root inoculant (₹450 / 1kg)
- Seaweed extract (Ascophyllum) (₹350 / 500ml)
- Humic + fulvic acid concentrate (₹400 / 1L)
- Vermicompost (₹180 / 5kg)
- Biochar soil amendment (₹600 / 5kg)
- Neem cake organic pest deterrent (₹220 / 5kg)
- Rhizobium + Azospirillum N-fixer pack (₹300 / 1kg)
- Silicon foliar spray (₹500 / 1L)
- PGPR Pseudomonas inoculant (₹280 / 1kg)

**New page `src/pages/PlantBoosters.tsx`**:
- Hero with safety/regenerative messaging
- Category filter chips
- Product cards showing price + "View Details"
- Detail dialog with 4 clearly labeled sections: **How to Use**, **Where to Apply (and where NOT)**, **Consequences of Misuse**, **Expected Results**
- Prominent disclaimer banner: "Read instructions before use"
- Add-to-cart with quantity, sticky cart sidebar (mirrors HardwareStore pattern)
- Full i18n via `boostersPage.*` keys in en.json

**Routing & nav**:
- Add `/boosters` route in `App.tsx`
- Add a 12th feature card in `Features.tsx` (icon: `Leaf` or `FlaskConical`, color: olive)
- Add `nav.boosters` and `features.boosters.*` keys to en.json

### 2. New Course: "Bio-Inputs Mastery"

In `src/pages/Courses.tsx` `courseData`, add 8th entry:
- id: `bioInputs`, icon: `FlaskConical`, duration: 5, lessons: 10, level: `intermediate`, color: `accent`
- Topics: `application` / `timing` / `dosage` / `storage`

Add matching i18n block under `coursesPage.list.bioInputs` in en.json.

### 3. Remove Bundle Discount

Delete the entire `motion.div` "bundleTitle / bundleOnline / bundleInPerson" block at the bottom of `Courses.tsx` (the gradient CTA card). Also remove the now-unused `bundleTitle`, `bundleDesc`, `bundleOnline`, `bundleInPerson` keys from en.json.

### Files to change
- **New**: `src/pages/PlantBoosters.tsx`, Supabase migration for `plant_boosters` table + seed data
- **Edit**: `src/App.tsx` (route), `src/components/Features.tsx` (new card), `src/pages/Courses.tsx` (add course, remove bundle), `src/i18n/locales/en.json` (boosters + bioInputs keys, remove bundle keys)

### Out of scope (this round)
- Translating new keys into the other 20 locales (English-only for now, fast to ship; can batch-translate after)
- Real checkout/payment (cart + toast confirmation only, same as HardwareStore)
- Admin UI to add new boosters (insert via migration seed)
