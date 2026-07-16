import {
  IconBellRinging,
  IconBuildingBank,
  IconCalendarCheck,
  IconCoinRupee,
  IconCreditCard,
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
// Card illustrations live in /public, named after each choice id.
const predictor = {
  heading: "Make a choice. See where it takes you",
  // Detail screen for the "miss a payment" choice.
  missPayment: {
    kicker: "See how your score changes",
    title: "If you miss loan EMI or credit card bills",
    optionsLabel: "Miss payments for",
    // Longer delinquency → bigger illustrative hit to the score.
    options: [
      { id: "30", label: "30 days", delta: -40 },
      { id: "60", label: "60 days", delta: -58 },
      { id: "90", label: "90 days", delta: -80 },
    ],
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
  choices: [
    {
      id: "miss-payment",
      label: "Miss a payment due date",
      delta: -58,
      tone: "negative",
    },
    {
      id: "pay-outstanding",
      label: "Pay outstanding loans & cards",
      delta: 32,
      tone: "positive",
    },
    {
      id: "lower-utilisation",
      label: "Lower your credit utilisation",
      delta: 18,
      tone: "brand",
    },
    {
      id: "default-loan",
      label: "Default on a loan or card",
      delta: -112,
      tone: "negative",
    },
    {
      id: "close-oldest-card",
      label: "Close oldest credit card",
      delta: -24,
      tone: "warning",
    },
    {
      id: "new-credit",
      label: "Take a new credit card",
      delta: -12,
      tone: "brand",
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
  impacts,
  loans,
  card,
  loan,
  findAccount,
  paymentLegend,
};
