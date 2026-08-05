"use client";

import { useRouter } from "next/navigation";
import Button from "../components/Button";

/**
 * Payment in progress — the bank hasn't confirmed the ₹49 refresh charge yet.
 * Sits between the refresh sheet's payment flow and /fetching: we can't pull a
 * fresh report until the charge settles, so the user waits here.
 */
export default function PaymentInProgress() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col bg-background-primary">
      {/* Illustration + copy, centered in the available space */}
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
        {/* biome-ignore lint/performance/noImgElement: prototype static asset */}
        <img
          src="/hour-glass-1.png"
          alt="An hourglass with sand running through it"
          className="size-[274px] object-contain"
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-xl leading-8 font-bold text-content-primary">
            Payment in progress
          </h1>
          <p className="text-sm leading-6 text-content-secondary">
            Your ₹49 payment is still being confirmed by your bank. We&apos;ll
            refresh your CIBIL score the moment it goes through — this usually
            takes a few minutes.
          </p>
        </div>
      </div>

      {/* CTA, pinned to the bottom */}
      <div className="flex flex-col items-center gap-4 border-t border-border-primary px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <Button variant="primary" onClick={() => router.push("/score")}>
          Back to score
        </Button>
      </div>
    </div>
  );
}
