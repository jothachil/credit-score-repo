"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Distance between two adjacent ticks. The scroll maths below assumes the
// spacers make `scrollLeft === index * TICK_PX`, so keep them in step.
const TICK_PX = 12;
// Every Nth tick is taller and carries a label.
const MAJOR_EVERY = 10;

/** ₹12,50,000 — Indian digit grouping, no paise. */
export function formatAmount(n) {
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

// One detent's worth of haptic feedback, fired as the ruler crosses each tick
// so it feels like a native picker wheel.
//
// This is the Vibration API, which iOS Safari does not implement — on iPhone
// it's a silent no-op, and there is no web API that reaches the Taptic Engine.
// Android Chrome does buzz. Kept deliberately short: a long pulse on a fast
// flick queues up and lags behind the scroll.
const HAPTIC_MS = 8;

function tickHaptic() {
  if (typeof navigator === "undefined") return;
  // Guard rather than assume — `vibrate` is absent on desktop Safari too, and
  // some browsers expose it but reject calls without user activation.
  if (typeof navigator.vibrate !== "function") return;
  try {
    navigator.vibrate(HAPTIC_MS);
  } catch {
    // A blocked vibrate must never break scrolling.
  }
}

/** Short form for the ruler's tick labels: ₹5K, ₹2.5L, ₹1.5Cr. */
function formatTick(n) {
  const trim = (v) => String(Number(v.toFixed(1)));
  if (n >= 1_00_00_000) return `₹${trim(n / 1_00_00_000)}Cr`;
  if (n >= 1_00_000) return `₹${trim(n / 1_00_000)}L`;
  if (n >= 1_000) return `₹${trim(n / 1_000)}K`;
  return `₹${n}`;
}

/**
 * Horizontal scroll range selector — a ruler you swipe sideways, with the
 * value under the fixed centre line being the selected one. Snapping is native
 * (`scroll-snap-align: center` per tick), so touch momentum feels right and
 * the control settles exactly on a step.
 *
 * Not built on a Base UI primitive: ScrollArea exists to style scrollbars
 * (this one is deliberately hidden) and Slider is a drag-thumb track, so
 * neither gives the scroll-momentum picker asked for here. Accessibility is
 * therefore hand-wired — the viewport is a `slider` role with arrow-key
 * support and a live value.
 *
 *   <AmountRuler min={20000} max={1500000} step={10000}
 *                value={amount} onChange={setAmount} label="Credit limit" />
 *
 * `value` is read on mount to set the starting scroll offset; after that the
 * scroller owns its position and reports upward via `onChange`. Remount it
 * (change its `key`) to jump to a new value.
 */
export default function AmountRuler({
  min,
  max,
  step,
  value,
  onChange,
  label,
}) {
  const viewportRef = useRef(null);
  const didInit = useRef(false);
  // Last detent a haptic fired for, so one tick never buzzes twice.
  const lastTick = useRef(null);
  const [pad, setPad] = useState(0);

  const count = Math.floor((max - min) / step) + 1;
  const valueAt = (i) => Math.min(max, min + i * step);

  // Spacers put the first and last tick within reach of the centre line.
  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => setPad(Math.max(0, (el.clientWidth - TICK_PX) / 2));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Jump to the incoming value once the spacers exist. Deliberately one-shot:
  // syncing on every `value` change would fight the user's momentum scroll.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el || pad === 0 || didInit.current) return;
    // Seed the haptic ref too, so settling onto the opening value is silent.
    lastTick.current = Math.round((value - min) / step);
    el.scrollLeft = lastTick.current * TICK_PX;
    didInit.current = true;
  }, [pad, value, min, step]);

  function handleScroll(event) {
    const raw = Math.round(event.currentTarget.scrollLeft / TICK_PX);
    const i = Math.min(Math.max(raw, 0), count - 1);
    // Haptics key off a ref, not the `value` prop: several scroll events can
    // land in one frame during a fast flick, and `value` won't have caught up
    // between them, so comparing against it double-fires on one detent.
    if (i !== lastTick.current) {
      lastTick.current = i;
      tickHaptic();
    }
    const next = valueAt(i);
    if (next !== value) onChange(next);
  }

  // Arrow keys nudge by one step, Home/End jump to the ends.
  function handleKeyDown(event) {
    const deltas = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1 };
    let next;
    if (event.key in deltas) next = value + deltas[event.key] * step;
    else if (event.key === "Home") next = min;
    else if (event.key === "End") next = max;
    else return;

    event.preventDefault();
    next = Math.min(Math.max(next, min), max);
    if (next === value) return;
    lastTick.current = Math.round((next - min) / step);
    tickHaptic();
    onChange(next);
    const el = viewportRef.current;
    if (el) el.scrollLeft = lastTick.current * TICK_PX;
  }

  return (
    <div className="relative">
      {/* Centre line — marks the tick currently selected */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center"
      >
        <span className="h-10 w-0.5 rounded-full bg-background-brand" />
      </div>

      {/* The scroll container is itself the slider control — see note above */}
      <div
        ref={viewportRef}
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={formatAmount(value)}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        className="flex touch-pan-x snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-xl outline-none [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-selected [&::-webkit-scrollbar]:hidden"
      >
        <span aria-hidden style={{ minWidth: pad }} className="shrink-0" />
        {Array.from({ length: count }, (_, i) => {
          const major = i % MAJOR_EVERY === 0;
          return (
            <span
              key={valueAt(i)}
              aria-hidden
              style={{ width: TICK_PX }}
              className="flex shrink-0 snap-center flex-col items-center gap-2 pt-2"
            >
              <span
                className={`w-0.5 rounded-full ${
                  major ? "h-10 bg-content-tertiary" : "h-5 bg-border-primary"
                }`}
              />
              {/* Labels are wider than a tick, so let them overflow evenly */}
              <span className="h-4 text-[11px] leading-4 whitespace-nowrap text-content-secondary">
                {major ? formatTick(valueAt(i)) : ""}
              </span>
            </span>
          );
        })}
        <span aria-hidden style={{ minWidth: pad }} className="shrink-0" />
      </div>
    </div>
  );
}
