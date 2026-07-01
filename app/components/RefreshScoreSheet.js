"use client";

import {
  IconBulb,
  IconLock,
  IconShieldCheck,
  IconShieldCheckFilled,
  IconTrendingUp,
} from "@tabler/icons-react";
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
    detail: "Plan better for loans, cards and big purchases.",
  },
];

/**
 * Refresh-score upsell sheet — opens from the score screen's refresh CTA.
 * `onConfirm` runs the paid refresh (and the caller closes the sheet).
 */
export default function RefreshScoreSheet({ open, onOpenChange, onConfirm }) {
  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Unlock Your Latest Credit Score"
      titleHidden
    >
      <div className="flex flex-col items-center gap-4">
        {/* Illustration */}
        {/* biome-ignore lint/performance/noImgElement: prototype static asset */}
        <img
          src="/no-credit-score-2.png"
          alt="Credit score being refreshed"
          className="size-[240PX] object-contain"
        />

        {/* Heading + subtitle */}
        <div className="flex flex-col text-center">
          <h2 className="text-xl leading-8 font-bold text-content-primary">
            Unlock Your Latest Credit Score
          </h2>
          <p className="text-sm leading-6 text-content-secondary">
            Refresh it to see the most up-to-date picture of your credit health.
          </p>
        </div>

        {/* Benefits */}
        <div className="flex w-full flex-col gap-3">
          {BENEFITS.map(({ id, icon: Icon, title, detail }) => (
            <div key={id} className="flex items-center gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-background-light-brand">
                <Icon size={24} stroke={2} className="text-content-brand" />
              </span>
              <div className="flex flex-col gap-0.5">
                <p className="text-[15px] leading-5 font-bold text-content-primary">
                  {title}
                </p>
                <p className="text-sm leading-5 text-content-secondary">
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
            onClick={onConfirm}
            className="flex items-center justify-center gap-2"
          >
            <IconLock size={20} stroke={2} className="shrink-0" />
            Refresh Now for ₹49
          </Button>
          <p className="flex items-center gap-1.5 text-xs text-content-secondary">
            <IconShieldCheckFilled size={16} className="text-content-brand" />
            Secure payment · Powered by LazyPay
          </p>
        </div>
      </div>
    </BottomSheet>
  );
}
