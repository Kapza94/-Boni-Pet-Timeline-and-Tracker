# CLAUDE.md — Boni project memory

This file is loaded automatically into every Claude Code session in this
repo. It captures the **stack**, **conventions**, **non-obvious rules**,
and **session learnings** so a new Claude instance can be productive
immediately without re-deriving them.

If you change scope or learn something non-obvious, add it here.

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
- **Text-on-glass contrast rule (non-negotiable)**:
  - **Bright glass** (regular 0.58+ / strong 0.72+) = always **dark
    text**. Use `colors.onGlass[1]` (#181a21) for primary, `onGlass[2]`
    (#45474e) for meta, `onGlass[3]` (#787a80) for tertiary.
  - **Thin glass** (0.32) over the dark canvas = always **light text**.
    Use `colors.ink[1]` (#faf8f5). Never dark text on thin glass.
  - **Pastel accent washes** (lavender / peach / rose / sky at 0.20–0.40
    over canvas) = always **light text** (`ink[1]`).
  - **Honey reminder cards** (warm-yellow surfaces) = opaque honey
    `>= 0.80` with **dark text** (`onGlass[1]`). Never a wash with
    light text — that's the readability bug.
  - **Emerald active surfaces** (done tiles, running activity card) =
    light text + emerald icon + glow.
  This rule is the one we keep blowing in mockups; if a glass surface
  ever feels unreadable it's because this rule was violated. Fix the
  surface, don't darken the text past spec.
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
- **TODO — Sign in with Apple is deferred.** Blocked on the same
  Apple Developer account. The Apple button on `(auth)/sign-in.tsx`
  stays disabled until then. When the account exists:
  (1) enable Sign in with Apple capability in the App ID,
  (2) install `expo-apple-authentication`,
  (3) build a `useAppleSignIn` hook mirroring `useGoogleSignIn`
      (request identityToken + nonce, exchange via
      `supabase.auth.signInWithIdToken({ provider: 'apple' })`),
  (4) enable `[auth.external.apple]` in `supabase/config.toml`,
  (5) flip the button `disabled` flag in the sign-in screen.
- **TODO — Google OAuth blocked in Expo Go.** SDK 49+ removed the
  `auth.expo.io` proxy; Google's iOS OAuth client rejects the
  `exp://...` redirect Expo Go emits, so a native dev client is
  required to verify the Google flow end-to-end. The wiring itself is
  done (`hooks/useGoogleSignIn.ts`, `app.json` URL scheme,
  `supabase/config.toml` `[auth.external.google]`,
  `EXPO_PUBLIC_GOOGLE_*_CLIENT_ID` in `.env.local`). Deferred until
  after MVP feature work to avoid burning dev-build cycles mid-feature.
  When ready to verify:
  (1) `npm_config_cache=/tmp/npm-cache-boni npx eas-cli build
      --profile development --platform ios --simulator` (uses the
      existing `eas.json` development-simulator profile),
  (2) wait ~10–15 min, download the `.tar.gz`, extract `Boni.app`,
      drag into the running iOS Simulator,
  (3) `npx expo start --dev-client` to hot-reload JS into the native
      shell,
  (4) tap "Continue with Google" → expect the system browser to open
      the Google consent screen and return to a signed-in session.
  Rebuilds are only needed when native deps, `app.json`, or URL
  schemes change — JS-only edits hot-reload over Metro.
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

### Branching + PR workflow

- **main is always shippable.** Only completed features land. Never
  commit directly to main (the bootstrap commits and one-line `docs:`
  notes are the historical exception, not the rule).
- **One branch per FEATURES.md ID.** Naming:
  - `feat/F##-short-slug` — feature work (`feat/F02-auth`,
    `feat/F03-onboarding`)
  - `fix/<slug>` — bug fixes against an already-shipped feature
  - `chore/<slug>` — tooling, deps, config (`chore/jest-infra`)
  - `docs/<slug>` — docs-only changes
  - `refactor/<slug>` — non-behavior code reshaping
- **Branch off main**, do all the TDD red-green-refactor commits there.
  Many small commits inside the branch are fine and encouraged — they
  document the path.
- **Squash-merge into main** when the feature is green + visually
  verified on the simulator + the PR has been reviewed. Main gets one
  `F##: <feature>` commit per branch, so its log reads as a clean
  changelog and a feature reverts in a single shot.
- **Delete the branch** after squash-merge. No long-lived branches.
- **PR title** mirrors the squash commit title: `F##: <feature>`.

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
- **2026-05-21 (F01)** — Lucide name strings are PascalCase
  (`"Settings"`, `"PawPrint"`, `"CircleCheckBig"`), not kebab-case as
  the lucide.dev site implies. Mismatched names hit the LIcon dev
  warning and silently render nothing.
- **2026-05-21 (F01)** — jest.mock factories can't safely `require`
  `react-native` directly — babel's nativewind interop pulls
  `_ReactNativeCSSInterop` into scope and trips the "out-of-scope
  variables" rule when the mock is hoisted. Mocks for visual-only
  things (BlurView, Skia primitives) return `null` instead.
- **2026-05-21 (F01)** — Sheet shell is RN's `Modal` + a styled View,
  not `@gorhom/bottom-sheet` (yet). The FEATURES.md spec calls for
  gorhom, but the visual shell + backdrop-to-dismiss is all F01
  needs; drag-to-dismiss will swap gorhom in behind the same public
  API in F06 (Quick Log) where the gesture actually matters.
