# Boni — Final Product Spec

**Boni: Pet Timeline & Log** — a minimalist iOS pet-life companion app.
Premium iOS glassmorphic visual paradigm. Mobile-only. Single-pet free tier;
multi-pet, photos, family sync, and downloadable memory book PDF are paid.

This document is the implementation-ready specification of the prototype
delivered as `Boni — iOS App.html`, with the 7 open assumptions resolved
per product decisions on 2026-05-20.

---

## 1. Product overview

### 1.1 What it is
A mobile-first companion that turns routine pet care into a quietly emotional
shared family journal. Combines:

- **5-second daily logging** of food, water, walks, and bowel movements
  (binary toggle + optional amount/duration detail)
- **Medication and vaccine tracking** with relative-time reminders, fully
  user-editable
- **A chronological timeline** mixing automated daily logs with manual
  milestone moments and vet-visit entries
- **Photo memories** (premium) compiled into an optional **downloadable,
  printable PDF memory book** (premium)
- **Multi-user household sync** so any family member can see and contribute
  to one pet's day (premium)

### 1.2 What it explicitly is NOT
Hard scope boundaries — these are not in the product:

- No real-time GPS, location tracking, or geofencing
- No mathematical charts, weight graphs, or clinical trend lines
- No social features (likes, public feeds, banners, comments, followers)
- No clinical diagnostics or vet-facing PDF export wizards
- No physical print-on-demand fulfillment (memory book is digital PDF only)
- No Android, web, or tablet surfaces (iOS only)

### 1.3 Visual paradigm
Premium iOS glassmorphism: a deep canvas painted with soft pastel ambient
blobs (lavender, rose, peach, sky-blue), every interactive surface a
translucent white-tinted glass card with a 1px white refraction border, soft
multi-layer shadows, sentence case, SF Pro Display for ~95% of text,
Instrument Serif reserved for emotional moments (pet name, milestone titles,
paywall hero, memory book cover). Completed daily tasks drift to an emerald
glow over 900ms — the color drift IS the confirmation. Never alarmist.

### 1.4 Monetization
Single 3-tier subscription wall with decoy framing:

| Tier | Price | Display |
|---|---|---|
| Weekly | $1.99 / week | The decoy |
| Monthly | $4.99 / month | The flexible option |
| Yearly | $29.99 / year (~$2.50/mo) | **BEST VALUE · SAVE 50%** |

Free tier always available via a desaturated footer link:
*"Continue with free basic tracking (no photos / no shared sync)."*

**Billing**: Apple StoreKit (in-app purchase). Implementation deferred
until Apple Developer account is provisioned. App ships with a paywall UI
in place and a stub purchase handler that routes to a TODO state; real
StoreKit wiring lands in a follow-up release.

---

## 2. User stories

### 2.1 First-time user (onboarding)
- As a new user, I see a single editorial splash so I understand the product
  in <5 seconds.
- As a new user, I sign up with Apple, Google, or email + password.
- As a new user, I tap 3 dummy setup chips and see them populate a live
  preview, so I feel what the app does before committing.
- As a new user, I create exactly one pet profile (name, birth/adoption
  date, photo) on the free tier.
- As a new user, I see the 3-tier paywall with yearly highlighted as the
  best value, and can dismiss it to continue free.

### 2.2 Daily logger (the core loop)
- As a primary caregiver, I open the app and see today's four toggles
  (Food / Water / Walked / Poop) and can mark each in one tap.
- As a primary caregiver, I can optionally add an amount (food portion)
  or duration (walk minutes) when logging.
- As a primary caregiver, I see who in the household completed each task
  (premium) so I never re-feed the dog.
- As a primary caregiver, I see a low-stress banner when a vaccine booster
  is due within 30 days.
- As a primary caregiver, I tap the center + to open a quick-log sheet
  and capture a walk, meal, medication, photo, note, or vet visit in one tap.

### 2.3 Medication tracker
- As a caregiver giving daily meds, I see the next dose with a relative
  countdown ("in 20 min") and can mark it given or snooze it.
- As a caregiver, I see a clean list of all daily meds with dose and next
  scheduled time.
- As a caregiver, I can add, edit, or remove a medication entry at any
  time (name, dose, frequency, schedule, instructions, active flag).
- As a caregiver, I see a clean list of annual vaccines with the date given
  and next due date; entries within 30 days get a soft warm tint.

### 2.4 Timeline / journal
- As any household member, I scroll a chronological feed of today's
  automated logs mixed with manual moments and vet visits.
- As a free user, I see a beautiful frosted-glass locked photo slot that,
  when tapped, opens the paywall sheet.
- As a premium user, I add photos and editorial milestone captions to the
  timeline.
- As any user, I see gentle text-only insight cards when the system detects
  3+ consecutive days of below-baseline appetite or energy.

### 2.5 Family
- As any household member, I see who's in the household, their role, and
  what each contributed today.
- As a premium user, I see real-time family activity ("Sara fed Mochi 12
  min ago").

### 2.6 Vet visits / pet passport
- As a caregiver, I log a vet visit including date, vet/clinic name,
  reason, vet's notes, diagnoses, treatments given, and follow-up tasks.
- As a caregiver, I attach medications prescribed at the visit directly
  to the Medication list, editable from the vet visit context.
- As a caregiver, I scroll a chronological "pet passport" view of all
  past vet visits.

### 2.7 Memory book (premium, downloadable PDF)
- As a premium user, I tap to generate a PDF memory book of my pet's life,
  auto-compiled from the timeline (photos + milestones + log highlights).
- As a premium user, I preview the cover and page count, then download
  the PDF to my device for printing or sharing.

---

## 3. Full feature list

### 3.1 Onboarding (5 steps)
- **Step 0 — Sign in / sign up.** Three buttons: Continue with Apple,
  Continue with Google, Continue with email. Email path opens a minimal
  form (email + password + household name). Apple/Google paths use native
  sheets and create the household record on first success.
- **Step 1 — Splash.** Boni glyph (mini-schnauzer face in honey halo);
  Instrument Serif hero line "Every day, every memory."; sub line in SF Pro;
  mocked glass timeline card showing "Milo's first swim" + a logged walk
  toggle. CTA: "Show me".
- **Step 2 — Tap to taste.** Three interactive chips: "Set morning food",
  "Set heartworm pill", "Track daily walks". Tapping any chip animates it
  into a live "Your day · preview" glass panel below. Live preview shows
  "Tap one above — watch it populate." when empty. CTA: "Set up my pet".
- **Step 3 — Pet profile.** Circular photo drop-zone, Name field
  (focused emerald ring by default), Birth/Adoption Date field, and a
  desaturated locked "Add another pet" row with `PREMIUM` lock pill. CTA:
  "Continue".
- **Step 4 — Paywall.** Honey gradient orb, "Cherish every moment."
  serif hero, 3-tier list with yearly badged, single primary CTA "Start
  your free trial", subtle footer "Continue with free basic tracking…".

Progress dots at the top; Back button visible on steps 2 & 3.

### 3.2 Top-level chrome
- Status bar (54px transparent).
- Bottom tab bar — floating glass capsule, 14px inboard, 34px safe-area
  clearance. Five slots: Today / Meds / **+** (FAB) / Timeline / Family.
- FAB at center: emerald-filled circle with glow shadow; opens Quick Log.
- Active tab: emerald label, 2px stroke icon, emerald dot indicator.

### 3.3 Screen — Today
- Large title "Today" with eyebrow `Friday · May 22`; trailing 40px round
  glass search button.
- Contextual vaccine banner (capsule, glass) — shows only when a booster
  is due within 30 days. Format: `[icon]  Rabies booster due in 12 days.   Jun 3  ›`
  Tone is warm honey for soft warnings, warm rose for urgent.
- 2×2 grid of toggle cards: Food, Water, Walked, Poop.
  - Inactive: faint white glass border, neutral icon chip, "Tap to log".
  - Active: emerald ring + glow, emerald icon chip, drift transition
    900ms `ease-in-out-soft`. Subline becomes a timestamp ("Ate · 7:15 AM").
  - **Long-press** any toggle to open detail inline editor: amount field
    (food / water) or duration field (walk) or note (poop). Optional —
    skipping leaves toggle as binary mark.
- "How is she feeling?" section — mood selector row of four icon+label
  options (Tired / Calm / Bright / Hyper). Single-select; selected option
  uses emerald color and weight 600.
- "Family" section — glass row with overlapping AvatarStack, "All caught
  up" / "Sara fed Mochi 12 min ago", chevron.
- "A pattern we noticed" — purple-blob PatternFlag with italic serif text
  and a subline ("Three partial meals since Monday").
- "Keep her story going" — honey-gradient premium upsell row → opens paywall.

### 3.4 Screen — Meds & Vaccines
- Large title "Meds & Vaccines" with eyebrow `Active care`; trailing +
  button (opens add-med sheet).
- **Next up card** — solid warm honey card with eyebrow `NEXT UP · IN 20
  MIN`, drug name in 24px bold, sub-detail line ("Anti-inflammatory · give
  with food"), and two CTAs: primary dark "Mark as given" + secondary glass
  "Snooze".
- **Daily medications** section — glass list. Each row: honey icon chip,
  drug name, dose+frequency, NEXT eyebrow + next time. Tap row → edit
  sheet (name, dose, frequency, next due, instructions, active toggle,
  delete). Long-press → quick-action sheet (mark given / snooze / pause).
- **Annual vaccines** section — glass list. Each row: syringe icon chip
  (warm-tinted if within 30 days, neutral otherwise), vaccine name, "Given
  [date]", NEXT eyebrow + "in N days" or year. Tap row → edit sheet.

### 3.5 Screen — Timeline
- Large title "Timeline" with eyebrow `[N] days together`; trailing filter
  button.
- **Pet cover** — 200px warm-tinted hero card: serif italic pet name, breed
  + age subline, circular initial badge with honey ring.
- **Today** section — glass list of automated logs (walk, breakfast, pill,
  vet visit) with emerald check icons.
- **Add a moment** — for free tier, a `LockedPhotoCard` (frosted aspect-1.4
  card with central lock + "Cherish every moment." + "Unlock unlimited
  photos"). Tap fires the paywall sheet.
- **A year ago** — single glass quote card with serif italic milestone
  text and an `EYEBROW` date stamp.
- **Insight** — `PatternFlag` (same component as Today screen).

### 3.6 Screen — Family
- Large title "Family" with eyebrow `[Pet]'s people`; trailing user-plus.
- **Status hero** — emerald glow card with serif italic line "Today,
  Mochi is well looked after." + summary "Walk · breakfast · morning pill
  all logged."
- **The household** — glass list of `PersonRow`s: avatar + name + role +
  detail (e.g. "Active now", "3 logs today").
- **Today's contributions** — glass list of `ContribRow`s: avatar + bold
  name + did-what + relative timestamp.
- **Want a memory book?** — lavender→peach gradient upsell row → opens
  Memory Book sheet.

### 3.7 Quick Log sheet
- Bottom sheet (frosted, 28px top radii).
- Header: serif italic "What just happened?" + "Tap to log in 5 seconds."
- 2×3 grid of tiles: Walk / Meal / Medication / Photo / Note / Vet.
- Each tile: honey icon chip, label, sub-detail. Tapping opens that tile's
  minimal entry step (see 3.7.1).
- Cancel button at bottom.

#### 3.7.1 Quick Log tile behaviors
- **Walk** — open duration picker (default 20 min), optional note. Submit
  creates Activity type=`walk`.
- **Meal** — open portion picker (e.g. 1 cup / ½ cup / custom), optional
  note. Submit creates Activity type=`food`.
- **Medication** — open list of active medications; tap one to mark given
  (advances `next_due_at`); or tap "Add new" to open the med editor.
- **Photo** — opens camera/library. If tier=free, sheet closes and paywall
  sheet opens.
- **Note** — opens text field. Submit creates Activity type=`note`.
- **Vet** — opens Vet Visit sheet (see 3.8).

### 3.8 Vet Visit sheet (pet passport entry)
- Bottom sheet, frosted, full-height scrollable.
- Header: serif italic "Vet visit" + date picker (defaults to today).
- Form fields (all editable, all optional except date):
  - **Clinic / vet name** — text input
  - **Reason for visit** — text input (e.g. "annual checkup", "limping")
  - **Vet's notes** — multi-line text area (the passport detail —
    diagnoses, observations, vet's verbal advice)
  - **Treatments given** — multi-line text area (shots, procedures,
    samples taken)
  - **Follow-up** — text input (e.g. "recheck in 2 weeks")
  - **Medications prescribed** — inline editable list. Each row: name,
    dose, frequency, instructions, "Add to active meds" toggle. Toggling
    creates / updates a Medication record linked to this VetVisit.
  - **Photos / attachments** — up to N image attachments (premium-gated
    for upload; free tier sees lock).
- Primary CTA: "Save visit" → creates VetVisit + N Medication records +
  one Activity of type=`vet` (for the timeline).
- A read-only "Past visits" linked passport view is accessible from the
  pet profile (chronological list of VetVisit cards).

### 3.9 Paywall sheet
- Bottom sheet, frosted, 28px top radii.
- Header: honey gradient orb, serif italic "Keep [pet]'s story going.",
  sub line "Unlimited photos · multi-pet · real-time family sync ·
  memory book PDF".
- 3 tier rows (Weekly / Monthly / Yearly). Selected row has emerald ring
  + emerald icon chip + emerald glow. Yearly row carries the
  `BEST VALUE · SAVE 50%` badge.
- Primary CTA: "Continue with Yearly" (emerald, full-width). In current
  build this calls a stub purchase handler — real StoreKit lands later.
- Footer link: "Continue with free basic tracking (no photos / no
  shared sync)."
- Trigger surfaces: (a) locked photo card on Timeline, (b) "Keep her
  story going" row on Today, (c) photo-gated Vet Visit attachment, (d)
  "Want a memory book?" row on Family.

### 3.10 Memory Book sheet (downloadable PDF)
- Bottom sheet, frosted.
- Header: serif italic "A book of her life." + "Auto-compiled from your
  timeline. Download and print at home."
- Cover preview — gold-warm cover card, pet name in serif italic + date
  range. (No 3D / no physical shipping artwork.)
- Stats strip — 3 inset cards: Pages / Photos / File size.
- Primary CTA: "Generate PDF" — server compiles, then triggers iOS native
  download / share sheet so user can save to Files, AirPrint, or share.
- Secondary text: "Print at home or any print shop."
- Trigger surface: "Want a memory book?" row on Family.

### 3.11 Cross-cutting components
- `Glass` primitive (3 strengths: thin / regular / strong).
- `BoniNavBar` — eyebrow + 34px bold large title + optional trailing glass
  icon button.
- `ToggleCard`, `VaccineBanner`, `PatternFlag`, `LockedPhotoCard`,
  `PetCover`, `MedRow`, `VaxRow`, `FeedRow`, `PersonRow`, `ContribRow`,
  `VetVisitRow`.
- `Avatar` (with optional emerald active ring), `AvatarStack`.
- `Sheet` (modal bottom sheet shell).
- `AmbientCanvas` (ambient pastel-blob backdrop).
- `MedicationEditor` (reusable in Meds screen, Quick Log, and Vet Visit).

### 3.12 Free-tier locked states
- Photo upload card → frosted lock overlay → paywall trigger.
- Family activity attribution → covered by transparent lock watermark.
- Multi-pet → lock-pill on "Add another pet" row at onboarding.
- Vet Visit attachments → lock badge on attachment row.
- Memory Book PDF generation → upsell row opens paywall, not the sheet.

### 3.13 Pattern flagging
- Insight cards appear when daily logs show a 3-consecutive-day dip in
  appetite or energy, computed against the pet's rolling 14-day median.
- Text-only, supportive tone. Never alarmist.

---

## 4. User flows

### 4.1 First-launch flow
1. App launches → Sign-in screen (Apple / Google / Email).
2. Auth success → Onboarding step 1 (Splash).
3. Tap "Show me" → step 2 (Tap to taste).
4. Tap any chips (zero or more) → tap "Set up my pet" → step 3 (Pet
   profile).
5. Edit name / pick date / drop photo → tap "Continue" → step 4 (Paywall).
6. Tap "Start your free trial" OR the small footer link → main app
   (Today tab active).

### 4.2 Daily log flow
1. User opens app on Today.
2. User taps any toggle card (e.g. Walked) → card drifts to emerald glow
   over 900ms; sub-label becomes a timestamp.
3. (Optional) Long-press toggle → inline detail (amount / duration / note).
4. (Premium) family avatar of the completing user appears beside the
   active card.

### 4.3 Quick-log flow
1. User taps the center + in the tab bar.
2. Quick Log sheet slides up.
3. User taps a tile → minimal entry step appears → submit → sheet
   dismisses; log is recorded.

### 4.4 Medication flow
1. User opens Meds.
2. "Next up" card shows the next dose with relative time.
3. User taps "Mark as given" → row completes; appears in Today's timeline.
4. User taps "Snooze" → reminder pushes ahead by a default snooze interval.
5. User taps any med row → edit sheet (full CRUD).

### 4.5 Vet visit flow
1. User taps + → Vet tile (or visits Pet profile → "Log vet visit").
2. Vet Visit sheet opens.
3. User fills clinic, reason, notes, treatments, follow-up.
4. User adds N medications inline; toggles "Add to active meds" on those
   the pet should keep taking.
5. User attaches photos (premium) or sees lock badge (free).
6. Save → VetVisit + Activity(type=vet) + N Medication records created.
7. Activity appears in Timeline; visit appears in Pet passport list.

### 4.6 Photo paywall flow (free user)
1. User opens Timeline.
2. User taps the locked "Add a moment" frosted photo card.
3. Paywall sheet slides up. User selects a tier (default Yearly).
4. User taps primary CTA to subscribe, OR taps the footer link to dismiss.

### 4.7 Family contribution flow
1. Anyone in the household opens the app.
2. They see the current status hero on Family + today's contributions list.
3. When they complete a task (Today, Meds, Quick Log), their avatar attaches
   to that log entry; others see it in real time.

### 4.8 Memory book PDF flow (premium)
1. User opens Family.
2. User taps "Want a memory book?" row.
3. Memory Book sheet slides up showing cover preview + stats.
4. User taps "Generate PDF" → progress indicator → iOS share sheet opens
   with the file. User saves to Files / AirPrints / shares.

---

## 5. Data model

### 5.1 Entities

#### Household
- `id` — uuid
- `name` — string
- `subscription_tier` — enum: `free` | `weekly` | `monthly` | `yearly`
- `subscription_status` — enum: `active` | `trialing` | `expired` | `canceled` | `stubbed`
- `subscription_renews_at` — datetime, nullable
- `created_at` — datetime

> `stubbed` status used while StoreKit is not wired — a "premium" toggle
> in dev settings can be flipped to allow QA/internal review of premium
> surfaces before the real purchase path ships.

#### User
- `id` — uuid
- `household_id` — fk → Household
- `name` — string (display name; first name in copy)
- `avatar_initials` — string (1–2 chars; derived but stored)
- `avatar_color` — string (oklch token)
- `role` — enum: `primary` | `partner` | `housemate` | `walker` | `other`
- `email` — string, nullable (null when Apple-private-relay denied)
- `auth_provider` — enum: `apple` | `google` | `email`
- `auth_provider_id` — string (subject identifier from the provider; or
  null when provider=`email`)
- `created_at` — datetime
- `last_active_at` — datetime

#### Pet
- `id` — uuid
- `household_id` — fk → Household
- `name` — string
- `breed` — string, nullable
- `birth_or_adoption_date` — date
- `photo_url` — string, nullable (premium; S3-backed)
- `created_at` — datetime

> Free tier: exactly 1 Pet per Household. Server must enforce.

#### Activity (the daily-log entry)
- `id` — uuid
- `pet_id` — fk → Pet
- `user_id` — fk → User (who logged it)
- `type` — enum: `food` | `water` | `walk` | `poop` | `med` | `vet` | `note` | `photo`
- `status` — enum: `done` | `pending` (for scheduled meds before given)
- `occurred_at` — datetime
- `detail` — string, nullable (free-form text — e.g. note body, vet
  one-line summary)
- `amount` — decimal, nullable (food portion in cups, water in oz —
  units encoded in `amount_unit`)
- `amount_unit` — enum: `cup` | `oz` | `g` | `ml`, nullable
- `duration_minutes` — int, nullable (walk length)
- `med_id` — fk → Medication, nullable (only when type=`med`)
- `vet_visit_id` — fk → VetVisit, nullable (only when type=`vet`)
- `photo_url` — string, nullable (only when type=`photo`, premium)
- `created_at` — datetime

#### Medication
- `id` — uuid
- `pet_id` — fk → Pet
- `vet_visit_id` — fk → VetVisit, nullable (set when prescribed at a visit)
- `name` — string (e.g. "Carprofen")
- `dose` — string (e.g. "75 mg")
- `frequency` — enum: `once_daily` | `twice_daily` | `as_needed` | `weekly` | `monthly`
- `next_due_at` — datetime
- `instructions` — string, nullable (e.g. "give with food")
- `active` — bool (user-editable; flipping to false stops reminders but
  preserves history)
- `created_at` — datetime
- `updated_at` — datetime

#### Vaccine
- `id` — uuid
- `pet_id` — fk → Pet
- `name` — enum: `rabies` | `dhpp` | `bordetella` | `other`
- `name_other` — string, nullable (when name=`other`)
- `given_on` — date
- `next_due_on` — date
- `created_at` — datetime

#### VetVisit
- `id` — uuid
- `pet_id` — fk → Pet
- `user_id` — fk → User
- `occurred_on` — date
- `clinic_name` — string, nullable
- `vet_name` — string, nullable
- `reason` — string, nullable
- `vet_notes` — text, nullable (the passport detail — diagnoses,
  observations, vet's verbal advice)
- `treatments` — text, nullable (shots, procedures, samples)
- `follow_up` — string, nullable
- `attachment_urls` — array<string>, nullable (premium; S3-backed)
- `created_at` — datetime
- `updated_at` — datetime

> A VetVisit may be linked from 0..N Medication rows (those prescribed
> at the visit). Each save creates exactly one Activity(type=`vet`) so
> the visit lands on the Timeline.

#### Mood
- `id` — uuid
- `pet_id` — fk → Pet
- `user_id` — fk → User
- `value` — enum: `tired` | `calm` | `bright` | `hyper`
- `occurred_at` — datetime

#### Milestone
- `id` — uuid
- `pet_id` — fk → Pet
- `user_id` — fk → User
- `title` — string (editorial — e.g. "She learned the word 'walk.'")
- `occurred_on` — date
- `photo_url` — string, nullable (premium)
- `created_at` — datetime

#### Insight (system-generated pattern flag)
- `id` — uuid
- `pet_id` — fk → Pet
- `kind` — enum: `appetite_dip` | `energy_dip`
- `text` — string (the surfaced sentence)
- `sub` — string (e.g. "Three partial meals since Monday")
- `window_start` — date
- `window_end` — date
- `dismissed_at` — datetime, nullable
- `created_at` — datetime

#### MemoryBookExport (premium)
- `id` — uuid
- `pet_id` — fk → Pet
- `user_id` — fk → User
- `pages` — int
- `photo_count` — int
- `pdf_url` — string (signed URL, time-limited; S3-backed)
- `byte_size` — int
- `status` — enum: `generating` | `ready` | `failed` | `expired`
- `generated_at` — datetime, nullable
- `expires_at` — datetime (signed URL TTL; e.g. 7 days)
- `created_at` — datetime

### 5.2 Relationships
- Household 1—N User
- Household 1—N Pet
- Pet 1—N Activity, Medication, Vaccine, VetVisit, Mood, Milestone,
  Insight, MemoryBookExport
- User 1—N Activity, Mood, Milestone, VetVisit, MemoryBookExport
- Activity N—1 Medication (nullable; only for med-type activities)
- Activity N—1 VetVisit (nullable; only for vet-type activities)
- VetVisit 1—N Medication (nullable; meds prescribed at this visit)

---

## 6. API requirements

REST-ish over HTTPS. JSON. All endpoints authenticated except auth itself.
All collection endpoints scoped to the authenticated user's household.

### 6.1 Auth
- `POST /auth/sign-up`        — { email, password, household_name } (email path)
- `POST /auth/sign-in`        — { email, password } → { token, user }
- `POST /auth/apple`          — { identity_token, authorization_code, household_name? } → { token, user }
- `POST /auth/google`         — { id_token, household_name? } → { token, user }
- `POST /auth/sign-out`
- `GET  /me`                  → current user + household + subscription status

Apple/Google endpoints verify the provider token server-side, create a
User+Household on first success (using `household_name` if provided, else
a default like "[Name]'s household"), and return the session token.

### 6.2 Pets
- `GET    /pets` → array (free tier returns max 1)
- `POST   /pets` — { name, breed?, birth_or_adoption_date, photo? }
  - 402 Payment Required if free tier and one pet already exists
- `GET    /pets/:id`
- `PATCH  /pets/:id`
- `DELETE /pets/:id`

### 6.3 Activities (daily log)
- `GET   /pets/:id/activities?from=&to=&type=` — filtered, paginated
- `POST  /pets/:id/activities` — { type, status?, occurred_at?, detail?,
  amount?, amount_unit?, duration_minutes?, med_id?, vet_visit_id?, photo? }
  - 402 if `type=photo` and tier=free
- `PATCH /activities/:id`
- `DELETE /activities/:id`
- `GET   /pets/:id/today` → today's activities + completion summary +
  family attributions

### 6.4 Medications
- `GET    /pets/:id/medications`
- `POST   /pets/:id/medications` — { name, dose, frequency, next_due_at,
  instructions?, vet_visit_id? }
- `PATCH  /medications/:id` — any field (full edit)
- `POST   /medications/:id/mark-given` — { occurred_at?, user_id? } →
  creates an Activity of type `med`, advances `next_due_at`
- `POST   /medications/:id/snooze` — { minutes }
- `DELETE /medications/:id`

### 6.5 Vaccines
- `GET    /pets/:id/vaccines`
- `POST   /pets/:id/vaccines` — { name, name_other?, given_on, next_due_on }
- `PATCH  /vaccines/:id`
- `DELETE /vaccines/:id`
- `GET    /pets/:id/vaccines/upcoming?within_days=30` → those whose
  `next_due_on` is within the window (drives the Today banner)

### 6.6 Vet visits
- `GET    /pets/:id/vet-visits` → chronological list (the passport)
- `POST   /pets/:id/vet-visits` — { occurred_on, clinic_name?, vet_name?,
  reason?, vet_notes?, treatments?, follow_up?, attachments?,
  medications?: [{ name, dose, frequency, instructions?, add_to_active }] }
  - On save: creates VetVisit, creates one Activity(type=`vet`), creates
    Medication rows for each entry where `add_to_active=true`.
  - 402 if `attachments` provided and tier=free.
- `GET    /vet-visits/:id`
- `PATCH  /vet-visits/:id`
- `DELETE /vet-visits/:id`

### 6.7 Moods
- `POST /pets/:id/moods` — { value, occurred_at? }
- `GET  /pets/:id/moods/latest`

### 6.8 Milestones
- `GET  /pets/:id/milestones?from=&to=` — paginated
- `POST /pets/:id/milestones` — { title, occurred_on, photo? }
  - 402 if `photo` provided and tier=free
- `PATCH /milestones/:id`
- `DELETE /milestones/:id`

### 6.9 Insights
- `GET  /pets/:id/insights?active=true` — undismissed insights
- `POST /insights/:id/dismiss`

Insight generation is server-side. Job runs nightly per pet, computing
against the pet's rolling 14-day median:
- `appetite_dip` when, for 3 consecutive days, total daily food amount
  (sum of `amount` on `type=food` activities, in normalized units) is
  below 60% of the rolling median — OR when no food activity is logged
  on any of those days.
- `energy_dip` when, for 3 consecutive days, total daily walk duration
  (sum of `duration_minutes` on `type=walk`) is below 60% of the rolling
  median — OR when no walk is logged.

### 6.10 Household / family
- `GET    /household/members`
- `POST   /household/invites` — { email, role } (premium)
- `DELETE /household/members/:id` (primary caregiver only)
- `GET    /pets/:id/contributions/today` → today's activities grouped by user

### 6.11 Subscription
- `GET  /subscription` → current tier, status, renews_at
- `POST /subscription/start-trial` — { tier } (yearly auto-trial)
- `POST /subscription/change` — { tier }
- `POST /subscription/cancel`
- `POST /subscription/stub-set` — { tier } (DEV/QA only; only enabled
  while StoreKit is not yet wired; gated by build flag)

Real StoreKit receipt validation endpoint to be added in a follow-up
release; for now the client uses the stub endpoint behind a build flag.

### 6.12 Memory book export
- `POST  /pets/:id/memory-book/exports` → starts generation, returns
  MemoryBookExport with status=`generating`
- `GET   /memory-book/exports/:id` → poll for status; when `ready`,
  response includes `pdf_url` (signed, time-limited)
- `GET   /pets/:id/memory-book/preview` → { pages, photo_count } for the
  cover sheet (no PDF generated)

### 6.13 Realtime
- WebSocket `/realtime`
- Server pushes on household-scoped channel:
  - `activity.created` / `activity.updated`
  - `medication.given` / `medication.updated`
  - `vet_visit.created`
  - `mood.created`
  - `milestone.created`
  - `insight.created`
  - `memory_book.ready`
- Drives the "Sara fed Mochi 12 min ago" copy + live family attribution.

---

## 7. Edge cases

### 7.1 Free-tier enforcement
- Adding a 2nd pet → blocked client- and server-side (402); opens paywall.
- Uploading a photo (activity, milestone, or vet attachment) → blocked;
  opens paywall.
- Inviting another household member → blocked; opens paywall.
- Generating a memory book PDF → blocked; opens paywall.
- Free user opens the Family screen → screen renders, but contribution
  attribution is covered by a transparent lock watermark.

### 7.2 Vaccine banner
- Show only when at least one vaccine has `next_due_on - today ≤ 30 days`.
- If multiple vaccines qualify, show the soonest. The rest are surfaced
  only in Meds & Vaccines screen, not as banners.
- Once `next_due_on - today ≤ 0`, tone shifts from honey to warm rose;
  copy stays supportive ("Rabies booster due today", never "OVERDUE").
- Tapping the banner navigates to Meds & Vaccines, scrolled to the
  relevant row.

### 7.3 Toggle cards (Today)
- Tapping an active toggle un-toggles it: animation reverses; the
  associated Activity is soft-deleted.
- Re-tapping in the same minute should reuse the existing Activity rather
  than churning new ones.
- The same toggle tapped by two family members simultaneously: server
  resolves by `occurred_at`; the attribution shown is the first writer.
- Long-press inline detail editor: closing without entering anything
  leaves the toggle binary (no amount/duration stored).

### 7.4 Quick log
- Each tile opens its own minimal entry step (note text, photo capture,
  duration picker, etc.). Cancel from the entry step returns to the
  Quick Log grid.
- "Photo" tile → if tier=free, sheet closes and the paywall sheet opens.
- "Medication" tile with zero active meds → shows an "Add a medication"
  empty state with primary CTA into the med editor.

### 7.5 Pattern flag
- Once dismissed, an insight does not re-fire for the same window.
- An insight fires at most once per `(pet, kind)` per 7-day rolling window.
- Insight copy is server-supplied (`text` + `sub`) so it can be tuned
  without a client release.
- Pets with fewer than 7 days of history are excluded from insight
  generation (no baseline median yet).

### 7.6 Onboarding
- User can return from step 2 → step 1, and step 3 → step 2, but not from
  step 4 (paywall) — that step is terminal and dismissed only via the
  free-tier link or successful subscribe (or, currently, the stub
  purchase handler).
- Adding 2+ pets in step 3 is locked behind premium even before the
  paywall is shown.
- Selecting zero "tap to taste" chips is allowed; user advances anyway.
- Apple Sign-In with private-relay email → store the relay address as
  `email`; never re-prompt the user to "verify" it.

### 7.7 Vet visit
- Saving with zero optional fields filled (only the date) is allowed —
  produces a minimal passport entry the user can edit later.
- Editing `vet_notes` later does not retro-update the Timeline Activity
  copy; the Activity holds a one-line summary captured at save time.
- A Medication created from a vet visit can be edited or deactivated
  later from the Meds screen — it is no longer "owned" by the visit.
- Deleting a VetVisit does NOT delete the Medication rows it spawned
  (those are independent records owned by the pet).

### 7.8 Memory book
- Premium-only. Free users see the upsell row but tapping it opens the
  paywall sheet, not the book sheet.
- The preview (pages + photo_count) is computed from up-to-the-minute
  counts; recomputed on each open.
- PDF generation is async — the client polls or listens on the realtime
  channel for `memory_book.ready`.
- Signed `pdf_url` expires after 7 days; user can regenerate at no cost
  to produce a fresh URL.

### 7.9 Authentication
- Apple Sign-In is the recommended path when running on iOS (per
  App Store guidelines). All 3 paths must be visible.
- Google Sign-In uses the native Google SDK and returns an ID token the
  server verifies.
- Email/password requires a minimum 8-character password; no email
  verification step in v1 (deferred).
- Account deletion is available from Settings (required for App Store
  review) and cascades through the household if the deleting user is
  the primary; otherwise removes just that user.

### 7.10 Network / offline
- Logging actions queue locally and sync when online; UI shows the
  emerald drift immediately.
- Insights are server-generated only — never inferred client-side.
- Memory book PDF generation requires an active connection; offline,
  the "Generate PDF" CTA shows a transient "Connect to generate" state.

---

## 8. Non-functional requirements

### 8.1 Platforms
- iOS only. iPhone form factors; designed at 390×844 (iPhone 14/15) and
  scales to all current iPhone sizes including Dynamic Island devices.
- iOS 16+ (for `backdrop-filter` parity / native equivalent).
- Dark canvas only — no light mode.

### 8.2 Visual fidelity
- Glass surfaces: fill `rgba(255,255,255,0.58)` (regular) / `0.72` (strong)
  / `0.32` (thin); border `1px solid rgba(255,255,255,0.55)`;
  `backdrop-filter: blur(24px) saturate(1.7)` (regular) / `blur(36px)` (strong).
- Refraction edge (1px white border) is non-negotiable.
- Active task drift to emerald glow takes 900ms `ease-in-out-soft`.
- Default transition 240ms `ease-out-soft`; spring reserved for delight
  (milestone unlock, photo drop, memory book PDF ready).
- Press feedback: `scale(0.98)` + drop shadow, 140ms.

### 8.3 Typography
- SF Pro Display for ~95% of UI (regular/medium/semibold/bold).
- Instrument Serif italic for: pet name on covers, milestone titles, paywall
  hero ("Cherish every moment.", "Keep [pet]'s story going."), memory book
  cover, certain quotes.
- Sentence case everywhere. ALL CAPS reserved for eyebrow style and the
  paywall badge.
- Voice: supportive, never alarmist, second-person soft. No emoji in chrome.
  No medical jargon. Always use the pet's name.

### 8.4 Spacing & layout
- 4pt base scale. Outer page padding 20px. Section rhythm 32px.
- Tab bar floats 14px inboard, 34px safe-area clearance.
- Status bar 54px (transparent); large title nav 44–96px (glass).
- Hit targets ≥44px.

### 8.5 Iconography
- Lucide outline, 1.5–2px stroke. 22px tab bar, 20px list rows, 18px
  inline, 16px chips.
- Colors: `--on-glass-2` on glass; `--ink-2` on canvas; `--emerald-500`
  for active.

### 8.6 Performance
- Time-to-interactive on Today screen <1s on iPhone 12 and newer.
- Real-time push latency for household activity <2s p95.
- 60fps animations on all drifts and sheet presents.
- Memory book PDF generation <30s p95 for a 12-month timeline.

### 8.7 Privacy & storage
- All household data is private to the household. No public discovery, no
  social graph, no third-party sharing.
- Photos and pet data are deletable on demand.
- **Photo / attachment / PDF storage**: S3 (or equivalent). Used only for
  premium accounts — uploads from free-tier devices are blocked at the
  client and server. This keeps storage costs paid for by the same users
  who consume the storage.
- Signed URLs for premium media expire after a short TTL (default 1 hour
  for in-app display; 7 days for the memory book download).

### 8.8 Accessibility
- VoiceOver labels for every toggle, list row, sheet, and CTA.
- All metadata text (timestamps, sub-labels) maintains ≥4.5:1 contrast
  against its glass surface.
- Reduce Motion: disable the 900ms emerald drift in favor of an instant
  state swap; disable ambient blob drift.
- Dynamic Type respected up to XXL.

### 8.9 Subscription mechanics
- 3 tiers exactly: $1.99/wk, $4.99/mo, $29.99/yr.
- Yearly is the displayed best value; copy must render the per-month
  equivalent ("~$2.50/mo").
- Free escape link is always present at the bottom of the paywall sheet
  and onboarding paywall step, in desaturated text — never hidden.
- **StoreKit deferred**: build ships with stub purchase handler behind a
  build flag. Real StoreKit integration is a separate work item gated
  on the Apple Developer account being provisioned.

---

## 9. Open assumptions — RESOLVED

All previously open assumptions resolved on 2026-05-20:

1. **Identity provider** → Apple Sign-In + Google Sign-In + email/password.
   All three visible on sign-in screen.
2. **Payment processor** → Apple StoreKit (deferred until Apple Developer
   account is provisioned; ship with stub handler behind a build flag).
3. **Photo storage** → S3, restricted to premium accounts so storage cost
   is covered by subscription revenue.
4. **Insight thresholds** → add optional `amount` (food/water) and
   `duration_minutes` (walk) fields. Dip = 3 consecutive days where the
   daily total is below 60% of the pet's rolling 14-day median, OR where
   the activity is missing entirely. Toggles remain one-tap; detail is
   long-press optional.
5. **Multi-pet UX past 1** → deferred to a later phase. Design the pet
   switcher when implementation reaches multi-pet support, to avoid
   blocking current scope.
6. **Vet visit** → expanded into a full pet-passport entity (VetVisit)
   with vet notes, treatments, follow-up, and an inline editable
   Medications list that can attach prescribed meds to the active
   medications list. Medications are fully user-editable from the Meds
   screen and from the Vet Visit sheet.
7. **Memory book** → replaced physical hardcover with a downloadable,
   printable PDF. Premium-only. Server compiles, returns a time-limited
   signed URL, user saves / AirPrints / shares via iOS share sheet.
   No fulfillment partner, no $59 SKU.
