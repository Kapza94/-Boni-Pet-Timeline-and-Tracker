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

## Development workflow

1. Pick the next feature from `FEATURES.md` (top to bottom unless a
   dependency reroutes you).
2. Write the migration first (`supabase/migrations/...sql`), apply
   locally (`supabase db reset` or `supabase migration up`).
3. Update Zod schemas + TanStack Query hook for the table.
4. Build the screen using existing primitives (`Glass`, `Sheet`,
   `BoniNavBar`, etc.). If a primitive is missing, add it under
   `components/` — don't inline a one-off.
5. Verify with a smoke test (Detox or component-level), plus a
   manual run on the iOS simulator.
6. Commit. PR per feature. Reference the F## ID in the title.

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
