"use client";

import { IconFileText } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import Button from "../components/Button";

// Date this credit report was last fetched from the bureau.
const REPORT_FETCH_DATE = "24 Jun 2026";

export default function NoCreditHistory() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col bg-background-primary">
      {/* Illustration + copy, centered in the available space */}
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
        {/* biome-ignore lint/performance/noImgElement: prototype static asset */}
        <img
          src="/no-score-history.png"
          alt="A person climbing steps toward a star"
          className="size-[274px] object-contain"
        />
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-xl leading-8 font-bold text-content-primary">
            No credit history
          </h1>
          <div className="flex items-center justify-center gap-2 text-[14px] leading-5 text-content-secondary">
            <IconFileText size={20} stroke={2} className="shrink-0" />
            Fetched on {REPORT_FETCH_DATE}
          </div>
        </div>
      </div>

      {/* Powered by CIBIL — bureau attribution */}
      <div className="flex items-center justify-center pb-2">
        {/* biome-ignore lint/performance/noImgElement: prototype static asset */}
        <img
          src="/cibil.png"
          alt="Powered by CIBIL"
          className="h-auto w-full max-w-[80px] object-contain"
        />
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
