"use client";

import "slot-text/style.css";
import {
  IconChevronRight,
  IconCreditCard,
  IconFileDownload,
  IconHelpCircle,
  IconInfoCircle,
  IconRefresh,
} from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SlotText } from "slot-text/react";
import LoanRow from "../components/LoanRow";
import NavBar from "../components/NavBar";
import RefreshScoreSheet from "../components/RefreshScoreSheet";
import ScoreBreakdownSheet from "../components/ScoreBreakdownSheet";
import ThemeColor from "../components/ThemeColor";
import { debugFlagAtoms } from "../state/debugFlags";

// FICO score model. Bands run low → high; each segment of the gauge is sized
// proportionally to its share of the 300–850 range. Colors follow the standard
// FICO palette — the orange/light-green steps have no semantic token (Figma
// uses literals too), so they're kept as documented one-off literals.
const SCORE_MIN = 300;
const SCORE_MAX = 850;
const SCORE_BANDS = [
  { id: "poor", label: "Poor", min: 300, color: "bg-background-negative" },
  { id: "fair", label: "Fair", min: 580, color: "bg-[#f47b0b]" },
  { id: "good", label: "Good", min: 670, color: "bg-background-warning" },
  {
    id: "very-good",
    label: "Very Good",
    min: 740,
    color: "bg-[var(--mountain-green-04)]",
  },
  {
    id: "exceptional",
    label: "Exceptional",
    min: 800,
    color: "bg-background-postive",
  },
];

// 16 evenly spaced scale ticks under the gauge.
const SCORE_TICKS = Array.from({ length: 16 }, (_, i) => `tick-${i}`);

// Resolve a raw score into its band, gauge segments, and tick position. The
// gauge runs high → low (Exceptional on the left, Poor on the right), so the
// segments and the tick marker are both measured from the high end.
function resolveScore(score) {
  const range = SCORE_MAX - SCORE_MIN;
  const segments = SCORE_BANDS.map((band, i) => {
    const max = SCORE_BANDS[i + 1]?.min ?? SCORE_MAX;
    return { ...band, span: max - band.min };
  }).reverse();
  const band =
    [...SCORE_BANDS].reverse().find((b) => score >= b.min) ?? SCORE_BANDS[0];
  const fraction = Math.min(Math.max((score - SCORE_MIN) / range, 0), 1);
  const activeTick = Math.round((1 - fraction) * (SCORE_TICKS.length - 1));
  return { segments, band, activeTick };
}

// Factors that move the score — a horizontally scrolling row of cards.
const IMPACTS = [
  {
    id: "payment-history",
    rating: "Excellent",
    label: ["Payment history"],
    value: "100%",
  },
  {
    id: "credit-utilization",
    rating: "Excellent",
    label: ["Credit utilization"],
    value: "2.27%",
  },
  {
    id: "credit-history",
    rating: "Excellent",
    label: ["Credit history"],
    value: "7+ years",
  },
  {
    id: "credit-mix",
    rating: "Good",
    label: ["Credit mix"],
    value: "4 acc",
  },
  {
    id: "recent-inquiries",
    rating: "Excellent",
    label: ["Recent inquiries"],
    value: "0",
  },
  {
    id: "disputes",
    rating: "Excellent",
    label: ["Disputes"],
    value: "0",
  },
];

function ImpactCard({ rating, label, value }) {
  return (
    <div className="flex w-48 shrink-0 snap-start flex-col gap-6 rounded-2xl border border-border-primary bg-gradient-to-b from-background-light-postive to-background-primary p-4">
      {/* mountain-green-02: a stronger tint than the card's pale top, no token */}
      <span className="self-start rounded-full bg-[var(--mountain-green-02)] px-3 py-1 text-[14px] leading-5 font-medium text-content-postive">
        {rating}
      </span>
      <div className="flex flex-col gap-1">
        <span className="text-[14px] leading-5 text-content-secondary">
          {label.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </span>
        <span className="text-2xl leading-9 font-bold text-content-primary">
          {value}
        </span>
      </div>
    </div>
  );
}

// A tappable list row: leading icon, label, and a circular chevron affordance.
// Rows stack inside a bordered card; all but the last carry a bottom divider.
function ActionRow({ icon: Icon, label, onClick, last }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full cursor-pointer items-center gap-4 p-4 text-left ${
        last ? "" : "border-b border-border-primary"
      }`}
    >
      <Icon size={24} stroke={2} className="shrink-0 text-content-primary" />
      <span className="flex-1 text-[14px] leading-5 text-content-primary">
        {label}
      </span>
      <span className="flex items-center justify-center rounded-full bg-background-secondary p-1">
        <IconChevronRight
          size={20}
          stroke={2}
          className="text-content-primary"
        />
      </span>
    </button>
  );
}

const CURRENT_SCORE = 789;

export default function CreditScore() {
  const router = useRouter();
  const refreshAvailable = useAtomValue(debugFlagAtoms.refreshAvailable);
  const [score, setScore] = useState(SCORE_MIN);
  const [direction, setDirection] = useState("up");
  const [refreshSheetOpen, setRefreshSheetOpen] = useState(false);
  const [breakdownSheetOpen, setBreakdownSheetOpen] = useState(false);
  const { segments, band, activeTick } = resolveScore(score);

  // slot-text only rolls on text *changes*, not on mount — so start at the
  // score floor and settle on the real value after first paint to get an
  // entrance roll (number, label, and gauge all animate into place).
  useEffect(() => {
    setScore(CURRENT_SCORE);
  }, []);

  // Roll the score to a new value — drives the slot-text animation. Direction
  // follows the delta so digits roll up on an increase, down on a decrease.
  function refreshScore() {
    let next = score;
    while (next === score) {
      next =
        Math.floor(Math.random() * (SCORE_MAX - SCORE_MIN + 1)) + SCORE_MIN;
    }
    setDirection(next > score ? "up" : "down");
    setScore(next);
    setRefreshSheetOpen(false);
  }

  return (
    <div className="flex flex-1 flex-col bg-background-secondary">
      {/* Status bar tints dark to match the hero's top edge */}
      <ThemeColor color="#000000" />
      {/* Hero — dark surface with score, gauge and refresh banner */}
      <section className="relative overflow-hidden bg-background-inverse-primary">
        {/* Ambient glow behind the gauge — tinted to the current score band */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 -bottom-20 mx-auto h-48 w-[200%] rounded-full opacity-40 blur-[56px] transition-colors duration-500 ${band.color}`}
        />

        {/* App bar — shared NavBar, transparent over the dark hero */}
        <NavBar inverse border={false} />

        {/* Score + gauge */}
        <div className="relative flex flex-col gap-4 px-4 pt-1 pb-5">
          <div className="flex flex-col gap-0.5">
            <p className="mt-10 text-[10px] leading-4 font-medium tracking-[1px] text-content-inverse-primary uppercase">
              Credit Score
            </p>
            {/* Fixed height so the SSR-empty → built → rolling states of the
                slot-text number never change the row height (slot-text injects
                its cells client-side and uses its own line-height). */}
            <p className="flex h-14 items-baseline gap-2">
              <SlotText
                text={String(score)}
                options={{ direction }}
                className="text-3xl font-bold text-content-inverse-primary"
              />
              <span className="flex items-center gap-1 text-sm leading-6 text-content-inverse-primary lowercase">
                {band.label}
                <button
                  type="button"
                  aria-label="How your score is calculated"
                  onClick={() => setBreakdownSheetOpen(true)}
                  className="flex cursor-pointer items-center text-content-inverse-primary"
                >
                  <IconInfoCircle size={16} stroke={2} />
                </button>
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex h-8 w-full items-end gap-0.5">
              {segments.map((segment) => (
                <span
                  key={segment.id}
                  style={{ flexGrow: segment.span }}
                  className={`basis-0  transition-all duration-500 ease-out ${segment.color} ${
                    segment.id === band.id ? "h-full" : "h-3/4"
                  }`}
                />
              ))}
            </div>
            <div className="flex w-full items-center justify-between px-px">
              {SCORE_TICKS.map((tick, i) => {
                // Endpoints show the score range (high end left, low end right);
                // the rest stay as dots, with the active one highlighted.
                if (i === 0 || i === SCORE_TICKS.length - 1) {
                  return (
                    <span
                      key={tick}
                      className="text-[13px] leading-4 font-medium text-content-inverse-primary"
                    >
                      {i === 0 ? 900 : 300}
                    </span>
                  );
                }
                return (
                  <span
                    key={tick}
                    className={`size-1.5 rounded-full transition-colors duration-500 ${
                      i === activeTick
                        ? "bg-content-inverse-primary"
                        : "bg-content-secondary"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Refresh banner — copy + CTA depend on the "refresh available" flag */}
          <div className="flex items-center justify-between gap-4 rounded-lg bg-background-inverse-secondary px-4 py-3">
            <span className="flex items-center gap-2 text-[14px] leading-5 text-content-inverse-primary">
              <IconRefresh size={20} stroke={2} className="shrink-0" />
              {refreshAvailable
                ? "Refresh available"
                : "Next refresh in 30 days"}
            </span>
            {refreshAvailable && (
              <button
                type="button"
                onClick={() => setRefreshSheetOpen(true)}
                className="cursor-pointer text-[14px] leading-5 font-bold text-content-brand"
              >
                Update
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="flex flex-col gap-6 px-4 py-6">
        <section className="flex flex-col gap-2">
          <h2 className="text-sm leading-6 font-semibold text-content-secondary">
            What impacts your score?
          </h2>
          {/* Full-bleed horizontal scroll: -mx-4/px-4 lets cards run to the
              frame edge while the first card still aligns with the section. */}
          <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-px-4 px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {IMPACTS.map((impact) => (
              <ImpactCard key={impact.id} {...impact} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm leading-6 font-semibold text-content-secondary">
              Loans &amp; Credit lines
            </h2>
            <button
              type="button"
              onClick={() => router.push("/loans")}
              className="cursor-pointer text-[14px] leading-5 font-bold text-content-brand"
            >
              View all
            </button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border-primary bg-background-primary py-1">
            <LoanRow
              icon={IconCreditCard}
              name="PayU Finance Private Ltd"
              detail="₹64,000 · Card EMI"
              status="Active"
              tone="positive"
            />
            <LoanRow
              icon={IconCreditCard}
              name="PayU Finance Private Ltd"
              detail="₹64,000 · Card EMI"
              status="Active"
              tone="positive"
              last
            />
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-sm leading-6 font-semibold text-content-secondary">
            Actions
          </h2>
          <div className="overflow-hidden rounded-2xl border border-border-primary bg-background-primary">
            <ActionRow
              icon={IconHelpCircle}
              label="Get help"
              onClick={() => router.push("/help")}
            />
            <ActionRow
              icon={IconFileDownload}
              label="Download full report"
              onClick={() => router.push("/report")}
              last
            />
          </div>
        </section>

        {/* Powered by CIBIL — bureau attribution */}
        <div className="flex items-center justify-center pt-2 pb-4">
          {/* biome-ignore lint/performance/noImgElement: prototype static asset */}
          <img
            src="/cibil.png"
            alt="Powered by CIBIL"
            className="h-auto w-full max-w-[64px] object-contain"
          />
        </div>
      </div>

      <RefreshScoreSheet
        open={refreshSheetOpen}
        onOpenChange={setRefreshSheetOpen}
        onConfirm={refreshScore}
      />

      <ScoreBreakdownSheet
        open={breakdownSheetOpen}
        onOpenChange={setBreakdownSheetOpen}
        currentBandId={band.id}
      />
    </div>
  );
}
