# CLAUDE.md — Boni project memory

This file is loaded automatically into every Claude Code session in this
repo. It captures the **stack**, **conventions**, **non-obvious rules**,
and **session learnings** so a new Claude instance can be productive
immediately without re-deriving them.

If you change scope or learn something non-obvious, add it here.

---

## Engineer role and conduct

Behave as a **senior-level engineer** on this project. That means:

- **95% confidence threshold.** Don't write or change code unless you are
  95%+ confident the approach is correct. If not, ask first — even if the
  question is high-level ("Before I touch X, I want to confirm Y — is that
  right?"). A clarifying question costs nothing. A wrong implementation
  costs a revert and wasted review time.
- **Surgical scope.** Only touch code directly required for the current
  task. Do not clean up nearby files, rename things that aren't broken,
  reformat unrelated code, or refactor "while you're in there." If
  something adjacent needs fixing, flag it in words — don't fix it silently.
- **No speculative changes.** If a change is "nice to have" or "probably
  fine," leave it out. Ship the minimum that makes the task done.
- **Question first, build second.** If the high-level intent is unclear,
  or if two valid approaches exist with meaningfully different trade-offs,
  ask before choosing. Don't bury a design decision inside an
  implementation.

---

## What this project is

**Boni: Pet Timeline & Log** — minimalist iOS pet-life companion. Premium
iOS glassmorphic visual paradigm. Mobile-only. Single-pet free tier;
multi-pet, photos, family sync, and downloadable PDF memory book are paid.

Authoritative scope: **`SPEC.md`** (do not edit lightly — it's the
contract). Buildable slices: **`FEATURES.md`** (where to start).
Design source: `/tmp/boni-design/extracted/boni/` — the original handoff
bundle (HTML prototype + design system + chat transcript).

---

## Stack

### Frontend
- **React Native + Expo SDK** (latest stable) — cross-platform foundation
  even though the product is iOS-only (lets us run on the simulator
  fast and keeps the door open).
- **Expo Router** — file-based navigation. Onboarding under
  `app/(onboarding)/`, main app under `app/(app)/(tabs)/`, modals under
  `app/(app)/sheets/`.
- **NativeWind** — Tailwind classes on React Native. Tokens are mirrored
  from `colors_and_type.css` into `tailwind.config.js`.
- **`expo-blur`** — for the iOS frosted-glass backdrop on every Glass
  surface. Always paired with the 1px white refraction border.
- **`@shopify/react-native-skia`** — Skia for any custom-painted surface:
  the ambient pastel blob canvas, the memory-book cover preview, complex
  multi-layer shadows that `View`+`shadowOffset` can't replicate.
- **`@gorhom/bottom-sheet`** — bottom-sheet shell wrapped behind our
  `<Sheet>` component.
- **TanStack Query** — server cache + mutations.
- **Zustand** — ephemeral UI state when context is overkill.
- **react-hook-form + Zod** — forms + validation; Zod schemas mirror
  the Postgres tables.
- **Lucide** (`lucide-react-native`) — icon set; outline, 1.5–2px stroke.
- **Fonts** — SF Pro Display (in `assets/fonts/`) + Instrument Serif
  (Google Fonts via `expo-font`).

### Backend (Supabase)
- **Postgres** — primary data store. Schema in `supabase/migrations/`.
- **Supabase Auth** — Apple, Google, and Email/password providers.
- **Supabase Storage** — buckets `pet-photos`, `activity-photos`,
  `vet-attachments`, `milestone-photos`, `memory-books`. Premium-only
  uploads enforced by Storage policies.
- **Supabase Realtime** — broadcasts on `household:<id>` channel for
  cross-device sync (<2s p95 target).
- **Edge Functions** — `generate_memory_book`, nightly `insights_job`,
  `send_invite`, `accept_invite`.
- **Supabase Cron** — schedules the nightly insight job.

### Build / deploy
- **EAS Build** for iOS. Preview profile → TestFlight (when Apple
  Developer account is provisioned). StoreKit integration is deferred —
  see "Open project state" below.

---

## Repository layout (target)

```
.
├── app/                          # Expo Router routes
│   ├── (auth)/sign-in.tsx
│   ├── (onboarding)/             # 4 step screens
│   ├── (app)/
│   │   ├── (tabs)/               # today, meds, timeline, family
│   │   ├── sheets/               # quick-log, paywall, vet-visit, memory-book, invite
│   │   ├── pet/[id]/passport.tsx
│   │   └── settings.tsx
│   └── _layout.tsx
├── components/                   # design system primitives (Glass, Sheet, etc.)
├── hooks/                        # TanStack Query hooks per feature
├── lib/                          # supabase client, auth, storage, realtime
├── theme/                        # typography presets, motion presets
├── tokens.ts
├── tailwind.config.js
├── supabase/
│   ├── migrations/               # SQL migrations per feature
│   ├── functions/                # Edge functions
│   └── seed.sql
└── SPEC.md, FEATURES.md, CLAUDE.md, README.md
```

Don't create this in one shot. Each feature in `FEATURES.md` brings
its own files. Match the structure as you go.

---

## Design system rules (non-negotiable)

- **Refraction edge**: every Glass surface has a `1px solid
  rgba(255, 255, 255, 0.55)` border. **Always present.** This is the
  signature of the visual paradigm — never omit.
- **Glass strengths**: thin `0.32`, regular `0.58`, strong `0.72` fill
  opacity. Blur 24px (regular) / 36px (strong) / 12px (thin).
- **Canvas**: dark, `oklch(22% 0.022 270)`. **Never pure black.**
  Painted with 4 pastel blobs (lavender, rose, peach, sky) via Skia.
  Blobs drift on 60s+ cycles when idle on hero/onboarding screens
  (respects Reduce Motion).
- **Active state**: completed daily toggles drift to emerald glow over
  **900ms** with `ease-in-out-soft`. The color drift IS the
  confirmation — never a tick-mark on its own.
- **Default transition**: 240ms `ease-out-soft`. Press = `scale(0.98)`
  + drop shadow, 140ms. Spring reserved for delight moments (milestone
  unlock, photo drop, memory book ready).
- **Corner radii**: md=16 (buttons, chips), lg=22 (cards), xl=28
  (sheets), 2xl=36 (paywall hero, memory book preview), pill (tabs,
  FAB).
- **Spacing**: 4pt base. Outer page padding 20px. Section rhythm 32px.
  Glass card internal padding 16px. Hit targets ≥44px.
- **Tab bar**: floating glass capsule, 14px inboard from screen edge,
  34px safe-area clearance.

---

## Copy / voice rules

Boni's voice is **the calm friend you call when your dog won't eat.**
Supportive, brief, never clinical, never alarmist.

- **Second person, soft.** "You logged Mochi's dinner."
- **Always use the pet's name** — never "your pet."
- **Sentence case everywhere.** Buttons, titles, rows, settings. ALL
  CAPS only for the `eyebrow` style and paywall badges
  (`BEST VALUE · SAVE 50%`).
- **No emoji in chrome.** Allowed only in user-entered note content.
- **No exclamation points** outside celebratory moments.
- **No medical jargon.** "Pill" not "medication unit." "Vet visit" not
  "veterinary appointment."
- **No alarmist tone for reminders.** "Rabies booster due in 12 days"
  — never "ALERT" or "OVERDUE" until it actually is.
- **Past tense for completions** ("Mochi ate breakfast"). **Imperative
  for actions** ("Add a moment", "Mark as given").

---

## Backend conventions

- **RLS on by default** on every new table. Default policy: rows
  visible only when `pet_id`'s household contains the caller, OR
  `user_id = auth.uid()` for user-scoped tables.
- **Free-tier enforcement is server-side**, not just UI. Anything
  premium-gated returns a structured error the client maps to a
  paywall trigger. Examples: second pet INSERT, photo upload, invite
  send, memory book generation.
- **Mutations that change scheduling state** (mark-given, snooze,
  vet-visit create) are RPCs (`SECURITY DEFINER` Postgres functions)
  so the multi-row logic stays atomic.
- **Realtime channels** are per-household (`household:<id>`). Triggers
  in Postgres broadcast `{ type, row }` on relevant table changes.
- **Migrations** live in `supabase/migrations/<timestamp>_<feature>.sql`,
  one per feature in `FEATURES.md`.
- **Seed data** for local development is in `supabase/seed.sql` —
  includes a household, two users, one pet, a few activities, one
  upcoming vaccine, one med, and one VetVisit so every screen renders
  with content.

---

## Open project state (don't lose this)

- **Apple Developer account is not provisioned yet.** StoreKit is
  stubbed behind `EXPO_PUBLIC_STOREKIT_STUB=1`. A dev panel in
  Settings flips `households.subscription_tier` via the stub RPC so
  premium UIs can be QA'd before real purchases work. Production
  builds must reject the stub endpoint.
- **Memory book is PDF, not physical.** Original brief had a $59
  hardcover; replaced with a downloadable PDF (user-decided
  2026-05-20). Server compiles, returns a 7-day signed URL, iOS share
  sheet handles save/print.
- **Multi-pet UX is deferred.** Free tier is enforced as 1 pet;
  premium can have many but the pet-switcher UI is **not designed
  yet** — see `SPEC.md` §9 item 5. When we reach that step, design
  it then to avoid churning current screens.
- **No light mode.** Dark canvas only.
- **iOS only**, even though we're on Expo. Don't add Android-only
  workarounds; do gate Skia + BlurView paths if iOS-only assumptions
  bleed in.

---

## Development workflow — strict TDD

We use the **superpowers `test-driven-development` skill**. Invoke it at
the start of every coding turn (it's a rigid skill — follow it exactly,
don't adapt away the discipline).

**Iron law:** no production code without a failing test first. If
production code lands without a prior failing test, delete it and start
over from the test.

Red → Green → Refactor:
1. Write one failing test for the next behavior.
2. Run the test, **watch it fail for the right reason** (not a typo).
3. Write the minimum code to pass.
4. Run the test, watch it pass.
5. Refactor only while green.
6. Repeat.

### Branching + PR workflow (two-branch flow)

Two long-lived branches:

- **`main`** — always clean, always the most-recent shippable build.
  Nothing lands here unless every test is green, the feature works
  on the simulator, and we'd be comfortable cutting a TestFlight
  build off it. Never commit directly to main.
- **`dev`** — the integration branch. All feature branches merge
  here first. Can briefly hold in-progress state across multiple
  features when they cross-depend.

Short-lived branches (one per FEATURES.md ID):

- `feat/F##-short-slug` — feature work (`feat/F02-auth`,
  `feat/F03-onboarding`)
- `fix/<slug>` — bug fixes against an already-shipped feature
- `chore/<slug>` — tooling, deps, config (`chore/jest-infra`)
- `docs/<slug>` — docs-only changes
- `refactor/<slug>` — non-behavior code reshaping

**Daily flow**:

1. Branch off `dev`: `git checkout dev && git pull && git checkout -b feat/F##-slug`.
2. Do the TDD red-green-refactor commits on the branch. Many small
   commits are fine — they document the path. `wip:` commits OK
   mid-flight; squash strips them.
3. When feature is green + visually verified on the simulator:
   squash-merge into `dev` as `F##: <feature>`. Delete the branch.
4. **End of day** (or whenever `dev` is in a known-good "demo-able"
   state): fast-forward or squash-merge `dev` → `main`. Tag the
   main SHA if it's worth pinning (`v0.x` markers as we approach
   TestFlight).

**Never** commit directly to main. The bootstrap commits + F01
landed on main as a historical pre-`dev` exception; from F02
onward, all work flows through `dev`.

**PR titles** mirror the squash commit title: `F##: <feature>`.

### Per-feature loop

1. Pick the next feature from `FEATURES.md` (top to bottom unless a
   dependency reroutes you).
2. For backend features: write a failing DB/RLS/RPC test
   (`supabase test db` or a vitest hitting the local Supabase) before
   creating the migration. Apply migration locally
   (`supabase db reset` or `supabase migration up`) only to make the
   test pass.
3. Update Zod schemas + TanStack Query hook for the table — also test-first.
4. Build the screen using existing primitives (`Glass`, `Sheet`,
   `BoniNavBar`, etc.). If a primitive is missing, add it under
   `components/` — don't inline a one-off. Primitives are built
   test-first too.
5. Verify on the iOS simulator (real human eyes, not just green tests).
6. Commit. One commit per feature. Reference the F## ID in the title.

### Test commands

- `npm test` — run unit + component tests once.
- `npm run test:watch` — TDD loop.
- `npm test -- <file>` — single-file run.

### Test infra

- **jest-expo** preset — handles RN + Expo module mocks.
- **@testing-library/react-native** — component queries + interactions.
- **@testing-library/jest-native** — extra matchers (`toBeOnTheScreen`, etc).
- Skia + BlurView are stubbed in `jest.setup.ts` so visual primitives can
  be unit-tested without a real GPU. Visual regression (snapshot or
  screenshot) is a separate later step.

### One-time debts (TDD)

- **F00 primitives** (`AmbientCanvas`, `Glass`) shipped before TDD was
  in place. They get retroactive characterization tests in F01 that
  lock current behavior. This is a recorded exception, not a precedent.
  Every primitive landing from F01 onward is strict test-first.

### Useful commands
- `npx expo start` — launch dev server.
- `npx expo run:ios` — build + run on simulator.
- `supabase start` — local Supabase stack.
- `supabase db reset` — replay all migrations + seed.
- `supabase functions serve <name>` — run an Edge Function locally.
- `eas build --profile preview --platform ios` — TestFlight build.

---

## Anti-goals (don't drift)

Per `SPEC.md` §1.2:
- No GPS / location / geofencing.
- No mathematical charts, weight graphs, clinical trend lines.
- No social features (likes, public feeds, comments, followers).
- No clinical diagnostics or vet-facing PDF wizards.
- No physical print fulfillment (PDF only).
- No Android, web, or tablet surfaces.
- No light mode.

If a feature request crosses one of these lines, push back before
building — they're the brand promise.

---

## Session learnings

Append below as we discover non-obvious things during development.
Format: date, one-line insight, optional context.

- **2026-05-20** — Project initialized. SPEC + FEATURES + CLAUDE.md
  committed before any code. Source design bundle lives in
  `/tmp/boni-design/extracted/boni/` for visual reference (don't
  render in a browser; read the source).
- **2026-05-20 (F00)** — npm cache had root-owned files
  (`~/.npm/_cacache/...`). Workaround: pass
  `npm_config_cache=/tmp/npm-cache-boni` for installs. Permanent fix
  the user can run: `sudo chown -R 501:20 ~/.npm`.
- **2026-05-20 (F00)** — npm peer-dep resolution failed on
  expo-linking when the project path has trailing whitespace
  (`.../Boni Pet Timeline and Log. /`). Workaround: install with
  `--legacy-peer-deps`. Consider renaming the directory if it keeps
  biting (would require closing the IDE first).
- **2026-05-20 (F00)** — `create-expo-app@latest` pulls Tailwind v4 by
  default through transitive specifiers. NativeWind 4.x needs Tailwind
  3.4.x. Always pin `tailwindcss@^3.4.0` immediately after.
- **2026-05-20 (F00)** — `npx expo install` doesn't accept `--cache`
  flag; pass via `npm_config_cache=...` env var instead.
- **2026-05-20 (F00)** — Reanimated 4 worklets require
  `react-native-worklets` (now bundled by Expo SDK 54 default
  template). Don't manually add `react-native-reanimated/plugin` to
  babel — the new build system handles it.
- **2026-05-20 (F00)** — BlurView on iOS uses `intensity` 0–100 where
  100 ≈ 50px blur radius. To hit the 24px/36px design spec, we map
  `blur * 2` as intensity — works empirically; revisit with real
  device side-by-side once the design system ships.
- **2026-05-20 (F01)** — lucide-react-native v1 doesn't ship a runtime
  `icons` map (each glyph is a separate named export). LIcon uses
  `import * as Lucide` and indexes by name string, which pulls the
  whole set into the bundle. Bundle policy: tolerable while we build;
  if RN payload becomes a concern, swap LIcon to a hand-curated
  `iconMap.ts` of the ~30 glyphs Boni actually uses.
- **2026-05-20 (F01)** — NativeWind's babel preset injects an internal
  `_ReactNativeCSSInterop` binding into every transformed module. That
  binding leaks into `jest.mock` factory scope-analysis and breaks any
  mock that calls `require()` inside its factory. Fix: split
  `babel.config.js` by `NODE_ENV` so the NativeWind preset is off for
  jest, and move mocks into `__mocks__/<package>.js` files (auto-loaded
  by name) instead of inline `jest.mock(..., () => ...)` factories.
- **2026-05-20 (F01)** — `@gorhom/bottom-sheet`'s own mock at
  `@gorhom/bottom-sheet/mock` renders children unconditionally. Our
  Sheet tests therefore can't assert visibility tracking; they assert
  the public contract instead (ref exposes present + dismiss;
  invoking them doesn't throw). Animation + visibility verified
  visually on the simulator.

---

## 🌅 Tomorrow-morning handover

**Last session ended 2026-05-20.** Pick up exactly here.

### Where we are right now

- Branches in the repo (after tonight's push):
  - `main` — 11 commits, clean. Contains F00 bootstrap + 3 F01
    primitives (Eyebrow, SerifTitle, LIcon).
  - `dev` — created tonight, **same SHA as main**. From tomorrow
    onward this is where all feature work integrates first.
  - `feat/F01-design-system` — 9 commits ahead of `dev`. Holds the
    rest of F01: PressableSurface, useReduceMotion, Avatar,
    AvatarStack, BoniNavBar, Sheet (+ BottomSheetModalProvider
    wiring), characterization tests for AmbientCanvas + Glass, the
    Jest hardening, and the WIP kitchen-sink test scaffold.
- Test suite on `feat/F01-design-system`: **56 passing across 11
  suites**, **1 RED suite** (`app/kitchen-sink.test.tsx`) —
  intentionally failing because the matching `app/kitchen-sink.tsx`
  impl is the next thing to write.
- Live services last running:
  - Supabase local stack (`npx supabase start` — Docker-backed).
    May have shut down with the laptop; just rerun.
  - Metro on iPhone 16e simulator. Need to relaunch.

### Resume in this order

1. `cd "/Users/kapza/Documents/Projects/Boni Pet Timeline and Log. "`
2. Open Docker Desktop (wait for it to be ready).
3. `npx supabase start` (cached images, ~30s).
4. `git fetch && git checkout feat/F01-design-system`
5. `DEVELOPER_DIR=/Users/kapza/Downloads/Xcode.app/Contents/Developer npx expo start --ios`
   (DEVELOPER_DIR needed because Xcode lives in `~/Downloads/Xcode.app`,
   not `/Applications/Xcode.app`. Permanent fix: move Xcode to
   `/Applications` and `sudo xcode-select -s
   /Applications/Xcode.app/Contents/Developer`.)
6. `npm test` — confirm baseline: 56 passing, 1 RED on kitchen-sink.

### What to finish on `feat/F01-design-system` (in order)

1. **Implement `app/kitchen-sink.tsx`** to satisfy the existing
   `app/kitchen-sink.test.tsx`. Required content (driven by the
   test's `getByText` assertions):
   - Eyebrow "F01 · KITCHEN SINK"
   - `BoniNavBar` with title "Primitives"
   - `SerifTitle` hero italic "Every day, every memory."
   - `Avatar` with initials "SA"
   - `AvatarStack` with overflow producing "+2"
   - `PressableSurface` labelled "Open sheet" that opens a `Sheet`
   - A `Glass` card with body copy mentioning "refraction edge"
   - Plus enough primitive coverage to count as a proper "every
     primitive on one screen" demo: `LIcon` in a few sizes, the
     Glass strength + elevation matrix, a `useReduceMotion` readout
     line.
2. **Update `app/index.tsx`** to redirect to `/kitchen-sink` instead
   of `/scaffold` (one-line change).
3. **Manual verify on the simulator** — every primitive renders, no
   red boxes, press feedback works, Sheet opens via the
   PressableSurface and closes via the backdrop. Toggle iOS
   Settings → Accessibility → Motion → Reduce Motion and confirm
   AmbientCanvas stops drifting and PressableSurface skips the
   scale animation.
4. **Delete `app/scaffold.tsx`** (replaced by kitchen-sink) — but
   only after kitchen-sink is verified.
5. **Run `npm test`** — expect 12 passing suites, no REDs.
6. **Squash-merge F01 into `dev`** (NOT main; main stays clean
   until end of day): `git checkout dev && git pull && git merge
   --squash feat/F01-design-system && git commit -m "F01: design
   system primitives"`. Push `dev`. Delete `feat/F01-design-system`
   locally and on origin.

### Then start F02 (auth) — off `dev`

- `git checkout dev && git pull && git checkout -b feat/F02-auth`.
- Read `FEATURES.md` F02 section before writing any code.
- Apple Sign-In: needs `expo-apple-authentication` install.
- Google Sign-In: needs `expo-auth-session` setup.
- Email/password: simplest path, do first.
- Server side: Supabase Auth providers enabled in
  `supabase/config.toml`; database trigger
  `on_auth_user_created` → creates `households` + `users` rows.
- Migrations live in `supabase/migrations/<timestamp>_<feature>.sql`,
  one per feature. Write a failing SQL/RLS test before each migration
  (the iron law applies to backend too).
- Squash-merge into `dev` when green + verified.

### End-of-day ritual

When `dev` is in a known-good "demo-able" state:
1. `git checkout main && git pull`
2. `git merge --ff-only dev` (or `--squash` if you want one
   end-of-day commit per day instead of the day's feature commits)
3. `git push origin main`
4. Tag if it's a meaningful checkpoint:
   `git tag -a v0.x -m "..."  && git push --tags`

### Outstanding decisions blocking forward progress

- **Apple Developer account** — still not provisioned. Keep StoreKit
  stubbed for F02 + onward. Apple Sign-In on a real device needs the
  developer account too, but it works on the iOS simulator with
  Xcode-managed signing.
- **Move Xcode to `/Applications`?** — quality-of-life cleanup so the
  `DEVELOPER_DIR=` env-var prefix becomes unnecessary.

### Don't forget

- TDD iron law: every new file → failing test first. Engineer-conduct
  rules at the top of this file ARE the bar.
- Branch + squash convention: never commit directly to main again.
- F01 is the only branch that landed F00 polish commits on main as
  bootstrap exceptions. From F02 onward, no more main commits.
