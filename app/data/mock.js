import {
  IconBellRinging,
  IconBuildingBank,
  IconCalendarCheck,
  IconCalendarRepeat,
  IconChartPie,
  IconClockHour4,
  IconCoinRupee,
  IconCreditCard,
  IconCreditCardOff,
  IconHistory,
  IconPercentage,
  IconReceipt,
  IconScale,
  IconSearch,
  IconWallet,
  IconZoomCheck,
} from "@tabler/icons-react";

// Single source of mock data for the whole prototype. Presentation logic
// (colours, charts, classification tones) lives in the components; this file
// only holds the numbers, copy, and lists the screens render.
//
// Values are derived from the CIBIL (TrueLink) report in
// `public/sample-nikil-cibil.json`, pulled on 13 Jul 2026: riskScore 800,
// populationRank 10, 10 tradelines (4 open, 6 closed — closure detected via
// `dateClosed`), 3 inquiries.

// ---- Score ----
const currentScore = 800;
const reportFetchDate = "13 Jul 2026";
const userPercentile = 10; // populationRank — top 10% of scored borrowers

// Month-by-month history (oldest → newest). The bureau report only carries
// the latest score, so earlier months are a plausible ramp up to 800.
const scoreHistory = [
  { month: "Feb", score: 776 }, // Very Good
  { month: "Mar", score: 782 }, // Very Good
  { month: "Apr", score: 788 }, // Excellent
  { month: "May", score: 792 }, // Excellent
  { month: "Jun", score: 796 }, // Excellent
  { month: "Jul", score: 800 }, // Excellent
];
const scoreDelta = scoreHistory.at(-1).score - scoreHistory.at(-2).score;

// Copy for the "Predict score" banner on the score page.
const scorePrediction = {
  title: "Predict score",
  subtitle: "Check your future score if your portfolio changes",
  cta: "Check now",
};

// Score predictor page: each choice applies a delta to the current score.
// Deltas are illustrative magnitudes — hits for missed payments/defaults,
// modest gains for repayment/utilisation, small dips for new credit.
// Card illustrations live in /public, named by each choice's `image`.
// Longer delinquency → bigger illustrative hit. Shared by the miss-payment
// detail screen and that choice's `input.options`.
const missPaymentOptions = [
  { id: "30", label: "30 days", delta: -40 },
  { id: "60", label: "60 days", delta: -58 },
  { id: "90", label: "90 days", delta: -80 },
];

// The four "take new credit" scenarios. Each collects a rupee amount on a
// ruler in a sheet, so it carries the range that ruler spans plus the `step`
// it snaps to — chosen to keep the tick count sane over these wide ranges.
//
// Taking on new credit dips the score, and a bigger commitment dips it more,
// so the delta is interpolated between `deltaAtMin` and `deltaAtMax` rather
// than being flat. `defaultAmount` is where the ruler opens and must land on
// a step.
const amountScenarios = {
  "obtain-credit-card": {
    id: "obtain-credit-card",
    kind: "amount",
    image: "new-credit",
    tone: "brand",
    kicker: "See how your score changes",
    title: "If you take a new credit card",
    resultPrefix: "If you take a new credit card of",
    amountLabel: "Credit limit",
    min: 20_000,
    max: 15_00_000,
    step: 10_000,
    defaultAmount: 2_00_000,
    deltaAtMin: -6,
    deltaAtMax: -18,
    cta: "Predict score",
    tipsTitle: "If you take the card",
    tips: [
      {
        id: "headroom",
        icon: IconPercentage,
        title: "A bigger limit can help",
        detail: "Extra headroom lowers utilisation, once the enquiry settles.",
      },
      {
        id: "space-applications",
        icon: IconSearch,
        title: "Space out applications",
        detail: "Each application adds an enquiry — avoid clustering them.",
      },
      {
        id: "first-bill",
        icon: IconCalendarCheck,
        title: "Never miss the first bill",
        detail: "Early misses on a new account hurt more than later ones.",
      },
    ],
  },
  "obtain-home-loan": {
    id: "obtain-home-loan",
    kind: "amount",
    image: "house-loan",
    tone: "brand",
    kicker: "See how your score changes",
    title: "If you take a home loan",
    resultPrefix: "If you take a home loan of",
    amountLabel: "Loan amount",
    min: 10_00_000,
    max: 5_00_00_000,
    step: 1_00_000,
    defaultAmount: 50_00_000,
    deltaAtMin: -12,
    deltaAtMax: -30,
    cta: "Predict score",
    tipsTitle: "Before you borrow",
    tips: [
      {
        id: "secured-mix",
        icon: IconScale,
        title: "It improves your credit mix",
        detail: "A secured loan balances an all-unsecured portfolio.",
      },
      {
        id: "emi-affordable",
        icon: IconChartPie,
        title: "Keep the EMI affordable",
        detail: "Lenders look at how much of your income is committed.",
      },
      {
        id: "recovers",
        icon: IconHistory,
        title: "The dip is temporary",
        detail: "On-time EMIs rebuild the score over the following months.",
      },
    ],
  },
  "obtain-auto-loan": {
    id: "obtain-auto-loan",
    kind: "amount",
    image: "car-loan",
    tone: "brand",
    kicker: "See how your score changes",
    title: "If you take a car loan",
    resultPrefix: "If you take a car loan of",
    amountLabel: "Loan amount",
    min: 1_00_000,
    max: 20_00_000,
    step: 25_000,
    defaultAmount: 8_00_000,
    deltaAtMin: -10,
    deltaAtMax: -22,
    cta: "Predict score",
    tipsTitle: "Before you borrow",
    tips: [
      {
        id: "bigger-downpayment",
        icon: IconCoinRupee,
        title: "Put more down",
        detail: "A smaller loan means a smaller dip and a lighter EMI.",
      },
      {
        id: "one-lender",
        icon: IconSearch,
        title: "Compare without applying",
        detail: "Quotes are fine — it's the applications that add enquiries.",
      },
      {
        id: "auto-debit",
        icon: IconCalendarCheck,
        title: "Set up auto-debit",
        detail: "Consistent EMIs turn this into a positive over time.",
      },
    ],
  },
  "obtain-personal-loan": {
    id: "obtain-personal-loan",
    kind: "amount",
    image: "personal-loans",
    tone: "brand",
    kicker: "See how your score changes",
    title: "If you take a personal loan",
    resultPrefix: "If you take a personal loan of",
    amountLabel: "Loan amount",
    min: 5_000,
    max: 10_00_000,
    step: 5_000,
    defaultAmount: 3_00_000,
    deltaAtMin: -8,
    deltaAtMax: -26,
    cta: "Predict score",
    tipsTitle: "Before you borrow",
    tips: [
      {
        id: "unsecured-weight",
        icon: IconScale,
        title: "Unsecured debt weighs more",
        detail: "It moves the score more than a secured loan of the same size.",
      },
      {
        id: "borrow-less",
        icon: IconWallet,
        title: "Borrow only what you need",
        detail: "The dip scales with the amount you take on.",
      },
      {
        id: "close-early",
        icon: IconClockHour4,
        title: "Clear it on schedule",
        detail: "A closed loan repaid on time leaves a positive record.",
      },
    ],
  },
};

// Copy for each scenario the predictor can run, keyed by choice id. The
// result page reads whichever the `scenario` query param names.
//
// `kind` is how the scenario gets its number: `select` collects an option
// first (miss-payment, via its sheet) and takes that option's delta; `direct`
// takes no input at all and applies its own delta as soon as it's tapped;
// `amount` collects a rupee figure on a ruler and interpolates its delta from
// where that figure sits in the range (see amountScenarios above).
//
// `resultPrefix` opens the recap sentence on the result page. For a `select`
// scenario the chosen option's label is appended ("…for 60 days"); a `direct`
// prefix is already a whole sentence and stands alone.
const scenarios = {
  "miss-payment": {
    id: "miss-payment",
    kind: "select",
    layout: "stack",
    image: "miss-payment",
    tone: "negative",
    kicker: "See how your score changes",
    title: "If you miss your EMIs or card bills",
    resultPrefix: "If you miss your EMIs or card bills",
    resultJoiner: "for",
    optionsLabel: "Miss payments for",
    options: missPaymentOptions,
    cta: "Predict score",
    // Shown on the result screen — how to avoid the missed-payment hit.
    tipsTitle: "Tips to stay on track",
    tips: [
      {
        id: "auto-pay",
        icon: IconCalendarCheck,
        title: "Set up auto-pay",
        detail: "Automate EMIs & card bills so due dates never slip.",
      },
      {
        id: "total-due",
        icon: IconCoinRupee,
        title: "Pay the total amount due",
        detail: "Clearing the full bill avoids interest and late marks.",
      },
      {
        id: "reminders",
        icon: IconBellRinging,
        title: "Turn on due-date reminders",
        detail: "A nudge 3 days early gives you time to arrange funds.",
      },
    ],
  },
  "close-oldest-card": {
    id: "close-oldest-card",
    // Collects nothing, but shows which account it means before predicting —
    // "your oldest card" is meaningless until you see which one it is.
    kind: "account",
    image: "close-oldest-card",
    tone: "warning",
    kicker: "See how your score changes",
    title: "If you close your oldest card",
    accountLabel: "This is your oldest card",
    resultPrefix: "If you close your oldest card",
    delta: -24,
    cta: "Predict score",
    tipsTitle: "Before you close it",
    tips: [
      {
        id: "keep-open",
        icon: IconHistory,
        title: "Keep your oldest account open",
        detail: "Account age is a scoring factor — closing it shortens it.",
      },
      {
        id: "use-lightly",
        icon: IconCreditCard,
        title: "Use it lightly instead",
        detail: "One small recurring charge keeps the card active.",
      },
      {
        id: "close-newer",
        icon: IconCreditCardOff,
        title: "Close a newer card first",
        detail: "If you must close one, pick your most recent account.",
      },
    ],
  },
  "pay-off-cards": {
    id: "pay-off-cards",
    // Collects nothing, but shows what "your credit cards" adds up to before
    // predicting — how many carry a balance, and what clearing them costs.
    kind: "cards",
    image: "clear-credit-card",
    tone: "positive",
    kicker: "See how your score changes",
    title: "If you pay off your credit cards",
    cardsLabel: "Cards you'd be clearing",
    resultPrefix: "If you pay off your credit cards",
    delta: 32,
    cta: "Predict score",
    tipsTitle: "Tips to keep it there",
    tips: [
      {
        id: "under-30",
        icon: IconPercentage,
        title: "Stay under 30% utilisation",
        detail: "Using less of your limit keeps this factor healthy.",
      },
      {
        id: "before-statement",
        icon: IconCalendarCheck,
        title: "Pay before the statement date",
        detail: "Bureaus see the statement balance, not the due-date one.",
      },
      {
        id: "avoid-rebuild",
        icon: IconWallet,
        title: "Avoid rebuilding balances",
        detail: "Clearing cards only helps while they stay cleared.",
      },
    ],
  },
  // Broader than pay-off-cards — loans as well as cards — so the gain is
  // larger. See the overlap note on the choices list.
  "pay-all-outstanding": {
    id: "pay-all-outstanding",
    kind: "direct",
    resultPrefix: "If you pay off everything you owe",
    delta: 38,
    tipsTitle: "Tips to stay debt-free",
    tips: [
      {
        id: "high-interest-first",
        icon: IconReceipt,
        title: "Clear high-interest debt first",
        detail: "Cards and personal loans cost the most to carry.",
      },
      {
        id: "keep-accounts-open",
        icon: IconHistory,
        title: "Keep the accounts open",
        detail: "A paid-off account still adds to your credit history.",
      },
      {
        id: "buffer",
        icon: IconWallet,
        title: "Build a small buffer",
        detail: "Savings you can dip into keep new debt from creeping back.",
      },
    ],
  },
  // Applying for credit logs a hard enquiry. How much it stings depends on
  // what you apply for, so the type is the data point this scenario collects.
  // `summaryLabel` is the article-carrying form used in the result sentence,
  // which the radio labels can't be without reading oddly.
  "add-enquiry": {
    id: "add-enquiry",
    kind: "select",
    // Four longer labels, so they stack rather than sit in a row.
    layout: "stack",
    image: "lower-utilisation",
    tone: "warning",
    kicker: "See how your score changes",
    title: "If you apply for new credit",
    resultPrefix: "If you apply for",
    resultJoiner: "",
    optionsLabel: "What are you applying for?",
    options: [
      {
        id: "credit-card",
        label: "Credit card",
        summaryLabel: "a credit card",
        delta: -8,
      },
      {
        id: "personal-loan",
        label: "Personal loan",
        summaryLabel: "a personal loan",
        delta: -10,
      },
      {
        id: "home-loan",
        label: "Home loan",
        summaryLabel: "a home loan",
        delta: -12,
      },
      {
        id: "consumer-loan",
        label: "Consumer loan",
        summaryLabel: "a consumer loan",
        delta: -5,
      },
    ],
    cta: "Predict score",
    tipsTitle: "Before you apply",
    tips: [
      {
        id: "check-eligibility",
        icon: IconZoomCheck,
        title: "Check eligibility first",
        detail: "Pre-approved offers use soft checks that don't count.",
      },
      {
        id: "space-out",
        icon: IconCalendarRepeat,
        title: "Space out applications",
        detail: "Several enquiries close together read as credit hunger.",
      },
      {
        id: "fades",
        icon: IconSearch,
        title: "Enquiries fade",
        detail: "They stop weighing on your score after about 12 months.",
      },
    ],
  },
  ...amountScenarios,
};

const predictor = {
  heading: "Make a choice. See where it takes you",
  scenarios,
  // The ten simulation options the predictor supports. Each carries the
  // control the detail screen should render (`input.kind`) plus the limits
  // that control has to enforce:
  //   select          — fixed list of choices, no free entry
  //   toggle          — boolean yes/no
  //   amount          — rupee amount, clamped to [min, max]
  //   account-amount  — pick an account, then a rupee amount ≤ its balance
  //   enquiry         — product type + rupee amount
  // `image` names the illustration in /public (several options share one).
  // Inputs are collected in a bottom sheet on the predict grid; only
  // miss-payment has one built so far.
  choices: [
    {
      id: "miss-payment",
      label: "Miss a payment",
      image: "miss-payment",
      delta: -58,
      tone: "negative",
      input: {
        kind: "select",
        label: "Days past due",
        options: missPaymentOptions,
      },
    },
    {
      id: "close-oldest-card",
      label: "Close my oldest card",
      image: "close-oldest-card",
      delta: -24,
      tone: "warning",
      input: { kind: "toggle", label: "Close the oldest card" },
    },
    {
      id: "pay-off-cards",
      label: "Pay off my credit cards",
      image: "clear-credit-card",
      delta: 32,
      tone: "positive",
      input: { kind: "toggle", label: "Clear every card balance" },
    },
    {
      id: "pay-specific-account",
      label: "Pay towards one account",
      image: "lower-utilisation",
      delta: 14,
      tone: "positive",
      input: {
        kind: "account-amount",
        label: "Account & payment amount",
        // Only accounts carrying a balance can be paid, and a payment can
        // never exceed what's outstanding on the account picked.
        minBalance: 1,
        maxIsAccountBalance: true,
      },
    },
    {
      id: "pay-all-outstanding",
      label: "Pay off everything I owe",
      image: "pay-outstanding",
      delta: 38,
      tone: "positive",
      // NOTE: overlaps with "pay-off-cards" — cards are a subset of all
      // outstanding balances. Field name and precedence still to be confirmed.
      input: { kind: "toggle", label: "Clear every outstanding balance" },
    },
    {
      id: "obtain-credit-card",
      label: "Take a new credit card",
      image: "new-credit",
      delta: -12,
      tone: "brand",
      input: {
        kind: "amount",
        label: "Credit limit",
        min: 20_000,
        max: 15_00_000,
      },
    },
    {
      id: "obtain-home-loan",
      label: "Take a home loan",
      image: "house-loan",
      delta: -18,
      tone: "brand",
      input: {
        kind: "amount",
        label: "Loan amount",
        min: 10_00_000,
        max: 5_00_00_000,
      },
    },
    {
      id: "obtain-auto-loan",
      label: "Take a car loan",
      image: "car-loan",
      delta: -14,
      tone: "brand",
      input: {
        kind: "amount",
        label: "Loan amount",
        min: 1_00_000,
        max: 20_00_000,
      },
    },
    {
      id: "obtain-personal-loan",
      label: "Take a personal loan",
      image: "personal-loans",
      delta: -16,
      tone: "brand",
      input: {
        kind: "amount",
        label: "Loan amount",
        min: 5_000,
        max: 10_00_000,
      },
    },
    {
      id: "add-enquiry",
      label: "Apply for new credit",
      // Kept out of the grid for now — the enquiry input isn't built yet, so
      // the tile has nowhere to land. Drop `hidden` to bring it back.
      hidden: true,
      image: "lower-utilisation",
      delta: -8,
      tone: "warning",
      input: {
        kind: "enquiry",
        label: "Product type & amount",
        types: [
          { id: "credit-card", label: "Credit card" },
          { id: "mortgage", label: "Mortgage" },
          { id: "vehicle", label: "Vehicle" },
          { id: "personal", label: "Personal" },
        ],
      },
    },
  ],
};

// ---- Payment history detail page ----
const paymentHistoryDetail = {
  factorLabel: "High-impact factor",
  description:
    "It's a percentage of your repayments towards your credit cards & loans on time.",
  onTimeLabel: "On-time payments",
  tipsTitle: "Tips to boost credit score",
  tips: [
    {
      id: "avoid-late",
      title: "Avoid Late Payments",
      detail:
        "Even neutral payment histories with on-time payments are critical to maintaining your score.",
    },
    {
      id: "limit-new",
      title: "Limit New Applications",
      detail:
        "Opening fewer new accounts keeps your focus on a predictable payment schedule.",
    },
    {
      id: "keep-old",
      title: "Keep Old Accounts Open",
      detail:
        "Long-standing accounts with clean histories anchor your track record.",
    },
  ],
};

// ---- Credit usage detail page ----
const creditUsageDetail = {
  title: "Credit usage",
  factorLabel: "High-impact factor",
  description:
    "It's a measurement of how much of your available limit has been utilized.",
  utilizedLabel: "Credit Utilized",
  maxLabel: "Max Credit Limit",
  pctLabel: "Credit utilized",
};

// ---- Recent inquiries detail page ----
const inquiriesDetail = {
  title: "Recent inquiries",
  factorLabel: "Low-impact factor",
  description:
    "Hard inquiries lenders make when you apply for new credit. Too many in a short period can pull your score down.",
  countLabel: "Inquiries in last 6 months",
  recentTitle: "Last 6 months",
  olderTitle: "Older inquiries",
};

// From the report's InquiryPartition — newest first. `recent` marks the
// 6-month window before the report fetch (13 Jul 2026).
const inquiries = [
  {
    id: "hsbc-2026-02",
    lender: "HSBC",
    date: "22 Feb 2026",
    amount: "₹15,000",
    recent: true,
  },
  {
    id: "hdfc-2025-10",
    lender: "HDFC Bank",
    date: "14 Oct 2025",
    amount: "₹77,00,000",
    recent: false,
  },
  {
    id: "payu-2025-09",
    lender: "PayU Finance",
    date: "23 Sep 2025",
    amount: "₹5,000",
    recent: false,
  },
];

// ---- Credit age detail page ----
const creditAgeDetail = {
  title: "Credit age",
  factorLabel: "Medium-impact factor",
  description:
    "Credit age refers to the age of your oldest active credit card or loan account.",
  ageLabel: "Credit age",
};

// ---- Credit mix detail page ----
const creditMixDetail = {
  title: "Credit mix",
  factorLabel: "Low-impact factor",
  description:
    "The share of secured vs unsecured credit you hold. A healthier balance helps your score.",
  shareLabel: "Secured credit share",
  securedTitle: "Secured",
  unsecuredTitle: "Unsecured",
  emptySecured: "No secured accounts yet — e.g. home, auto or gold loans.",
};

// ---- Impact factors ----
// Classification bands per factor (PayUFin's rating scale), Excellent → Poor.
const paymentHistoryRanges = [
  { tone: "excellent", label: "Excellent", range: "100% · 0 missed payment" },
  { tone: "very-good", label: "Very Good", range: "85% · 1 missed payment" },
  { tone: "good", label: "Good", range: "75% · 2 missed payments" },
  { tone: "fair", label: "Fair", range: "55% · 3 – 4 missed payments" },
  { tone: "poor", label: "Poor", range: "50% · 5+ missed payments" },
];
function classifyPaymentHistory(pct) {
  if (pct >= 90) return "Excellent";
  if (pct >= 80) return "Very Good";
  if (pct >= 70) return "Good";
  if (pct >= 50) return "Fair";
  return "Poor";
}

const creditUtilizationRanges = [
  { tone: "excellent", label: "Excellent", range: "Below 10%" },
  { tone: "very-good", label: "Very Good", range: "11 – 30%" },
  { tone: "good", label: "Good", range: "31 – 50%" },
  { tone: "fair", label: "Fair", range: "51 – 75%" },
  { tone: "poor", label: "Poor", range: "Above 76%" },
];
function classifyCreditUtilization(pct) {
  if (pct <= 10) return "Excellent";
  if (pct <= 30) return "Very Good";
  if (pct <= 50) return "Good";
  if (pct <= 75) return "Fair";
  return "Poor";
}

const creditHistoryRanges = [
  { tone: "excellent", label: "Excellent", range: "7 years & above" },
  { tone: "very-good", label: "Very Good", range: "5 – 7 years" },
  { tone: "good", label: "Good", range: "3 – 5 years" },
  { tone: "fair", label: "Fair", range: "2 – 3 years" },
  { tone: "poor", label: "Poor", range: "Below 2 years" },
];
function classifyCreditHistory(years) {
  if (years >= 7) return "Excellent";
  if (years >= 5) return "Very Good";
  if (years >= 3) return "Good";
  if (years >= 2) return "Fair";
  return "Poor";
}

const creditMixRanges = [
  { tone: "excellent", label: "Excellent", range: "40 – 100%" },
  { tone: "good", label: "Good", range: "5 – 40%" },
  { tone: "poor", label: "Poor", range: "0 – 5%" },
];
function classifyCreditMix(pct) {
  if (pct >= 40) return "Excellent";
  if (pct >= 5) return "Good";
  return "Poor";
}

const recentInquiriesRanges = [
  { tone: "excellent", label: "Excellent", range: "0 – 1 enquiries" },
  { tone: "very-good", label: "Very Good", range: "2 enquiries" },
  { tone: "good", label: "Good", range: "3 enquiries" },
  { tone: "fair", label: "Fair", range: "4 – 5 enquiries" },
  { tone: "poor", label: "Poor", range: "6+ enquiries" },
];
function classifyRecentInquiries(n) {
  if (n <= 1) return "Excellent";
  if (n === 2) return "Very Good";
  if (n === 3) return "Good";
  if (n <= 5) return "Fair";
  return "Poor";
}

// Impact tiles — `rating` is derived from `value` so the two stay in sync.
// Numbers computed from the report:
// - Payment history: 204 reported MonthlyPayStatus months across the 10
//   tradelines, of which 202 are "0" (on time). The two exceptions are both
//   on the closed AMEX card — 12 dpd in Oct 2022, 42 dpd in Nov 2022 → 99%.
// - Utilization: revolving (type 10) accounts only —
//   1,92,925 / (25,00,000 + 4,70,000 + 98,000 + 0) ≈ 6%.
// - History: oldest tradeline opened 31 Oct 2011 → ~14 years.
// - Mix: 2 of the 4 active accounts are secured (car loan + home loan) → 50%.
// - Inquiries: 1 in the last 6 months (HSBC, 22 Feb 2026).
const impacts = [
  {
    id: "payment-history",
    rating: classifyPaymentHistory(99),
    label: ["Payment history"],
    value: "99%",
    title: "Payment history",
    description:
      "The share of your credit payments made on time. Even one missed payment can pull this down.",
    ranges: paymentHistoryRanges,
  },
  {
    id: "credit-utilization",
    rating: classifyCreditUtilization(6),
    label: ["Credit utilization"],
    value: "6%",
    title: "Credit utilization",
    description:
      "How much of your available credit limit you're using. The lower, the better.",
    ranges: creditUtilizationRanges,
  },
  {
    id: "credit-history",
    rating: classifyCreditHistory(14),
    label: ["Credit history"],
    value: "14 years",
    title: "Credit history",
    description:
      "How long you've had active credit accounts. A longer history helps your score.",
    ranges: creditHistoryRanges,
  },
  {
    id: "credit-mix",
    rating: classifyCreditMix(50),
    label: ["Credit mix"],
    value: "50%",
    title: "Credit mix",
    description:
      "The share of secured vs unsecured credit you hold. A healthier balance helps your score.",
    ranges: creditMixRanges,
  },
  {
    id: "recent-inquiries",
    rating: classifyRecentInquiries(1),
    label: ["Recent inquiries"],
    value: "1",
    title: "Recent inquiries",
    description:
      "Hard inquiries from new credit applications in the last 6 months. Fewer is better.",
    ranges: recentInquiriesRanges,
  },
];

// ---- Payment history ----
const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Builds the per-year payment calendar from a tradeline's MonthlyPayStatus
// window ("YYYY-MM", inclusive). Months inside the window default to on-time —
// the report is "0"/"STD" almost everywhere — except explicit overrides
// ({ "YYYY-MM": status }) for the "XXX" (not-reported) gaps and the handful of
// days-past-due entries. Months outside the reported window render as
// not-reported.
function buildPayments(from, to, overrides = {}) {
  const [fromYear, fromMonth] = from.split("-").map(Number);
  const [toYear, toMonth] = to.split("-").map(Number);
  const years = [];
  const byYear = {};
  for (let year = toYear; year >= fromYear; year--) {
    years.push(year);
    byYear[year] = MONTH_LABELS.map((month, i) => {
      const m = i + 1;
      const inWindow =
        (year > fromYear || m >= fromMonth) && (year < toYear || m <= toMonth);
      const key = `${year}-${String(m).padStart(2, "0")}`;
      const status = overrides[key] ?? (inWindow ? "on-time" : "not-reported");
      return { month, status };
    });
  }
  return { years, byYear };
}

// ---- Loans & credit lines ----
// One record per tradeline in the report, newest-opened first. `type` decides
// which detail layout renders it ("card" → CreditLimit-based, "loan" →
// highBalance-based). Open vs closed follows the bureau's `dateClosed` field.
// `secured` marks the collateral-backed products (CIBIL account types 01 Auto,
// 02 Housing, 13 Two-wheeler) and drives the credit-mix screen. `payments`
// mirrors each tradeline's actual MonthlyPayStatus range.
const loans = {
  active: [
    {
      id: "hdfc-auto-loan",
      type: "loan",
      opened: "2025-10-15",
      icon: IconBuildingBank,
      name: "HDFC Bank Car Loan",
      detail: "₹77,00,000 · Auto Loan",
      status: "Active",
      tone: "positive",
      secured: true,
      bank: "HDFC Bank",
      outstanding: "₹71,37,562",
      loanAmount: "₹77,00,000",
      paidPct: 7,
      principalPaid: "₹5,62,438",
      year: 2025,
      updatedBy: "HDFC Bank",
      updatedOn: "30 Jun 2026",
      payments: buildPayments("2025-10", "2026-06"),
    },
    {
      id: "payu-consumer-loan",
      type: "loan",
      opened: "2025-09-23",
      icon: IconBuildingBank,
      name: "PayU Finance (LazyPay)",
      detail: "₹25,000 · Consumer Loan",
      status: "Active",
      tone: "positive",
      bank: "PayU Finance",
      outstanding: "₹0",
      loanAmount: "₹25,000",
      paidPct: 100,
      principalPaid: "₹25,000",
      year: 2025,
      updatedBy: "PayU Finance",
      updatedOn: "09 Jul 2026",
      payments: buildPayments("2025-09", "2026-07"),
    },
    {
      id: "hdfc-home-loan",
      type: "loan",
      opened: "2021-03-19",
      icon: IconBuildingBank,
      name: "HDFC Bank Home Loan",
      detail: "₹1,26,54,375 · Housing Loan",
      status: "Active",
      tone: "positive",
      secured: true,
      bank: "HDFC Bank",
      outstanding: "₹45,76,944",
      loanAmount: "₹1,26,54,375",
      paidPct: 64,
      principalPaid: "₹80,77,431",
      year: 2021,
      updatedBy: "HDFC Bank",
      updatedOn: "07 Jul 2026",
      // The bureau only carries the last 36 months of status for this account.
      payments: buildPayments("2023-08", "2026-07"),
    },
    {
      id: "hdfc-card",
      type: "card",
      opened: "2011-10-31",
      icon: IconCreditCard,
      name: "HDFC Bank Credit Card",
      detail: "₹25,00,000 · Credit Card",
      status: "Active",
      tone: "positive",
      bank: "HDFC Bank",
      totalSpends: "₹1,92,925",
      creditLimit: "₹25,00,000",
      limitUsedPct: 8,
      limitUsedAmount: "₹1,92,925",
      year: 2011,
      updatedBy: "HDFC Bank",
      updatedOn: "09 Jul 2026",
      payments: buildPayments("2023-08", "2026-07"),
    },
  ],
  closed: [
    {
      id: "amex-card-0551",
      type: "card",
      opened: "2019-08-19",
      icon: IconCreditCard,
      name: "American Express Credit Card ••0551",
      detail: "₹4,70,000 · Credit Card",
      status: "Closed",
      tone: "negative",
      bank: "American Express",
      totalSpends: "₹0",
      creditLimit: "₹4,70,000",
      limitUsedPct: 0,
      limitUsedAmount: "₹0",
      year: 2019,
      updatedBy: "American Express",
      updatedOn: "18 Mar 2023",
      // The only delinquency in the whole report: 12 days past due in Oct 2022,
      // 42 days in Nov 2022, then an "XXX" gap in the final month.
      payments: buildPayments("2020-04", "2023-03", {
        "2022-10": "delayed",
        "2022-11": "overdue",
        "2023-02": "not-reported",
      }),
    },
    {
      id: "hdfc-home-loan-closed",
      type: "loan",
      opened: "2017-02-28",
      icon: IconBuildingBank,
      name: "HDFC Bank Home Loan (e-HDFC Ltd)",
      detail: "₹35,00,000 · Housing Loan",
      status: "Closed",
      tone: "negative",
      secured: true,
      bank: "HDFC Bank",
      outstanding: "₹0",
      loanAmount: "₹35,00,000",
      paidPct: 100,
      principalPaid: "₹35,00,000",
      year: 2017,
      updatedBy: "HDFC Bank",
      updatedOn: "31 Mar 2022",
      payments: buildPayments("2019-04", "2022-03", {
        "2021-12": "not-reported",
      }),
    },
    {
      id: "amex-card-1444",
      type: "card",
      opened: "2014-06-17",
      icon: IconCreditCard,
      name: "American Express Credit Card ••1444",
      // The bureau carries no credit limit or high balance for this one
      // (both come through as -1), so there's nothing to show as a limit.
      detail: "No limit reported · Credit Card",
      status: "Closed",
      tone: "negative",
      bank: "American Express",
      totalSpends: "₹0",
      creditLimit: "₹0",
      limitUsedPct: 0,
      limitUsedAmount: "₹0",
      year: 2014,
      updatedBy: "American Express",
      updatedOn: "14 Apr 2019",
      // Its 36-month window is "XXX" apart from the final month.
      payments: buildPayments("2019-04", "2019-04"),
    },
    {
      id: "citi-card-7113",
      type: "card",
      opened: "2013-03-28",
      icon: IconCreditCard,
      name: "Citibank Credit Card ••7113",
      detail: "₹98,000 · Credit Card",
      status: "Closed",
      tone: "negative",
      bank: "Citibank",
      totalSpends: "₹0",
      creditLimit: "₹98,000",
      limitUsedPct: 0,
      limitUsedAmount: "₹0",
      year: 2013,
      updatedBy: "Citibank",
      updatedOn: "15 Nov 2014",
      payments: buildPayments("2014-04", "2014-04"),
    },
    {
      id: "bajaj-twowheeler-loan",
      type: "loan",
      opened: "2010-03-30",
      icon: IconBuildingBank,
      name: "Bajaj Finance Two-wheeler Loan",
      detail: "₹61,000 · Two-wheeler Loan",
      status: "Closed",
      tone: "negative",
      secured: true,
      bank: "Bajaj Finance",
      outstanding: "₹0",
      loanAmount: "₹61,000",
      paidPct: 100,
      principalPaid: "₹61,000",
      year: 2010,
      updatedBy: "Bajaj Finance",
      updatedOn: "03 Jun 2014",
      // Reported as "STD" (standard/on-time) throughout, with "XXX" gaps.
      payments: buildPayments("2010-05", "2012-03", {
        "2010-07": "not-reported",
        "2011-09": "not-reported",
        "2011-11": "not-reported",
        "2011-12": "not-reported",
        "2012-01": "not-reported",
        "2012-02": "not-reported",
      }),
    },
    {
      id: "hdfc-personal-loan",
      type: "loan",
      opened: "2010-02-17",
      icon: IconBuildingBank,
      name: "HDFC Bank Personal Loan",
      detail: "₹1,00,000 · Personal Loan",
      status: "Closed",
      tone: "negative",
      bank: "HDFC Bank",
      outstanding: "₹0",
      loanAmount: "₹1,00,000",
      paidPct: 100,
      principalPaid: "₹1,00,000",
      year: 2010,
      updatedBy: "HDFC Bank",
      updatedOn: "31 Dec 2011",
      payments: buildPayments("2010-02", "2011-12"),
    },
  ],
};

// Detail pages read the matching record from the loans list.
const card = loans.active.find((l) => l.type === "card");
const loan = loans.active.find((l) => l.type === "loan");

// Account age is measured against the report pull date rather than the wall
// clock: a `new Date()` here would render one number on the server and
// possibly another on the client, and would silently drift over time.
const REPORT_DATE_ISO = "2026-07-13";

function formatOpened(iso) {
  const [year, month, day] = iso.split("-");
  return `${Number(day)} ${MONTH_LABELS[Number(month) - 1]} ${year}`;
}

function yearsSince(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const [ry, rm, rd] = REPORT_DATE_ISO.split("-").map(Number);
  const beforeAnniversary = rm < m || (rm === m && rd < d);
  return ry - y - (beforeAnniversary ? 1 : 0);
}

// The account behind the "close my oldest card" scenario. Derived from the
// tradelines rather than hardcoded, so the sheet always names the card the
// data actually says is oldest.
const oldestCardRecord = loans.active
  .filter((l) => l.type === "card")
  .reduce((a, b) => (a.opened <= b.opened ? a : b));

const oldestCard = {
  ...oldestCardRecord,
  openedLabel: formatOpened(oldestCardRecord.opened),
  ageLabel: `${yearsSince(oldestCardRecord.opened)} years old`,
};

// Amounts are stored the way they're displayed ("₹51,132"), so totalling them
// means stripping the formatting back off and rebuilding it.
function parseRupees(label) {
  return Number(label.replace(/\D/g, ""));
}

function formatRupees(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

// What "pay off my credit cards" actually covers: the active cards still
// carrying a balance, and the total owed across them. Derived from the
// tradelines rather than written down, so the sheet can't drift from the
// report — a card cleared in the data drops out of the count on its own.
const cardsWithBalance = loans.active.filter(
  (account) =>
    account.type === "card" && parseRupees(account.limitUsedAmount) > 0,
);

const outstandingCards = {
  count: cardsWithBalance.length,
  totalLabel: formatRupees(
    cardsWithBalance.reduce(
      (total, account) => total + parseRupees(account.limitUsedAmount),
      0,
    ),
  ),
};

// ---- Your details ----
// Contact information as lenders reported it to the bureau — the bureau holds
// whatever each lender last sent, which is why the same person can sit under
// several addresses or numbers.
//
// Dates are stored as ISO and the lists are sorted newest-first from them, so
// "latest" is derived rather than a property of the order someone typed these
// in. The score page shows `[0]` of each list and the detail page badges it.
//
// The report's BorrowerAddress entries carry an `Origin` (the lender that sent
// them) and a `dateReported`; emails and phones don't, so those are attributed
// to the lender whose tradeline was reported on the same date. Exact duplicates
// are collapsed — the report lists the same mobile number four times.
const reportedDetails = {
  emails: [
    {
      id: "email-hdfc",
      value: "nik86vaidya@gmail.com",
      reportedBy: "HDFC Bank",
      on: "2025-10-15",
    },
    {
      id: "email-payu",
      value: "nikhil.vaidya@payufin.com",
      reportedBy: "PayU Finance",
      on: "2025-09-30",
    },
  ],
  addresses: [
    {
      id: "address-hdfc-office",
      value:
        "Divyasree Greens, 100 Feet Road, Embassy Golf Links Business Park, Challaghatta, Bengaluru 560071",
      reportedBy: "HDFC Bank",
      on: "2025-10-15",
    },
    {
      id: "address-hdfc-home",
      value:
        "B-1503, August Grand, 15th Floor, Wing B, Sarjapur Main Road, Kaikondrahalli, Bengaluru 560035",
      reportedBy: "HDFC Bank",
      on: "2025-10-15",
    },
    {
      id: "address-payu",
      value:
        "B 1503, August Grand, 15th Floor, Wing B, Sarjapur Main Road, Kaikondrahalli, Bengaluru, Karnataka 560035",
      reportedBy: "PayU Finance",
      on: "2025-09-30",
    },
    {
      id: "address-hdfc-old",
      value:
        "Flat No 1503, B Block, 15th Floor, August Grand Apartment, Sarjapur Road, Near Wipro, Bengaluru 560035",
      reportedBy: "HDFC Bank",
      on: "2024-01-31",
    },
  ],
  phones: [
    {
      id: "phone-hdfc",
      value: "+91 97429 42546",
      reportedBy: "HDFC Bank",
      on: "2025-10-15",
    },
  ],
};

// ISO sorts lexicographically, so no date parsing is needed to order these.
function newestFirst(entries) {
  return [...entries]
    .sort((a, b) => (a.on < b.on ? 1 : -1))
    .map((entry) => ({ ...entry, reportedOn: formatOpened(entry.on) }));
}

const personalDetails = {
  // Onboarding collects a name but doesn't persist it, so the identity on the
  // contact card comes from here.
  name: "Nikhil Vijay Vaidya",
  emails: newestFirst(reportedDetails.emails),
  addresses: newestFirst(reportedDetails.addresses),
  phones: newestFirst(reportedDetails.phones),
};

// Copy for the details screens. `groups` drives both the summary rows on the
// score page and the sections on the detail page, so the two can't fall out of
// step when a field is added — or reordered. Phone leads: it's the detail
// lenders key off and the one people check first.
const personalDetailsPage = {
  title: "Personal information",
  intro:
    "This is the contact information your lenders have reported to CIBIL. It updates when a lender sends the bureau something new.",
  groups: [
    { id: "phone", label: "Phone", plural: "Phone numbers", key: "phones" },
    { id: "email", label: "Email", plural: "Email addresses", key: "emails" },
    { id: "address", label: "Address", plural: "Addresses", key: "addresses" },
  ],
  cardSubtitle: "As reported to CIBIL",
  // Row at the foot of the score page's details card, opening this page.
  viewAllLabel: "View all details",
  // Foot of a details group that's showing only its most recent entries.
  viewMoreLabel: (n) => `View ${n} more`,
  latestBadge: "Latest",
  reportedNote: (entry) => `${entry.reportedBy} · ${entry.reportedOn}`,
  footnote:
    "Something look wrong? Contact the lender that reported it — they update the bureau, not the other way round.",
};

const paymentLegend = [
  { id: "on-time", label: "On time" },
  { id: "delayed", label: "Delayed" },
  { id: "overdue", label: "Overdue" },
  { id: "not-reported", label: "Not reported" },
];

// Look up any account (active or closed) by id — used by the detail pages.
function findAccount(id) {
  return [...loans.active, ...loans.closed].find((a) => a.id === id);
}

export const mock = {
  currentScore,
  reportFetchDate,
  userPercentile,
  scoreHistory,
  scoreDelta,
  scorePrediction,
  predictor,
  paymentHistoryDetail,
  creditUsageDetail,
  inquiriesDetail,
  inquiries,
  creditAgeDetail,
  creditMixDetail,
  impacts,
  loans,
  card,
  loan,
  oldestCard,
  outstandingCards,
  findAccount,
  paymentLegend,
  personalDetails,
  personalDetailsPage,
};
