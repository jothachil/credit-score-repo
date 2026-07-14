"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "../../components/Button";
import NavBar from "../../components/NavBar";
import { RadioCard, RadioGroup } from "../../components/RadioField";
import { mock } from "../../data/mock";

const COPY = mock.predictor.missPayment;

export default function MissPayment() {
  const router = useRouter();
  const [duration, setDuration] = useState(COPY.options[0].id);

  return (
    <div className="flex flex-1 flex-col bg-background-primary">
      <NavBar backHref="/predict" border={false} />

      <div className="flex flex-1 flex-col  px-4 pt-2">
        {/* Header — kicker + title with the choice illustration */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-[15px] leading-6 text-content-secondary">
              {COPY.kicker}
            </p>
            <h1 className="text-xl leading-8 font-bold text-content-primary">
              {COPY.title}
            </h1>
          </div>
          {/* biome-ignore lint/performance/noImgElement: prototype static asset */}
          <img
            src="/miss-payment.png"
            alt=""
            className="w-32 shrink-0 object-contain"
          />
        </div>

        {/* Duration selector */}
        <div className="flex flex-col gap-3">
          <p className="text-[15px] leading-6 font-medium text-content-primary">
            {COPY.optionsLabel}
          </p>
          <RadioGroup
            value={duration}
            onValueChange={setDuration}
            aria-label={COPY.optionsLabel}
            className="flex-col"
          >
            {COPY.options.map(({ id, label }) => (
              <RadioCard key={id} value={id}>
                {label}
              </RadioCard>
            ))}
          </RadioGroup>
        </div>

        {/* Bureau attribution */}
        <div className="mt-10 flex items-center justify-center gap-2 pt-4">
          {/* biome-ignore lint/performance/noImgElement: prototype static asset */}
          <img
            src="/cibil.png"
            alt="CIBIL"
            className="h-auto w-full max-w-[56px] object-contain"
          />
        </div>
      </div>

      {/* CTA — pinned to the bottom of the screen */}
      <div className="sticky bottom-0 mt-auto flex flex-col border-t border-border-primary bg-background-primary px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <Button
          variant="primary"
          onClick={() => router.push(`/predict/result?days=${duration}`)}
        >
          {COPY.cta}
        </Button>
      </div>
    </div>
  );
}
