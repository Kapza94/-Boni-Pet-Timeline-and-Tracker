# Home / Calendar / Daily Log — Sub-project #1 Design

**Status:** Draft for review
**Date:** 2026-05-23
**Sub-project of:** `docs/superpowers/specs/2026-05-23-boni-v2-architecture-design.md`
**Replaces (in old SPEC.md):** §3.2 (top-level chrome), §3.3 (Today screen), §3.5 (deferred — now Memory tab not this scope), §5 partial (Activity entity, plus the new tables this surface needs)

## 1. Scope

Locks the four-tab navigation, the Home screen (calendar-feed-anchored daily log), and the Calendar tab (agenda view). Defines every interaction, sheet, data model delta, hook, and test that this surface needs. Stops short of designing Pet / Medical / Memory / Family — those are separate sub-projects.

## 2. Tab bar — locked

Floating glass capsule, 14px inboard from screen edge, 34px safe-area clearance. **Four tabs only:**

| Tab | Icon (Lucide) | Free? | Notes |
|---|---|---|---|
| Home | `Home` | Yes | Daily log + due-today |
| Calendar | `Calendar` | Yes | Agenda view |
| Pet | `PawPrint` | Yes | Profile + passport (sub-project #2) |
| Medical | `Stethoscope` | Yes | Vet visits + weight + meds (sub-project #3) |

Settings opens from a circular user avatar in the top-right of the Home header. **Not a tab.** Memory + Family + Expenses tabs are deprecated — those surfaces live as deep-link destinations from other tabs (Memory under Pet's photo journal entry, Family under Settings, Expenses under Calendar's "See breakdown ›").

Quick-log FAB (old SPEC §3.2) is **deprecated**. The one-tap grid on Home replaces it.

## 3. Home screen — locked layout

Top to bottom, single ScrollView:

### 3.1 Header (≈ 60px)

- **Left:** pet avatar stack. Free or single-pet paid → one circular avatar (40px). Paid 2+ pets → overlapping stack with -8px offset (max 3 visible + a "+N" counter). Tap → pet switcher sheet.
- **Center:** date eyebrow `FRI · MAY 23 · MOCHI` (active pet name appended). Below: serif italic "Today" (large title, 32px, Instrument Serif italic, `ink[1]`).
- **Right:** user avatar (36px, 1.5px white refraction border, lavender fill). Tap → Settings stack.

### 3.2 Running activity card (conditional)

Renders only when an `activities` row exists with `started_at IS NOT NULL AND ended_at IS NULL`. Visual: saturated emerald-600 wash (`#00a16f` at 0.85), white 0.55 refraction border, light text, emerald glow ring. Shows the activity type icon (Lucide), label ("Walk in progress"), and a monospaced timer (mm:ss). Tap anywhere on the card → stops the timer via `stop_activity` RPC.

A sticky local notification (`expo-notifications`) mirrors the card on the lock screen with the same Stop action. Notification cancels when the card stops, regardless of which surface triggered the stop.

### 3.3 Quick-log grid

`QUICK LOG` eyebrow + 4×2 grid of glass tiles. Order locked:

| Pos | Tile | Lucide icon | Behavior |
|---|---|---|---|
| 1 | Food | `Bone` | Instant log |
| 2 | Water | `Droplet` | Instant log |
| 3 | Walk | `Footprints` | Start timer |
| 4 | Poop | (custom thin swirl) | Instant log |
| 5 | Pee | `Droplets` | Instant log |
| 6 | Weight | `Scale` | Input sheet |
| 7 | Train | `Target` | Start timer |
| 8 | Photo (paid) | `Camera` | Camera/library; free = paywall sheet |

**Tile visual states:**
- **Idle:** thin glass (0.10 white over canvas) + 0.40 white refraction edge + light icon + light label
- **Done today:** emerald wash (0.28) + emerald refraction edge (0.65) + emerald glow inset + emerald icon + emerald label
- **Locked (free + Photo):** 0.05 white wash, 0.22 white edge, 60% opacity, top-right `+` honey pill (lock indicator using Lucide `Lock` glyph inside the pill — see §3.6 contrast rule)

**Per-tile tap behavior (locked from §3 brainstorm):**

| Tile | Single tap | Long press |
|---|---|---|
| Food / Water / Poop / Pee | log @ now() | retroactive time picker sheet |
| Walk / Train | start timer | manual entry sheet (start + end + duration backdated) |
| Weight | open weight input sheet | input sheet pre-opened to backdate state |
| Photo (paid) | camera/library | retroactive picker |
| Photo (free) | paywall sheet | paywall sheet |

Done-glow persists for the calendar day and resets at midnight (local time). Tiles remain tappable when done — same activity can be logged multiple times per day.

### 3.4 "Due today" reminder list

`DUE TODAY` eyebrow + capsules. Source: `reminders` table filtered `due_at <= end_of_today(local) AND dismissed_at IS NULL AND pet_id = active_pet`.

Each capsule: opaque honey wash (`#f9b481` at 0.80) + white 0.55 refraction edge + **dark text** (`onGlass[1]`, per the contrast rule landed in CLAUDE.md). Lucide icon left, title + meta line, no trailing chevron (the whole capsule is tappable; chevron is implied).

Empty state: no card at all. Silence is fine. Don't render "No reminders today" copy.

### 3.5 Home empty state (first-time only)

If user has 0 activities (ever) and 0 reminders: replace §3.2–§3.4 with a centered serif card:
- Italic serif: `"Mochi's first day with Boni."`
- Body line: `"Tap any tile to start logging."`

Single tap of any tile transitions to the normal layout (state-driven, no animation orchestration needed).

### 3.6 Color + contrast (re-affirmed from CLAUDE.md)

- Thin glass tiles → light text (`ink[1]`)
- Bright glass cards (running, expense, event) → dark text (`onGlass[1]` primary, `onGlass[2]` meta)
- Honey reminder capsule → dark text on opaque honey
- Lavender accent washes (sync card) → light text
- Emerald active surfaces → light text + emerald icon/timer

## 4. Calendar tab — locked layout

Top to bottom:

### 4.1 Header

Identical pattern to Home: date eyebrow `MAY 2026 · MOCHI`, serif italic "Calendar" hero, user avatar right (→ Settings).

### 4.2 Month strip

Thin glass capsule: `‹ May 2026 ›`. Tap arrows = prev/next month. Tap month name = year picker sheet. **No month grid view in v1** — Agenda only.

### 4.3 Expense summary card

Bright glass card pinned below the month strip. Two-column:
- Left: `THIS MONTH` eyebrow (dark) + total in tabular numerals (`$84.20`)
- Right: entry count + `See breakdown ›` link (`emerald[600]` text)

Free tap on "See breakdown ›" → paywall sheet (expense categories are paid). Paid tap → Expenses screen deep-link (lives at `/(app)/expenses` per sub-project #7).

### 4.4 Agenda list

Vertical, soonest-first. Date headers grouped:

- `Today · Fri May 23` (relative + absolute)
- `Sat May 24` (relative day name for next 6 days)
- `Jun 3 · in 11 days` (absolute + countdown for events beyond a week)
- `Aug 12 · in 81 days` (long horizon)

Each event = bright glass card (`onGlass[1]` text), Lucide icon left, title + meta line, chevron right. Variants:
- **Honey event** — recurring weekly/daily reminders (tooth brushing pattern)
- **Emerald event** — celebratory (birthday, adoption anniversary)
- **Default** — vet visits, vaccines, custom user events

**Event sources (one merged feed):**
- `reminders` table (free + paid)
- `vet_visits` table (next visit + future visits)
- Auto-computed: `pet.birthday` (yearly), `pet.adoption_anniversary` (yearly, if DOB ≠ adoption date)
- Future: custom user-added events (via §4.6 + FAB)

### 4.5 Sync card (paid surface)

Pinned below the agenda when user has no `calendar_links` row. Lavender wash (`#b6a8ff` at 0.30) + white refraction edge + Lucide `Lock` icon + copy:
> Sync to your Apple or Google Calendar
> Boni+ feature

Free user tap → paywall sheet. Paid user tap → setup sheet (provider picker → OS calendar permission → confirm → linked).

When linked: card collapses to a small footer line `Synced to Apple Calendar · last 2m ago`. Settings has the unlink/re-link control.

### 4.6 + FAB (add custom event)

Floating emerald circle, bottom-right, 22px inboard from screen edge, 96px from bottom (clears tab bar). Lucide `Plus`. Glow shadow. Tap → add-event sheet:
- Title (text input)
- Icon (Lucide picker — limited set: bell, vaccine, paw, sparkles, cake, target, droplet, syringe)
- Date + time picker
- Recurrence: none / daily / weekly / monthly / yearly / custom
- Optional notes

Saves to `reminders` table with `kind = 'custom'`.

### 4.7 Calendar empty state

If no events of any kind in the active month + no past activity: centered glass card "Nothing scheduled. Tap + to add your first reminder."

## 5. Interactions (locked from §3 brainstorm)

### 5.1 Sheets

All sheets: bottom-anchored, draggable to dismiss, backdrop blur (24px), refraction border on the sheet container. Sheet shell is RN `Modal` for now (per F01 session learnings — gorhom is deferred until F06 when drag-to-dismiss gesture becomes critical, and is swappable behind the same public API).

**Sheet inventory:**
1. **Pet switcher** — list of household pets + "+ Add another pet" (free → paywall)
2. **Retroactive log sheet** — long press on instant-log tile. Time picker + optional amount/portion
3. **Manual walk/train entry sheet** — long press on duration tile. start_time, end_time, computed duration, optional notes
4. **Weight input sheet** — number pad + kg/lb toggle + optional backdated time
5. **Reminder detail sheet** — tap a reminder capsule. Mark done / Snooze (1d / 1w / custom) / Edit / Delete
6. **Paywall sheet** — fires from Photo tile (free), sync card (free), 2nd pet add (free)
7. **Add custom event sheet** — Calendar + FAB
8. **Calendar sync setup sheet** — paid; provider picker + permission

### 5.2 Navigation rules

- Sheets stack (chained sheets allowed)
- Soft toast = bottom glass capsule, 2.4s auto-dismiss, non-blocking; used for log confirmations
- No iOS alerts, no dialogs; sheets only
- No swipe-to-delete on tiles or reminders in v1 (long-press carries all power use)
- No 3D Touch / Haptic Touch differentiation — `onPress` + `onLongPress` only

### 5.3 Realtime cross-device sync

On Home mount + Calendar mount, subscribe to `supabase.channel('household:'+householdId)`. Invalidate queries on:
- `activities` INSERT/UPDATE → `['running-activity']`, `['today-completed']`
- `reminders` UPDATE → `['today-reminders']`, `['upcoming-agenda']`
- `expenses` INSERT → `['monthly-expense-total']`
- `weight_entries` INSERT → `['weight-chart']` (consumed by Medical tab; Home doesn't render)

Target p95 sync latency < 2s (from SPEC §6 — unchanged).

## 6. Data model — tables touched by Home + Calendar

### 6.1 `activities` — extend

Add columns:
- `started_at timestamptz` — nullable; set when timer-style activity begins
- `ended_at timestamptz` — nullable; set when timer stops or activity is logged retroactively
- `is_running boolean GENERATED ALWAYS AS (started_at IS NOT NULL AND ended_at IS NULL) STORED` — denormalized for fast index/query

`activities.type` enum gains: `pee`, `training` (existing: `food`, `water`, `walk`, `poop`, `med`, `vet`, `note`, `photo`).

Indexes:
- `activities_pet_running_idx ON activities (pet_id) WHERE is_running` — at most one row per pet usually
- `activities_pet_occurred_idx ON activities (pet_id, occurred_at DESC)` — for today-completed queries

### 6.2 `weight_entries` (new)

```sql
create table public.weight_entries (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  weight_kg numeric(5,2) not null,
  recorded_at timestamptz not null default now(),
  recorded_by uuid references public.users(id),
  created_at timestamptz not null default now()
);
```

RLS: select/insert/update/delete where caller's household contains `pet_id`'s household.

### 6.3 `reminders` (new)

```sql
create type reminder_kind as enum ('vaccine', 'med', 'vet', 'custom');

create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  kind reminder_kind not null,
  title text not null,
  icon text,                -- Lucide name; nullable, default by kind
  due_at timestamptz not null,
  recurrence text,          -- 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | RFC-5545 RRULE for custom
  source_id uuid,           -- FK to vaccine/med if auto-generated
  dismissed_at timestamptz,
  created_by uuid references public.users(id),
  created_at timestamptz not null default now()
);
```

RLS: same household-bound visibility pattern.

Indexes:
- `reminders_pet_due_idx ON reminders (pet_id, due_at) WHERE dismissed_at IS NULL`

### 6.4 `expenses` (new)

```sql
create type expense_category as enum (
  'food', 'vet', 'meds', 'grooming', 'boarding', 'toys', 'insurance', 'other'
);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  amount_cents integer not null check (amount_cents >= 0),
  currency text not null default 'USD',
  category expense_category not null default 'other',
  note text,
  receipt_url text,         -- Storage path; paid-only (server-side guard on INSERT)
  occurred_at timestamptz not null default now(),
  created_by uuid references public.users(id),
  created_at timestamptz not null default now()
);
```

RLS + household-bound visibility. Free-tier guard: `receipt_url` must be null on insert when household is free; rejected via trigger.

### 6.5 `calendar_links` (new, paid)

```sql
create type calendar_provider as enum ('apple', 'google');

create table public.calendar_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  provider calendar_provider not null,
  access_token text not null,        -- encrypted at rest via pgcrypto
  refresh_token text,                -- encrypted at rest
  last_synced_at timestamptz,
  created_at timestamptz not null default now()
);
```

Per-user, not per-household. RLS: visible only to the user themselves.

Free-tier guard trigger: INSERT denied when the user's household is free; raises `paywall_required`.

### 6.6 `pets` (extended in master spec, recap of fields touched by this surface)

Master spec already adds `species`, `sex`, `neutered`, `microchip_id`, `allergies`, `health_conditions`, `weight_kg` to `pets`. Home/Calendar uses:
- `pets.name` (header eyebrow)
- `pets.birth_or_adoption_date` (birthday auto-event)
- `pets.weight_kg` (Weight tile current value; chart history in `weight_entries`)

## 7. RPCs (`SECURITY DEFINER`, atomic)

- `start_activity(p_pet_id uuid, p_type text)` returns `activities` — inserts a running row, returns it. Errors if there is already a running activity of the same type for that pet.
- `stop_activity(p_activity_id uuid)` returns `activities` — sets `ended_at = now()`, derives `duration_minutes`. Errors if the row is already stopped or the caller is not in the household.
- `dismiss_reminder(p_reminder_id uuid)` returns `reminders` — sets `dismissed_at`. Idempotent.
- `snooze_reminder(p_reminder_id uuid, p_new_due_at timestamptz)` returns `reminders` — updates `due_at`.

RPCs handle the multi-column updates atomically. All check household membership via `auth.uid()` lookup against `users.household_id`.

## 8. Hooks (TanStack Query)

### Mutations

- `useLogActivity({ petId, type, occurredAt?, amount?, amountUnit?, durationMinutes?, note? })`
- `useStartActivity({ petId, type })` — calls `start_activity` RPC + schedules local notification
- `useStopActivity({ activityId })` — calls `stop_activity` RPC + cancels notification
- `useLogWeight({ petId, weightKg, recordedAt? })`
- `useDismissReminder({ reminderId })`
- `useSnoozeReminder({ reminderId, newDueAt })`
- `useCreateReminder({ petId, kind, title, dueAt, recurrence? })`
- `useLogExpense({ petId, amountCents, category, note?, occurredAt?, receiptUrl? })` (basic for free; receiptUrl ignored on free)

### Queries

- `useRunningActivity(petId)` — at most one row
- `useTodayCompleted(petId)` — distinct types logged today for done-glow state
- `useTodayReminders(petId)` — `due_at <= end_of_today AND dismissed_at IS NULL`
- `useUpcomingAgenda(petId, monthStart, monthEnd)` — union of reminders + vet_visits + computed birthdays/anniversaries
- `useMonthlyExpenseTotal(petId, yearMonth)` — sum of `expenses.amount_cents` for the month
- `useActivePet()` — returns the user's session-local active pet (defaults to first pet on the household)

### Free-tier guards

Client-side errors mapped to paywall trigger:
- `PHOTO_REQUIRES_PREMIUM` — surfaced from `activities` insert when type=photo
- `CALENDAR_SYNC_REQUIRES_PREMIUM` — surfaced from `calendar_links` insert
- `RECEIPT_REQUIRES_PREMIUM` — surfaced from `expenses` insert with receipt_url

## 9. Testing strategy (TDD per CLAUDE.md)

### 9.1 Migration + RLS + RPC (pgTAP)

- Schema: every new column, every new table, every new index, every enum
- RLS: pet-in-household visibility on all new tables
- Free-tier guard triggers fire on the right INSERTs (photo activity, calendar_links, expenses.receipt_url) and not on others
- RPC `start_activity`: rejects double-start, returns row, only callable by caller in household
- RPC `stop_activity`: computes duration correctly, idempotent on double-stop (errors second time), rejects cross-household call
- RPC `dismiss_reminder`: idempotent
- RPC `snooze_reminder`: updates due_at, no other side effects

### 9.2 Hooks (Jest + @testing-library/react-native + TanStack)

- Each mutation: success path + error path + paywall-trigger path
- Each query: empty data, single row, multi-row
- Cache invalidation via the Realtime path tested via direct invalidation calls (Realtime is integration-tested in simulator)

### 9.3 Components

- `RunningActivityCard` — renders only when running activity exists; tap → stop mutation
- `QuickLogGrid` — 8 tiles in order; done-state derived from `useTodayCompleted`
- `LogTile` — instant tap + long-press paths; locked variant for free Photo
- `RemindersList` — capsules from `useTodayReminders`; empty = nothing rendered
- `ExpenseSummaryCard` — free vs paid breakdown rendering, `See breakdown ›` paywall on free
- `AgendaList` — date grouping for next-7-days relative + beyond-week absolute; honey/emerald variants
- `MonthStrip` — prev/next, year picker invocation
- `SyncCard` — locked/unlocked states
- `AddEventFAB` + add-event sheet
- Each sheet (pet switcher, retroactive log, manual walk entry, weight, reminder detail, paywall, add event, sync setup)

### 9.4 Integration (simulator)

- Sign in → onboarding (existing F03 flow) → land on Home → tap Walk → kill app → reopen → see running card + sticky notification → tap Stop → row in DB with duration
- Tap reminder capsule → detail sheet → dismiss → capsule disappears
- Calendar + FAB → add custom event → appears in agenda
- Long-press Food tile → retroactive picker → confirm → soft toast → tile done-glow
- Free user taps Photo → paywall sheet renders
- Paid user taps Photo → camera → photo lands in activity row
- Two-device test (paid family): start walk on device A → device B sees running card in <2s

## 10. Out of scope (deferred)

- Month grid calendar view (defer to v2 if requested; agenda-only ships v1)
- Day / Week view toggles
- Two-way external calendar sync (master spec locks one-way write)
- Live Activities (iOS Dynamic Island + lock screen rich UI) — sticky local notification ships v1; Live Activity is a polish later
- Smart logging (Siri / Voice / Watch) — separate sub-project, not this surface
- Swipe gestures on tiles/reminders
- Multi-pet aggregate views ("all pets at once") — pet switcher swaps active pet; aggregate is its own UX in sub-project #5

## 11. Open questions (resolved or deferred during brainstorm)

| Question | Resolution |
|---|---|
| Tab structure | 4 tabs: Home / Calendar / Pet / Medical. Settings via avatar. |
| Quick-log FAB | Deprecated. 4×2 grid replaces it. |
| 8th tile content | Photo (paid, paywall on free) |
| Walk timer single-tap behavior | Single tap = start; long press = backdated manual entry |
| Timer persistence | DB-backed via `started_at` + sticky local notification. No Live Activity in v1. |
| Multi-pet on Home | Pet avatar stack top-left, tap = switcher sheet |
| Mood selector | Dropped from Home (was old SPEC §3.3) |
| Time-of-day greeting | None. Date eyebrow + serif "Today" is the greeting. |
| Calendar default view | Agenda only. No grid/day/week in v1. |
| External calendar sync | One-way write only (master spec). Paid only. |
| Expenses surface | Monthly total on Calendar tab; breakdown deep-link to Expenses screen (sub-project #7); receipt upload paid-only |
| Cross-device realtime | Supabase Realtime on `household:<id>`; <2s p95 target |
| Sheet shell | RN Modal in v1; swap to `@gorhom/bottom-sheet` later when drag-to-dismiss gesture becomes critical (likely during the Medical or Vet-vault surfaces). Public API of the `Sheet` primitive stays unchanged across the swap. |

## 12. What this doc does NOT do

- Does not change F00–F02 shipped work (auth, primitives, onboarding scaffold)
- Does not lock the Pet / Medical / Memory / Family / Expenses / Settings / Login screens (their own sub-project specs)
- Does not lock visual primitives beyond what `theme/tokens.ts` already defines
- Does not lock copy beyond the empty-state lines (CLAUDE.md voice rules apply)
- Does not lock the migration ordering or numbering — implementation plan (next step via writing-plans) handles that
