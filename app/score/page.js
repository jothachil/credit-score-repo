"use client";

import "slot-text/style.css";
import {
  IconArrowRight,
  IconArrowUp,
  IconAward,
  IconChevronRight,
  IconFileSearch,
  IconFileText,
  IconHelpCircle,
  IconInfoCircle,
} from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SlotText } from "slot-text/react";
import ImpactBreakdownSheet from "../components/ImpactBreakdownSheet";
import LoanRow from "../components/LoanRow";
import NavBar from "../components/NavBar";
import RefreshScoreSheet from "../components/RefreshScoreSheet";
import ScoreBreakdownSheet from "../components/ScoreBreakdownSheet";
import ThemeColor from "../components/ThemeColor";
import { mock } from "../data/mock";
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
    label: "Excellent",
    min: 800,
    color: "bg-background-postive",
  },
];

// Band id → SVG fill (mirrors each gauge segment's colour) for charting.
const BAND_FILL = {
  poor: "var(--background-negative)",
  fair: "#f47b0b",
  good: "var(--background-warning)",
  "very-good": "var(--mountain-green-04)",
  exceptional: "var(--background-postive)",
};

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

// Each rating maps to a tone: the card's top-tint gradient and the badge's
// (stronger) tint + text colour. The *-02 badge tints are one step darker than
// the card's *-01 top, so the pill reads against the surface (no token).
const RATING_TONE = {
  Excellent: {
    card: "from-background-light-postive",
    badge: "bg-[var(--mountain-green-02)] text-content-postive",
  },
  "Very Good": {
    card: "from-background-light-postive",
    badge: "bg-[var(--mountain-green-02)] text-content-postive",
  },
  Good: {
    card: "from-background-light-warning",
    badge: "bg-[var(--sunrise-yellow-02)] text-content-warning",
  },
  Fair: {
    card: "from-background-light-warning",
    badge: "bg-[var(--sunrise-yellow-02)] text-content-warning",
  },
  Poor: {
    card: "from-background-light-negative",
    badge: "bg-[var(--fire-red-02)] text-content-negative",
  },
};

function ImpactCard({ rating, label, value, onClick }) {
  const tone = RATING_TONE[rating] ?? RATING_TONE.Good;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-48 shrink-0 snap-start cursor-pointer flex-col gap-6 rounded-2xl border border-border-primary bg-gradient-to-b to-background-primary p-4 text-left ${tone.card}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`rounded-full px-3 py-1 text-[14px] leading-5 font-medium ${tone.badge}`}
        >
          {rating}
        </span>
        <IconInfoCircle
          size={18}
          stroke={2}
          className="shrink-0 text-content-secondary"
        />
      </div>
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
    </button>
  );
}

// A compact line chart of the monthly score history. Pure SVG, sized by a
// viewBox so it scales to the card width; colours come from our brand token.
function ScoreTrendChart({ data }) {
  const W = 320;
  const H = 160;
  const padX = 22;
  const padTop = 30;
  const padBottom = 26;
  const scores = data.map((d) => d.score);
  const min = Math.min(...scores) - 8;
  const max = Math.max(...scores) + 8;
  const stepX = (W - padX * 2) / (data.length - 1);
  const yFor = (score) =>
    padTop + (1 - (score - min) / (max - min)) * (H - padTop - padBottom);
  const points = data.map((d, i) => ({
    ...d,
    x: padX + i * stepX,
    y: yFor(d.score),
  }));
  const baseline = H - padBottom;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      aria-label="Credit score over the last six months"
    >
      <defs>
        {Object.entries(BAND_FILL).map(([id, color]) => (
          <linearGradient
            key={id}
            id={`scoreTrendFill-${id}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>

      {points.slice(0, -1).map((p, i) => {
        const next = points[i + 1];
        const bandId = resolveScore(next.score).band.id;
        return (
          <g key={`seg-${p.month}`}>
            <polygon
              points={`${p.x},${p.y} ${next.x},${next.y} ${next.x},${baseline} ${p.x},${baseline}`}
              fill={`url(#scoreTrendFill-${bandId})`}
            />
            <line
              x1={p.x}
              y1={p.y}
              x2={next.x}
              y2={next.y}
              stroke={BAND_FILL[bandId]}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        );
      })}

      {points.map((p, i) => {
        const isLast = i === points.length - 1;
        const fill = BAND_FILL[resolveScore(p.score).band.id];
        return (
          <g key={p.month}>
            <circle
              cx={p.x}
              cy={p.y}
              r={isLast ? 5 : 4}
              fill={fill}
              stroke="var(--background-primary)"
              strokeWidth="2"
            />
            <text
              x={p.x}
              y={p.y - 12}
              textAnchor="middle"
              className="text-[10px] font-semibold"
              fill={fill}
            >
              {p.score}
            </text>
            <text
              x={p.x}
              y={H - 8}
              textAnchor="middle"
              className="fill-content-secondary text-[10px]"
            >
              {p.month}
            </text>
          </g>
        );
      })}
    </svg>
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

export default function CreditScore() {
  const router = useRouter();
  const refreshAvailable = useAtomValue(debugFlagAtoms.refreshAvailable);
  const [score, setScore] = useState(SCORE_MIN);
  // Entrance roll always goes upward; the refresh flow now redirects to
  // /fetching instead of rolling in place.
  const direction = "up";
  const [refreshSheetOpen, setRefreshSheetOpen] = useState(false);
  const [breakdownSheetOpen, setBreakdownSheetOpen] = useState(false);
  const [activeImpact, setActiveImpact] = useState(null);
  const { segments, band, activeTick } = resolveScore(score);

  // slot-text only rolls on text *changes*, not on mount — so start at the
  // score floor and settle on the real value after first paint to get an
  // entrance roll (number, label, and gauge all animate into place).
  useEffect(() => {
    setScore(mock.currentScore);
  }, []);

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
              CIBIL Score
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
              <IconFileText size={20} stroke={2} className="shrink-0" />
              Fetched on {mock.reportFetchDate}
            </span>
            {refreshAvailable && (
              <button
                type="button"
                onClick={() => setRefreshSheetOpen(true)}
                className="cursor-pointer text-[14px] leading-5 font-bold text-content-brand"
              >
                Refresh Now
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="flex flex-col gap-6 px-4 py-6">
        <div className="flex flex-col gap-2">
          <section className="flex flex-col gap-2">
            <h2 className="text-sm leading-6 font-semibold text-content-secondary">
              Score history
            </h2>
            <div className="overflow-hidden rounded-2xl border border-border-primary bg-background-primary">
              {/* Percentile standing */}
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background-light-postive">
                  <IconAward
                    size={20}
                    stroke={2}
                    className="text-content-postive"
                  />
                </span>
                <p className="text-[14px] leading-5 text-content-primary">
                  Cheers! You're in the top{" "}
                  <span className="font-bold text-content-postive">
                    {mock.userPercentile}%
                  </span>{" "}
                  of 3M+ users
                </p>
              </div>
              <div className="border-t border-border-primary" />
              {/* Change since last month */}
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-background-postive px-2.5 py-1 text-[14px] leading-5 font-bold text-content-inverse-primary">
                  <IconArrowUp size={16} stroke={2.5} />
                  {mock.scoreDelta} pts
                </span>
                <span className="text-[14px] leading-5 text-content-secondary">
                  since last month
                </span>
              </div>
              <div className="border-t border-border-primary" />
              {/* Monthly trend */}
              <div className="p-4">
                <ScoreTrendChart data={mock.scoreHistory} />
              </div>
            </div>
          </section>

          {/* Predict score banner */}
          <section className="glow-ring relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-border-primary bg-background-primary p-2">
            <div className="flex flex-col items-start gap-1 py-4 pl-4">
              <h2 className="text-base leading-6 font-bold text-content-primary">
                {mock.scorePrediction.title}
              </h2>
              <p className="text-[14px] leading-5 text-content-secondary">
                {mock.scorePrediction.subtitle}
              </p>
              <button
                type="button"
                onClick={() => router.push("/predict")}
                className="mt-3 flex cursor-pointer items-center gap-2.5 text-[15px] leading-5 font-bold text-content-primary"
              >
                {mock.scorePrediction.cta}
                <span className="flex size-5 items-center justify-center rounded-full bg-background-inverse-primary text-content-inverse-primary">
                  <IconArrowRight size={10} stroke={2.5} />
                </span>
              </button>
            </div>
            {/* biome-ignore lint/performance/noImgElement: prototype static asset */}
            <img
              src="/magic-glass-1.png"
              alt=""
              className="w-30 shrink-0 self-stretch object-cover"
            />
          </section>
        </div>

        <section className="flex flex-col gap-2">
          <h2 className="text-sm leading-6 font-semibold text-content-secondary">
            Credit Overview
          </h2>
          {/* Full-bleed horizontal scroll: -mx-4/px-4 lets cards run to the
              frame edge while the first card still aligns with the section. */}
          <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-px-4 px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {mock.impacts.map((impact) => (
              <ImpactCard
                key={impact.id}
                {...impact}
                onClick={() => setActiveImpact(impact)}
              />
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
            {mock.loans.active.map((loan, i) => (
              <LoanRow
                key={loan.id}
                {...loan}
                last={i === mock.loans.active.length - 1}
                onClick={() => router.push(`/${loan.type}?id=${loan.id}`)}
              />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-sm leading-6 font-semibold text-content-secondary">
            Actions
          </h2>
          <div className="overflow-hidden rounded-2xl border border-border-primary bg-background-primary">
            <ActionRow
              icon={IconHelpCircle}
              label="FAQ"
              onClick={() => router.push("/faq")}
            />
            <ActionRow
              icon={IconFileSearch}
              label="View full report"
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
      />

      <ScoreBreakdownSheet
        open={breakdownSheetOpen}
        onOpenChange={setBreakdownSheetOpen}
        currentBandId={band.id}
      />

      <ImpactBreakdownSheet
        impact={activeImpact}
        onOpenChange={(open) => !open && setActiveImpact(null)}
      />
    </div>
  );
}
