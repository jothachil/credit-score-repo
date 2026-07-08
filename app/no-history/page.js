"use client";

import { useRouter } from "next/navigation";
import Button from "../components/Button";

export default function NoCreditHistory() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col bg-background-primary">
      {/* Illustration + copy, centered in the available space */}
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
        {/* biome-ignore lint/performance/noImgElement: prototype static asset */}
        <img
          src="/no-credit-score-3.png"
          alt="A credit score gauge with no reading"
          className="size-[274px] object-contain"
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-xl leading-8 font-bold text-content-primary">
            No credit history yet
          </h1>
          <p className="text-sm leading-6 text-content-secondary">
            You don&apos;t have enough credit history for CIBIL to calculate a
            score. Start using a credit card or loan and repay on time — your
            score will show up here once there&apos;s enough activity.
          </p>
        </div>
      </div>

      {/* CTA, pinned to the bottom */}
      <div className="flex flex-col items-center gap-4 border-t border-border-primary px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <Button variant="primary" onClick={() => router.back()}>
          Go back
        </Button>
      </div>
    </div>
  );
}
