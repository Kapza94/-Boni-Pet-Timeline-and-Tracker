# Boni v2 — Architecture Rework Design

**Status:** Draft for review
**Date:** 2026-05-23
**Replaces (partially):** `SPEC.md` §3 (screens), §5 (data model entities), §6 (subscription gating). Sections §1.2 (anti-goals), §7 (visual paradigm), §8 (motion/a11y/copy/voice) stay locked.

## 1. Context

F00–F03 shipped the visual system + auth + onboarding. Walking the simulator surfaced that the app is architecturally thin behind the styling: the daily log loop, calendar shape, pet data model, and paid value were all underbuilt against what owners actually need. This doc locks the new architecture so per-screen brainstorms can build on a shared frame.

Stack, design system, voice rules, and TDD workflow stay as defined in `CLAUDE.md`. No changes to React Native + Expo + Supabase + NativeWind + Skia + TanStack. No changes to the dark canvas, glass primitives, refraction border, or copy voice.

## 2. Free vs Paid split (locked)

### Free tier — "the whole daily app, one pet."

- 1 pet (server-enforced — unchanged from SPEC §5.1)
- Detailed pet creation: species, name, image, DOB, weight, breed, sex, neuter status, microchip ID, allergies, health conditions
- Full daily log: food, water, walk (with duration), poop, pee, training, weight
- One-tap log row from the home screen
- Start-now timers for walk + training (timer runs in the foreground, finishes into an Activity row)
- Calendar feed home (in-app surface — what to do for the dog today, no external sync)
- Manual vaccine list
- Manual vet visits (record only)
- Weight chart (raw, no alerts, no AI interpretation)
- Manual reminders (vaccine due, med due, etc.)
- Travel checklist (static template, check items off per trip)
- Basic monthly expense total (sum of recorded expenses; no categories, no receipts)
- Basic milestones (manual entries — "first walk", "10 lbs", etc.)

### Paid tier — "Boni+." Five themed pillars.

| Pillar | Hook | Surfaces |
|---|---|---|
| Memory & Legacy | "Don't lose a single moment." | Unlimited photos, photo timeline / journal, milestones (auto + manual), "On this day last year" surfacing, yearly highlight reel, PDF memory book, video clips, custom anniversaries |
| Family Coordination | "Everyone on the same page." | Multi-caregiver realtime sync, walker/sitter read-only or scoped-write share link, per-caregiver activity filter, auto end-of-day summary push, role-aware permissions |
| Multi-Pet | "For the whole pack." | Unlimited pets, cross-pet timeline view, pet switcher, avatar stack |
| Vet & Records Vault | "Your pet's medical brain, always with you." | Lab result + document attachments, saved vet directory, Apple Wallet pass for rabies cert, pre-visit packet share via signed link, insurance claim PDF generator, full data export. Absorbed health-proactivity features: symptom log + photo upload, medication adherence streaks, vet handoff PDF |
| Calendar & Integrations | "Boni lives where you already do." | Apple Calendar one-way write, Google Calendar one-way write, iOS Reminders, home-screen widget, optional HealthKit export |

### Pricing — unchanged

Three SKUs at the same content tier, billing cadence only: $1.99/wk · $4.99/mo · $29.99/yr. Yearly badged as best value. Free escape link always present. StoreKit deferred behind `EXPO_PUBLIC_STOREKIT_STUB=1` until Apple Developer account is provisioned.

## 3. Screen map (replaces SPEC §3)

The home screen is no longer "Today" — it's the **calendar feed**. Daily log lives on it (one-tap row) rather than in a separate Today tab. Tab map and final navigation locked per-screen.

Working screen list:

1. **Home / Calendar** — feed of today's reminders, due meds, vaccine alerts, vet visits, expense summary card. One-tap log row (food / water / walk / poop / pee / weight / training). Start-now timer surfacing.
2. **Pet** — pet creation + profile fields. Passport (vaccines list + travel checklist). Free tier shows 1 pet; paid tier adds pet switcher + cross-pet view.
3. **Medical** — vet visits, weight chart, health parameters, medication list, symptom log (paid surfaces gated).
4. **Memory / Timeline** (paid) — photo journal, milestones, on-this-day, memory book.
5. **Family** (paid) — household members, caregiver roles, walker share, daily summaries.
6. **Expenses** — monthly rollup (free) or full breakdown + receipts + insurance PDF (paid).
7. **Settings** — subscription, profile, calendar sync setup (paid), data export (paid), dev panel.

The Quick-log FAB from old SPEC §3.2 is **deprecated**. The one-tap log row on the home screen replaces it. Detail editing (walk duration, food portion) opens an inline sheet from the log row, not a separate quick-log surface.

The 5-slot tab bar from old SPEC §3.2 is **deprecated**. New tab structure decided in the per-screen brainstorm for Home.

## 4. Data model deltas (changes to SPEC §5)

### Pet — extended

New columns on `pets`:
- `species` — enum: `dog`, `cat`, `rabbit`, `bird`, `reptile`, `small_mammal`, `other` (drives breed list + reminder defaults)
- `sex` — enum: `male`, `female`, `unknown`
- `neutered` — boolean
- `microchip_id` — text, nullable
- `allergies` — text[] (PostgreSQL array)
- `health_conditions` — text[]
- `weight_kg` — numeric, nullable (current weight; chart history in `weight_entries`)

### New tables

- **`weight_entries`** — `id`, `pet_id`, `weight_kg`, `recorded_at`, `recorded_by`. Drives the weight chart.
- **`expenses`** — `id`, `pet_id`, `amount_cents`, `currency`, `category` (enum: `food`, `vet`, `meds`, `grooming`, `boarding`, `toys`, `insurance`, `other`), `note`, `receipt_url` (paid — Storage), `occurred_at`, `created_by`.
- **`travel_checklists`** — `id`, `pet_id`, `name` (default "Trip"), `started_at`, `ended_at`. `travel_checklist_items` — `id`, `checklist_id`, `label`, `checked`, `position`.
- **`symptom_logs`** (paid) — `id`, `pet_id`, `body`, `photo_urls` (Storage), `occurred_at`, `linked_vet_visit_id` (nullable).
- **`vet_clinics`** (paid) — `id`, `household_id`, `name`, `phone`, `address`, `hours_json`. `vet_visits` references this (free tier still stores `vet_name` + `vet_clinic` as text on the visit; paid promotes them to FK).
- **`reminders`** — `id`, `pet_id`, `kind` (enum: `vaccine`, `med`, `vet`, `custom`), `title`, `due_at`, `source_id` (nullable FK to linked vaccine/med), `dismissed_at`.
- **`calendar_links`** (paid) — `id`, `user_id`, `provider` (`apple`/`google`), `access_token` (encrypted), `refresh_token` (encrypted), `last_synced_at`. Per-user, not per-household.

### Activity — extended

`activities.type` adds: `pee`, `training`. Existing types remain: `food`, `water`, `walk`, `poop`, `med`, `vet`, `note`, `photo`.

`activities` gains:
- `started_at` — timestamptz, nullable (for start-now timers)
- `ended_at` — timestamptz, nullable
- `is_running` — generated column (`started_at IS NOT NULL AND ended_at IS NULL`)

When a user taps "Start walk", a row is inserted with `started_at = now()`, `ended_at = null`. On stop, `ended_at = now()` and `duration_minutes` is derived. The home screen surfaces the running activity as a Live Activity-style card.

### Free-tier guards (server-side)

- Photo upload (any type) — denied unless `subscription_tier != 'free'`. Already enforced at Storage policy in F04 plan; this stays.
- Second pet insert — denied (existing trigger `enforce_free_tier_pet_limit`).
- Calendar link insert (`calendar_links`) — denied if free tier.
- Symptom log insert (`symptom_logs`) — denied if free tier.
- Memory book generation — denied if free tier.
- Walker/sitter invite (`users` insert with role `walker` or `sitter`) — denied if free tier.

All denials return a structured error the client maps to a paywall trigger.

## 5. Decomposition — per-screen brainstorm order

Each screen below gets its own brainstorm → spec → plan → impl cycle. Order matches dependency flow:

1. **Home / Calendar / Daily Log** — architectural anchor. Locks the tab structure + one-tap log shape + start-now timer + calendar feed model.
2. **Pet profile + Passport** — feeds the home screen with pet identity. Locks the extended `pets` schema + travel checklist surface.
3. **Medical (vet visits + weight + meds)** — feeds reminders + symptom log to the home calendar feed.
4. **Memory / Timeline (paid)** — depends on photos (F04 in old FEATURES). Locks Storage policy + milestone shape + memory book PDF flow.
5. **Multi-pet (paid)** — gating + pet switcher UX.
6. **Family (paid)** — caregiver invites + walker share + role permissions.
7. **Expenses** — basic monthly total (free) + categories/receipts/insurance PDF (paid).
8. **Settings + Subscription paywall** — finishes the surface map.
9. **Login button rework** — visual brand fix only (official Apple + Google buttons). No feature changes.

Each cycle commits its spec to `docs/superpowers/specs/`. After all eight cycles complete, `SPEC.md` + `FEATURES.md` get a single rewrite commit that replaces §3, §5, §6 (and renumbers F02 onward in FEATURES). F00 (design primitives) + F01 (visual primitives) + F02 (auth) stay shipped — no regressions to the green stack.

## 6. What stays out (anti-goals reaffirmed)

Per SPEC §1.2 — still off the table:
- GPS / location / geofencing
- Mathematical charts beyond the weight chart (no AI clinical trend lines)
- Social features (likes, public feeds)
- Vet-facing diagnostic wizards
- Physical print fulfillment (PDF only)
- Android / web / tablet surfaces
- Light mode

Added anti-goal: **no AI medical advice or symptom-driven diagnosis suggestions**. The symptom log captures the owner's observations + photos to pass to their vet. Boni does not interpret severity.

## 7. Open questions for per-screen brainstorms

These are flagged here so the per-screen sessions remember to resolve them:

- **Tab bar structure** — settled in the Home brainstorm.
- **Start-now timer persistence across app kills** — settled in the Home brainstorm (probably Live Activity + Notification).
- **Walker share scope** — settled in the Family brainstorm (read-only vs scoped-write).
- **Calendar one-way vs two-way sync** — anchored as one-way write in this doc; reaffirmed in the Calendar brainstorm.
- **Memory book — PDF compile location** — already settled (Edge Function), revisit only if Memory brainstorm surfaces new constraints.
- **Insurance PDF generator format** — settled in the Vet Vault brainstorm.

## 8. What this doc does NOT do

It does not:
- Replace the visual paradigm (`SPEC.md` §7)
- Replace motion / a11y / copy rules (`SPEC.md` §8)
- Lock the tab bar layout (per-screen brainstorm decides)
- Lock per-screen interaction details (per-screen brainstorm decides)
- Replace the existing pricing (unchanged from SPEC §8.9)

It does:
- Lock the free/paid split
- Lock the screen list
- Lock the data model deltas
- Lock the brainstorm order for the per-screen passes that follow
