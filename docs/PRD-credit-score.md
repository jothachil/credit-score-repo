# PRD — Free Credit Score Check (CIBLI)

> **Status:** Draft · Prototype → spec for v1
> **Doc owner:** John Thachil
> **Last updated:** 2026-06-29
> **Squad:** Credit Score
> **Reviewers:** Design · Engineering · Legal/Compliance · Data
> **Related:** Figma design-system file · `credit-score` prototype repo · Bureau API spec (TBD)

---

## 📑 Table of contents

1. [Background & problem](#1-background--problem)
2. [Objectives & success metrics](#2-objectives--success-metrics)
3. [Goals & non-goals](#3-goals--non-goals)
4. [Personas](#4-personas)
5. [User flow](#5-user-flow)
6. [Detailed screen specs](#6-detailed-screen-specs)
7. [Score model & data](#7-score-model--data)
8. [Edge cases & error handling](#8-edge-cases--error-handling)
9. [Design & UX requirements](#9-design--ux-requirements)
10. [Analytics & instrumentation](#10-analytics--instrumentation)
11. [Technical architecture](#11-technical-architecture)
12. [Legal, privacy & compliance](#12-legal-privacy--compliance)
13. [Release plan & milestones](#13-release-plan--milestones)
14. [Risks & open questions](#14-risks--open-questions)
15. [Out of scope / future](#15-out-of-scope--future)
16. [Appendix](#16-appendix)

---

## 1. Background & problem

Consumers want to understand their credit health but are deterred by three friction
points: (a) the perception that checking a score **hurts** it, (b) paywalls on most
bureau-direct products, and (c) reports that are dense and hard to interpret.

This feature removes all three. It offers a **free**, **no-impact** (soft-pull) score
check that resolves in seconds and presents the result in plain language — a banded
gauge, a one-word rating, and the specific factors driving the number — so a user can
go from "I have no idea" to "I know my score and what's affecting it" in a single
session.

**Why now:** the design system and mobile shell are built; bureau integration is the
remaining dependency. Shipping the consumer-facing experience first lets us validate
the flow against mock data while the API is finalized.

---

## 2. Objectives & success metrics

| Objective | Metric | Target (v1) |
|-----------|--------|-------------|
| Drive consent opt-in | Consent rate (opt-in / onboarding views) | ≥ 70% |
| Get users to their score fast | Median time-to-score (CTA → render) | ≤ 8s |
| Complete the flow reliably | Fetch completion rate | ≥ 95% |
| Make the score actionable | % who scroll impact cards or open Loans | ≥ 40% |
| Keep failures rare & recoverable | Error-state rate / retry-success rate | < 3% / ≥ 60% |
| Bring users back | 30-day refresh return rate | ≥ 25% |

> Metrics are proposed for the production release; the prototype is not instrumented.

---

## 3. Goals & non-goals

### Goals
- Check a credit score in **one tap after consent**, in under ~8 seconds.
- **Reassure** the user the check is safe (100% secured, no effect on score).
- Make the score **legible at a glance** (gauge + band label Poor → Exceptional).
- Surface **what moves the score** and the user's **active/closed credit lines**.
- Support a **30-day refresh** cadence with a clear "next refresh" state.

### Non-goals (this phase)
- Real-time bureau integration (prototype uses mock data + simulated fetch).
- Score history / trend charts.
- Dispute filing, report PDF export, or score-improvement coaching.
- Authentication / KYC (assumed handled upstream).
- Multi-region / multi-currency (India / ₹ only for v1).

---

## 4. Personas

| Persona | Description | Primary need |
|---------|-------------|--------------|
| **First-time checker** | Never seen their score; anxious it'll be "bad" or that checking hurts it. | Reassurance + a simple, non-judgmental result. |
| **Active monitor** | Checks periodically, has loans/cards, wants to track health. | Fast refresh + visibility into factors and credit lines. |
| **Loan applicant** | About to apply for credit; wants to know where they stand. | Accurate score + understanding of what to improve. |

---

## 5. User flow

| # | Screen | Route | Entry | Exit |
|---|--------|-------|-------|------|
| 1 | Onboarding / Consent | `/` | App entry | Consent + CTA → `/fetching` |
| 2 | Fetching | `/fetching` | From onboarding | Auto (~6.6s) → `/score`; on failure → `/error-state` |
| 3 | Score | `/score` | After fetch | "View all" → `/loans` |
| 4 | Loans & Credit lines | `/loans` | From score | Back → `/score` |
| 5 | Error state | `/error-state` | On fetch failure | "Try again" → back |

```
                 consent + "Check score now"
   [Onboarding] ──────────────────────────────▶ [Fetching] ──auto 6.6s──▶ [Score]
        ▲                                            │                        │
        │                                       fetch fails           "View all"
        │                                            ▼                        ▼
        └──────────── "Try again" ◀──────────── [Error state]            [Loans]
```

---

## 6. Detailed screen specs

### 6.1 Onboarding / Consent — `/`

**Purpose:** Pitch the free check, build trust, capture consent, start the flow.

**Layout (top → bottom):**
- Back button (app bar).
- Illustration (credit-score meter).
- Heading: **"Check your credit score for free!"** + subcopy
  *"Get detailed insights on your credit report"*.
- 3-up value-prop row (equal-height columns): **Detailed insights** · **100% secured** ·
  **No effect on score**.
- Pinned footer: consent checkbox + primary CTA.

**Behaviour & acceptance criteria:**
- [ ] Consent checkbox references **CIBLI Private Limited** receiving credit information.
- [ ] CTA **"Check score now"** is **disabled while consent is unchecked**.
- [ ] Tapping the CTA (consent given) navigates to `/fetching`.
- [ ] Back button returns to the previous surface.
- [ ] Footer respects bottom safe-area inset; CTA stays reachable on small screens.

> **Decision needed:** in the prototype consent defaults to **checked**. For
> production, default state must be confirmed with Legal (likely **unchecked** —
> explicit opt-in).

---

### 6.2 Fetching — `/fetching`

**Purpose:** Cover bureau latency with a reassuring, progress-style loader.

**Behaviour & acceptance criteria:**
- [ ] Plays a looping Lottie animation, centered.
- [ ] Cycles three messages, each ~2.2s:
  1. "Fetching your credit report"
  2. "Analysing your accounts"
  3. "Calculating your score"
- [ ] Persistent subcopy: *"Hang tight, this won't take long"*.
- [ ] After the sequence (~6.6s) auto-redirects to `/score` via `router.replace`
  (loader is **not** in the back-stack).
- [ ] **Production:** redirect is driven by the bureau response, not a fixed timer;
  messages loop until the response arrives. On failure → `/error-state`.

> **Decision needed:** define a max wait / timeout (e.g. 20s) before routing to the
> error state.

---

### 6.3 Score — `/score`

**Purpose:** Present the score and the context around it.

**Sections:**

**a) Hero (dark surface)**
- Label "CREDIT SCORE", the numeric score with a **rolling entrance animation**, and
  the band label (e.g. *very good*).
- **Gauge:** 5 FICO bands sized proportionally across 300–850, rendered **high → low**
  (Exceptional left → Poor right). Active band segment renders taller; an ambient glow
  behind the gauge is tinted to the active band color. 16 evenly-spaced ticks with the
  active tick highlighted.
- **Refresh banner:**
  - Default: *"Next refresh in 30 days"* (no action).
  - When a refresh is available: *"Refresh available"* + **Update** action.
  - Tapping **Update** rolls the score to the new value; digits animate **up** on an
    increase, **down** on a decrease.

**b) What impacts your score?**
- Horizontally scrolling, snap-aligned cards. Each card: a rating chip
  (e.g. Excellent / Good), the factor name, and its value.
- Factors: Payment history, Credit utilization, Credit history, Credit mix,
  Recent inquiries, Disputes.

**c) Loans & Credit lines**
- Preview of credit lines + a **View all** link → `/loans`.

**Acceptance criteria:**
- [ ] Band color and band label always agree with the numeric score.
- [ ] Gauge, number, and label animate into place on first render.
- [ ] Refresh banner copy/action is gated by refresh availability.
- [ ] Update animates the score in the correct direction based on the delta.
- [ ] Impact row scrolls horizontally with snap; scrollbar hidden.
- [ ] "View all" navigates to `/loans`.

---

### 6.4 Loans & Credit lines — `/loans`

**Purpose:** Full list of the user's credit lines.

**Behaviour & acceptance criteria:**
- [ ] Two tabs: **Active** and **Closed**.
- [ ] Each row shows institution name, amount + type (e.g. *₹64,000 · Card EMI*), and a
  status chip toned **positive** (Active) or **negative** (Closed).
- [ ] Tabs are sticky beneath the nav bar while the list scrolls.
- [ ] Back navigates to `/score`.
- [ ] **Empty state** (production): if a tab has no items, show an empty-state message
  (copy TBD).

---

### 6.5 Error state — `/error-state`

**Purpose:** Handle fetch/processing failure gracefully.

**Behaviour & acceptance criteria:**
- [ ] Friendly illustration + heading **"Something went wrong"** + reassuring subcopy.
- [ ] Displays an **error code** for support reference.
- [ ] **Try again** CTA returns to the previous screen to retry.
- [ ] **Production:** error code maps to a real failure reason; copy may vary by cause
  (network vs bureau-unavailable vs no-record-found).

---

## 7. Score model & data

**Model:** FICO range **300–850**, resolved client-side into a band, gauge segments,
and the active tick.

| Band | Min score | Visual tone |
|------|-----------|-------------|
| Poor | 300 | Negative (red) |
| Fair | 580 | Orange |
| Good | 670 | Warning (yellow) |
| Very Good | 740 | Light green |
| Exceptional | 800 | Positive (green) |

**Prototype mock data:**
- Current score: **789** ("Very Good").
- Impact factors: Payment history (100%, Excellent), Credit utilization (2.27%,
  Excellent), Credit history (7+ years, Excellent), Credit mix (4 acc, Good), Recent
  inquiries (0, Excellent), Disputes (0, Excellent).
- Loans: 2 active (PayU Finance, ₹64,000 · Card EMI), 1 closed (House Loan).

**Data model (proposed for v1 API):**

```jsonc
{
  "score": 789,                       // int, 300–850
  "band": "very-good",                // derived; bureau may also send its own
  "refresh": {
    "available": false,
    "nextRefreshAt": "2026-07-29T00:00:00Z"
  },
  "factors": [
    { "id": "payment-history", "label": "Payment history",
      "rating": "Excellent", "value": "100%" }
    // …
  ],
  "loans": [
    { "id": "payu-1", "name": "PayU Finance Private Ltd",
      "amount": 64000, "currency": "INR", "type": "Card EMI",
      "status": "active" }
    // …
  ]
}
```

> **Open question:** is the band computed client-side from `score`, or authoritative
> from the bureau? Prototype computes it locally; v1 should treat the bureau value as
> source of truth if provided.

---

## 8. Edge cases & error handling

| Scenario | Expected behaviour |
|----------|--------------------|
| Consent not given | CTA disabled; cannot proceed. |
| Fetch timeout / network error | Route to `/error-state` with the relevant code. |
| Bureau returns **no record found** | Dedicated message (not a generic error) — copy TBD. |
| Score at band boundary (e.g. exactly 740) | Resolves to the **higher** band (`>=` min). |
| Score at floor/ceiling (300 / 850) | Gauge clamps; tick at the extreme. |
| Refresh not yet available | Show "Next refresh in 30 days"; no action. |
| Refresh available, user taps Update | New score animates in correct direction. |
| Loans tab empty | Empty state (production). |
| Slow connection during fetch | Loader messages loop until response or timeout. |

---

## 9. Design & UX requirements

- **Mobile-first:** designed within a centered `max-w-[400px]` frame; respect safe-area
  insets (status bar, home indicator).
- **Design system:** every interactive element built on **Base UI** primitives, styled
  with **semantic color tokens** that mirror the Figma variable collection — **no raw
  hex / `zinc-*`** in product UI.
- **State styling** comes from Base UI `data-*` attributes, not ad-hoc JS.
- **WebView compatibility:** dynamic status-bar tinting (`ThemeColor`); contained
  overscroll to avoid rubber-banding.
- **Accessibility:** every field labelled, visible focus-visible rings, pointer cursors
  on all interactive elements, `disabled:cursor-not-allowed` where applicable.
- **Motion:** score roll, gauge transitions, and loader message transitions should feel
  smooth (≤ ~500ms) and never cause layout shift (score row uses a fixed height).

---

## 10. Analytics & instrumentation

Proposed events for the production release:

| Event | Trigger | Key properties |
|-------|---------|----------------|
| `onboarding_viewed` | Onboarding render | — |
| `consent_toggled` | Checkbox change | `checked` |
| `score_check_started` | CTA tap | — |
| `fetch_completed` | Fetch success | `duration_ms` |
| `fetch_failed` | Fetch error | `error_code`, `reason` |
| `score_viewed` | Score render | `score`, `band` |
| `score_refreshed` | Update tap | `from`, `to`, `direction` |
| `impact_cards_scrolled` | Horizontal scroll | `max_index` |
| `loans_opened` | "View all" tap | — |
| `loans_tab_changed` | Tab switch | `tab` |
| `error_retry` | "Try again" tap | `error_code` |

---

## 11. Technical architecture

- **Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Base UI, Framer Motion,
  Jotai, Tabler Icons, dotLottie. Bun + Biome for tooling.
- **Routing:** App Router pages per screen (`/`, `/fetching`, `/score`, `/loans`,
  `/error-state`). `/fetching` uses `router.replace` so it's excluded from history.
- **Score logic:** `resolveScore()` maps a raw score → band, proportional gauge
  segments, and active tick. `CURRENT_SCORE` mocked at **789**.
- **State / scenarios:** Jotai atoms persisted to `localStorage` gate scenarios
  (e.g. `refreshAvailable`). A dev-only debug panel jumps between screens and toggles
  flags.
- **v1 dependency:** replace mock data with a bureau API call (soft pull). Define
  request/response contract, auth, caching (respect 30-day refresh), and timeout.

---

## 12. Legal, privacy & compliance

- [ ] Consent copy, default state, and record-keeping reviewed & approved by Legal.
- [ ] Soft-pull confirmed with the bureau (must not affect the user's score).
- [ ] Data retention & deletion policy defined for fetched credit data.
- [ ] Bureau attribution / disclosures present where required.
- [ ] PII handling (storage, transit encryption, access controls) signed off.

---

## 13. Release plan & milestones

| Milestone | Scope | Status |
|-----------|-------|--------|
| **M0 — Prototype** | Full flow on mock data, design-system parity, debug panel | ✅ Done |
| **M1 — Bureau integration** | Real soft-pull, loading/timeout/error wiring | ⏳ Pending API |
| **M2 — Instrumentation** | Analytics events + dashboards | ⬜ Not started |
| **M3 — Compliance sign-off** | Legal/privacy review, consent finalization | ⬜ Not started |
| **M4 — Beta** | Limited rollout, monitor metrics & error rate | ⬜ Not started |
| **M5 — GA** | Full launch | ⬜ Not started |

---

## 14. Risks & open questions

| # | Risk / question | Owner | Notes |
|---|-----------------|-------|-------|
| 1 | Bureau latency & failure modes | Eng | Replaces fixed 6.6s fetch; needs timeout + error mapping. |
| 2 | Consent default state (checked vs unchecked) | Legal | Prototype defaults checked; likely needs explicit opt-in. |
| 3 | Refresh eligibility logic | Product/Eng | "30 days" is hardcoded copy; real per-user timers TBD. |
| 4 | Band source of truth (client vs bureau) | Eng | Decide before API contract is frozen. |
| 5 | No-record-found UX | Design | Needs dedicated copy, distinct from generic error. |
| 6 | Localization / currency | Product | India/₹ only for v1; multi-region future. |
| 7 | Empty loans state | Design | Copy + visual TBD. |

---

## 15. Out of scope / future

- Score **history & trends** over time.
- **Personalized recommendations** to improve the score.
- **Dispute filing** and **report export** (PDF).
- **Push notifications** for score changes or refresh availability.
- Multi-bureau aggregation; multi-region/currency support.

---

## 16. Appendix

**Glossary**
- **Soft pull:** a credit inquiry that does not affect the score.
- **Band:** the qualitative bucket for a score (Poor → Exceptional).
- **FICO range:** 300–850 scoring scale used by the gauge.

**Reference screens (prototype routes):** `/` · `/fetching` · `/score` · `/loans` ·
`/error-state`

**Source:** spec reverse-engineered from the `credit-score` prototype (mock data,
client-side score model, simulated fetch).
