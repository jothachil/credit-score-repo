"use client";

import {
  IconAlertTriangle,
  IconBulb,
  IconCircleCheckFilled,
  IconClockHour4,
  IconLoader2,
  IconShieldCheckFilled,
  IconTrendingUp,
  IconWallet,
} from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { mock } from "../data/mock";
import { debugFlagAtoms } from "../state/debugFlags";
import BottomSheet from "./BottomSheet";
import Button from "./Button";

// Benefits of refreshing — icon + title + supporting line, in tinted tiles.
const BENEFITS = [
  {
    id: "detect",
    icon: IconTrendingUp,
    title: "Detect improvements or drops early",
    detail: "Catch changes early and take action.",
  },
  {
    id: "decisions",
    icon: IconBulb,
    title: "Make informed financial decisions",
    detail: "Plan better for loans, cards & big purchases.",
  },
];

// Dummy payment pacing: offer → confirm → processing → success → /fetching.
// `confirm` is a grace period, not a spinner: it states where the money comes
// from and gives a window to back out before anything is charged.
const CONFIRM_MS = 8000;
const PROCESSING_MS = 2200;
const SUCCESS_MS = 1400;

/**
 * Refresh-score upsell sheet — opens from the score screen's refresh CTA.
 * Paying steps through a confirmation with a cancel window, then a dummy
 * payment flow (loader → success), and hands off to the /fetching loader to
 * pull the refreshed report.
 *
 * When the last refresh was <15 days ago (debug flag "recent_refresh"),
 * tapping the paid CTA interjects a warning that the score is unlikely to
 * have moved — payment only starts if the user insists.
 *
 * When the report was fetched <2 days ago (debug flag "recent_fetch"),
 * nothing can have changed yet — the sheet opens straight into a blocked
 * state with no offer and no way to pay.
 */
export default function RefreshScoreSheet({ open, onOpenChange }) {
  const router = useRouter();
  const recentRefresh = useAtomValue(debugFlagAtoms.recentRefresh);
  const recentFetch = useAtomValue(debugFlagAtoms.recentFetch);
  const [phase, setPhase] = useState("offer");

  // Fresh state every time the sheet opens — a <2-day-old report skips the
  // offer entirely.
  useEffect(() => {
    if (open) setPhase(recentFetch ? "blocked" : "offer");
  }, [open, recentFetch]);

  // Drive the dummy flow: hold on the cancel window, linger on the loader,
  // flash success, then hand off to the fetching page.
  //
  // The `open` guard is what makes Cancel real. This component stays mounted
  // when the sheet closes, and closing doesn't change `phase` — so without it
  // the pending timer survives, and a cancelled transaction would still march
  // on to /fetching a few seconds later. Depending on `open` means dismissing
  // the sheet by any route (Cancel, swipe, backdrop) clears the timer.
  useEffect(() => {
    if (!open) return;
    if (phase === "confirm") {
      const t = setTimeout(() => setPhase("processing"), CONFIRM_MS);
      return () => clearTimeout(t);
    }
    if (phase === "processing") {
      const t = setTimeout(() => setPhase("success"), PROCESSING_MS);
      return () => clearTimeout(t);
    }
    if (phase === "success") {
      const t = setTimeout(() => router.push("/fetching"), SUCCESS_MS);
      return () => clearTimeout(t);
    }
  }, [open, phase, router]);

  // Fill the countdown bar across the cancel window. Starts at 0 and is
  // pushed to 100 on the next frame so the CSS transition actually runs
  // (setting both in one paint would jump straight to the end).
  const [countdown, setCountdown] = useState(0);
  useEffect(() => {
    if (phase !== "confirm") {
      setCountdown(0);
      return;
    }
    const raf = requestAnimationFrame(() => setCountdown(100));
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Unlock Your Latest CIBIL Score"
      titleHidden
    >
      {phase === "blocked" && (
        <div className="flex flex-col items-center gap-4 pt-6 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-background-light-brand">
            <IconClockHour4
              size={32}
              stroke={2}
              className="text-content-brand"
            />
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="text-xl leading-8 font-bold text-content-primary">
              Nothing new to fetch yet
            </h2>
            <p className="text-sm leading-6 text-content-secondary">
              Lenders report to the bureau in cycles, so your score won&apos;t
              change within 2 days. Try again in 15 to 30 days.
            </p>
          </div>
          <div className="mt-2 w-full">
            <Button variant="primary" onClick={() => onOpenChange(false)}>
              Got it
            </Button>
          </div>
        </div>
      )}

      {phase === "warning" && (
        <div className="flex flex-col items-center gap-4 pt-6 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-background-light-warning">
            <IconAlertTriangle
              size={32}
              stroke={2}
              className="text-content-warning"
            />
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="text-xl leading-8 font-bold text-content-primary">
              You refreshed recently
            </h2>
            <p className="text-sm leading-6 text-content-secondary">
              Your score was last updated on {mock.reportFetchDate}. Credit
              scores rarely move within 15 days, so refreshing now will likely
              show the same score.
            </p>
          </div>
          <div className="mt-2 flex w-full flex-col gap-2">
            {/* Skip the offer pitch — straight into the payment flow */}
            <Button variant="primary" onClick={() => setPhase("confirm")}>
              Refresh anyway
            </Button>
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Maybe later
            </Button>
          </div>
        </div>
      )}

      {/* Cancel window — names the funding source and holds for three seconds
          before anything is charged. The bar makes the window visible so the
          Cancel button doesn't feel like a race. */}
      {phase === "confirm" && (
        <div className="flex flex-col items-center gap-4 pt-6 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-background-light-brand">
            <IconWallet size={32} stroke={2} className="text-content-brand" />
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="text-xl leading-8 font-bold text-content-primary">
              Confirming payment
            </h2>
            <p className="text-sm leading-6 text-content-secondary">
              ₹49 will be deducted from your LazyPay BNPL limit.
            </p>
          </div>

          <div className="mt-2 flex w-full flex-col gap-2">
            <div
              aria-hidden
              className="h-3 w-full overflow-hidden rounded-full bg-background-secondary"
            >
              {/* Fill time is driven by CONFIRM_MS rather than a duration
                  utility, so retiming the window can't leave the bar
                  finishing early and sitting full. */}
              <div
                style={{
                  width: `${countdown}%`,
                  transitionDuration: `${CONFIRM_MS}ms`,
                }}
                className="h-full rounded-full bg-background-brand transition-[width] ease-linear"
              />
            </div>
          </div>

          <div className="w-full">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <p className="text-xs mt-4 leading-4 text-content-tertiary">
              Cancel now to stop this transaction
            </p>
          </div>
        </div>
      )}

      {phase === "processing" && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <IconLoader2
            size={48}
            stroke={2}
            className="animate-spin text-content-brand"
          />
          <div className="flex flex-col gap-0.5">
            <p className="text-lg leading-7 font-semibold text-content-primary">
              Processing payment
            </p>
            <p className="text-sm leading-6 text-content-secondary">
              Paying ₹49 via LazyPay
            </p>
          </div>
        </div>
      )}

      {phase === "success" && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <IconCircleCheckFilled size={56} className="text-content-postive" />
          <div className="flex flex-col gap-0.5">
            <p className="text-lg leading-7 font-semibold text-content-primary">
              Payment successful
            </p>
            <p className="text-sm leading-6 text-content-secondary">
              Fetching your latest score…
            </p>
          </div>
        </div>
      )}

      {phase === "offer" && (
        <div className="flex flex-col items-center gap-4">
          {/* Illustration */}
          {/* biome-ignore lint/performance/noImgElement: prototype static asset */}
          <img
            src="/no-credit-score-3.png"
            alt="Credit score being refreshed"
            className="size-[150PX] object-contain"
          />

          {/* Heading + subtitle */}
          <div className="flex flex-col text-center">
            <h2 className="text-xl leading-8 font-bold text-content-primary">
              Unlock Latest CIBIL Score
            </h2>
            <p className="text-sm leading-6 text-content-secondary">
              Refresh it to see the most up-to-date picture of your credit
              health.
            </p>
          </div>

          {/* Benefits */}
          <div className="flex w-full flex-col gap-6 mt-4">
            {BENEFITS.map(({ id, icon: Icon, title, detail }) => (
              <div key={id} className="flex items-center gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background-light-brand">
                  <Icon size={24} stroke={2} className="text-content-brand" />
                </span>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[15px] leading-5 font-bold text-content-primary">
                    {title}
                  </p>
                  <p className="text-xs leading-5 text-content-secondary">
                    {detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex w-full flex-col items-center gap-3 mt-4">
            <Button
              variant="primary"
              // Recently refreshed → warn before taking the payment
              onClick={() => setPhase(recentRefresh ? "warning" : "confirm")}
              className="flex items-center justify-center gap-2"
            >
              Pay ₹49 with LazyPay
            </Button>
            <p className="flex items-center gap-1.5 text-xs text-content-secondary">
              <IconShieldCheckFilled size={16} className="text-content-brand" />
              Secure payment · Powered by LazyPay
            </p>
          </div>
        </div>
      )}
    </BottomSheet>
  );
}
