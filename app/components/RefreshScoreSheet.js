"use client";

import {
  IconBulb,
  IconCircleCheckFilled,
  IconLoader2,
  IconShieldCheckFilled,
  IconTrendingUp,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

// Dummy payment pacing: offer → processing → success → /fetching.
const PROCESSING_MS = 2200;
const SUCCESS_MS = 1400;

/**
 * Refresh-score upsell sheet — opens from the score screen's refresh CTA.
 * The CTA runs a dummy payment flow (loader → success) and then hands off
 * to the /fetching loader to pull the refreshed report.
 */
export default function RefreshScoreSheet({ open, onOpenChange }) {
  const router = useRouter();
  const [phase, setPhase] = useState("offer");

  // Fresh offer state every time the sheet opens.
  useEffect(() => {
    if (open) setPhase("offer");
  }, [open]);

  // Drive the dummy flow: linger on the loader, flash success, then hand
  // off to the fetching page.
  useEffect(() => {
    if (phase === "processing") {
      const t = setTimeout(() => setPhase("success"), PROCESSING_MS);
      return () => clearTimeout(t);
    }
    if (phase === "success") {
      const t = setTimeout(() => router.push("/fetching"), SUCCESS_MS);
      return () => clearTimeout(t);
    }
  }, [phase, router]);

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Unlock Your Latest CIBIL Score"
      titleHidden
    >
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
            className="size-[200PX] object-contain"
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
              onClick={() => setPhase("processing")}
              className="flex items-center justify-center gap-2"
            >
              Instant refresh now for ₹49
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
