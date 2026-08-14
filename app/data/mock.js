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
// Values are derived from a real CIBIL (TrueLink) report pulled on
// 13 Jul 2026: riskScore 784, populationRank 15, 8 tradelines (6 open,
// 2 closed — closure detected via `dateClosed`), 9 inquiries.

// ---- Score ----
const currentScore = 784;
const reportFetchDate = "13 Jul 2026";
const userPercentile = 15; // populationRank — top 15% of scored borrowers

// Month-by-month history (oldest → newest). The bureau report only carries
// the latest score, so earlier months are a plausible ramp up to 784.
const scoreHistory = [
  { month: "Feb", score: 712 }, // Good
  { month: "Mar", score: 728 }, // Good
  { month: "Apr", score: 741 }, // Good
  { month: "May", score: 756 }, // Very Good
  { month: "Jun", score: 770 }, // Very Good
  { month: "Jul", score: 784 }, // Very Good
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
    image: "pay-outstanding",
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
    image: "new-credit",
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
    image: "default-loan",
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
    image: "pay-outstanding",
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
      image: "pay-outstanding",
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
      image: "pay-outstanding",
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
      image: "new-credit",
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
      image: "default-loan",
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
    id: "hdfc-2026-01",
    lender: "HDFC Bank",
    date: "29 Jan 2026",
    amount: "₹10,000",
    recent: true,
  },
  {
    id: "idfc-2025-12",
    lender: "IDFC First Bank",
    date: "19 Dec 2025",
    amount: "₹20,000",
    recent: false,
  },
  {
    id: "hdfc-2025-07",
    lender: "HDFC Bank",
    date: "22 Jul 2025",
    amount: "₹1,000",
    recent: false,
  },
  {
    id: "icici-2025-01",
    lender: "ICICI Bank",
    date: "25 Jan 2025",
    amount: "₹1,00,000",
    recent: false,
  },
  {
    id: "adityabirla-2024-09",
    lender: "Aditya Birla Finance",
    date: "13 Sep 2024",
    amount: "₹4,00,000",
    recent: false,
  },
  {
    id: "tcl-2024-08",
    lender: "Tata Capital",
    date: "14 Aug 2024",
    amount: "₹7,09,000",
    recent: false,
  },
  {
    id: "icici-2024-04",
    lender: "ICICI Bank",
    date: "16 Apr 2024",
    amount: "₹10,00,000",
    recent: false,
  },
  {
    id: "hdfc-2024-03",
    lender: "HDFC Bank",
    date: "15 Mar 2024",
    amount: "₹1,000",
    recent: false,
  },
  {
    id: "idfc-2023-08",
    lender: "IDFC First Bank",
    date: "01 Aug 2023",
    amount: "₹20,000",
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
// - Payment history: every MonthlyPayStatus across all 8 tradelines is "0"
//   (on time) or "XXX" (not reported) → 100%.
// - Utilization: revolving (type 10) accounts only —
//   (51,132 + 8,850 + 0 + 47,330) / (1,89,000 + 3 × 5,00,000) ≈ 6%.
// - History: oldest tradeline opened 06 Apr 2022 → ~4 years.
// - Mix: all accounts are unsecured (cards + consumer/personal loans) → 0%.
// - Inquiries: 1 in the last 6 months (HDFC, 29 Jan 2026).
const impacts = [
  {
    id: "payment-history",
    rating: classifyPaymentHistory(100),
    label: ["Payment history"],
    value: "100%",
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
    rating: classifyCreditHistory(4),
    label: ["Credit history"],
    value: "4 years",
    title: "Credit history",
    description:
      "How long you've had active credit accounts. A longer history helps your score.",
    ranges: creditHistoryRanges,
  },
  {
    id: "credit-mix",
    rating: classifyCreditMix(0),
    label: ["Credit mix"],
    value: "0%",
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
// this report has status "0" everywhere — except explicit overrides
// ({ "YYYY-MM": status }) for the "XXX" (not-reported) gaps. Months outside
// the reported window render as not-reported.
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
// One record per tradeline in the report. `type` decides which detail layout
// renders it ("card" → CreditLimit-based, "loan" → highBalance-based).
// Open vs closed follows the bureau's `dateClosed` field. `payments` mirrors
// each tradeline's actual MonthlyPayStatus range.
const loans = {
  active: [
    {
      id: "hdfc-card",
      type: "card",
      opened: "2026-02-04",
      icon: IconCreditCard,
      name: "HDFC Bank Credit Card",
      detail: "₹1,89,000 · Credit Card",
      status: "Active",
      tone: "positive",
      bank: "HDFC Bank",
      totalSpends: "₹51,132",
      creditLimit: "₹1,89,000",
      limitUsedPct: 27,
      limitUsedAmount: "₹51,132",
      year: 2026,
      updatedBy: "HDFC Bank",
      updatedOn: "10 Jul 2026",
      payments: buildPayments("2026-02", "2026-07"),
    },
    {
      id: "idfc-card",
      type: "card",
      opened: "2025-12-19",
      icon: IconCreditCard,
      name: "IDFC First Bank Credit Card",
      detail: "₹5,00,000 · Credit Card",
      status: "Active",
      tone: "positive",
      bank: "IDFC First Bank",
      totalSpends: "₹8,850",
      creditLimit: "₹5,00,000",
      limitUsedPct: 2,
      limitUsedAmount: "₹8,850",
      year: 2025,
      updatedBy: "IDFC First Bank",
      updatedOn: "09 Jul 2026",
      payments: buildPayments("2025-12", "2026-07"),
    },
    {
      id: "snapmint-loan",
      type: "loan",
      opened: "2025-10-28",
      icon: IconBuildingBank,
      name: "Snapmint Financial Services",
      detail: "₹4,282 · Consumer Loan",
      status: "Active",
      tone: "positive",
      bank: "Snapmint",
      outstanding: "₹3,742",
      loanAmount: "₹4,282",
      paidPct: 13,
      principalPaid: "₹540",
      year: 2025,
      updatedBy: "Snapmint",
      updatedOn: "30 Jun 2026",
      payments: buildPayments("2025-10", "2026-06"),
    },
    {
      id: "icici-card-8747",
      type: "card",
      opened: "2022-12-30",
      icon: IconCreditCard,
      name: "ICICI Bank Credit Card ••8747",
      detail: "₹5,00,000 · Credit Card",
      status: "Active",
      tone: "positive",
      bank: "ICICI Bank",
      totalSpends: "₹0",
      creditLimit: "₹5,00,000",
      limitUsedPct: 0,
      limitUsedAmount: "₹0",
      year: 2022,
      updatedBy: "ICICI Bank",
      updatedOn: "31 Jan 2026",
      // "XXX" gaps in the bureau data: Apr–Aug 2025 and Oct–Nov 2025.
      payments: buildPayments("2023-02", "2026-01", {
        "2025-04": "not-reported",
        "2025-05": "not-reported",
        "2025-06": "not-reported",
        "2025-07": "not-reported",
        "2025-08": "not-reported",
        "2025-10": "not-reported",
        "2025-11": "not-reported",
      }),
    },
    {
      id: "lazypay-loan",
      type: "loan",
      opened: "2022-09-01",
      icon: IconBuildingBank,
      name: "PayU Finance (LazyPay)",
      detail: "₹5,600 · Consumer Loan",
      status: "Active",
      tone: "positive",
      bank: "PayU Finance",
      outstanding: "₹0",
      loanAmount: "₹5,600",
      paidPct: 100,
      principalPaid: "₹5,600",
      year: 2022,
      updatedBy: "PayU Finance",
      updatedOn: "30 Jun 2026",
      payments: buildPayments("2023-07", "2026-06"),
    },
    {
      id: "icici-card-1784",
      type: "card",
      opened: "2022-06-14",
      icon: IconCreditCard,
      name: "ICICI Bank Credit Card ••1784",
      detail: "₹5,00,000 · Credit Card",
      status: "Active",
      tone: "positive",
      bank: "ICICI Bank",
      totalSpends: "₹47,330",
      creditLimit: "₹5,00,000",
      limitUsedPct: 9,
      limitUsedAmount: "₹47,330",
      year: 2022,
      updatedBy: "ICICI Bank",
      updatedOn: "30 Jun 2026",
      payments: buildPayments("2023-07", "2026-06"),
    },
  ],
  closed: [
    {
      id: "adityabirla-loan",
      type: "loan",
      opened: "2024-09-13",
      icon: IconBuildingBank,
      name: "Aditya Birla Capital",
      detail: "₹1,00,000 · Personal Loan",
      status: "Closed",
      tone: "negative",
      bank: "Aditya Birla Capital",
      outstanding: "₹0",
      loanAmount: "₹1,00,000",
      paidPct: 100,
      principalPaid: "₹1,00,000",
      year: 2024,
      updatedBy: "Aditya Birla Capital",
      updatedOn: "15 Jan 2025",
      payments: buildPayments("2024-09", "2025-01"),
    },
    {
      id: "idfc-ola-loan",
      type: "loan",
      opened: "2022-04-06",
      icon: IconBuildingBank,
      name: "IDFC First Bank (OLA)",
      detail: "₹30,000 · Consumer Loan",
      status: "Closed",
      tone: "negative",
      bank: "IDFC First Bank",
      outstanding: "₹0",
      loanAmount: "₹30,000",
      paidPct: 100,
      principalPaid: "₹30,000",
      year: 2022,
      updatedBy: "IDFC First Bank",
      updatedOn: "04 Jun 2025",
      payments: buildPayments("2022-07", "2025-06"),
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
};
