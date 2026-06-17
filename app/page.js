"use client";

import "slot-text/style.css";
import {
  IconArrowLeft,
  IconChevronRight,
  IconCreditCard,
  IconHeadset,
  IconHome,
  IconReceipt2,
  IconRefresh,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SlotText } from "slot-text/react";

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

function ChevronCircle() {
  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-background-secondary text-content-primary">
      <IconChevronRight size={20} stroke={2} />
    </span>
  );
}

function LoanRow({ icon: Icon, name, detail, status, tone, large, last }) {
  return (
    <button
      type="button"
      className={`flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-background-secondary ${
        last ? "" : "border-b border-border-primary"
      }`}
    >
      <span className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border-primary bg-background-secondary text-content-primary">
          <Icon size={22} stroke={1.5} />
        </span>
        <span className="flex flex-col">
          <span
            className={`font-semibold text-content-primary ${
              large ? "text-sm leading-6" : "text-[14px] leading-5"
            }`}
          >
            {name}
          </span>
          <span className="text-[14px] leading-5 text-content-secondary">
            {detail}
          </span>
          <span
            className={`text-[12px] leading-4 font-semibold ${
              tone === "negative"
                ? "text-content-negative"
                : "text-content-postive"
            }`}
          >
            {status}
          </span>
        </span>
      </span>
      <ChevronCircle />
    </button>
  );
}

function ActionRow({ icon: Icon, label, last }) {
  return (
    <button
      type="button"
      className={`flex w-full cursor-pointer items-center gap-4 p-4 text-left transition-colors hover:bg-background-secondary ${
        last ? "" : "border-b border-border-primary"
      }`}
    >
      <Icon size={24} stroke={2} className="shrink-0 text-content-primary" />
      <span className="flex-1 text-[14px] leading-5 text-content-primary">
        {label}
      </span>
      <ChevronCircle />
    </button>
  );
}

const CURRENT_SCORE = 789;

export default function CreditScore() {
  const router = useRouter();
  const [score, setScore] = useState(SCORE_MIN);
  const [direction, setDirection] = useState("up");
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
  }

  return (
    <div className="flex flex-1 flex-col bg-background-secondary">
      {/* Hero — dark surface with score, gauge and refresh banner */}
      <section className="relative overflow-hidden bg-background-inverse-primary">
        {/* Ambient green glow behind the gauge */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-12 mx-auto h-40 w-[130%] rounded-full bg-background-postive/40 blur-[56px]"
        />

        {/* App bar */}
        <div className="relative flex items-center px-4 py-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="-m-2 inline-flex cursor-pointer items-center justify-center rounded-lg p-2 text-content-inverse-primary outline-none transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <IconArrowLeft size={24} stroke={2} />
          </button>
        </div>

        {/* Score + gauge */}
        <div className="relative flex flex-col gap-4 px-4 pt-1 pb-5">
          <div className="flex flex-col gap-0.5">
            <p className="text-[10px] leading-4 font-medium tracking-[1px] text-content-inverse-primary uppercase">
              Credit Score
            </p>
            {/* Fixed height so the SSR-empty → built → rolling states of the
                slot-text number never change the row height (slot-text injects
                its cells client-side and uses its own line-height). */}
            <p className="flex h-10 items-baseline gap-2">
              <SlotText
                text={String(score)}
                options={{ direction }}
                className="text-2xl leading-10 font-bold text-content-inverse-primary"
              />
              <span className="text-sm leading-6 text-content-inverse-primary lowercase">
                {band.label}
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex h-2.5 w-full gap-1">
              {segments.map((segment) => (
                <span
                  key={segment.id}
                  style={{ flexGrow: segment.span }}
                  className={`h-full basis-0 rounded-lg transition-[flex-grow] duration-500 ease-out ${segment.color}`}
                />
              ))}
            </div>
            <div className="flex w-full justify-between px-px">
              {SCORE_TICKS.map((tick, i) => (
                <span
                  key={tick}
                  className={`size-1.5 rounded-full transition-colors duration-500 ${
                    i === activeTick
                      ? "bg-content-inverse-primary"
                      : "bg-content-secondary"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Refresh banner */}
          <div className="flex items-center justify-between gap-4 rounded-lg bg-background-inverse-secondary px-4 py-3">
            <span className="flex items-center gap-2 text-[14px] leading-5 text-content-inverse-primary">
              <IconRefresh size={20} stroke={2} className="shrink-0" />
              Next refresh in 30 days
            </span>
            <button
              type="button"
              onClick={refreshScore}
              className="cursor-pointer text-[14px] leading-5 font-bold text-content-brand"
            >
              Update
            </button>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="flex flex-col gap-6 px-4 py-6">
        <section className="flex flex-col gap-2">
          <h2 className="text-sm leading-6 font-semibold text-content-secondary">
            Loans &amp; Credit lines
          </h2>
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
            />
            <LoanRow
              icon={IconHome}
              name="Jun statement"
              detail="₹64,000 · House Loan"
              status="Closed"
              tone="negative"
              large
              last
            />
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-sm leading-6 font-semibold text-content-secondary">
            Actions
          </h2>
          <div className="overflow-hidden rounded-2xl border border-border-primary bg-background-primary">
            <ActionRow icon={IconReceipt2} label="View payment history" />
            <ActionRow icon={IconHeadset} label="Contact support" last />
          </div>
        </section>
      </div>
    </div>
  );
}
