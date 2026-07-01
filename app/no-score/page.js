"use client";

import { useRouter } from "next/navigation";
import Button from "../components/Button";

export default function NoCreditScore() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col bg-background-primary">
      {/* Illustration + copy, centered in the available space */}
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
        {/* biome-ignore lint/performance/noImgElement: prototype static asset */}
        <img
          src="/no-credit-score.png"
          alt="A magnifying glass over an empty score"
          className="size-[274px] object-contain"
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-xl leading-8 font-bold text-content-primary">
            We couldn&apos;t spot a score
          </h1>
          <p className="text-sm leading-6 text-content-secondary">
            You don&apos;t have enough credit activity yet for us to calculate a
            score. Once you start using credit, check back and it&apos;ll show
            up here.
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
