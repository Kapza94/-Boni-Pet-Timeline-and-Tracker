# Boni — Feature Breakdown for Claude Code

Source of truth: `SPEC.md`. This file slices that spec into **discrete,
claude-code-shaped features**. Each feature is a self-contained unit of
work covering both frontend (React Native + Expo) and backend (Supabase)
so a single Claude Code session can land it end-to-end.

Features are ordered by dependency. Build top-to-bottom unless noted.

---

## Stack reference

- **Frontend**: React Native + Expo SDK (latest), Expo Router for
  file-based navigation, NativeWind for Tailwind-on-RN, `expo-blur` for
  the iOS frosted-glass backdrop, `@shopify/react-native-skia` for any
  custom-painted surfaces (ambient blob canvas, memory-book cover
  preview, complex shadows).
- **Backend**: Supabase — Postgres for data, Supabase Auth (Apple,
  Google, email), Supabase Storage for photos / vet attachments /
  memory-book PDFs, Supabase Realtime for household sync, Edge
  Functions for the insight job and PDF generation.
- **State**: TanStack Query for server cache; Zustand (or React
  context) for ephemeral UI state. Decide per feature; default to
  Query for anything that touches the network.
- **Forms**: react-hook-form + Zod schemas mirrored from DB.

---

## How to use this doc

Each feature row:
- **ID** — stable identifier (`F##`).
- **Title** — short name.
- **Goal** — single-sentence outcome.
- **Frontend** — components, screens, hooks.
- **Backend** — Supabase tables, RLS, RPCs, Storage rules, Edge Functions.
- **Deps** — feature IDs that must land first.
- **Done when** — acceptance.

Build one feature at a time. Each feature should land behind a
verifying test (Detox or component-level) plus a manual run-through.

---

## F00 — Project scaffold

**Goal**: Empty Expo app boots, Supabase client connects, NativeWind
classes render, ambient canvas + glass tokens render on a placeholder
screen.

**Frontend**
- `npx create-expo-app boni --template tabs`
- Add `nativewind`, `tailwindcss`, configure `tailwind.config.js` with
  the Boni design tokens (port from `colors_and_type.css`).
- Add `expo-blur`, `@shopify/react-native-skia`,
  `@supabase/supabase-js`, `react-native-url-polyfill`,
  `@react-native-async-storage/async-storage`.
- Set up Expo Router file structure: `app/_layout.tsx`,
  `app/(onboarding)/`, `app/(app)/(tabs)/`, `app/(app)/sheets/`.
- Add SF Pro Display + Instrument Serif via `expo-font`.
- Wire dark-only theme (no light mode).

**Backend**
- Create Supabase project.
- Capture `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
  in `.env.local`; add `.env.example`.
- Enable Row Level Security on all future tables by default.

**Deps**: none.
**Done when**: `npx expo start` launches; a placeholder screen renders
the ambient blob canvas + one Glass card with the Instrument Serif
hero string; Supabase client logs "connected" in the console.

---

## F01 — Design system primitives

**Goal**: Reusable components and tokens that every other screen
consumes. No business logic.

**Frontend**
- `components/Glass.tsx` — wraps `BlurView` + 1px white border + the
  three shadow tiers (sm/md/lg). Props: `strength` (thin/regular/strong),
  `radius`, `children`.
- `components/AmbientCanvas.tsx` — Skia canvas painting the four pastel
  blobs (lavender / rose / peach / sky) with slow `useDerivedValue`
  drift. Sits behind every screen.
- `components/BoniNavBar.tsx` — eyebrow + 34px bold large title +
  optional trailing icon button.
- `components/Eyebrow.tsx`, `components/SerifTitle.tsx`,
  `components/Sheet.tsx` (bottom-sheet shell using
  `@gorhom/bottom-sheet` over a `BlurView`).
- `components/Avatar.tsx` + `AvatarStack.tsx`.
- `components/icons/LIcon.tsx` — Lucide via `lucide-react-native`,
  wired to color tokens.
- `tokens.ts` — exports `colors`, `radii`, `spacing`, `durations`,
  `easings` derived from the Tailwind config so JS code can reference
  them too.
- `theme/typography.ts` — text style presets (display, title, body,
  meta, eyebrow, serif).

**Backend**
- None.

**Deps**: F00.
**Done when**: A "kitchen sink" screen renders every primitive with no
runtime warnings; press feedback (`scale(0.98)` 140ms) works on any
pressable; Reduce Motion disables blob drift.

---

## F02 — Authentication (Apple / Google / Email)

**Goal**: User can sign up and sign in via three paths. Session
persists. `/me` returns user + household + subscription tier.

**Frontend**
- `app/(auth)/sign-in.tsx` — three buttons + email form.
- `lib/auth.ts` — wraps `supabase.auth.signInWithIdToken` (Apple,
  Google) and `signInWithPassword` / `signUp` for email.
- Apple: `expo-apple-authentication`.
- Google: `expo-auth-session` with the Google provider.
- Session restored on app boot via `supabase.auth.getSession()`.
- Sign-out from Settings.

**Backend**
- Supabase Auth providers enabled in dashboard: Apple, Google, Email.
- Database trigger `on_auth_user_created` → creates a `households` row
  and a `users` row, links them.
- Tables `households`, `users` per SPEC §5.1. RLS:
  - `users`: SELECT/UPDATE where `auth.uid() = id`.
  - `households`: SELECT where `id` is in user's household; UPDATE
    only by `role='primary'`.

**Deps**: F00, F01.
**Done when**: Each of the three auth paths produces a usable session;
killing and reopening the app restores it; account deletion (Settings
flow) removes the user and cascades the household if they are primary.

---

## F03 — Onboarding flow

**Goal**: New user walks the 5-step onboarding and lands on Today.

**Frontend**
- `app/(onboarding)/_layout.tsx` — Stack with progress dots + back
  button (steps 2 & 3 only).
- `step-1-splash.tsx`, `step-2-taste.tsx`, `step-3-profile.tsx`,
  `step-4-paywall.tsx`. Sign-in is F02's screen.
- Step 2: three chips, local state, live preview panel.
- Step 3: photo drop zone (no upload yet — held until F04), name,
  birth/adoption date.
- Step 4: imports the Paywall sheet from F16.
- Onboarding completion writes `onboarded_at` on `users`.

**Backend**
- `users.onboarded_at` column.
- `pets` table per SPEC §5.1. RLS: SELECT/INSERT/UPDATE/DELETE where
  `household_id` matches caller's household; INSERT denied when free
  tier and `count(*) >= 1`.

**Deps**: F02, F16 (paywall sheet — can stub during F03 build and
swap in once F16 lands).
**Done when**: New account can walk every step; first pet appears in
`pets`; user lands on Today.

---

## F04 — Photo storage (Supabase Storage)

**Goal**: Premium users can upload pet/photo/vet/milestone images;
free users are blocked at upload time.

**Frontend**
- `lib/storage.ts` — `uploadImage(bucket, file)` returns a public-ish
  signed URL or storage path; the URL helper returns a 1-hour signed
  URL for display.
- `<RemoteImage>` component that resolves signed URLs and caches.
- Image picker via `expo-image-picker` + downscale via
  `expo-image-manipulator`.

**Backend**
- Buckets: `pet-photos`, `activity-photos`, `vet-attachments`,
  `milestone-photos`, `memory-books`.
- Storage policies: INSERT allowed only when caller's household has
  `subscription_tier != 'free'`; SELECT allowed only within own
  household; DELETE allowed by uploader or household primary.
- `media_assets` table (optional) for tracking ownership + cleanup.

**Deps**: F02.
**Done when**: A premium account can upload + view; a free account
gets a 403 at the storage layer with a paywall-trigger error from
the client.

---

## F05 — Today: toggles, mood, vaccine banner

**Goal**: The core daily-log surface works end-to-end with optimistic
emerald-drift animations.

**Frontend**
- `app/(app)/(tabs)/index.tsx` — Today screen.
- `components/ToggleCard.tsx` with the 900ms emerald drift
  (`Animated` + `useSharedValue`).
- Long-press → inline `<DetailEditor>` with portion / duration / note
  field per type.
- `components/MoodSelector.tsx` — single-select row of 4.
- `components/VaccineBanner.tsx` — driven by F09.
- `hooks/useTodayActivities.ts` — TanStack Query against
  `GET /pets/:id/today`; mutations write to `activities`.

**Backend**
- `activities` table per SPEC §5.1 + the F#4 fields (`amount`,
  `amount_unit`, `duration_minutes`, `vet_visit_id`).
- `moods` table.
- RLS: SELECT/INSERT/UPDATE/DELETE where pet → household → caller.
- RPC `today_summary(pet_id uuid)` returns the day's activities
  grouped by type + family attributions in one round trip.

**Deps**: F02, F03, F09.
**Done when**: Tapping a toggle drifts to emerald and writes an
Activity; un-tapping soft-deletes; long-press detail editor stores
amount/duration; mood selection writes a Mood row.

---

## F06 — Quick Log sheet

**Goal**: + FAB opens the sheet; every tile lands a row.

**Frontend**
- `app/(app)/sheets/quick-log.tsx` — 2×3 grid.
- Each tile pushes its mini-entry screen (Walk duration picker, Meal
  portion picker, Med list, Photo capture, Note, Vet → opens Vet sheet
  F10).
- "Photo" tile when free → close + open Paywall sheet (F16).

**Backend**
- Uses `activities` table from F05. No new schema.

**Deps**: F05, F08, F10, F16.
**Done when**: Each tile produces the correct Activity (or routes to
its parent sheet); cancel returns to the grid without writing.

---

## F07 — Tabs + FAB chrome

**Goal**: Bottom tab bar floats correctly with the center + FAB and
the active-state styling.

**Frontend**
- `app/(app)/(tabs)/_layout.tsx` — custom `tabBar` prop using a
  `Glass` capsule.
- Center slot is a non-route FAB that opens Quick Log (`router.push`
  to the modal sheet).
- Five slots: Today / Meds / + / Timeline / Family.

**Backend**: none.
**Deps**: F01, F06.
**Done when**: Tab bar renders glass capsule with correct insets;
active tab shows emerald label + dot; + opens Quick Log.

---

## F08 — Medications

**Goal**: Full CRUD for meds + Next Up card + mark-given / snooze.

**Frontend**
- `app/(app)/(tabs)/meds.tsx`.
- `components/MedRow.tsx`, `NextUpCard.tsx`.
- `components/MedicationEditor.tsx` — reused in Meds, Quick Log, Vet
  Visit. Form: name, dose, frequency, next_due_at, instructions,
  active toggle.
- `hooks/useMedications.ts`.

**Backend**
- `medications` table per SPEC §5.1.
- RPC `mark_medication_given(med_id, occurred_at, user_id)` →
  inserts Activity(type=med), advances `next_due_at` by frequency.
- RPC `snooze_medication(med_id, minutes)`.
- RLS scoped by pet → household.

**Deps**: F03, F05.
**Done when**: Add / edit / delete med works; Next Up updates;
mark-given creates a Timeline row; snooze pushes the time.

---

## F09 — Vaccines + Today banner

**Goal**: Vaccine list with edit + the 30-day Today banner.

**Frontend**
- `components/VaxRow.tsx` inside the Meds screen (Section B).
- `components/VaccineBanner.tsx` used by Today screen (F05).
- `hooks/useUpcomingVaccines.ts`.

**Backend**
- `vaccines` table per SPEC §5.1.
- View `vaccines_upcoming` filtering to `next_due_on - today <= 30`.
- RLS scoped by pet → household.

**Deps**: F03, F05.
**Done when**: Adding a vaccine due in <=30 days makes the banner
appear; tapping banner navigates to the vaccine row.

---

## F10 — Vet visits (pet passport)

**Goal**: Full Vet Visit sheet + chronological passport view.

**Frontend**
- `app/(app)/sheets/vet-visit.tsx` — full form per SPEC §3.8.
- Inline editable Medications list using `MedicationEditor` rows;
  each has an "Add to active meds" toggle.
- `app/(app)/pet/[id]/passport.tsx` — chronological list of
  VetVisitRow cards.
- Photo / attachment slots gated to premium (uses F04).

**Backend**
- `vet_visits` table per SPEC §5.1 + `attachment_urls` array.
- `medications.vet_visit_id` FK (added in F08; nullable).
- RPC `create_vet_visit(payload jsonb)` that atomically:
  1. Inserts a `vet_visits` row,
  2. Inserts each medication in the payload where
     `add_to_active = true`,
  3. Inserts one `activities` row of type=`vet` linked to the visit.
- RLS scoped by pet → household.

**Deps**: F04, F08.
**Done when**: A saved visit produces 1 VetVisit + N Meds + 1
Activity in one transaction; editing notes later does NOT mutate the
Activity copy.

---

## F11 — Timeline feed

**Goal**: Chronological feed mixing automated logs, milestones, vet
visits, and pattern-flag insights.

**Frontend**
- `app/(app)/(tabs)/timeline.tsx`.
- `components/PetCover.tsx`, `FeedRow.tsx`, `LockedPhotoCard.tsx`
  (uses F16 paywall when tapped), `PatternFlag.tsx`.
- Virtualized list (`@shopify/flash-list`).
- `hooks/useTimeline.ts` — paginated by week.

**Backend**
- View or RPC `timeline_feed(pet_id, from, to)` that unions
  `activities` + `milestones` + `vet_visits` + `insights` with a
  uniform shape (id, kind, occurred_at, payload).

**Deps**: F04, F05, F08, F09, F10, F12, F15, F16.
**Done when**: Today's logs appear automatically; a milestone appears
when added; locked photo card opens paywall on free tier.

---

## F12 — Milestones

**Goal**: Premium users can add editorial milestones with optional
photo.

**Frontend**
- `app/(app)/sheets/add-milestone.tsx` — title, date, photo.
- Add-milestone CTA in the Timeline screen header (premium).

**Backend**
- `milestones` table per SPEC §5.1.
- RLS scoped by pet → household; INSERT with `photo_url` denied on
  free tier.

**Deps**: F04, F11.
**Done when**: Premium users can post a milestone; it lands in the
feed; free users see the gated CTA.

---

## F13 — Family / household members

**Goal**: Family tab + invite + roles + per-row contribution feed.

**Frontend**
- `app/(app)/(tabs)/family.tsx`.
- `components/PersonRow.tsx`, `ContribRow.tsx`, `StatusHero.tsx`.
- `app/(app)/sheets/invite.tsx` — email + role (premium).

**Backend**
- `household_invites` table (id, household_id, email, role, token,
  expires_at, accepted_at).
- Edge function `send_invite` → emails the magic link via a transactional
  email provider.
- Edge function `accept_invite` → on token redemption, inserts a `users`
  row in the inviting household.
- RPC `contributions_today(pet_id)` → activities grouped by user_id.
- RLS: invites visible only to household; only `role='primary'` can
  remove members.

**Deps**: F02, F05, F08.
**Done when**: Primary can invite (premium-gated); invitee accepts and
appears in the household; their daily logs show in Today's family row.

---

## F14 — Realtime sync

**Goal**: Any logged action propagates to other household devices in
<2s.

**Frontend**
- `lib/realtime.ts` — subscribes to the household channel on app
  focus; unsubscribes on background.
- TanStack Query cache invalidation on incoming events.

**Backend**
- Supabase Realtime enabled on `activities`, `medications`, `moods`,
  `milestones`, `vet_visits`, `insights`, `memory_book_exports`.
- A Postgres trigger broadcasts on a per-household channel:
  `household:<id>` with payload `{ type, row }`.

**Deps**: F05, F08, F10, F11, F12.
**Done when**: Two devices logged into the same household see each
other's toggles flip in <2s.

---

## F15 — Insights (pattern flagging)

**Goal**: Server detects appetite/energy dips and surfaces them.

**Frontend**
- `components/PatternFlag.tsx` (already in F05 + F11) consumes
  `insights` rows.
- Swipe-to-dismiss writes to `dismissed_at`.

**Backend**
- `insights` table per SPEC §5.1.
- Edge function (scheduled nightly via Supabase Cron):
  1. For each pet with ≥7 days of history,
  2. Compute rolling 14-day median for food amount and walk duration,
  3. If 3-consecutive-day totals are <60% of median OR missing,
     insert an Insight (one per `(pet, kind)` per 7-day window).
- RLS scoped by pet → household.

**Deps**: F05, F08.
**Done when**: Seeded data with a 3-day dip produces exactly one
Insight; dismissing it prevents re-fire in the same window.

---

## F16 — Subscription paywall (StoreKit deferred)

**Goal**: Paywall sheet wired; free-tier locks throughout the app
trigger it; a dev-only stub flips the tier so premium surfaces can be
tested before StoreKit lands.

**Frontend**
- `app/(app)/sheets/paywall.tsx` — 3 tier rows, default Yearly, free
  footer link.
- `hooks/useSubscription.ts` returns the current tier + status; used
  by every locked surface.
- `lib/purchases.ts` — current implementation calls
  `/subscription/stub-set` behind a `EXPO_PUBLIC_STOREKIT_STUB=1`
  build flag.
- Settings → dev panel (only visible with the flag) to flip tier.

**Backend**
- `households.subscription_tier` + `subscription_status` (`stubbed` is
  a valid status).
- RPC `set_subscription_stub(household_id, tier)` — only callable when
  the request includes a `x-storekit-stub: 1` header AND the server
  build is non-production.
- All premium-gated endpoints check `subscription_tier`. Helper:
  `is_premium(household_id) returns bool`.

**Deps**: F02.
**Done when**: Tapping any locked surface opens the paywall; flipping
the stub tier unlocks premium UI; production builds cannot call the
stub endpoint.

---

## F17 — Memory book PDF export

**Goal**: Premium user generates a PDF compiled from the timeline and
saves/shares it via iOS.

**Frontend**
- `app/(app)/sheets/memory-book.tsx` — cover preview + stats +
  "Generate PDF" CTA.
- `hooks/useMemoryBook.ts` — POST to start, poll until
  `status='ready'`, then call `expo-sharing.shareAsync(pdf_url)`.
- Listens on the realtime channel for `memory_book.ready` to avoid
  polling once F14 is in.

**Backend**
- `memory_book_exports` table per SPEC §5.1.
- Edge function `generate_memory_book(pet_id)`:
  1. Pull pet, milestones, top-N photos, year ranges.
  2. Render HTML template; convert to PDF via a server-side renderer
     (`puppeteer` in a Deno-compatible variant, OR offload to a small
     external service if Deno can't host headless Chrome).
  3. Upload to `memory-books` bucket; sign URL with 7-day TTL.
  4. Update `memory_book_exports` row to `status='ready'`.
- RLS scoped by pet → household; INSERT denied on free tier.

**Deps**: F02, F04, F11, F12, F14, F16.
**Done when**: Premium user gets a PDF in the iOS share sheet within
30s for a 12-month timeline; free users see the upsell row routing to
paywall.

---

## F18 — Free-tier lock surfaces

**Goal**: All locked states render their lock UI consistently.

**Frontend**
- `components/LockedOverlay.tsx` — translucent overlay with lock
  icon, used by photo cards, family attribution row, multi-pet row,
  vet attachment slots.
- `components/UpsellRow.tsx` — gradient honey or lavender-peach;
  consumed by Today + Family.

**Backend**: none (logic enforced in F02 + per-feature RLS).
**Deps**: F16.
**Done when**: Visual audit on a free account: every gated surface
shows the right lock; every lock tap opens the paywall.

---

## F19 — Accessibility + Reduce Motion

**Goal**: VoiceOver labels everywhere; ≥4.5:1 contrast on glass
metadata; Reduce Motion disables drifts.

**Frontend**
- Audit every interactive: `accessibilityLabel`,
  `accessibilityRole`, `accessibilityHint`.
- Hook `useReduceMotion()` (wraps `AccessibilityInfo`); ToggleCard
  drift + AmbientCanvas drift respect it.
- Dynamic Type respected up to XXL via `allowFontScaling` defaults
  + text-style scaling.

**Backend**: none.
**Deps**: F05 (toggles), F01 (canvas).
**Done when**: VoiceOver walks the full app without "unlabeled
button"; Xcode Accessibility Inspector passes contrast; Reduce
Motion swaps drifts for instant state changes.

---

## F20 — Settings + account deletion

**Goal**: Settings screen with sign-out + delete account; required
for App Store review.

**Frontend**
- `app/(app)/settings.tsx` — sign-out, delete account, dev panel
  (when stub flag).
- Confirmation modal for delete (destructive).

**Backend**
- RPC `delete_account(user_id)` — if primary, cascade-delete the
  household + pets + activities + storage objects; otherwise just
  delete the user row and reassign primary if needed.
- Edge function variant that also calls
  `supabase.auth.admin.deleteUser` server-side.

**Deps**: F02.
**Done when**: Delete flow purges everything and signs out; primary
cascade tested with seeded data.

---

## F21 — App Store packaging

**Goal**: Build pipeline ready for TestFlight when the Apple Developer
account is provisioned.

**Frontend**
- EAS Build config: `eas.json` with `production`, `preview`,
  `development` profiles.
- App icons + splash via `expo-splash-screen` per the Boni glyph.
- Privacy manifest entries for camera, photo library, push (if any).

**Backend**: none.
**Deps**: F00 → F20.
**Done when**: `eas build --profile preview --platform ios` produces
an installable IPA; submission template drafted.

---

## Dependency graph (high level)

```
F00 → F01 → F02 ──► F03 ──► F05 ──► F06, F07, F08, F09
                          │
                          ├─► F04 (storage)
                          │
F02 ─► F13 (family)
F08 ─► F10 (vet)
F11 (timeline) needs F04 F05 F08 F09 F10 F12 F15 F16
F14 (realtime) layered on top of any table-touching feature
F16 (paywall) gates F12 F17 F18 attachments in F10
F17 (memory book) needs F04 F11 F12 F14 F16
F19 + F20 + F21 finalize
```

Build sequence suggestion:
1. F00 → F01 → F02
2. F03 → F04 → F05 → F07 → F06
3. F08 → F09 → F10
4. F11 → F12
5. F13 → F14 → F15
6. F16 → F17 → F18
7. F19 → F20 → F21

Each feature should land as a single PR with the matching schema
migrations, RLS policies, and a smoke test.

---

## Out of scope (per SPEC §1.2)

Not features. Do not build:
- GPS / location / geofencing
- Charts, graphs, trend lines
- Social features (likes, public feeds, comments)
- Clinical diagnostics, vet-facing exports
- Physical print fulfillment (memory book is PDF only)
- Android, web, tablet surfaces
- Multi-pet UI (deferred — per SPEC §9 item 5)
