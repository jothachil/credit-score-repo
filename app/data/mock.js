import { IconBuildingBank, IconCreditCard } from "@tabler/icons-react";

// Single source of mock data for the whole prototype. Presentation logic
// (colours, charts, classification tones) lives in the components; this file
// only holds the numbers, copy, and lists the screens render.

// ---- Score ----
const currentScore = 789;
const reportFetchDate = "24 Jun 2026";
const userPercentile = 20;

// Month-by-month history (oldest → newest); spans several bands for colour.
const scoreHistory = [
  { month: "Feb", score: 560 }, // Poor
  { month: "Mar", score: 620 }, // Fair
  { month: "Apr", score: 685 }, // Good
  { month: "May", score: 730 }, // Good
  { month: "Jun", score: 765 }, // Very Good
  { month: "Jul", score: 789 }, // Very Good
];
const scoreDelta = scoreHistory.at(-1).score - scoreHistory.at(-2).score;

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
    rating: classifyCreditUtilization(24),
    label: ["Credit utilization"],
    value: "24%",
    title: "Credit utilization",
    description:
      "How much of your available credit limit you're using. The lower, the better.",
    ranges: creditUtilizationRanges,
  },
  {
    id: "credit-history",
    rating: classifyCreditHistory(2),
    label: ["Credit history"],
    value: "2 years",
    title: "Credit history",
    description:
      "How long you've had active credit accounts. A longer history helps your score.",
    ranges: creditHistoryRanges,
  },
  {
    id: "credit-mix",
    rating: classifyCreditMix(42),
    label: ["Credit mix"],
    value: "42%",
    title: "Credit mix",
    description:
      "The share of secured vs unsecured credit you hold. A healthier balance helps your score.",
    ranges: creditMixRanges,
  },
  {
    id: "recent-inquiries",
    rating: classifyRecentInquiries(7),
    label: ["Recent inquiries"],
    value: "7",
    title: "Recent inquiries",
    description:
      "Hard inquiries from new credit applications in the last 6 months. Fewer is better.",
    ranges: recentInquiriesRanges,
  },
];

// ---- Loans & credit lines ----
// `detail` containing "Card" routes to the card detail, else the loan detail.
// Each entry holds both the row fields (icon/name/detail/status/tone) and the
// detail-page fields, so the list and the detail screens share one record.
// `type` decides which detail layout renders it.
const loans = {
  active: [
    {
      id: "hdfc-diners",
      type: "card",
      icon: IconCreditCard,
      name: "HDFC Diners Club International",
      detail: "₹5,070 · Credit Card",
      status: "Active",
      tone: "positive",
      bank: "HDFC Bank",
      totalSpends: "₹5,070",
      creditLimit: "₹9,75,000",
      limitUsedPct: 1,
      limitUsedAmount: "₹5,070",
      year: 2026,
      updatedBy: "HDFC Bank",
      updatedOn: "17 Jun 2026",
    },
    {
      id: "payu-personal",
      type: "loan",
      icon: IconBuildingBank,
      name: "PayU Finance Private Ltd",
      detail: "₹48,000 · Personal Loan",
      status: "Active",
      tone: "positive",
      bank: "PayU Finance",
      outstanding: "₹48,000",
      loanAmount: "₹64,000",
      paidPct: 25,
      principalPaid: "₹16,000",
      year: 2026,
      updatedBy: "PayU Finance",
      updatedOn: "17 Jun 2026",
    },
  ],
  closed: [
    {
      id: "payu-closed",
      type: "loan",
      icon: IconBuildingBank,
      name: "PayU Finance Private Ltd",
      detail: "₹64,000 · Personal Loan",
      status: "Closed",
      tone: "negative",
      bank: "PayU Finance",
      outstanding: "₹0",
      loanAmount: "₹64,000",
      paidPct: 100,
      principalPaid: "₹64,000",
      year: 2026,
      updatedBy: "PayU Finance",
      updatedOn: "17 Jun 2026",
    },
  ],
};

// Detail pages read the matching record from the loans list.
const card = loans.active.find((l) => l.type === "card");
const loan = loans.active.find((l) => l.type === "loan");

// Shared payment-history calendar used by both detail pages.
const paymentMonths = [
  { month: "Jan", status: "on-time" },
  { month: "Feb", status: "on-time" },
  { month: "Mar", status: "delayed" },
  { month: "Apr", status: "on-time" },
  { month: "May", status: "overdue" },
  { month: "Jun", status: "on-time" },
  { month: "Jul", status: "on-time" },
  { month: "Aug", status: "delayed" },
  { month: "Sep", status: "on-time" },
  { month: "Oct", status: "not-reported" },
  { month: "Nov", status: "not-reported" },
  { month: "Dec", status: "not-reported" },
];

const paymentLegend = [
  { id: "on-time", label: "On time" },
  { id: "delayed", label: "Delayed" },
  { id: "overdue", label: "Overdue" },
  { id: "not-reported", label: "Not reported" },
];

const paymentYears = [2026, 2025, 2024];

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
  impacts,
  loans,
  card,
  loan,
  findAccount,
  paymentMonths,
  paymentLegend,
  paymentYears,
};
