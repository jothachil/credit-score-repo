"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { mock } from "../data/mock";
import BottomSheet from "./BottomSheet";
import Button from "./Button";
import { RadioCard, RadioGroup } from "./RadioField";

const COPY = mock.predictor.missPayment;

/**
 * Miss-a-payment input sheet — opens from that choice on the predict grid so
 * the scenario's one data point (days past due) is collected inline instead of
 * on a separate screen. Confirming hands off to the shared result page.
 *
 * Layout follows the house sheet pattern (RefreshScoreSheet): tinted hero with
 * the choice illustration, centred heading, then the input and CTA. The tint
 * is negative to match the choice card's tone on the grid.
 */
export default function MissPaymentSheet({ open, onOpenChange }) {
  const router = useRouter();
  const [duration, setDuration] = useState(COPY.options[0].id);

  // Reopen with a clean selection rather than the last scenario's.
  useEffect(() => {
    if (open) setDuration(COPY.options[0].id);
  }, [open]);

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title={COPY.title}
      titleHidden
    >
      {/* Negative-tinted hero, bled to the sheet's edges by cancelling the
          BottomSheet body padding. Fades to the sheet surface going down. */}
      <div className="-mx-5 -mt-px flex flex-col items-center gap-3 bg-gradient-to-b from-background-light-negative to-background-primary px-5 pt-6 pb-2 text-center">
        {/* biome-ignore lint/performance/noImgElement: prototype static asset */}
        <img
          src="/miss-payment.png"
          alt=""
          className="size-28 shrink-0 object-contain"
        />
        <div className="flex flex-col gap-1">
          <p className="text-xs leading-4 font-medium tracking-[0.6px] text-content-secondary uppercase">
            {COPY.kicker}
          </p>
          <h2 className="text-xl leading-7 font-bold text-content-primary">
            {COPY.title}
          </h2>
        </div>
      </div>

      {/* Days past due — the only data point this scenario takes. Three short
          ordinal values, so they sit in one row rather than a tall stack. */}
      <div className="flex flex-col gap-3 pt-5">
        <p className="text-[15px] leading-6 font-medium text-content-primary">
          {COPY.optionsLabel}
        </p>
        <RadioGroup
          value={duration}
          onValueChange={setDuration}
          aria-label={COPY.optionsLabel}
        >
          {COPY.options.map(({ id, label }) => (
            <RadioCard key={id} value={id} compact>
              {label}
            </RadioCard>
          ))}
        </RadioGroup>
      </div>

      <div className="pt-6">
        <Button
          variant="primary"
          onClick={() => router.push(`/predict/result?days=${duration}`)}
        >
          {COPY.cta}
        </Button>
      </div>
    </BottomSheet>
  );
}
